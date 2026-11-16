# Plantillas de prompt

Reemplazar lo que está entre `{llaves}`. La descripción va en inglés (los generadores la siguen mejor);
los textos que se ven en la imagen van en español, entre comillas, EXACTOS. Cada prompt debe poder usarse
solo, en un chat nuevo: por eso el bloque de estilo se repite en todos.

## Bloque de estilo (pegar donde dice {ESTILO})

```
VISUAL STYLE (keep identical across the whole set):
- Square 1:1 image, 1200x1200, e-commerce product infographic, photorealistic.
- Background: dark blurred mechanic workshop in graphite and cold steel tones. A dark metal workbench along the bottom,
  with a soft red rim light (#FF3333).
- Single accent color: brand red #FF3333 (no orange or other accent colors).
- Text colors: titles pure white, secondary text light gray #C9CED6.
- Title font: extra-bold condensed italic sans-serif, ALL CAPS (Anton / Bebas Neue style).
  Body font: clean bold sans-serif (Montserrat style), sentence case.
- Cards: dark semi-transparent rounded rectangles (#1A1D22, ~85% opacity) with a thick red left border; each
  card has a red line icon inside a rounded square with a red outline.
- Signature: one thin red diagonal stripe in the top-left corner only.
- RESERVED AREA: leave the bottom-right corner (about 360x120 px) completely empty, just dark background — no text, no cards, no product, no stripe there (our logo is added later).
- Keep 60px safe margins. Large, highly legible text that reads on a phone thumbnail.
- Render ALL text exactly as written in quotes, in Spanish, with accents and "¿" punctuation. Do not add any
  other text, numbers, watermarks, phone numbers, URLs or brand logos.
```

## Hueco del producto (pegar donde dice {PRODUCTO})

La IA NUNCA dibuja el producto (lo inventa/deforma). Deja el hueco y `armar.mjs` pega la foto real recortada.
Usar la versión del lado que corresponde a la imagen (2 y 4 → LEFT, 3 y 5 → RIGHT):

```
EMPTY PRODUCT AREA: do NOT draw the product, a camshaft or any engine part anywhere in the image. On the LEFT
side, from x=60 to x=500 px and from y=230 px down to the bottom edge, leave only the empty dark metal workbench with the soft red rim light, nothing on it, no
text and no cards: a real photo of the product is pasted there afterwards.
```
```
EMPTY PRODUCT AREA: do NOT draw the product, a camshaft or any engine part anywhere in the image. On the RIGHT
side, from x=700 to x=1140 px and from y=230 px down to y=1050 px, leave only the empty dark metal workbench with the soft red rim light, nothing on it, no
text and no cards: a real photo of the product is pasted there afterwards.
```

---

## 1 · Portada (adjuntar sólo la foto de la caja; si no hay caja, no generar: `armar.mjs` arma la portada con un fondo blanco liso — crear `1-portada.png` blanco de 1200×1200)

```
Create a square 1:1 e-commerce main product photo, 1200x1200, pure white background (RGB 255,255,255), no
gradient, no texture, no floor line.
BOX: the attached photo shows the product box ({descripción de la caja en inglés: colores y textos impresos}),
possibly photographed casually (hand, lap, table). Take ONLY the box: remove everything else, straighten it and
render it as a clean closed box with sharp studio lighting, keeping its printed design IDENTICAL.
Place ONLY the box on the left side, at a slight 3/4 angle, occupying roughly x=40 to x=640 px and y=380 to
y=880 px, with a soft natural contact shadow.
The right part of the image (x greater than 520 px) must stay COMPLETELY EMPTY pure white: the real product photo
is pasted there afterwards, partly in front of the box.
Do NOT draw the product, a camshaft or any other object. NO added text, icons, badges, logos, frames or
motorcycles (only what is printed on the box itself).
```

## 2 · Detalles (no adjuntar nada)

```
Create a square product infographic for an online store.
{ESTILO}
{PRODUCTO}
LAYOUT: the LEFT area stays empty for the product ({PRODUCTO}).
On the RIGHT: the title on top, and below it {N} stacked cards, one per feature.
TITLE (two lines, the second word(s) in red): "{TÍTULO LÍNEA 1}" / "{TÍTULO LÍNEA 2}"
CARDS (icon — bold white title — light gray subtitle):
1. {ícono} — "{título}" — "{bajada}"
2. {ícono} — "{título}" — "{bajada}"
...
```

## 3 · Compatibilidades (no adjuntar nada)

```
Create a square product compatibility infographic for an online store.
{ESTILO}
{PRODUCTO}
LAYOUT: the RIGHT area stays empty for the product ({PRODUCTO}). On the LEFT: the title on top, then a single tall
card containing a clean list, one model per row, each row with a small red check-mark icon. Thin divider
lines between rows. A small generic motorcycle silhouette icon (no brand) next to the title.
TITLE (red word last): "{TÍTULO}" ej. "COMPATIBLE" / "CON"
LIST ROWS (brand in white bold, years in light gray):
- "{Marca Modelo}" "{años}"
- ...
FOOTNOTE under the card, small light gray: "{nota}" ej. "Verificá tu modelo antes de comprar."
```

## 4 · Preguntas frecuentes (no adjuntar nada)

```
Create a square FAQ infographic for an online store.
{ESTILO}
{PRODUCTO}
LAYOUT: the LEFT area stays empty for the product ({PRODUCTO}). On the RIGHT: the title on top, then {N} stacked cards.
Each card: a numbered red circle badge on the left ("1", "2", ...), the question in bold white, the answer
below in light gray.
TITLE (second word in red): "{PREGUNTAS}" "{FRECUENTES}"
CARDS:
1. Q: "{pregunta}" A: "{respuesta}"
2. ...
```

## 5 · Opiniones (no adjuntar nada)

```
Create a square customer reviews infographic for an online store.
{ESTILO}
{PRODUCTO}
LAYOUT: the RIGHT area stays empty for the product ({PRODUCTO}). On the LEFT: the title on top with five large red
stars below it, then {N} stacked review cards. Each card: five small red stars, the time label aligned right
in small light gray, and the quote in bold white below.
TITLE (second line in red): "{LO QUE DICEN}" / "{NUESTROS CLIENTES}"
REVIEWS (copy text exactly, including quotes marks):
1. time "{Hace 1 mes}" — "“{texto literal}”"
2. ...
```

Notas para opiniones: transcribir LITERAL (sólo se permite corregir una errata obvia de tipeo), sin nombres de
compradores, sólo reseñas de 4–5 estrellas reales y la cantidad de estrellas real de cada una. Si la reseña es
larga, elegir otra más corta antes que recortarla cambiando el sentido.
