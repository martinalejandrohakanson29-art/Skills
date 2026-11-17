// Pega el PRODUCTO REAL (recortado) en el hueco de cada escena + el logo. Lo usan armar.mjs y generar.mjs.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const HERE = path.dirname(fileURLToPath(import.meta.url));
export const S = 1200;
const LOGO_W = 300, MARGIN = 36;

// Zonas donde va el producto (coinciden con los prompts y con el layout de generar.mjs).
export const ZONAS = {
  izq: { x: 60, y: 230, w: 440, h: 860 },
  der: { x: 700, y: 230, w: 440, h: 820 },        // termina antes de la esquina del logo
  portada: { x: 470, y: 200, w: 690, h: 900 },     // portada con caja a la izquierda
  portadaSola: { x: 140, y: 140, w: 920, h: 920 }, // portada sin caja: producto centrado
};
export const ZONA_POR_IMAGEN = { '1': 'portada', '2': 'izq', '3': 'der', '4': 'izq', '5': 'der' };

async function rotado(file, grados) {
  const p = sharp(file);
  if (!grados) return p.png().toBuffer();
  const r = await p.rotate(grados, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return sharp(r).trim({ threshold: 1 }).png().toBuffer();
}

// Sombra de contacto: elipse suave debajo del objeto.
export async function sombra(w, fondoClaro) {
  const ew = Math.round(w * 0.8), eh = Math.max(24, Math.round(w * 0.09)), pad = 50;
  const op = fondoClaro ? 0.22 : 0.65;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ew + pad * 2}" height="${eh + pad * 2}">
    <defs><filter id="b"><feGaussianBlur stdDeviation="${Math.round(eh / 2.5)}"/></filter></defs>
    <ellipse cx="${ew / 2 + pad}" cy="${eh / 2 + pad}" rx="${ew / 2}" ry="${eh / 2}" fill="black" fill-opacity="${op}" filter="url(#b)"/></svg>`;
  return { buf: await sharp(Buffer.from(svg)).png().toBuffer(), ew, eh, pad };
}

// Objeto apoyado abajo y centrado en la zona, con sombra. Devuelve capas para composite().
export async function capaObjeto(buf, z, escala, fondoClaro) {
  const p = await sharp(buf).resize({ width: Math.round(z.w * escala), height: Math.round(z.h * escala), fit: 'inside' }).png().toBuffer();
  const { width: w, height: h } = await sharp(p).metadata();
  const left = Math.round(z.x + (z.w - w) / 2), top = Math.round(z.y + z.h - h);
  const s = await sombra(w, fondoClaro);
  const sTop = Math.min(S - s.eh - s.pad * 2, top + h - Math.round(s.eh * 0.6) - s.pad);
  return [
    { input: s.buf, left: Math.round(left + (w - s.ew) / 2) - s.pad, top: sTop },
    { input: p, left, top },
  ];
}

// escenas: carpeta con 1-portada.*, 2-detalles.*, ... (generadas por IA o por generar.mjs)
// dir: carpeta del producto (producto.png); salida en <dir>/final/
export async function componer({ dir, escenas = dir, rotar = 0, rotarPortada = 0, escala = 1, portadaSola = false }) {
  const prodPath = path.join(dir, 'producto.png');
  if (!fs.existsSync(prodPath)) throw new Error('Falta producto.png en la carpeta (usar recortar.mjs).');
  const prodInfografia = await rotado(prodPath, rotar);
  const prodPortada = await rotado(prodPath, rotarPortada);

  const out = path.join(dir, 'final');
  fs.mkdirSync(out, { recursive: true });
  const logo = await sharp(path.join(HERE, '..', 'logo.png')).resize({ width: LOGO_W }).png().toBuffer();
  const { height: logoH } = await sharp(logo).metadata();
  const hechos = [];

  for (const f of fs.readdirSync(escenas).filter(f => /^[1-5]-.*\.(png|jpe?g|webp)$/i.test(f)).sort()) {
    let zona = ZONA_POR_IMAGEN[f[0]];
    const esPortada = zona === 'portada';
    if (esPortada && portadaSola) zona = 'portadaSola';
    const base = await sharp(path.join(escenas, f)).resize(S, S, { fit: 'cover' }).flatten({ background: '#ffffff' }).toBuffer();
    const capas = await capaObjeto(esPortada ? prodPortada : prodInfografia, ZONAS[zona], escala, esPortada);
    if (!esPortada) capas.push({ input: logo, left: S - LOGO_W - MARGIN, top: S - logoH - MARGIN });
    const dest = path.join(out, f.replace(/\.[^.]+$/, '.jpg'));
    await sharp(base).composite(capas).jpeg({ quality: 92 }).toFile(dest);
    hechos.push(dest);
    console.log(`${zona.padEnd(11)} ${dest}`);
  }
  return hechos;
}
