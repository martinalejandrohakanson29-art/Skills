# Estilo visual — Revolución Motos

> `generar.mjs` implementa este estilo tal cual (colores, tipografías Anton/Montserrat, tarjetas, franja, logo). Si se cambia algo acá, cambiarlo también en el script.

Objetivo: verse profesional y "de taller serio", coherente con el logo de la tienda, y leerse bien en una
miniatura de celular. La competencia también usa rojo: nos diferenciamos por el layout (fondo grafito, tarjetas
oscuras con borde, badges numerados, logo fijo), no por el color.

## Concepto: "Taller grafito + rojo Revolución"

- **Fondo** (imágenes 2–5): taller mecánico oscuro, desenfocado, tonos grafito/acero frío. El producto apoyado
  sobre un banco de trabajo de metal oscuro, con luz de recorte roja suave en un borde.
- **Acento único: rojo de la marca** `#FF3333` (el del logo). Se usa en: palabra destacada del título, íconos,
  bordes de tarjetas, la franja diagonal. Ningún otro color de acento.
- **Texto**: blanco `#FFFFFF` para títulos; gris claro `#C9CED6` para bajadas/respuestas.
- **Tarjetas**: rectángulos redondeados oscuros semi-transparentes (`#1A1D22` al ~85 %), borde izquierdo rojo
  grueso, ícono de línea rojo dentro de un cuadrado redondeado con borde rojo. (La competencia usa tarjetas
  blancas con cuadro rojo lleno: no hacer eso.)
- **Tipografía**: títulos en sans-serif condensada, extra-negrita, itálica, MAYÚSCULAS (estilo Anton/Bebas,
  combina con el logo). Cuerpo en sans-serif negrita limpia (estilo Montserrat/Inter), en oración normal.
- **Firma de la casa**: una franja diagonal roja fina en la esquina superior izquierda + el logo abajo a la derecha.

## Logo

- Archivo: `logo.png` (en esta carpeta). Va en las imágenes 2–5, abajo a la derecha, 300 px de ancho.
- **El generador NO dibuja el logo** (deforma las letras) **ni el producto** (lo inventa). Los prompts piden
  dejar libres la esquina del logo (~360×120 px) y el hueco del producto; `armar.mjs` pega ambos reales.
- Huecos (coinciden con ZONAS en `armar.mjs`): izquierda x 60–500, y 230–1090 · derecha x 700–1140,
  y 230–1050 · portada: caja a la izquierda (la dibuja la IA), producto real a la derecha x 470–1160.
- Nombrar las imágenes `1-portada` … `5-opiniones`; la que empieza con "1" queda sin logo (regla de ML).
- En otra IA sin Node: pegar a mano (Canva, Photopea) el PNG sin fondo del producto y el logo en esos lugares.

## Composición (1200×1200, 1:1)

- Margen de seguridad: nada importante a menos de 60 px del borde.
- Producto real (lo pega el script) ocupando ~40 % del ancho, de un lado; textos del otro lado.
- Alternar el lado para que el set no sea repetitivo:
  - 2 Detalles → producto a la IZQUIERDA, tarjetas a la derecha.
  - 3 Compatibilidades → producto a la DERECHA, lista a la izquierda.
  - 4 FAQ → producto a la IZQUIERDA, tarjetas a la derecha.
  - 5 Opiniones → producto a la DERECHA, reseñas a la izquierda.
- Esquina inferior derecha siempre libre para el logo.
- Título arriba, ocupando el ancho del bloque de texto; una palabra en rojo.
- Texto grande: el título tiene que leerse en una miniatura de 200 px.

## Portada (imagen 1) — distinta al resto

- Fondo blanco puro (RGB 255,255,255), sin degradé ni textura.
- Caja a la izquierda (la dibuja la IA desde la foto) + producto real adelante a la derecha (lo pega el script).
- Sin texto, sin íconos, sin franjas, sin logo nuestro, sin motos.

## Íconos sugeridos (línea, rojo)

velocímetro (potencia), rayo (aceleración), engranaje (instalación/modificaciones), pistón (motor/cc),
gráfico ascendente (rendimiento/RPM), llave y destornillador (taller), escudo (calidad/durabilidad),
caja (qué incluye), regla (medidas), resorte (resortes/válvulas), moto (compatibilidad), estrella (opiniones).
