---
name: imagenes-ml
description: Genera las imágenes terminadas (JPG 1200×1200) para una publicación de MercadoLibre de Revolución Motos — portada fondo blanco, detalles/beneficios, compatibilidades, preguntas frecuentes y opcional opiniones — con el estilo propio de la tienda, la foto REAL del producto y el logo. Las dibuja un script (no hace falta ChatGPT). Si Martín pasa imágenes o datos de la competencia, toma la información y la reescribe con otras palabras. También revisa imágenes. Usar cuando diga cosas como "armame las fotos para la leva", "imágenes para ML del kit de cilindro", "hacé las fotos copiando la info de esta competencia", "revisá estas imágenes que generé".
---

# Imágenes para MercadoLibre — Revolución Motos

Esta skill **genera las imágenes finales**: el script `generar.mjs` dibuja fondo de taller, tarjetas, íconos y
textos (con tipografías reales, sin errores de ortografía), pega la foto REAL del producto recortada y el logo.
No hace falta ningún generador de imágenes externo. **No terminar entregando prompts**: el entregable son los JPG.

**Regla de oro: el producto es siempre la foto real.** Nunca dibujarlo ni pedirle a una IA que lo dibuje
(probado: ChatGPT cambió las levas, el plato y los rulemanes → riesgo de reclamo en ML).

## Preparación (una vez por PC/sesión)

En la carpeta de esta skill: `npm install` (instala sharp, opentype.js 1.x y los íconos lucide-static).
Requiere Node 18+. Si el entorno no tiene Node ni acceso a npm, ver "Plan B" al final.

## Archivos de la skill

- `generar.mjs` — dibuja y arma TODO el set desde `ficha.json`. **Es el camino principal.**
- `recortar.mjs` — recorta una foto sobre fondo claro y liso → PNG transparente.
- `componer.mjs` — pega producto + logo (lo usan generar y armar). `armar.mjs` — sólo para el Plan B.
- `ficha.ejemplo.json` — formato de la ficha (copiarlo y completarlo).
- `estilo.md` (look), `reglas.md` (reglas ML + reescritura de competencia), `prompts.md` (sólo Plan B).
- `fondo.jpg`, `logo.png`, `fuentes/` (Anton, Montserrat — OFL), `iconos/` (íconos propios, ej. `piston`).

## El set

| # | Imagen | Contenido | Lado del producto |
|---|---|---|---|
| 1 | Portada | Producto (+ caja si hay `caja.png`) sobre blanco puro. Sin texto ni logo. | centro / derecha |
| 2 | Detalles | Título + 3–5 beneficios con ícono. | izquierda |
| 3 | Compatibilidades | Lista de modelos/años + nota. | derecha |
| 4 | Preguntas frecuentes | 3–5 preguntas con respuesta corta. | izquierda |
| 5 | Opiniones (opcional) | Reseñas reales, literales. | derecha |

## Paso 1 — Juntar insumos (pedir sólo lo que falte)

- **Fotos nuestras** del producto (y de la caja aparte, si tiene). Son la ÚNICA referencia del producto.
  Nunca usar fotos de la competencia. Describir el producto desde NUESTRAS fotos (marca, logo grabado o no,
  cantidad de piezas/rulemanes): la competencia puede vender otra marca del mismo repuesto.
- Vocabulario: "rulemanes" (no "rodamientos"), como habla el comprador argentino.
- **Nombre del producto** y datos técnicos (medidas, material, qué incluye).
- **Compatibilidades**: las dice Martín, o "usá las de la competencia" → tomarlas de sus imágenes/publicación.
- **Competencia (opcional)**: imágenes o link (con link, se puede usar el scraper de `competencia-ml`, sólo en la PC con `tienda-martin`).
- **Opiniones (opcional)**: captura de las reseñas de NUESTRA publicación.

## Paso 2 — Ficha de textos (mostrarla y esperar OK)

Mostrar a Martín en markdown corto:

```
PRODUCTO: ...
DETALLES    — Título: ... / ... | 3–5 × ícono + "título" + "bajada"
COMPATIBLES — Título | Marca Modelo — años | nota al pie
FAQ         — Título | 3–5 × pregunta + respuesta
OPINIONES   — 3–4 × estrellas + "texto literal" + antigüedad
⚠ A VERIFICAR: datos técnicos que salen de la competencia y no podemos confirmar
```

