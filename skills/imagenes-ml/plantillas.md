# Plantillas de prompt — una por imagen

Cómo se usan: **un chat nuevo por imagen** (o un mensaje por imagen dentro del GPT), adjuntando las imágenes
que dice cada plantilla, en ese orden. Reemplazar lo que está entre `{llaves}`.
Los textos visibles van en español, entre comillas, EXACTOS. La descripción va en inglés (los generadores la
siguen mejor).

Generador recomendado: **ChatGPT (imágenes)**. Alternativa: **Gemini (Nano Banana)**. Formato siempre 1:1.

---

## Bloque PRODUCTO (pegar donde dice {PRODUCTO})

Es lo más importante: la referencia de diseño muestra el producto de OTRA marca. La IA tiende a copiar ese
producto (su logo grabado, su caja). Este bloque lo impide.

```
PRODUCT FIDELITY (most important rule):
- The product in the final image must be EXACTLY the one in the "MY PRODUCT" photo: same shape, same number of
  lobes, same bearings, same flange/plate, same holes, same proportions, same surface finish.
- {DESCRIPCIÓN FÍSICA EN INGLÉS, ej: "Single-cylinder motorcycle camshaft: cast-iron textured flange with two
  bolt holes on one end, two pressed ball bearings, two polished lobes, plain shaft with NO engraved logo or text"}.
- Do NOT copy the product, the engraved logo, the box or any brand from the DESIGN REFERENCE image.
  The design reference is ONLY for layout, lighting, composition and graphic style.
- You may change the camera angle to stand the product upright and relight it as a studio shot, but do not
  invent, remove or reshape any part.
```

## Bloque CAJA (pegar donde dice {CAJA}; si no hay caja, borrar el bloque)

```
MY BOX: the "MY BOX" photo shows our product box, maybe photographed casually (in a hand, on a lap).
Take ONLY the box, straighten it and render it as a clean closed box, keeping its printed design IDENTICAL:
{DESCRIPCIÓN DE LA CAJA EN INGLÉS, ej: "white, red and black box with the 'ULTIMO' logo top-left and a
'CAM SHAFT' banner"}. Never show the box of the design reference.
```

## Bloque REGLAS (pegar siempre donde dice {REGLAS})

```
RULES:
- Square 1:1, 1200x1200 px, photorealistic premium e-commerce infographic, sharp and legible on a phone.
- Render ALL visible text EXACTLY as written between quotes, in Spanish, with accents, "ñ" and "¿".
  Do not add any other text, numbers, prices, phone numbers, URLs, watermarks, seals or brand logos.
- No motorcycle brand logos and no real catalog motorcycle photos.
- Keep 60 px safe margins.
- {LOGO}
```

`{LOGO}` según el caso:
- Con logo adjunto: `Place the attached "MY LOGO" image small in the bottom-right corner, about 300 px wide,
  copied exactly, without redrawing or changing its letters.`
- Sin logo (portada, o si el generador lo deforma): `Leave the bottom-right corner (about 360x120 px) empty,
  just background.` → después se pega el logo a mano (Canva/Photopea) o con `plan-b/armar.mjs`.

---

## 1 · Portada

Adjuntar: **MY PRODUCT**, **MY BOX** (y opcional la portada de referencia como DESIGN REFERENCE).

```
Create the MAIN PHOTO of a MercadoLibre listing.
{PRODUCTO}
{CAJA}
COMPOSITION: pure white background (RGB 255,255,255), no gradient, no texture, no floor line. The box on the
left at a slight 3/4 angle, the product standing upright in front of it on the right, slightly overlapping.
Soft natural contact shadows, clean studio light, product filling about 75% of the image height.
ABSOLUTELY NO text, icons, badges, logos, frames, stickers or motorcycles (only what is printed on the box).
```

## 2 · Beneficios

