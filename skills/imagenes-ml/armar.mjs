// Arma las imágenes finales: pega el PRODUCTO REAL (recortado) en el hueco que dejó la IA + el logo.
// Uso: node armar.mjs <carpeta-producto> [--rotar 0] [--rotar-portada 0] [--escala 1]
//   --rotar: giro (grados, + = horario) del producto en 2-5 para que quede parado en la zona alta y angosta.
//   --rotar-portada: giro en la portada (normalmente 0: la foto tal cual).
// En la carpeta tiene que haber:
//   producto.png  -> recorte transparente del producto (node recortar.mjs <foto> producto.png)
//   1-portada.*   -> lo generado por la IA (portada: sólo la caja a la izquierda, derecha vacía)
//   2-detalles.*, 3-compatibles.*, 4-faq.*, 5-opiniones.* -> escenas con el hueco vacío
// Salida: <carpeta>/final/*.jpg 1200x1200. Logo en 2-5, portada sin logo.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const dir = args[0];
const opt = (k, d) => { const i = args.indexOf('--' + k); return i > -1 ? +args[i + 1] : d; };
if (!dir) { console.error('Uso: node armar.mjs <carpeta> [--rotar grados] [--escala 1]'); process.exit(1); }
const here = path.dirname(fileURLToPath(import.meta.url));
const S = 1200, LOGO_W = 300, MARGIN = 36;

// Zonas donde va el producto (deben coincidir con lo que piden los prompts).
const ZONAS = {
  izq: { x: 60, y: 230, w: 440, h: 860 },
  der: { x: 700, y: 230, w: 440, h: 820 },   // termina antes de la esquina del logo
  portada: { x: 470, y: 200, w: 690, h: 900 },
};
const ZONA_POR_IMAGEN = { '1': 'portada', '2': 'izq', '3': 'der', '4': 'izq', '5': 'der' };

const prodPath = path.join(dir, 'producto.png');
if (!fs.existsSync(prodPath)) { console.error('Falta producto.png en la carpeta (usar recortar.mjs).'); process.exit(1); }
async function rotado(grados) {
  const p = sharp(prodPath);
  if (!grados) return p.png().toBuffer();
  const r = await p.rotate(grados, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return sharp(r).trim({ threshold: 1 }).png().toBuffer();
}
const prodInfografia = await rotado(opt('rotar', 0));          // 2-5
const prodPortada = await rotado(opt('rotar-portada', 0));     // 1

async function capaProducto(zona, fondoClaro) {
  const z = ZONAS[zona], k = opt('escala', 1);
  const p = await sharp(zona === 'portada' ? prodPortada : prodInfografia).resize({ width: Math.round(z.w * k), height: Math.round(z.h * k), fit: 'inside' }).png().toBuffer();
  const { width: w, height: h } = await sharp(p).metadata();
  const left = Math.round(z.x + (z.w - w) / 2), top = Math.round(z.y + z.h - h); // apoyado abajo de la zona
  // sombra: elipse suave debajo del producto (queda natural con cualquier ángulo de foto)
  const ew = Math.round(w * 0.8), eh = Math.max(24, Math.round(w * 0.09)), pad = 50;
  const op = fondoClaro ? 0.22 : 0.65;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ew + pad * 2}" height="${eh + pad * 2}">
    <defs><filter id="b"><feGaussianBlur stdDeviation="${Math.round(eh / 2.5)}"/></filter></defs>
    <ellipse cx="${ew / 2 + pad}" cy="${eh / 2 + pad}" rx="${ew / 2}" ry="${eh / 2}" fill="black" fill-opacity="${op}" filter="url(#b)"/></svg>`;
  const sombraBlur = await sharp(Buffer.from(svg)).png().toBuffer();
  const sTop = Math.min(S - eh - pad * 2, top + h - Math.round(eh * 0.6) - pad);
  return [
    { input: sombraBlur, left: Math.round(left + (w - ew) / 2) - pad, top: sTop },
    { input: p, left, top },
  ];
}

const out = path.join(dir, 'final');
fs.mkdirSync(out, { recursive: true });
const logo = await sharp(path.join(here, 'logo.png')).resize({ width: LOGO_W }).png().toBuffer();
const { height: logoH } = await sharp(logo).metadata();

for (const f of fs.readdirSync(dir).filter(f => /^[1-5].*\.(png|jpe?g|webp)$/i.test(f)).sort()) {
  const zona = ZONA_POR_IMAGEN[f[0]];
  const esPortada = zona === 'portada';
  const base = await sharp(path.join(dir, f)).resize(S, S, { fit: 'cover' }).flatten({ background: '#ffffff' }).toBuffer();
  const capas = await capaProducto(zona, esPortada);
  if (!esPortada) capas.push({ input: logo, left: S - LOGO_W - MARGIN, top: S - logoH - MARGIN });
  const dest = path.join(out, f.replace(/\.[^.]+$/, '.jpg'));
  await sharp(base).composite(capas).jpeg({ quality: 92 }).toFile(dest);
  console.log(`${zona.padEnd(8)} ${dest}`);
}
