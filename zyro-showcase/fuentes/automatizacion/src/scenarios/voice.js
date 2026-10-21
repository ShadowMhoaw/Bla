// Guion de la llamada: 3 pasos (llamada entrante → el cliente pide cita → el cliente acepta el hueco).
// Mientras habla cada parte, la terminal enseña lo que hace la IA con el audio: STT, NLU, calendario y TTS.

import { LLAMANTE, nuevaCita } from '../data/mock';
import { proximosDiasAbiertos, capitalizar } from '../lib/dates';
import { mmss } from '../lib/format';

export const nuevaLlamada = (api) =>
  api.patch('voice', { phase: 'idle', speaker: null, thinking: false, transcript: [], startedAt: null, endedAt: null, resumen: null });

export function pasoLlamada(api, phase) {
  if (phase === 'idle') return llamadaEntrante(api);
  if (phase === 'greeted') return clientePideCita(api);
  if (phase === 'proposed') return clienteAcepta(api);
  if (phase === 'ended') return nuevaLlamada(api);
}

/* Paso 1: suena el teléfono, la IA identifica al cliente y contesta */
async function llamadaEntrante(api) {
  api.patch('voice', { phase: 'ringing', transcript: [], speaker: null, thinking: false, startedAt: null, endedAt: null, resumen: null });
  const identificacion = api.log([
    { text: `Llamada entrante · SIP ${LLAMANTE.numero} → línea principal`, kind: 'sys' },
    { text: 'Buscando el número en la base de clientes…', kind: 'action' },
    { text: `Cliente reconocido: ${LLAMANTE.nombre} · ${LLAMANTE.vehiculo} · última visita hace 4 meses`, kind: 'data' },
  ]);
  await api.wait(2400);
  await identificacion;

  api.patch('voice', { phase: 'connected', startedAt: Date.now() });
  const contestar = api.log([
    { text: 'Contestando llamada · saludo personalizado', kind: 'ok' },
    { text: 'Sintetizando voz (TTS)… 310 ms', kind: 'action' },
    { text: 'Audio saliente en curso · escuchando al cliente', kind: 'info' },
  ]);
  await api.habla('ia', `Taller Ronda, buenos días, Lucía. Soy el asistente virtual. ¿En qué puedo ayudarte?`);
  await contestar;
  api.patch('voice', { phase: 'greeted' });
}

/* Paso 2: el cliente pide cita para frenos → la IA transcribe, extrae datos y propone huecos */
async function clientePideCita(api) {
  const [dia, dia2] = proximosDiasAbiertos(2);
  const frase = 'Hola, buenas. Quería pedir cita para revisar los frenos, me chirrían un poco al frenar.';

  const procesado = api.log([
    { text: 'Audio stream recibido · 16 kHz · 5,8 s', kind: 'sys' },
    { text: 'Detección de voz (VAD): cliente hablando', kind: 'info' },
    { text: 'Transcribiendo (STT)…', kind: 'action' },
    { text: `Transcribiendo: "${frase}"`, kind: 'info' },
    { text: 'Extrayendo datos (NLU)…', kind: 'action' },
    { text: 'Intención: PEDIR_CITA (0.98) · servicio: Revisión de frenos · síntoma: chirrido al frenar', kind: 'intent', effect: { kpi: 'consultas' } },
    { text: `Vehículo asociado a la ficha: ${LLAMANTE.vehiculo}`, kind: 'data' },
    { text: 'Consultando huecos en calendario…', kind: 'action' },
    { text: `Huecos libres: ${dia.corta} 10:00 · ${dia2.corta} 09:00`, kind: 'data' },
  ]);
  await api.habla('client', frase);
  api.patch('voice', { thinking: true });
  await procesado;

  const sintesis = api.log([{ text: 'Sintetizando respuesta (TTS)… 280 ms', kind: 'action' }]);
  await api.habla(
    'ia',
    `Perfecto, Lucía. Para revisar los frenos de tu Seat León tengo hueco ${dia.rel} a las 10:00 o ${dia2.rel} a las 9:00. ¿Cuál te viene mejor?`,
  );
  await sintesis;
  api.patch('voice', { phase: 'proposed' });
}

/* Paso 3: el cliente acepta → la IA crea la cita, manda el SMS y cuelga */
async function clienteAcepta(api) {
  const [dia] = proximosDiasAbiertos(2);
  const frase = `${capitalizar(dia.rel)} a las diez me viene perfecto.`;
  const id = nuevaCita();

  const procesado = api.log([
    { text: 'Audio stream recibido · 16 kHz · 2,1 s', kind: 'sys' },
    { text: `Transcribiendo: "${frase}"`, kind: 'info' },
    { text: `Hueco elegido: ${dia.corta} 10:00 (confianza 0.99)`, kind: 'data', effect: { kpi: 'consultas' } },
    { text: 'Creando cita en el sistema…', kind: 'action', pause: 300 },
    { text: `✔ Cita ${id} creada · ${LLAMANTE.nombre} · Seat León · Revisión de frenos · ${dia.corta} 10:00`, kind: 'ok', effect: { kpi: 'citas' } },
  ]);
  await api.habla('client', frase);
  api.patch('voice', { thinking: true });
  await procesado;

  const cierre = api.log([
    { text: 'Enviando SMS de confirmación…', kind: 'action' },
    { text: '✔ SMS enviado · recordatorio programado 24 h antes', kind: 'ok' },
    { text: 'Resumen de la llamada guardado en la ficha del cliente', kind: 'data' },
  ]);
  await api.habla('ia', `Listo, Lucía: cita confirmada ${dia.rel} a las 10:00 para revisar los frenos. Te llegará un SMS con los detalles. ¡Hasta pronto!`);
  await cierre;

  const inicio = api.estado().voice.startedAt;
  const fin = Date.now();
  api.patch('voice', {
    phase: 'ended',
    endedAt: fin,
    resumen: { id, dia: dia.corta, hora: '10:00', vehiculo: 'Seat León', servicio: 'Revisión de frenos', cliente: LLAMANTE.nombre },
  });
  await api.log([{ text: `Llamada finalizada · duración ${mmss((fin - inicio) / 1000)} · atendida 100 % por IA`, kind: 'sys' }]);
}
