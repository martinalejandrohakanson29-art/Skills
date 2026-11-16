// DIBUJA el set completo de imágenes de ML (sin IA de imágenes): fondo de taller + tarjetas + íconos + textos
// EXACTOS con tipografías reales, y pega el producto real + logo.
// Uso: node generar.mjs <carpeta-producto> [--rotar g] [--rotar-portada g] [--escala 1] [--solo 2,3]
// En la carpeta:
//   ficha.json   -> textos aprobados (formato en ficha.ejemplo.json)
//   producto.png -> recorte transparente del producto (node recortar.mjs <foto> producto.png)
//   caja.png     -> (opcional) recorte transparente de la caja; si no está, la portada es sólo el producto
// Salida: <carpeta>/escenas/ (fondos con textos, sin producto) y <carpeta>/final/*.jpg 1200x1200.
import sharp from 'sharp';
import opentype from 'opentype.js';
import fs from 'node:fs';
import path from 'node:path';
import { componer, capaObjeto, HERE, S } from './componer.mjs';

const args = process.argv.slice(2);
const dir = args[0];
const opt = (k, d) => { const i = args.indexOf('--' + k); return i > -1 ? args[i + 1] : d; };
if (!dir) { console.error('Uso: node generar.mjs <carpeta> [--rotar g] [--escala 1]'); process.exit(1); }
const fichaPath = path.join(dir, 'ficha.json');
if (!fs.existsSync(fichaPath)) { console.error('Falta ficha.json en la carpeta (ver ficha.ejemplo.json).'); process.exit(1); }
const ficha = JSON.parse(fs.readFileSync(fichaPath, 'utf8'));

