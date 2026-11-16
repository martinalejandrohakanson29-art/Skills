---
name: imagenes-ml
description: Arma el set de imágenes para una publicación de MercadoLibre de Revolución Motos (portada fondo blanco, detalles/beneficios, compatibilidades, preguntas frecuentes y opcional opiniones) como prompts listos para un generador de imágenes (ChatGPT, Gemini, etc.) con el estilo propio de la tienda. Si Martín pasa imágenes o datos de la competencia, toma la información y la reescribe con otras palabras. También revisa las imágenes generadas. Usar cuando diga cosas como "armame las fotos para la leva", "imágenes para ML del kit de cilindro", "hacé las fotos copiando la info de esta competencia", "revisá estas imágenes que generé".
---

# Imágenes para MercadoLibre — Revolución Motos

Esta skill NO dibuja: produce (1) una **ficha de textos** aprobada por Martín y (2) **un prompt por imagen**
para pegar en un generador (ChatGPT/GPT-image o Gemini). Después revisa lo generado y arma las finales.

**Regla de oro: la IA NUNCA dibuja el producto.** Probado: ChatGPT inventa la pieza (cambió las levas, el plato
y los rulemanes). Los prompts piden la escena/textos con un HUECO vacío, y `armar.mjs` pega ahí la foto REAL
recortada (`producto.png`), con sombra, y el logo. La caja sí la puede dibujar la IA (es sólo el empaque).

Scripts (Node; la primera vez, `npm install` en la carpeta de esta skill):
- `node recortar.mjs <foto> <carpeta-producto>/producto.png [tolerancia=40]` — recorta una foto de producto
  sobre fondo claro y liso. Mirar el resultado sobre fondo oscuro; si la foto tiene fondo sucio, pedirle a Martín
  una foto sobre fondo blanco o un PNG sin fondo (Paint de Windows 11 → "Quitar fondo", o Canva).
- `node armar.mjs <carpeta-producto> --rotar <grados>` — compone las finales en `<carpeta>/final/`.
  `--rotar` gira el producto en 2–5 para que quede PARADO (+ = horario; la leva en diagonal usó -125).
  Probar el ángulo y mirar el resultado antes de entregar. `--escala 0.9` si queda muy grande.
En otra IA sin Node: el hueco se rellena a mano (Canva/Photopea) con el PNG sin fondo y el logo.

Archivos de apoyo (leerlos cuando toque el paso):
- `estilo.md` — el estilo visual propio (colores, tipografía, composición). Es la fuente de verdad del look.
- `prompts.md` — plantillas de prompt por imagen.
- `reglas.md` — reglas de MercadoLibre + reglas para reescribir info de la competencia.

## El set

| # | Imagen | Contenido |
|---|---|---|
| 1 | Portada | Producto (+ caja si la hay) sobre blanco puro. Sin texto, sin motos, sin agregados. |
| 2 | Detalles | Título + 4–5 beneficios/características con ícono. |
| 3 | Compatibilidades | Lista de motos/modelos/años compatibles. |
| 4 | Preguntas frecuentes | 4–6 preguntas con respuesta corta. |
| 5 | Opiniones (opcional) | Reseñas reales, transcriptas tal cual de la captura que pase Martín. |

## Paso 1 — Juntar insumos (pedir sólo lo que falte)

- **Fotos nuestras**: producto (y caja, por separado si las tiene). Son la ÚNICA referencia del producto.
  Nunca usar fotos de la competencia como referencia del producto. Mirar NUESTRAS fotos y describir el producto
  desde ellas (marca, logo grabado o no, cantidad de piezas/rulemanes): la competencia puede vender otra marca
  del mismo repuesto (ej. ellos H Racing con logo grabado, nosotros Ultimo sin logo).
- Si la foto es casera (caja en la mano, sobre la pierna, fondo sucio), el prompt pide extraer sólo el objeto.
- Vocabulario: "rulemanes" (no "rodamientos"), como habla el comprador argentino.
- **Nombre del producto** y datos técnicos que tenga (medidas, material, qué incluye).
- **Compatibilidades**: las dice Martín, o "usá las de la competencia" → tomarlas de sus imágenes/publicación.
- **Competencia (opcional)**: imágenes o link. Si pasa link y hace falta leer la ficha, se puede usar el scraper
  de la skill `competencia-ml` (sólo en la PC que tiene `tienda-martin`).
