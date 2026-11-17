# Frávega · Encendé tu mundo

Concepto de tienda con una dirección visual propia en violeta, fotografía de producto generada con ImageGen y animaciones de entrada, profundidad, revelado y respuesta de los controles. La interfaz respeta la preferencia de movimiento reducido.

## Vista local

Con Node.js 20 o posterior, ejecutá `node server.mjs` y abrí `http://127.0.0.1:4173`. El servidor local usa los módulos nativos de Node.js. El sitio también se puede servir estáticamente desde la raíz del repositorio.

## Recorrido de muestra

Desde la portada, entrá a Audio, abrí la ficha de los auriculares y agregalos al carrito. El checkout permite elegir entrega o retiro y genera un código de pedido de prueba. Podés consultarlo desde «Seguí tu pedido». El catálogo, los importes y los pedidos son ficticios. El navegador guarda el carrito y las compras de prueba de forma local. Los accesos a servicios comerciales llevan al sitio oficial de Frávega.

## Coreografía de la tienda

- La portada adapta el barrido de luz de [AFTER HOURS](https://thepromptsfactory.com/assets/video-previews/after-hours-light.mp4?capture=1). La luz se asienta tras la entrada y responde al puntero sobre la escena. La foto abre la ficha de los auriculares.
- «Elegí tu momento» traduce la profundidad de [STRATA](https://thepromptsfactory.com/assets/video-previews/extrafazant-strata.mp4?capture=1) a tres escenas que se exploran con botones, teclado o deslizamiento táctil. El cambio de plano también actualiza el texto y el color de la luz.
- La transición a la ficha conserva la foto de la escena tomando como referencia [SORA](https://thepromptsfactory.com/assets/video-previews/sora-shrink.mp4). Usa View Transitions cuando está disponible. El carrito retoma el arco violeta y las acciones de compra. Con movimiento reducido, la foto, la selección y las acciones conservan su estado estático.

## Fotografía

Las imágenes de producto se generaron para el proyecto con ImageGen y se guardaron como JPEG.

**Portada · `assets/hero.jpg`**

> Photoreal product campaign website hero, landscape 3:2. A single premium graphite black wireless over-ear headphone floating diagonally, expertly rendered tactile woven earcup and metallic hinge, complete silhouette with ample margin, centered slightly right. Violet light coming from rear right along edges. Rich saturated electric violet and ultraviolet bloom behind the object, deep almost black plum edges, restrained sharp laser arcs and atmospheric haze with clean studio grade lighting. Headphone looks sizable, clear and expensive. The environment is dark and nearly uniform toward far left edge for a smooth join with a dark website surface. Only the product and violet studio lighting, no lettering, no logos, no watermark, no people. High end art-directed advertising photography, convincing industrial design.

**Catálogo · `assets/products.jpg`**

> Commercial product photography contact sheet for an electronics store website, precisely arranged in equally sized cells, 3 columns and 2 rows, six cells total, overall aspect ratio 3:2. All backgrounds uniform soft very light lavender gray #f0edf5 with subtle real contact shadows, no visible dividers or grid lines. Each object FULLY fits its individual cell with 15 percent unoccupied space each side, large distinct clear form, no intersections. Reading order precisely: top left premium graphite black over-ear wireless headphones at three quarter angle, top middle thin flat screen TV with a colorful purple and orange landscape on screen, top right charcoal notebook computer open facing camera at slight 3/4 angle showing flowing petrol-blue screen. Bottom left elegant slate electric basket air fryer with handle, bottom middle graphite round robotic vacuum with bump sensor seen at three quarter angle, bottom right graphite smartphone showing front and rear diagonally overlapping as one product composition with luminous purple display. Premium realistic studio e-commerce photography, surfaces with material detail, identical focal sizes and even softbox lighting. No text, branding, numbers, prices, logos, UI, props, furniture or watermarks.

**TV · `assets/scene-tv.jpg`**

> Original high-end electronics campaign photo, landscape 4:3. An elegant slim 55-inch flat-screen smart television with narrow graphite bezel and two plausible feet, seen almost straight-on, centered slightly right and clearly large (fills 78 percent of the image width), standing on a low black polished stone plinth. On its screen a luminous luminous purple canyon with layers of teal-blue shadows and warm violet horizon, no UI. Set in a dark plum and deep navy showroom with subtle purple light projected down from rear right and slim violet accent reflection on stone. Preserve a clear silhouette and real grounded feet, restrained cinematic violet light with cool accents, realistic materials. Plenty of breathing room above, below and at edges. One product only, no people, no other furniture, no lettering or watermark.

**Cocina · `assets/scene-kitchen.jpg`**

> Original high-end appliance campaign photo, landscape 4:3. A single slate graphite electric basket air fryer, cylindrical with softly squared body, visible physical front pull handle and brushed metal, seen in a clear three-quarter product view, centered slightly right, complete silhouette taking up about 72 percent of image height. Stands on a dark violet-stone kitchen counter, subtle lavender and warm lilac highlights from back right, dark plum showroom background, subtle reflection and believable contact shadow. Restrained cinematic campaign lighting suited to a series with neon violet audio electronics, realistic product materials and clearly legible shape. No other products, no food, no people, no lettering or logo, no on-screen graphics, no watermark.
