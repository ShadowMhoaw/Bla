# Traspaso: qué hay y qué falta

Esta carpeta NO es el proyecto completo. El código real está en el PC, en
`Desktop\webs demos\zyro-showcase`, y desde la nube no se puede copiar. Aquí solo hay lo que se pudo recuperar del
historial de la sesión «Configuración local web» (20/10/2026):

- `README.md`: el README del proyecto tal y como lo escribió esa sesión.
- `docs/recuperado/enlazar-demos.js`: script con el que se desviaron los enlaces de la web principal (`localhost:3001`)
  al showcase local (`localhost:3410`) para hacer las capturas. No forma parte del proyecto.

- `fuentes/automatizacion/` y `plantillas/automatizacion/`: **demo nueva** de automatización con IA (Taller Ronda) en React +
  Tailwind + Framer Motion. El código está en `fuentes/automatizacion/` y el resultado compilado, que es lo que se publica,
  en `plantillas/automatizacion/`. Ver `fuentes/automatizacion/README.md`. Si en tu PC ya tienes
  `plantillas/automatizacion/`, decide con cuál de las dos te quedas antes de copiar.
- `plantillas/seo/`: **reconstrucción** de la plantilla de SEO (Reformas Nova) hecha desde una captura, no el código
  original. Al copiar tu proyecto, decide cuál de las dos versiones de `plantillas/seo/` te quedas.
  Versión actual: panel "clean UI" en HTML, CSS y JS puros (sin build ni librerías), con modo oscuro, gráfico interactivo,
  tablas con filtro y orden, y datos en `datos.js`. Diseño en blanco y negro, calendario con los 12 meses (octubre de 2025 a
  septiembre de 2026) y formulario de contacto con Zyro. Enlace directo a un mes: `#2026-09`.

## Estado a 20/10/2026
- Showcase terminado y probado en local (`node servir.js 3410`).
- Web principal (`Desktop\Webs\WEB PRINCIPAL`, puerto 3001) ya enlaza al showcase desde Inicio, Ecosistema y Servicios.
- **Pendiente:** publicar en Vercel (`vercel login`, luego `vercel --prod --yes` en la carpeta `zyro-showcase`).
  Hasta entonces los enlaces de la web principal apuntan a `zyro-showcase.vercel.app` y fallan.
- Idea ofrecida: que los enlaces apunten a `localhost:3410` en desarrollo y a Vercel en producción.

## Para subir el proyecto completo desde el PC
Desde la carpeta `zyro-showcase` (sin `.construccion/` ni `node_modules/`):

```
git clone https://github.com/ShadowMhoaw/Bla
git checkout ccr-a1275df8-b0ufp4
```
Copia el contenido de `zyro-showcase` dentro de `Bla/zyro-showcase/` (sustituyendo estos archivos; la documentación de traspaso vive ahora en `docs/`), y:
```
git add zyro-showcase
git commit -m "Zyro Showcase completo"
git push -u origin ccr-a1275df8-b0ufp4
```
