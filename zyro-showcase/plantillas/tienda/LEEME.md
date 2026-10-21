# Plantilla de tienda online · Olmo (tostadero ficticio)

HTML + Tailwind + JS por módulos, sin build en el despliegue: Vercel sirve los archivos tal cual.
Marca, productos, fotos (Unsplash) y precios son de ejemplo.

| Archivo | Papel |
| --- | --- |
| `index.html` | Franja de Zyro, barra de envío, Navbar, Hero, barra de confianza, catálogo, suscripción, origen, pie, y los dos diálogos (cesta y personalizar) |
| `datos.js` | Catálogo, moliendas, frecuencias y reglas (umbral de envío gratis, gastos, 15 % de suscripción). Importes en céntimos |
| `carrito.js` | Estado del carrito (`localStorage`); los precios se recalculan siempre desde el catálogo |
| `productos.js` | Tarjetas de producto, filtros, interruptor compra única/suscripción y hoja de molienda |
| `drawer.js` | Cesta lateral: líneas, cantidades, molienda por línea, barra de envío gratis y totales |
| `navbar.js` | Buscador que se expande, con sugerencias (flechas, Intro, Esc), y contador de la cesta |
| `utilidades.js`, `iconos.js`, `app.js` | Formato, diálogos animados y avisos; iconos; arranque |
| `entrada.css` → `tailwind.css` | Estilos propios + utilidades. `tailwind.css` ya está compilado y se versiona |

## Cambiar estilos
`tailwind.css` solo hay que regenerarlo si se tocan clases en `index.html`/`*.js` o `entrada.css`:
```
npx tailwindcss@3.4.17 -c tailwind.config.js -i entrada.css -o tailwind.css --minify
```
Para probar: `node servir.js 3410` (en la raíz de `zyro-showcase`) o cualquier servidor estático sobre esta carpeta.

## Notas
- Tipografías de Google Fonts (Fraunces y DM Sans) e imágenes de `images.unsplash.com`: si el sitio usa una CSP en
  `vercel.json`, hay que permitir `fonts.googleapis.com`, `fonts.gstatic.com` e `images.unsplash.com`.
- «Finalizar compra» solo muestra un aviso de demostración; el enlace «Quiero una tienda así» apunta a `/#contacto`.