// ---------- estilo (estilo.md) ----------
const ROJO = '#FF3333', BLANCO = '#FFFFFF', GRIS = '#C9CED6', CARD = '#1A1D22';
const load = f => { const b = fs.readFileSync(path.join(HERE, 'fuentes', f)); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
const F = { titulo: load('Anton-Regular.ttf'), bold: load('Montserrat-Bold.ttf'), semi: load('Montserrat-SemiBold.ttf') };
const capH = f => (f.tables.os2.sCapHeight || f.ascender * 0.7) / f.unitsPerEm;

// ---------- texto ----------
const ancho = (font, t, size) => font.getAdvanceWidth(t, size, { kerning: true });
function texto(font, t, x, y, size, fill, { align = 'left', italica = false } = {}) {
  const w = ancho(font, t, size);
  const x0 = align === 'right' ? x - w : align === 'center' ? x - w / 2 : x;
  const d = font.getPath(t, x0, y, size, { kerning: true }).toPathData(2);
  if (d.includes("NaN")) throw new Error(`Error dibujando el texto "${t}" (usar opentype.js 1.3.4)`);
  const tr = italica ? ` transform="translate(${x0} ${y}) skewX(-10) translate(${-x0} ${-y})"` : '';
  return `<path d="${d}" fill="${fill}"${tr}/>`;
}
function partir(font, t, size, maxW) {
  const lineas = []; let cur = '';
  for (const p of String(t).split(/\s+/)) {
    const prueba = cur ? cur + ' ' + p : p;
    if (cur && ancho(font, prueba, size) > maxW) { lineas.push(cur); cur = p; } else cur = prueba;
  }
  if (cur) lineas.push(cur);
  return lineas;
}
// bloque de párrafo: devuelve {svg, h}; y = borde superior
function parrafo(font, t, x, y, size, maxW, fill, lh = 1.25) {
  const lineas = partir(font, t, size, maxW);
  const c = capH(font) * size;
  const svg = lineas.map((l, i) => texto(font, l, x, y + c + i * size * lh, size, fill)).join('');
  return { svg, h: c + (lineas.length - 1) * size * lh, lineas: lineas.length };
}

// ---------- íconos (lucide.dev, o iconos/<nombre>.svg propios) ----------
const ALIAS = {
  velocimetro: 'gauge', rayo: 'zap', llave: 'wrench', herramientas: 'wrench', caja: 'package', escudo: 'shield-check',
  engranaje: 'cog', reloj: 'clock', regla: 'ruler', fuego: 'flame', moto: 'motorbike', check: 'check',
  estrella: 'star', motor: 'engine', tuerca: 'nut', camion: 'truck', pulgar: 'thumbs-up', calidad: 'badge-check',
  pregunta: 'circle-question-mark', combustible: 'fuel', medidas: 'ruler', garantia: 'shield-check', envio: 'truck',
};
function icono(nombre) {
  const n = ALIAS[nombre] || nombre;
  const f = [path.join(HERE, 'iconos', n + '.svg'), path.join(HERE, 'node_modules', 'lucide-static', 'icons', n + '.svg')].find(fs.existsSync);
  if (!f) throw new Error(`Ícono "${nombre}" no existe. Usar un nombre de https://lucide.dev/icons o uno de: ${Object.keys(ALIAS).join(', ')}, piston`);
  return fs.readFileSync(f, 'utf8').replace(/<!--[\s\S]*?-->/g, '').replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
}
const dibIcono = (nombre, x, y, size, color, sw = 2, fill = 'none') =>
  `<g transform="translate(${x} ${y}) scale(${size / 24})" fill="${fill}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${icono(nombre)}</g>`;
const estrellas = (n, x, y, size, gap) => Array.from({ length: 5 }, (_, i) =>
  dibIcono('star', x + i * (size + gap), y, size, ROJO, 1.5, i < n ? ROJO : 'none')).join('');

// ---------- piezas comunes ----------
// lado: 'der' = textos a la derecha (producto a la izquierda) | 'izq' = textos a la izquierda
const COL = { der: { x0: 560, x1: 1140, bottom: 1085 }, izq: { x0: 60, x1: 640, bottom: 1140 } };

function titulo(lineas, x0, maxW, top, maxSize = 100) {
  const f = F.titulo;
  let size = Math.min(maxSize, ...lineas.map(l => maxW / ancho(f, l.toUpperCase(), 1) * 0.97));
  const c = capH(f) * size, gap = size * 0.16;
  const svg = lineas.map((l, i) => texto(f, l.toUpperCase(), x0, top + c + i * (c + gap), size,
    i === lineas.length - 1 && lineas.length > 1 ? ROJO : BLANCO, { italica: true })).join('');
  const anchoUlt = ancho(f, lineas[lineas.length - 1].toUpperCase(), size);
  return { svg, bottom: top + lineas.length * c + (lineas.length - 1) * gap, size, c, anchoUlt };
}
const tarjeta = (x, y, w, h, borde = true) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${CARD}" fill-opacity="0.86" stroke="#FFFFFF" stroke-opacity="0.07"/>` +
  (borde ? `<path d="M${x + 16} ${y} H${x + 8} V${y + h} H${x + 16} A16 16 0 0 1 ${x} ${y + h - 16} V${y + 16} A16 16 0 0 1 ${x + 16} ${y} Z" fill="${ROJO}"/>` : '');

// Ajusta la escala k (tamaño de letra) hasta que el bloque entre en el alto disponible.
function ajustar(construir, disponible, kMax = 1.3, kMin = 0.55) {
  for (let k = kMax; k >= kMin; k -= 0.025) { const r = construir(k); if (r.h <= disponible) return r; }
  console.warn('⚠ El texto no entra ni con letra chica: acortar textos de la ficha.');
  return construir(kMin);
}

async function fondo(lado) {
  let bg = sharp(path.join(HERE, 'fondo.jpg')).resize(S, S, { fit: 'cover' });
  if (lado === 'izq') bg = bg.flop(); // banco/luz roja del lado del producto
  const a = lado === 'der' ? ['0', '0.62', '0.75'] : ['0.75', '0.62', '0'];
  const ov = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}">
    <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
      <stop offset="${lado === 'der' ? 0.36 : 0}" stop-color="#000" stop-opacity="${a[0]}"/>
      <stop offset="0.5" stop-color="#000" stop-opacity="${a[1]}"/>
      <stop offset="${lado === 'der' ? 1 : 0.64}" stop-color="#000" stop-opacity="${a[2]}"/></linearGradient>
      <radialGradient id="v" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></radialGradient></defs>
    <rect width="${S}" height="${S}" fill="url(#g)"/><rect width="${S}" height="${S}" fill="url(#v)"/>
    <path d="M0 98 L98 0" stroke="${ROJO}" stroke-width="7"/></svg>`;
  return { base: await bg.toBuffer(), overlay: ov };
}
async function escena(lado, cuerpo, dest) {
  const { base, overlay } = await fondo(lado);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}">${cuerpo}</svg>`;
  await sharp(base).composite([{ input: Buffer.from(overlay) }, { input: Buffer.from(svg) }]).png().toFile(dest);
  console.log('escena     ', dest);
}