Adjuntar: **DESIGN REFERENCE** (imagen de beneficios de la competencia), **MY PRODUCT**, **MY BOX**, **MY LOGO**.

```
Recreate the attached DESIGN REFERENCE image (same layout, same lighting, same premium graphic style, same
kind of 3D titles, cards and icons) but with MY product, MY box and MY texts.
{PRODUCTO}
{CAJA}
STYLE ADJUSTMENTS: accent color red #FF3333, graphite/dark workshop background. Icons in white on red.
TEXTS:
TITLE line 1: "{TÍTULO 1}"
TITLE line 2 (bigger): "{TÍTULO 2}"
CARDS (icon idea — bold title — smaller subtitle):
1. {ícono} — "{título}" — "{bajada}"
2. ...
{REGLAS}
```

## 3 · Compatibilidades

Adjuntar: **DESIGN REFERENCE** = nuestra imagen 2 ya aprobada (para que el set sea coherente), **MY PRODUCT**,
**MY LOGO**.

```
Create a compatibility infographic with EXACTLY the same visual style, background, colors, title treatment and
card design as the attached DESIGN REFERENCE (it is the previous image of the same set), mirrored: the product
standing on the RIGHT, the list on the LEFT.
{PRODUCTO}
TITLE: "{TÍTULO 1}" / "{TÍTULO 2}"   (with a small generic motorcycle silhouette icon, no brand)
LIST (one row per model, a red check icon at the start of each row, model in bold white, detail in gray):
- "{Marca Modelo}" — "{años / detalle}"
- ...
FOOTNOTE (small, gray): "{nota}"
{REGLAS}
```

## 4 · Preguntas frecuentes

Adjuntar: **DESIGN REFERENCE** (FAQ de la competencia), **MY PRODUCT**, **MY BOX**, **MY LOGO**.

```
Recreate the attached DESIGN REFERENCE image (same layout, lighting and premium graphic style) but with MY
product, MY box and MY texts. Keep the visual style of the rest of my set: accent red #FF3333, graphite
background.
{PRODUCTO}
{CAJA}
TITLE: "{PREGUNTAS}" "{FRECUENTES}"
CARDS (icon idea — question in bold — answer below, smaller):
1. {ícono} — "{pregunta}" — "{respuesta}"
2. ...
{REGLAS}
```

## 5 · Opiniones

Adjuntar: **DESIGN REFERENCE** (opiniones de la competencia), **MY PRODUCT**, **MY BOX**, **MY LOGO**.

```
Recreate the attached DESIGN REFERENCE image (same layout, lighting and premium graphic style) but with MY
product, MY box and MY reviews. Accent red #FF3333, graphite background.
{PRODUCTO}
{CAJA}
TITLE: "{OPINIONES}" / "{DE NUESTROS CLIENTES}" with five stars below.
REVIEW CARDS (five stars, time label aligned right in small gray, quote in bold) — copy the quotes EXACTLY:
1. "{Hace ...}" — "“{texto literal}”"
2. ...
{REGLAS}
```

---

## Si el producto sale cambiado (2 intentos fallidos) → Opción B

Pedir la escena SIN producto y pegar la foto real:
1. En la plantilla, reemplazar {PRODUCTO} y {CAJA} por:
   `EMPTY PRODUCT AREA: do NOT draw any product, camshaft, engine part or box. On the {LEFT|RIGHT} side
   (LEFT: x 60–500 px, RIGHT: x 700–1140 px; from y 230 px to the bottom) leave only the empty dark workbench.`
2. Recortar la foto real (fondo blanco y liso; si no, Paint de Windows 11 → "Quitar fondo" o Canva).
3. Pegar el recorte y el logo: a mano en Canva/Photopea, o con Node:
   `node plan-b/recortar.mjs <foto> <carpeta>/producto.png` y `node plan-b/armar.mjs <carpeta> --rotar <grados>`
   (las escenas en la carpeta como `1-portada.png … 5-opiniones.png`).
