// Conecta la web principal con el sitio único de demostraciones (zyro-showcase.vercel.app).
process.chdir('C:/Users/cacaf/Desktop/Webs/WEB PRINCIPAL');
const fs = require('fs');
const D = 'https://zyro-showcase.vercel.app';
function editar(f, pares) {
  const r = fs.readFileSync(f, 'utf8'); const crlf = r.includes('\r\n'); let c = r.replace(/\r\n/g, '\n');
  for (const [a, b] of pares) { if (!c.includes(a)) throw new Error(`${f}: falta «${a.slice(0, 70)}»`); c = c.split(a).join(b); }
  fs.writeFileSync(f, crlf ? c.replace(/\n/g, '\r\n') : c);
  console.log('editado', f);
}

// 1) Portfolio: cada propuesta abre el sitio único con su demostración elegida
editar('src/public/js/proyectos-data.js', [
  ["url: 'https://zyro-showcase-burger.vercel.app/',", `url: '${D}/?demo=hamburgueseria',`],
  ["url: 'https://zyro-showcase-brasserie.vercel.app/',", `url: '${D}/?demo=restaurante',`],
  ["url: 'https://zyro-showcase-viajes.vercel.app/',", `url: '${D}/?demo=viajes',`],
  ["url: 'https://zyro-showcase-juventud.vercel.app/',", `url: '${D}/?demo=centro-juvenil',`],
  ["url: 'https://zyro-showcase-patisserie.vercel.app/',", `url: '${D}/?demo=pasteleria',`],
  ["desc: 'Hamburguesería premium: carta digital por secciones, galería de especialidades, reservas y un panel propio para editar la carta sin tocar código.',",
   "desc: 'Hamburguesería premium: carta digital por secciones, galería de especialidades, opiniones y ubicación.',"],
  ["historia: 'Propuesta para una hamburguesería en la que la carta manda en el diseño: se consulta con comodidad desde el móvil y el propio negocio puede cambiarla sin depender de nadie.',",
   "historia: 'Propuesta para una hamburguesería en la que la carta manda en el diseño: se consulta con comodidad desde el móvil, con las especialidades de la casa a la vista.',"],
  [`   \`url\`: se rellena cuando cada demo esté redesplegada en Vercel. Mientras esté
   vacío, "Ver proyecto" lleva a /contacto en vez de abrir un enlace muerto. */`,
   `   \`url\`: desde el 2026-10-20 las cinco demos viven en UN solo sitio de Vercel con menú
   (${D}, proyecto «zyro-showcase» en Desktop/webs demos), y cada propuesta abre
   ahí su demostración (?demo=<id>). Antes eran cinco proyectos sueltos (zyro-showcase-burger, -brasserie…).
   Si el campo está vacío, "Ver proyecto" lleva a /contacto en vez de abrir un enlace muerto. */`],
]);

// 2) Servicios: ejemplo de cada servicio en el sitio de demostraciones
editar('scripts/servicios/generar.js', [
  ["ejemplo: ['Ver demostraciones', '/ecosistema#proyectos'],", "ejemplo: ['Ver demostraciones', `${DEMOS}/`],"],
  ["hablemos: 'Hablemos de su tienda', ejemplo: null,", "hablemos: 'Hablemos de su tienda', ejemplo: ['Ver plantilla de tienda', `${DEMOS}/?demo=tienda`],"],
  ["hablemos: 'Hablemos de su producto', ejemplo: null,", "hablemos: 'Hablemos de su producto', ejemplo: ['Ver plantilla de aplicación', `${DEMOS}/?demo=saas`],"],
  ["ejemplo: ['Ver una prueba', '/ejemplos/automatizacion'],", "ejemplo: ['Ver una prueba', `${DEMOS}/?demo=automatizacion`],"],
  ["hablemos: 'Hablemos de su posicionamiento', ejemplo: null,", "hablemos: 'Hablemos de su posicionamiento', ejemplo: ['Ver un informe de ejemplo', `${DEMOS}/?demo=seo`],"],
]);

// 3) Menú «¿Qué buscas?» del inicio
editar('src/public/index.html', [
  ['<a class="busca__a" href="/ecosistema#proyectos"><span>Ver demostraciones</span>', `<a class="busca__a" href="${D}/"><span>Ver demostraciones</span>`],
  ['<a class="busca__a" href="/ejemplos/automatizacion"><span>Ver una prueba</span>', `<a class="busca__a" href="${D}/?demo=automatizacion"><span>Ver una prueba</span>`],
]);

// 4) /ejemplos/automatizacion deja de ser una página «en preparación»: la prueba ya existe → redirección permanente
editar('src/routes/public.js', [
  ["  '/ejemplos/automatizacion': 'ejemplos/automatizacion.html',\n", ''],
  ["  '/aplicaciones': '/ecosistema/atalaya',\n};", `  '/aplicaciones': '/ecosistema/atalaya',
  // 2026-10-20: la prueba de automatización ya existe, en el sitio único de demostraciones.
  '/ejemplos/automatizacion': '${D}/?demo=automatizacion',
};`],
  ["    const [ruta, ancla] = hacia.split('#');\n    res.redirect(301, ruta + query + (ancla ? '#' + ancla : ''));",
   "    const [ruta, ancla] = hacia.split('#');\n    // Si el destino ya lleva query (?demo=…), la del visitante se añade con &.\n    const q = query && ruta.includes('?') ? '&' + query.slice(1) : query;\n    res.redirect(301, ruta + q + (ancla ? '#' + ancla : ''));"],
]);
editar('src/public/js/transicion.js', [['ejemplos\\/atalaya|ejemplos\\/automatizacion|', 'ejemplos\\/atalaya|']]);
editar('scripts/accesibilidad/saltar-al-contenido.js', [["'/ejemplos/atalaya', '/ejemplos/automatizacion',", "'/ejemplos/atalaya',"]]);
editar('scripts/inicio/comprobar-inicio.js', [["'/servicios#web /ecosistema#proyectos /servicios#software /ejemplos/atalaya /servicios#ia /ejemplos/automatizacion'",
  `'/servicios#web ${D}/ /servicios#software /ejemplos/atalaya /servicios#ia ${D}/?demo=automatizacion'`]]);

// 5) Generador de ejemplos: fuera la página de automatización
const g = 'scripts/ejemplos/generar.js';
let s = fs.readFileSync(g, 'utf8'); const crlf = s.includes('\r\n'); s = s.replace(/\r\n/g, '\n');
const i = s.indexOf("  {\n    slug: 'automatizacion',");
const j = s.indexOf('\n  },\n', i);
if (i < 0 || j < 0) throw new Error('generador de ejemplos: no encuentro el bloque de automatización');
s = s.slice(0, i) + s.slice(j + '\n  },\n'.length);
s = s.replace("// Por qué un generador (2026-10-17): el menú «¿Qué buscas?» del inicio enlaza a una demostración de Atalaya y a una prueba de\n// automatización con IA que todavía NO existen.",
  "// Por qué un generador (2026-10-17): el menú «¿Qué buscas?» del inicio enlaza a una demostración de Atalaya que todavía NO\n// existe. (La prueba de automatización con IA tenía aquí su página hasta el 2026-10-20: ya existe en el sitio de\n// demostraciones y /ejemplos/automatizacion redirige allí.)");
fs.writeFileSync(g, crlf ? s.replace(/\n/g, '\r\n') : s);
console.log('editado', g);
fs.rmSync('src/public/ejemplos/automatizacion.html');
console.log('borrado src/public/ejemplos/automatizacion.html');
