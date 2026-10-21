// Utilidades de fechas para los datos de ejemplo: el taller no abre los domingos,
// así que "mañana" se desplaza al siguiente día laborable cuando hace falta.

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const inicioDeDia = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Devuelve los próximos `n` días en que el taller abre (sin domingos), empezando por mañana. */
export function proximosDiasAbiertos(n = 2, desde = new Date()) {
  const hoy = inicioDeDia(desde);
  const out = [];
  for (let i = 1; out.length < n; i++) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i);
    if (d.getDay() === 0) continue;
    const nombre = DIAS[d.getDay()];
    out.push({
      date: d,
      nombre, // "jueves"
      corta: `${nombre.slice(0, 3)} ${d.getDate()} ${MESES[d.getMonth()]}`, // "jue 22 oct"
      rel: i === 1 ? 'mañana' : i === 2 ? 'pasado mañana' : `el ${nombre}`,
    });
  }
  return out;
}

/** Primer día de cita disponible (normalmente mañana). */
export const diaCita = () => proximosDiasAbiertos(1)[0];

/** ¿Está abierto el taller ahora mismo? L-V 8:30–14:00 y 16:00–19:30; sábados 9:00–13:00. */
export function abiertoAhora(ahora = new Date()) {
  const m = ahora.getHours() * 60 + ahora.getMinutes();
  const dia = ahora.getDay();
  if (dia >= 1 && dia <= 5) return (m >= 510 && m < 840) || (m >= 960 && m < 1170);
  if (dia === 6) return m >= 540 && m < 780;
  return false;
}

export const capitalizar = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
