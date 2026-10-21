// Guion del Asistente Web: qué contesta el bot, qué escribe el backend en el log y cuándo suben los contadores.
// Cada "turno" recibe `api` (ver state/DemoContext.jsx) y el estado actual de la conversación (`dialog`).
//   api.log(líneas)  → escribe en la terminal (efecto máquina de escribir, una línea tras otra)
//   api.say(texto)   → el bot escribe en el chat (con los tres puntitos antes)
//   effect: { kpi }  → el contador sube cuando la línea termina de escribirse

import { PRECIOS, HORARIO, VEHICULOS, RESPUESTAS_RAPIDAS, nuevaCita } from '../data/mock';
import { detectIntent, extraerCita, parseHora, parsePlaca, huecosPara } from '../lib/brain';
import { abiertoAhora, diaCita } from '../lib/dates';

const corto = (t) => (t.length > 58 ? `${t.slice(0, 55)}…` : t);
const menuInicial = () => RESPUESTAS_RAPIDAS;

/** Deja el chat listo para el siguiente mensaje: sin conversación pendiente y con los botones de siempre. */
const volverAlMenu = (api) => api.patch('web', { dialog: { stage: 'idle', data: {} }, suggestions: menuInicial() });

export async function turnoWeb(api, texto, dialog) {
  api.patch('web', { suggestions: [] });
  api.usuario(texto);
  api.escribiendo(true);

  // 1) Si estamos a mitad de un trámite, intentamos entender la respuesta dentro de ese contexto
  if (dialog.stage === 'cita_datos') {
    const datos = extraerCita(texto);
    if (datos.vehiculo || datos.servicio) return citaHuecos(api, texto, datos);
  }
  if (dialog.stage === 'cita_hueco') {
    const hora = parseHora(texto, dialog.data.huecos);
    if (hora) return citaConfirmar(api, texto, dialog.data, hora);
  }
  if (dialog.stage === 'estado') {
    const placa = parsePlaca(texto);
    if (placa) return estadoRespuesta(api, texto, placa);
  }

  // 2) Si no, miramos la intención general del mensaje
  const intencion = detectIntent(texto);
  const reintentar = dialog.stage !== 'idle' && intencion === 'desconocido';
  if (reintentar) return pedirDeNuevo(api, texto, dialog);

  switch (intencion) {
    case 'cita': return citaInicio(api, texto);
    case 'estado': return estadoInicio(api, texto);
    case 'precios': return precios(api, texto);
    case 'horario': return horario(api, texto);
    case 'humano': return pasarAHumano(api, texto, 'HABLAR_CON_PERSONA', 'Por supuesto.');
    case 'saludo': return saludo(api, texto);
    default: return noEntendido(api, texto);
  }
}

/* ─────────────── Pedir cita: datos → huecos → confirmación ─────────────── */

async function citaInicio(api, texto) {
  await api.log([
    { text: `Mensaje recibido · canal Web · "${corto(texto)}"`, kind: 'sys' },
    { text: 'Intención detectada: PEDIR_CITA (confianza 0.97)', kind: 'intent', effect: { kpi: 'consultas' } },
  ]);
  const resto = api.log([
    { text: 'Datos necesarios: nombre, vehículo, servicio, día', kind: 'data' },
    { text: 'Pidiendo los datos al cliente…', kind: 'info' },
  ]);
  api.patch('web', { dialog: { stage: 'cita_datos', data: {} } });
  await api.say('¡Claro! Para reservarte hueco necesito tu nombre, el coche y qué necesita. Puedes decírmelo en una sola frase.');
  await resto;
  api.patch('web', {
    suggestions: [
      { label: 'Soy Juan, Ford Focus, cambio de aceite, mañana por la mañana' },
      { label: 'Me llamo Marcos, Renault Clio, pre-ITV por la tarde' },
    ],
  });
}

async function citaHuecos(api, texto, datos) {
  const dia = diaCita();
  const huecos = huecosPara(datos.franja);
  const resumen = [datos.nombre, datos.vehiculo, datos.servicio].filter(Boolean).join(', ');
  await api.log([
    { text: `Mensaje recibido · "${corto(texto)}"`, kind: 'sys' },
    { text: 'Intención: PEDIR_CITA · analizando frase (NLU)…', kind: 'intent', effect: { kpi: 'consultas' } },
    { text: `Datos extraídos: ${resumen} · ${dia.rel}`, kind: 'data' },
    { text: 'Consultando huecos en calendario…', kind: 'action', pause: 350 },
    { text: `${huecos.length} huecos libres ${dia.rel}: ${huecos.join(', ')}`, kind: 'data' },
  ]);
  const saludo = datos.nombre ? `Perfecto, ${datos.nombre}.` : 'Perfecto.';
  const que = datos.servicio ? ` para ${datos.servicio.toLowerCase()}` : '';
  const coche = datos.vehiculo ? ` de tu ${datos.vehiculo}` : '';
  api.patch('web', { dialog: { stage: 'cita_hueco', data: { ...datos, dia, huecos } } });
  await api.say(`${saludo} Tengo hueco ${dia.rel}${que}${coche} a las ${huecos.join(', ').replace(/, ([^,]*)$/, ' o a las $1')}. ¿Cuál te viene mejor?`);
  api.patch('web', { suggestions: huecos.map((h) => ({ label: h, texto: `A las ${h}` })) });
}

