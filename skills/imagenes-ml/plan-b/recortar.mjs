// Recorta un producto fotografiado sobre fondo claro/liso -> PNG transparente.
// Uso: node recortar.mjs <foto> <salida.png> [tolerancia=40] [rotar_grados=0]
// Inunda desde los bordes (no agujerea brillos internos del metal), suaviza el borde y recorta.
import sharp from 'sharp';
const [src, dest, tolArg = '40', rotArg = '0'] = process.argv.slice(2);
const tol = +tolArg;
const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
// color de fondo = promedio de las 4 esquinas
const px = (x, y) => (y * W + x) * 4;
const corners = [[0, 0], [W - 1, 0], [0, H - 1], [W - 1, H - 1]].map(([x, y]) => px(x, y));
const bg = [0, 1, 2].map(c => corners.reduce((s, i) => s + data[i + c], 0) / 4);
const dist = i => Math.max(Math.abs(data[i] - bg[0]), Math.abs(data[i + 1] - bg[1]), Math.abs(data[i + 2] - bg[2]));
const isBg = new Uint8Array(W * H);
const stack = [];
for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
while (stack.length) {
  const p = stack.pop();
  if (isBg[p] || dist(p * 4) > tol) continue;
  isBg[p] = 1;
  const x = p % W, y = (p / W) | 0;
  if (x > 0) stack.push(p - 1); if (x < W - 1) stack.push(p + 1);
  if (y > 0) stack.push(p - W); if (y < H - 1) stack.push(p + W);
}
const alpha = Buffer.alloc(W * H);
for (let p = 0; p < W * H; p++) alpha[p] = isBg[p] ? 0 : 255;
const softAlpha = await sharp(alpha, { raw: { width: W, height: H, channels: 1 } }).blur(1.2).extractChannel(0).raw().toBuffer();
for (let p = 0; p < W * H; p++) data[p * 4 + 3] = softAlpha[p];
let img = sharp(data, { raw: { width: W, height: H, channels: 4 } }).png();
img = sharp(await img.toBuffer()).trim({ threshold: 1 });
if (+rotArg) img = sharp(await img.png().toBuffer()).rotate(+rotArg, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).trim({ threshold: 1 });
await img.png().toFile(dest);
console.log('ok', dest);