// ---------- 2 · Detalles (producto izq, textos der) ----------
function detalles(d) {
  const { x0, x1, bottom } = COL.der, W = x1 - x0;
  const t = titulo(d.titulo, x0, W, 64);
  const top = t.bottom + 44;
  const r = ajustar(k => {
    const pad = 22 * k, ib = 84 * k, gap = 22 * k, sep = 16 * k, tx = x0 + 8 + pad + ib + gap, tw = x1 - pad - tx;
    let y = top, svg = '';
    for (const it of d.items) {
      const ti = parrafo(F.bold, it.titulo, tx, 0, 32 * k, tw, BLANCO, 1.15);
      const sb = parrafo(F.semi, it.bajada || '', tx, 0, 23 * k, tw, GRIS, 1.3);
      const hText = ti.h + (it.bajada ? 14 * k + sb.h : 0);
      const h = Math.max(ib, hText) + pad * 2;
      const ty = y + (h - hText) / 2;
      svg += tarjeta(x0, y, W, h)
        + `<rect x="${x0 + 8 + pad}" y="${y + (h - ib) / 2}" width="${ib}" height="${ib}" rx="${14 * k}" fill="none" stroke="${ROJO}" stroke-width="3"/>`
        + dibIcono(it.icono, x0 + 8 + pad + ib * 0.2, y + (h - ib) / 2 + ib * 0.2, ib * 0.6, ROJO, 2)
        + parrafo(F.bold, it.titulo, tx, ty, 32 * k, tw, BLANCO, 1.15).svg
        + (it.bajada ? parrafo(F.semi, it.bajada, tx, ty + ti.h + 14 * k, 23 * k, tw, GRIS, 1.3).svg : '');
      y += h + sep;
    }
    return { svg, h: y - sep - top };
  }, bottom - top);
  return t.svg + r.svg;
}

// ---------- 3 · Compatibilidades (producto der, lista izq) ----------
function compatibles(d) {
  const { x0, x1 } = COL.izq, W = x1 - x0;
  const icoS = 84;
  const t = titulo(d.titulo, x0, W - icoS - 24, 64);
  const lastTop = t.bottom - t.c;
  let svg = t.svg + dibIcono('motorbike', x0 + t.anchoUlt + 22, lastTop + (t.c - icoS) / 2, icoS, ROJO, 1.8);
  const top = t.bottom + 44, notaH = d.nota ? 60 : 0, bottom = 1140 - notaH;
  const r = ajustar(k => {
    const pad = 30 * k, ck = 34 * k, tx = x0 + 8 + pad + ck + 20 * k, tw = x1 - pad - tx, rowPad = 18 * k;
    let y = top + pad - rowPad, s = '';
    d.filas.forEach((f, i) => {
      const m = parrafo(F.bold, f.modelo, tx, 0, 30 * k, tw, BLANCO, 1.15);
      const a = f.anios ? parrafo(F.semi, f.anios, tx, 0, 23 * k, tw, GRIS) : { h: 0 };
      const hRow = m.h + (f.anios ? 12 * k + a.h : 0) + rowPad * 2;
      if (i > 0) s += `<line x1="${tx}" x2="${x1 - pad}" y1="${y}" y2="${y}" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="1.5"/>`;
      const ty = y + rowPad;
      s += dibIcono('check', x0 + 8 + pad, ty + (m.h - ck) / 2, ck, ROJO, 3.2)
        + parrafo(F.bold, f.modelo, tx, ty, 30 * k, tw, BLANCO, 1.15).svg
        + (f.anios ? parrafo(F.semi, f.anios, tx, ty + m.h + 12 * k, 23 * k, tw, GRIS).svg : '');
      y += hRow;
    });
    const h = y + pad - rowPad - top;
    return { svg: tarjeta(x0, top, W, h) + s, h };
  }, bottom - top);
  svg += r.svg;
  if (d.nota) svg += parrafo(F.semi, d.nota, x0 + 4, top + r.h + 26, 22, W, GRIS).svg;
  return svg;
}

