// Arma las finales a partir de escenas generadas por OTRA IA (ChatGPT/Gemini) con el hueco vacío.
// (Si las escenas las dibuja la skill, usar generar.mjs, que ya hace todo.)
// Uso: node armar.mjs <carpeta-producto> [--rotar 0] [--rotar-portada 0] [--escala 1]
//   --rotar: giro (grados, + = horario) del producto en 2-5 para que quede parado en la zona alta y angosta.
//   --rotar-portada: giro en la portada (normalmente 0: la foto tal cual).
// En la carpeta: producto.png (recorte transparente) + 1-portada.*, 2-detalles.*, 3-compatibles.*, 4-faq.*, 5-opiniones.*
// Salida: <carpeta>/final/*.jpg 1200x1200. Logo en 2-5, portada sin logo.
import { componer } from './componer.mjs';

const args = process.argv.slice(2);
const dir = args[0];
const opt = (k, d) => { const i = args.indexOf('--' + k); return i > -1 ? +args[i + 1] : d; };
if (!dir) { console.error('Uso: node armar.mjs <carpeta> [--rotar grados] [--escala 1]'); process.exit(1); }
await componer({ dir, rotar: opt('rotar', 0), rotarPortada: opt('rotar-portada', 0), escala: opt('escala', 1) });