async function citaConfirmar(api, texto, datos, hora) {
  if (!hora.ok) {
    await api.log([
      { text: `Hueco solicitado (${hora.pedida}) no disponible`, kind: 'warn', effect: { kpi: 'consultas' } },
      { text: 'Volviendo a ofrecer los huecos libres…', kind: 'info' },
    ]);
    await api.say(`A las ${hora.pedida} ya no me queda hueco. Puedo ${datos.huecos.join(', ').replace(/, ([^,]*)$/, ' o a las $1')}. ¿Te viene bien alguno?`);
    api.patch('web', { suggestions: datos.huecos.map((h) => ({ label: h, texto: `A las ${h}` })) });
    return;
  }
  const id = nuevaCita();
  const cliente = datos.nombre ?? 'Cliente web';
  const vehiculo = datos.vehiculo ?? 'Vehículo por confirmar';
  const servicio = datos.servicio ?? 'Revisión general';
  await api.log([
    { text: `Hueco elegido: ${datos.dia.corta} ${hora.hora}`, kind: 'data', effect: { kpi: 'consultas' } },
    { text: 'Creando cita en el sistema…', kind: 'action', pause: 300 },
    { text: `✔ Cita ${id} creada · ${cliente} · ${vehiculo} · ${datos.dia.corta} ${hora.hora}`, kind: 'ok', effect: { kpi: 'citas' } },
  ]);
  const resto = api.log([
    { text: 'Enviando confirmación por SMS y email…', kind: 'action' },
    { text: '✔ Recordatorio programado 24 h antes de la cita', kind: 'ok' },
  ]);
  await api.say(`Hecho${datos.nombre ? `, ${datos.nombre}` : ''}. Tu cita está confirmada. Te llegará un SMS con los detalles.`, {
    tipo: 'cita',
    id,
    dia: `${datos.dia.corta}`,
    hora: hora.hora,
    vehiculo,
    servicio,
  });
  await resto;
  volverAlMenu(api);
}

/* ─────────────────────── ¿Está listo mi coche? ─────────────────────── */

async function estadoInicio(api, texto) {
  await api.log([
    { text: `Mensaje recibido · canal Web · "${corto(texto)}"`, kind: 'sys' },
    { text: 'Intención detectada: ESTADO_REPARACIÓN (confianza 0.95)', kind: 'intent', effect: { kpi: 'consultas' } },
    { text: 'Falta la matrícula para consultar la orden de reparación', kind: 'data' },
  ]);
  api.patch('web', { dialog: { stage: 'estado', data: {} } });
  await api.say('Claro, lo miro ahora mismo. ¿Me dices la matrícula del coche?');
  api.patch('web', {
    suggestions: [{ label: '4821 KLM', texto: 'Mi matrícula es 4821 KLM' }, { label: '7733 HRT', texto: 'La matrícula es 7733 HRT' }],
  });
}

async function estadoRespuesta(api, texto, placa) {
  const ficha = VEHICULOS[placa];
  await api.log([
    { text: `Mensaje recibido · "${corto(texto)}"`, kind: 'sys' },
    { text: `Matrícula extraída: ${placa}`, kind: 'data', effect: { kpi: 'consultas' } },
    { text: 'Consultando el sistema de gestión del taller…', kind: 'action', pause: 350 },
    ficha
      ? { text: `Orden ${ficha.orden} encontrada · ${ficha.vehiculo} · estado: ${ficha.estado.toUpperCase()}`, kind: 'ok' }
      : { text: `Sin coincidencias para ${placa} (0 de 1 órdenes abiertas)`, kind: 'warn' },
  ]);
  if (!ficha) {
    await api.say('No encuentro ninguna orden abierta con esa matrícula. ¿Puedes revisarla? Si prefieres, te paso con alguien del taller.');
    api.patch('web', {
      suggestions: [{ label: '4821 KLM', texto: 'Mi matrícula es 4821 KLM' }, { label: 'Hablar con una persona' }],
    });
    return;
  }
  const encabezado = ficha.estado === 'listo' ? '¡Buenas noticias! Tu coche está listo.' : 'Tu coche sigue en el taller, pero va bien.';
  await api.say(`${encabezado} ${ficha.nota}`, { tipo: 'estado', placa, ...ficha });
  volverAlMenu(api);
}

/* ─────────────────────── Precios y horario ─────────────────────── */