// ---------- 4 · Preguntas frecuentes (producto izq, textos der) ----------
function faq(d) {
  const { x0, x1, bottom } = COL.der, W = x1 - x0;
  const t = titulo(d.titulo, x0, W, 64);
  const top = t.bottom + 44;
  const r = ajustar(k => {
    const pad = 20 * k, br = 25 * k, gap = 18 * k, sep = 14 * k, tx = x0 + 8 + pad + br * 2 + gap, tw = x1 - pad - tx;
    let y = top, svg = '';
    d.items.forEach((it, i) => {
      const q = parrafo(F.bold, it.p, tx, 0, 26 * k, tw, BLANCO, 1.2);
      const a = parrafo(F.semi, it.r, tx, 0, 21 * k, tw, GRIS, 1.32);
      const h = Math.max(br * 2, q.h + 12 * k + a.h) + pad * 2;
      const n = String(i + 1);
      svg += tarjeta(x0, y, W, h)
        + `<circle cx="${x0 + 8 + pad + br}" cy="${y + pad + br}" r="${br}" fill="${ROJO}"/>`
        + texto(F.titulo, n, x0 + 8 + pad + br, y + pad + br + capH(F.titulo) * 30 * k / 2, 30 * k, BLANCO, { align: 'center' })
        + parrafo(F.bold, it.p, tx, y + pad, 26 * k, tw, BLANCO, 1.2).svg
        + parrafo(F.semi, it.r, tx, y + pad + q.h + 12 * k, 21 * k, tw, GRIS, 1.32).svg;
      y += h + sep;
    });
    return { svg, h: y - sep - top };
  }, bottom - top);
  return t.svg + r.svg;
}

// ---------- 5 · Opiniones (producto der, reseñas izq) ----------
function opiniones(d) {
  const { x0, x1, bottom } = COL.izq, W = x1 - x0;
  const t = titulo(d.titulo, x0, W, 64, 96);
  let svg = t.svg + estrellas(5, x0, t.bottom + 26, 46, 10);
  const top = t.bottom + 26 + 46 + 36;
  const r = ajustar(k => {
    const pad = 24 * k, tx = x0 + 8 + pad, tw = x1 - pad - tx, sep = 16 * k, ss = 26 * k;
    let y = top, s = '';
    for (const it of d.items) {
      const cita = `“${it.texto}”`;
      const q = parrafo(F.bold, cita, tx, 0, 27 * k, tw, BLANCO, 1.25);
      const h = pad * 2 + ss + 16 * k + q.h;
      s += tarjeta(x0, y, W, h)
        + estrellas(it.estrellas ?? 5, tx, y + pad, ss, 6 * k)
        + (it.cuando ? texto(F.semi, it.cuando, x1 - pad, y + pad + ss * 0.78, 20 * k, GRIS, { align: 'right' }) : '')
        + parrafo(F.bold, cita, tx, y + pad + ss + 16 * k, 27 * k, tw, BLANCO, 1.25).svg;
      y += h + sep;
    }
    return { svg: s, h: y - sep - top };
  }, bottom - top);
  return svg + r.svg;
}

// ---------- 1 · Portada ----------
async function portada(dest) {
  const capas = [];
  const caja = ['caja.png', 'caja.webp'].map(f => path.join(dir, f)).find(fs.existsSync);
  if (caja) capas.push(...await capaObjeto(await sharp(caja).png().toBuffer(), { x: 40, y: 380, w: 600, h: 500 }, 1, true));
  await sharp({ create: { width: S, height: S, channels: 3, background: '#ffffff' } }).composite(capas).png().toFile(dest);
  console.log('escena     ', dest, caja ? '(con caja)' : '(sin caja: producto centrado)');
  return !caja;
}

// ---------- main ----------
const esc = path.join(dir, 'escenas');
fs.rmSync(esc, { recursive: true, force: true });
fs.mkdirSync(esc, { recursive: true });
const solo = opt('solo', null)?.split(',');
const quiero = n => !solo || solo.includes(n);
let portadaSola = false;
if (quiero('1')) portadaSola = await portada(path.join(esc, '1-portada.png'));
if (quiero('2') && ficha.detalles) await escena('der', detalles(ficha.detalles), path.join(esc, '2-detalles.png'));
if (quiero('3') && ficha.compatibles) await escena('izq', compatibles(ficha.compatibles), path.join(esc, '3-compatibles.png'));
if (quiero('4') && ficha.faq) await escena('der', faq(ficha.faq), path.join(esc, '4-faq.png'));
if (quiero('5') && ficha.opiniones?.items?.length) await escena('izq', opiniones(ficha.opiniones), path.join(esc, '5-opiniones.png'));

await componer({
  dir, escenas: esc, portadaSola,
  rotar: +opt('rotar', ficha.rotar ?? 0),
  rotarPortada: +opt('rotar-portada', ficha.rotarPortada ?? 0),
  escala: +opt('escala', ficha.escala ?? 1),
});
