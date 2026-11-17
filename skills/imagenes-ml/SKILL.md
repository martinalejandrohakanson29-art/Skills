---
name: imagenes-ml
description: Asistente para armar las imágenes de una publicación de MercadoLibre de Revolución Motos tomando como modelo la publicación de un competidor: pide los datos que faltan (fotos nuestras, caja, opiniones reales, compatibilidades), arma la ficha de textos reescrita, prepara un prompt listo por imagen (portada, beneficios, compatibilidades, preguntas frecuentes, opiniones) para generar en ChatGPT o Gemini con nuestras fotos como referencia, y revisa las imágenes generadas. Usar cuando Martín diga cosas como "armame las fotos para la leva", "quiero hacer la publicación del kit de cilindro como la de X", "imágenes para ML de...", "revisá estas imágenes que generé".
---

# Imágenes para MercadoLibre — Revolución Motos

**La idea:** tomamos como MODELO las imágenes de una publicación de la competencia que vende el mismo repuesto
(diseño, estructura, datos) y las rehacemos con NUESTRO producto, NUESTRA caja, NUESTRAS opiniones y textos
reescritos. Las imágenes las dibuja una IA de imágenes (**ChatGPT** recomendado; Gemini alternativa) a partir
de las imágenes de referencia + nuestras fotos. Esta skill hace todo lo demás: pide, redacta, arma los prompts
y revisa.

Si estás en un entorno que genera imágenes (ChatGPT, Gemini): generalas vos, una por una, siguiendo los
prompts. Si no (Claude, otros): entregá los prompts listos y explicá qué adjuntar en cada uno.

Archivos: `plantillas.md` (prompt de cada imagen) · `reglas.md` (MercadoLibre + reescritura) ·
`revision.md` (control final) · `logo.png` · `plan-b/` (pegar la foto real si la IA cambia el producto) ·
`instrucciones-gpt.md` (versión para cargar en un GPT de ChatGPT o Gem de Gemini).

## Paso 1 — Pedir los insumos (de a poco, sólo lo que falte)

Hacer UNA pregunta corta por vez, en orden, y seguir con lo que haya:

1. **Publicación modelo**: capturas de sus imágenes (el link solo no alcanza: ML bloquea la lectura automática).
   Identificar cuál es cada una: portada, beneficios, FAQ, opiniones, compatibilidades.
2. **Foto de nuestro producto**: la mejor que haya. Ideal: sobre fondo liso claro, luz de día, nítida, entera.
   Mirarla y escribir la **descripción física** en inglés (forma, piezas, cantidad de levas/rulemanes, agujeros,
   terminación, si tiene o NO logo grabado). Compararla con la de la competencia y anotar las diferencias:
   ahí es donde la IA se equivoca.
3. **Foto de la caja** (si viene con caja). Puede ser casera; describir colores y textos impresos.
4. **Opiniones reales** de NUESTRA publicación (captura). Si no hay, la imagen 5 no se hace.
5. **Compatibilidades**: las dice Martín o "las de la competencia" (se toman de sus imágenes/título).
6. **Datos técnicos** que sepa (medidas, alzada, qué incluye, si hace falta resortes, etc.).
7. **Logo**: usar `logo.png` de esta carpeta salvo que diga otro.

## Paso 2 — Ficha de textos (mostrar y esperar OK)

Extraer los hechos de la competencia y reescribir según `reglas.md` (otras palabras, otro orden, otra
selección). Mostrar así:

```
PRODUCTO: nombre + descripción física (en inglés, para el prompt)
2 BENEFICIOS   — Título (2 líneas) | 4–5 × ícono + título (≤4 palabras) + bajada (≤7)
3 COMPATIBLES  — Título | Modelo — años/detalle (máx. 8 filas) | nota al pie
4 FAQ          — Título | 4–6 × pregunta (≤9 palabras) + respuesta (≤18)
5 OPINIONES    — 3–4 × texto LITERAL + antigüedad real
⚠ A VERIFICAR: datos que salen de la competencia y no podemos confirmar
```

Castellano rioplatense ("rulemanes", no "rodamientos"). Sin promesas sin dato ("+30 % de potencia").

## Paso 3 — Prompts (uno por imagen)

Completar las plantillas de `plantillas.md` con la ficha y guardarlo todo en
`fotos-ml/<producto-en-kebab>/publicacion.md` con, para cada imagen:
- **Adjuntar** (en orden y con su nombre: DESIGN REFERENCE, MY PRODUCT, MY BOX, MY LOGO).
- **Prompt** completo, listo para copiar (con los bloques {PRODUCTO}/{CAJA}/{REGLAS} ya pegados: cada prompt
  tiene que funcionar solo, en un chat nuevo).

Orden de trabajo recomendado: **2 primero** (define el estilo del set) → 4 → 5 → 3 (usa la 2 como referencia)
→ 1 portada. Un chat nuevo por imagen, así no arrastra errores.

## Paso 4 — Revisar

Cuando Martín pase las imágenes generadas: revisar con `revision.md`, comparando el producto contra la foto
REAL. Reportar sólo problemas concretos y dar el mensaje exacto para corregir en el mismo chat
("the camshaft must have 2 lobes like MY PRODUCT, keep everything else identical"). Si el producto sale
cambiado dos veces → Opción B (`plantillas.md`, al final).

## Paso 5 — Cerrar

Guardar las finales en `fotos-ml/<producto>/final/` como `1-portada.jpg … 5-opiniones.jpg` y recordar los
⚠ A VERIFICAR pendientes.