- **Opiniones (opcional)**: captura de las reseñas de NUESTRA publicación.

## Paso 2 — Ficha de textos (mostrarla y esperar OK antes de los prompts)

Armar en markdown, corto, para que Martín apruebe o corrija:

```
PRODUCTO: ...
DETALLES   — Título: ... | 4–5 ítems: "Título corto" + "bajada"
COMPATIBLES — Título: ... | lista Marca Modelo (años) | nota al pie
FAQ        — Título: ... | 4–6 × pregunta + respuesta
OPINIONES  — 3–4 × estrellas + texto literal + antigüedad
⚠ A VERIFICAR: datos técnicos que salen de la competencia y no podemos confirmar
```

Límites de texto (los generadores escriben mal los textos largos y en el celular no se leen):
- Título de imagen: máx. 3–4 palabras.
- Ítem de detalle: título ≤ 4 palabras, bajada ≤ 7 palabras.
- Pregunta ≤ 9 palabras, respuesta ≤ 18 palabras.
- Compatibilidades: máx. ~10 renglones; si hay más, agrupar ("Honda CG Titan 150 — 2004 a 2015").
- Castellano rioplatense, claro, sin promesas que no podamos sostener ("+30% de potencia" sólo si hay dato).

Si hay competencia: aplicar las reglas de reescritura de `reglas.md` (sacar los datos, reescribir desde cero).

## Paso 3 — Prompts

Con la ficha aprobada, completar las plantillas de `prompts.md` (una por imagen), con el bloque de estilo de
`estilo.md` incluido en cada prompt (cada prompt se usa solo, en un chat nuevo del generador).
Indicar en cada uno **qué adjuntar** (sólo la portada lleva la foto de la caja; 2–5 nada). Los textos que van en la imagen, entre comillas y EXACTOS.

## Paso 4 — Entregar

Guardar todo en `fotos-ml/<producto-en-kebab>/prompts.md` dentro del directorio de trabajo
(ficha + prompts + qué adjuntar en cada uno), dejar ahí `producto.png` recortado con `recortar.mjs`
(mirar el recorte) y decirle a Martín la ruta. En el chat, resumen corto:
qué imágenes salen, qué hay que adjuntar y los ⚠ a verificar.

Tips para el generador (incluirlos al final del archivo):
- Un chat nuevo por imagen; en la portada adjuntar la foto de la caja ANTES de pegar el prompt.
- Si igual dibuja el producto: "sacá el producto, dejá ese lugar vacío" y regenerar.
- Si escribe mal un texto: pedir "corregí sólo el texto X por 'Y', no cambies nada más".
- Si pone texto/tarjetas en el hueco del producto o en la esquina del logo: pedir que lo deje vacío.
- Pedir formato cuadrado 1:1. Bajar en la mejor calidad y exportar JPG 1200×1200.

## Paso 5 — Armar las finales

Martín guarda lo generado como `1-portada`, `2-detalles`, `3-compatibles`, `4-faq`, `5-opiniones` en la
carpeta del producto. Correr `node "<carpeta de esta skill>/armar.mjs" "<carpeta>" --rotar <g>`
→ `<carpeta>/final/` (JPG 1200×1200, producto real con sombra, logo en 2–5, portada sin logo).
Mirar CADA final: el producto no tiene que tapar texto ni quedar flotando; ajustar `--rotar`/`--escala` o pedir
que se regenere la escena con el hueco bien vacío.

## Paso 6 — Revisión de las imágenes generadas

Cuando Martín traiga las imágenes, mirarlas una por una y reportar sólo problemas concretos:
1. **Texto**: comparar letra por letra contra la ficha (tildes, "¿", ñ, números, años, cc). Errores típicos de IA:
   letras duplicadas, palabras inventadas, texto extra que no pedimos.
2. **Producto**: en lo generado NO tiene que haber ningún producto dibujado (si la IA lo dibujó igual, rehacer
   pidiendo el hueco vacío). En las finales el producto es la foto real: chequear recorte limpio y que no tape texto.
3. **Reglas ML** (`reglas.md`): portada blanca pura y sin agregados; sin datos de contacto; sin logos de terceros
   agregados; sin marcas de agua.
4. **Estilo**: que respete `estilo.md` (sólo rojo #FF3333 como acento, esquina del logo libre, legibilidad en chico).
Para cada error, dar el pedido de corrección listo para pegar en el generador.
