// "Cerebro" de la demo: reglas sencillas que simulan la comprensión del lenguaje (NLU).
// En un proyecto real esto lo haría un modelo de lenguaje; aquí basta con palabras clave
// para que el campo de texto del chat también funcione, no solo los botones.

import { SLOTS } from '../data/mock';
import { capitalizar } from './dates';

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Intención del mensaje: humano | cita | estado | precios | horario | saludo | desconocido */
export function detectIntent(texto) {
  const t = norm(texto);
  if (/(persona|humano|agente|encargad|jefe|reclam|queja|que me llamen|llamadme)/.test(t)) return 'humano';
  if (/(cita|reserv|turno|pedir hora|agendar|quiero hora)/.test(t)) return 'cita';
  if (/(esta listo|listo|recoger|recojo|matricula|como va|ya esta)/.test(t)) return 'estado';
  if (/(precio|cuanto|cuesta|tarifa|presupuesto|coste)/.test(t)) return 'precios';
  if (/(horario|abierto|abris|abren|cerrad|sabado|domingo|a que hora)/.test(t)) return 'horario';
  if (/^(hola|buenas|buenos dias|buenas tardes|hey|ey)\b/.test(t)) return 'saludo';
  return 'desconocido';
}

const MARCAS = 'ford|seat|renault|peugeot|citroen|opel|volkswagen|vw|audi|bmw|mercedes|toyota|nissan|kia|hyundai|fiat|dacia|skoda|mazda|honda|volvo|mini|suzuki|tesla';
const NO_MODELO = /^(y|e|o|para|que|con|de|del|quiero|necesito|es|tengo|si|por|a|en|un|una|mi)$/;
const NO_NOMBRE = /^(un|una|el|la|cliente|nuevo|nueva|de|del|yo)$/;

const SERVICIOS = [
  [/aceite/, 'Cambio de aceite'],
  [/freno|pastilla|disco/, 'Revisión de frenos'],
  [/itv/, 'Revisión pre-ITV'],
  [/neumatic|rueda|pinchazo/, 'Neumáticos'],
  [/bateria/, 'Batería'],
  [/diagnos|testigo|luz del|averia/, 'Diagnosis electrónica'],
  [/alinea|direccion/, 'Alineado de dirección'],
  [/revision|mantenimiento|puesta a punto/, 'Revisión general'],
];

/** Extrae nombre, vehículo, servicio, día y franja horaria de una frase libre. */
export function extraerCita(texto) {
  const t = norm(texto);
  const out = { nombre: null, vehiculo: null, servicio: null, franja: 'manana' };

  const nombre = texto.match(/(?:\bsoy|me llamo|mi nombre es)\s+([A-Za-zÁÉÍÓÚÑáéíóúñ]+)/i);
  if (nombre && !NO_NOMBRE.test(nombre[1].toLowerCase())) out.nombre = capitalizar(nombre[1].toLowerCase());

  const marca = texto.match(new RegExp(`\\b(${MARCAS})\\b(?:\\s+([A-Za-zÁÉÍÓÚÑáéíóúñ0-9-]+))?`, 'i'));
  if (marca) {
    const modelo = marca[2] && !NO_MODELO.test(marca[2].toLowerCase()) ? ` ${capitalizar(marca[2].toLowerCase())}` : '';
    out.vehiculo = `${capitalizar(marca[1].toLowerCase())}${modelo}`;
  }

  for (const [re, nombreServicio] of SERVICIOS) {
    if (re.test(t)) { out.servicio = nombreServicio; break; }
  }
  if (/tarde/.test(t)) out.franja = 'tarde';
  return out;
}

/** Hora elegida entre los huecos ofrecidos. → { ok, hora } | { ok:false, pedida } | null (no hay hora) */
export function parseHora(texto, ofrecidos) {
  const t = norm(texto);
  if (/primer/.test(t)) return { ok: true, hora: ofrecidos[0] };
  if (/segund/.test(t)) return { ok: true, hora: ofrecidos[1] };
  if (/ultim|tercer/.test(t)) return { ok: true, hora: ofrecidos[ofrecidos.length - 1] };
  const m = t.match(/(\d{1,2})(?:[:.h]\s?(\d{2}))?/);
  if (!m) return null;
  const hora = `${m[1].padStart(2, '0')}:${m[2] ?? '00'}`;
  const hallada = ofrecidos.find((o) => o === hora) ?? ofrecidos.find((o) => o.slice(0, 2) === m[1].padStart(2, '0'));
  return hallada ? { ok: true, hora: hallada } : { ok: false, pedida: hora };
}

/** Matrícula española "1234 ABC" (con o sin espacio/guion). */
export function parsePlaca(texto) {
  const m = texto.match(/(\d{4})\s*-?\s*([bcdfghjklmnpqrstvwxyz]{3})\b/i);
  return m ? `${m[1]} ${m[2].toUpperCase()}` : null;
}

export const huecosPara = (franja) => SLOTS[franja] ?? SLOTS.manana;
