// Guion del canal Correo: la IA lee, etiqueta, extrae datos, actúa y redacta un borrador.

import { CATEGORIAS, CORREOS } from '../data/mock';
import { proximosDiasAbiertos } from '../lib/dates';

export async function procesarCorreo(api, id) {
  const correo = CORREOS.find((c) => c.id === id);
  if (!correo) return;
  const resultado = correo.procesar({ dia: proximosDiasAbiertos(1)[0] });
  const palabras = correo.cuerpo.split(/\s+/).length;

  api.patch('email', { selectedId: id });
  api.patchCorreo(id, { estado: 'procesando' });

  // 1) Lectura y clasificación → aparece la etiqueta en la bandeja
  await api.log([
    { text: `Correo nuevo · de: ${correo.nombre} · "${correo.asunto}"`, kind: 'sys' },
    { text: `Leyendo mensaje (${palabras} palabras${correo.adjunto ? ' + 1 adjunto' : ''}) · idioma: es`, kind: 'info' },
    {
      text: `Clasificación: ${CATEGORIAS[correo.categoria].label.toUpperCase()} (${correo.confianza}) · prioridad ${correo.prioridad.toUpperCase()}`,
      kind: 'intent',
      effect: { kpi: 'consultas' },
    },
  ]);
  api.patchCorreo(id, { categoria: correo.categoria, prioridad: correo.prioridad, extraido: resultado.extraido });

  // 2) Datos extraídos y acciones en el sistema
  await api.log([
    { text: `Datos extraídos: ${Object.entries(resultado.extraido).map(([k, v]) => `${k}=${v}`).join(' · ')}`, kind: 'data' },
    ...resultado.acciones,
  ]);

  // 3) Borrador de respuesta (se escribe a la vez que el log)
  if (resultado.borrador) {
    const fin = api.log([{ text: 'Redactando borrador de respuesta…', kind: 'info', pause: 300 }, { text: '✔ Borrador listo para enviar', kind: 'ok' }]);
    await api.borrador(id, resultado.borrador);
    await fin;
  } else {
    await api.log([{ text: 'No requiere respuesta · archivado automáticamente', kind: 'ok' }]);
  }
  api.patchCorreo(id, { estado: 'listo' });
}