async function precios(api, texto) {
  await api.log([
    { text: `Mensaje recibido · canal Web · "${corto(texto)}"`, kind: 'sys' },
    { text: 'Intención detectada: CONSULTA_PRECIOS (confianza 0.96)', kind: 'intent', effect: { kpi: 'consultas' } },
    { text: 'Leyendo tarifas vigentes (tarifas-2026.pdf)…', kind: 'action', pause: 300 },
    { text: `${PRECIOS.length} servicios encontrados · respuesta sin intervención humana`, kind: 'ok' },
  ]);
  await api.say('Estos son nuestros precios orientativos, con IVA incluido. El precio final lo confirmamos al revisar el coche.', {
    tipo: 'precios',
    filas: PRECIOS,
  });
  volverAlMenu(api);
}

async function horario(api, texto) {
  const abierto = abiertoAhora();
  await api.log([
    { text: `Mensaje recibido · canal Web · "${corto(texto)}"`, kind: 'sys' },
    { text: 'Intención detectada: CONSULTA_HORARIO (confianza 0.98)', kind: 'intent', effect: { kpi: 'consultas' } },
    { text: 'Leyendo ficha de empresa (actualizada hoy)…', kind: 'action' },
    { text: `Estado ahora mismo: ${abierto ? 'ABIERTO' : 'CERRADO'}`, kind: abierto ? 'ok' : 'warn' },
  ]);
  await api.say(`${abierto ? 'Ahora mismo estamos abiertos.' : 'Ahora mismo estamos cerrados.'} Este es nuestro horario:`, {
    tipo: 'horario',
    filas: HORARIO,
  });
  volverAlMenu(api);
}

/* ─────────────────────── Humano, saludo y casos dudosos ─────────────────────── */

async function pasarAHumano(api, texto, intencion, apertura) {
  await api.log([
    { text: `Mensaje recibido · canal Web · "${corto(texto)}"`, kind: 'sys' },
    { text: `Intención detectada: ${intencion} (confianza 0.99)`, kind: 'intent', effect: { kpi: 'consultas' } },
    { text: 'Comprobando disponibilidad del equipo…', kind: 'action', pause: 300 },
    { text: '⚠ Conversación pasada a Jorge (jefe de taller) con resumen', kind: 'warn', effect: { kpi: 'humano' } },
  ]);
  await api.say(`${apertura} Le paso esta conversación a Jorge, del equipo del taller, con un resumen para que no tengas que repetir nada. Te escribirá en unos minutos.`);
  volverAlMenu(api);
}

async function saludo(api, texto) {
  await api.log([
    { text: `Mensaje recibido · canal Web · "${corto(texto)}"`, kind: 'sys' },
    { text: 'Intención detectada: SALUDO (confianza 0.99) → respuesta de cortesía', kind: 'intent', effect: { kpi: 'consultas' } },
  ]);
  await api.say('¡Hola! Encantado de atenderte. ¿Quieres pedir cita, consultar un precio o saber si tu coche está listo?');
  volverAlMenu(api);
}

async function noEntendido(api, texto) {
  await api.log([
    { text: `Mensaje recibido · canal Web · "${corto(texto)}"`, kind: 'sys' },
    { text: 'Intención no reconocida (confianza 0.31 < umbral 0.60)', kind: 'warn', effect: { kpi: 'consultas' } },
    { text: 'Regla: confianza baja → no inventar, derivar a una persona', kind: 'info' },
    { text: '⚠ Conversación pasada a Jorge (jefe de taller) con resumen', kind: 'warn', effect: { kpi: 'humano' } },
  ]);
  await api.say('Esto prefiero que lo vea una persona del equipo para no darte un dato equivocado. Ya le he pasado tu mensaje y te responderán en unos minutos.');
  volverAlMenu(api);
}

/** El cliente contestó algo que no encaja con lo que se le pedía: se repite la pregunta. */
async function pedirDeNuevo(api, texto, dialog) {
  await api.log([
    { text: `Mensaje recibido · "${corto(texto)}"`, kind: 'sys' },
    { text: 'No hay datos útiles en el mensaje → repitiendo la pregunta', kind: 'warn', effect: { kpi: 'consultas' } },
  ]);
  const pregunta = {
    cita_datos: 'No termino de entenderlo. ¿Me dices el coche y qué necesita? Por ejemplo: «Ford Focus, cambio de aceite».',
    cita_hueco: `Perdona, no he captado la hora. Tengo libre a las ${dialog.data.huecos.join(', ').replace(/, ([^,]*)$/, ' o a las $1')}.`,
    estado: 'Necesito la matrícula para buscarlo. Tiene este formato: 1234 ABC.',
  }[dialog.stage];
  await api.say(pregunta);
  const sugerencias = {
    cita_datos: [{ label: 'Soy Juan, Ford Focus, cambio de aceite, mañana por la mañana' }],
    cita_hueco: dialog.data.huecos.map((h) => ({ label: h, texto: `A las ${h}` })),
    estado: [{ label: '4821 KLM', texto: 'Mi matrícula es 4821 KLM' }],
  }[dialog.stage];
  api.patch('web', { suggestions: sugerencias });
}