Límites (en el celular no se leen textos largos; el script achica la letra si no entra, pero mejor no llegar ahí):
- Título: 2 líneas de 1–3 palabras; la última sale en rojo.
- Detalle: título ≤ 4 palabras, bajada ≤ 7. Pregunta ≤ 9 palabras, respuesta ≤ 18.
- Compatibilidades: máx. ~8 filas; si hay más, agrupar ("Honda CG Titan 150 — 2004 a 2015").
- Castellano rioplatense, sin promesas que no podamos sostener ("+30% de potencia" sólo si hay dato).
Si hay competencia: aplicar las reglas de reescritura de `reglas.md`.

## Paso 3 — Preparar la carpeta del producto

Carpeta: `fotos-ml/<producto-en-kebab>/` dentro del directorio de trabajo, con:
1. `producto.png` — `node "<skill>/recortar.mjs" <foto> <carpeta>/producto.png [tolerancia=40]`.
   Mirar el recorte (bordes limpios, sin restos de fondo). Si la foto tiene fondo sucio, pedir una sobre fondo
   blanco o un PNG sin fondo (Paint de Windows 11 → "Quitar fondo", o Canva).
2. `caja.png` (opcional) — la caja recortada igual. Si la foto de la caja es casera (en la mano, sobre la pierna)
   no se puede recortar bien: pedir PNG sin fondo o hacer la portada sin caja (sólo producto, también vale en ML).
3. `ficha.json` — la ficha aprobada, con el formato de `ficha.ejemplo.json`:
   - `icono`: alias en castellano (`velocimetro, rayo, piston, llave, caja, escudo, engranaje, reloj, regla,
     fuego, moto, motor, tuerca, calidad, garantia, envio, combustible, pulgar`) o cualquier nombre de
     https://lucide.dev/icons (ej. `shield-check`). Íconos propios: agregar `iconos/<nombre>.svg` (24×24, trazo).
   - `rotar`: grados para que el producto quede PARADO en 2–5 (+ = horario). Foto ya parada → 0.
   - `escala`: 0.9 si queda muy grande. Sin `opiniones` (o vacía) → no se genera la 5.

## Paso 4 — Generar

```
node "<carpeta de esta skill>/generar.mjs" "<carpeta-producto>" [--rotar g] [--escala 1] [--solo 2,4]
```
→ `<carpeta>/final/1-portada.jpg … 5-opiniones.jpg` (y `escenas/` con los fondos sin producto).

**Mirar CADA final** (abrir la imagen) antes de entregar: producto parado y apoyado, sin tapar texto; textos
completos; nada en la esquina del logo. Ajustar `rotar`/`escala` o acortar textos y volver a correr.
Si sale el aviso "⚠ El texto no entra", acortar los textos de esa imagen.

## Paso 5 — Entregar

Decirle a Martín la ruta de `final/` y un resumen corto: qué imágenes salieron y los ⚠ a verificar.
Guardar también la ficha en markdown (`ficha.md`) en la carpeta.

## Paso 6 — Revisión de imágenes (propias o de otra fuente)

Mirarlas una por una y reportar sólo problemas concretos:
1. **Texto**: comparar letra por letra contra la ficha (tildes, "¿", ñ, números, años, cc).
2. **Producto**: tiene que ser la foto real, recorte limpio, que no tape texto ni flote.
3. **Reglas ML** (`reglas.md`): portada blanca pura y sin agregados; sin contacto; sin logos de terceros; sin marcas de agua.
4. **Estilo** (`estilo.md`): sólo rojo #FF3333 como acento, esquina del logo libre, legible en chico.

## Plan B — sin Node (otra IA sin ejecutar código)

Sólo si de verdad no se puede correr `generar.mjs`: completar las plantillas de `prompts.md` (escena con el
hueco vacío, un chat nuevo por imagen en ChatGPT/Gemini), y después pegar a mano (Canva/Photopea) el PNG del
producto y el logo — o, si aparece Node, `node armar.mjs <carpeta> --rotar <g>` con las escenas guardadas como
`1-portada`, `2-detalles`, `3-compatibles`, `4-faq`, `5-opiniones`. En ese caso avisar que las imágenes no
están hechas todavía, sólo los prompts.
