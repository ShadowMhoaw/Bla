# Demostraciones de Zyro — un solo sitio

Las cinco webs de demostración por sector y una plantilla por servicio, en **un solo proyecto de Vercel y una sola URL**
(prevista: `https://zyro-showcase.vercel.app`), con un menú para pasar de una a otra.

Sustituye a los cinco proyectos sueltos que había (`zyro-showcase-burger`, `-brasserie`, `-viajes`, `-juventud`,
`-patisserie`). Sitio estático: no hay servidor ni paso de compilación en Vercel.

## Estado de este repositorio
Este repositorio **no contiene todavía el proyecto completo**. Está el código de dos plantillas; el resto (visor, las cinco
webs por sector, tienda, SaaS, `vercel.json`, herramientas) está en el PC y falta subirlo. Detalle en `docs/TRASPASO.md`.

| Carpeta | Contenido |
| --- | --- |
| `plantillas/seo/` | Informe mensual de SEO (HTML, CSS y JS puros, sin compilar) |
| `plantillas/automatizacion/` | Demo de automatización con IA ya compilada (lo que se publica) |
| `fuentes/automatizacion/` | Código fuente de esa demo (React + Vite + Tailwind + Framer Motion). `npm install && npm run build` |
| `docs/` | Notas de traspaso y scripts recuperados que no forman parte del sitio |

## Qué hay en el proyecto completo
| Ruta | Contenido |
| --- | --- |
| `/` | Visor: portada con las 9 demostraciones y, con `?demo=<id>`, la demostración elegida bajo la barra con el menú, anterior/siguiente, tamaño escritorio/tableta/móvil y «abrir aparte» |
| `/webs/hamburgueseria/` … | Las cinco webs por sector, compiladas como estáticas (no se editan aquí: ver abajo) |
| `/plantillas/tienda/` | Tienda online (Olmo, tostadero ficticio): catálogo, filtros, búsqueda, ficha, carrito y compra en tres pasos |
| `/plantillas/saas/` | Aplicación SaaS (Agendo): acceso por funciones, resumen, agenda semanal, clientes, plan y facturas, equipo |
| `/plantillas/automatizacion/` | Automatización con IA (Taller Ronda): asistente que da citas y registro de lo que hace; clasificación del correo |
| `/plantillas/seo/` | Informe mensual de SEO y mantenimiento (Reformas Nova) |

Identificadores de `?demo=`: `hamburgueseria`, `restaurante`, `viajes`, `centro-juvenil`, `pasteleria`, `tienda`, `saas`,
`automatizacion`, `seo`. La lista vive en `js/demos.js`. «Software a medida» no tiene plantilla: ya está Atalaya.

Todas las marcas, personas y cifras son de ejemplo y cada página lo dice en su franja superior.

## Las cinco webs por sector
Su código sigue en sus proyectos (`Desktop/webs demos/zyro-showcase-*` y `Desktop/Webs/zyro-showcase-viajes`).
Si se cambia alguna, se vuelve a compilar aquí:

```
node herramientas/construir.js            # las cinco
node herramientas/construir.js pasteleria  # solo una
```

El script no toca los originales: los copia a `.construccion/`, los adapta (exportación estática con `basePath`, rutas de
imagen prefijadas…) y deja el resultado en `webs/<id>/`. Cambios respecto a las versiones sueltas:
- **Hamburguesería:** sin el panel `/admin` ni su API (necesitan servidor y en Vercel no podían guardar nada).
- **Agencia de viajes:** las ofertas se leen de `api/announcements.json` (antes la sección salía vacía en Vercel), sin el
  botón «Admin» y con el formulario de consulta avisando de que es una demostración.

## Probar en local
```
node servir.js 3410                 # mismas cabeceras que vercel.json
node herramientas/comprobar.js      # 9 páginas × escritorio y móvil + visor
node herramientas/interaccion.js    # compra, cita, conversación, informe; regenera las miniaturas img/plantilla-*.webp
```
(Los dos últimos usan el `puppeteer-core` y `sharp` de la web principal.)

## Publicar en Vercel
```
vercel login
vercel --prod --yes
```
La primera vez crea el proyecto con el nombre de la carpeta (`zyro-showcase`). Si Vercel le diera otra dirección,
hay que cambiarla en la web principal: `DEMOS` de `scripts/servicios/generar.js`, el menú «¿Qué buscas?» de
`src/public/index.html`, `js/proyectos-data.js`, el enlace de `ecosistema.html` y la redirección de
`/ejemplos/automatizacion` en `src/routes/public.js` (los tests de `ecosistema.test.js` lo vigilan).

Cuando el sitio esté publicado y comprobado, los cinco proyectos antiguos sobran:
```
vercel project rm zyro-showcase-burger
```
(y lo mismo con `-brasserie`, `-viajes`, `-juventud` y `-patisserie`).
