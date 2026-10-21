// Tarjetas ricas que acompañan a algunas respuestas del bot (precios, horario, cita confirmada, estado del coche).

import { motion } from 'framer-motion';
import { CalendarCheck, CheckCircle2, Clock, Wrench } from 'lucide-react';

const Tarjeta = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
    className={`mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm ${className}`}
  >
    {children}
  </motion.div>
);

function Filas({ filas, icono: Icono }) {
  return (
    <ul className="divide-y divide-slate-100 text-[13px]">
      {filas.map((f) => (
        <li key={f.servicio ?? f.dias} className="flex items-center justify-between gap-3 px-3.5 py-2">
          <span className="flex items-center gap-2 text-slate-600">
            {Icono && <Icono className="h-3.5 w-3.5 shrink-0 text-brand-500" aria-hidden="true" />}
            {f.servicio ?? f.dias}
          </span>
          <span className="shrink-0 font-semibold tabular-nums text-slate-900">{f.precio ?? f.horas}</span>
        </li>
      ))}
    </ul>
  );
}

function Cita({ t }) {
  return (
    <Tarjeta className="border-emerald-200">
      <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-2 text-[13px] font-semibold text-emerald-700">
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Cita confirmada <span className="ml-auto font-mono text-xs font-medium">{t.id}</span>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 px-3.5 py-3 text-[13px]">
        <div><dt className="text-xs text-slate-500">Día</dt><dd className="flex items-center gap-1.5 font-semibold"><CalendarCheck className="h-3.5 w-3.5 text-brand-500" aria-hidden="true" />{t.dia}</dd></div>
        <div><dt className="text-xs text-slate-500">Hora</dt><dd className="font-semibold">{t.hora}</dd></div>
        <div><dt className="text-xs text-slate-500">Vehículo</dt><dd className="font-semibold">{t.vehiculo}</dd></div>
        <div><dt className="text-xs text-slate-500">Servicio</dt><dd className="font-semibold">{t.servicio}</dd></div>
      </dl>
    </Tarjeta>
  );
}

function Estado({ t }) {
  const listo = t.estado === 'listo';
  return (
    <Tarjeta>
      <div className="flex items-center justify-between gap-2 px-3.5 pt-3 text-[13px]">
        <div>
          <p className="font-semibold">{t.vehiculo}</p>
          <p className="font-mono text-xs text-slate-500">{t.placa} · {t.orden}</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${listo ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {listo ? 'Listo' : 'En curso'}
        </span>
      </div>
      <div className="px-3.5 pt-3">
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className={`h-full rounded-full ${listo ? 'bg-emerald-500' : 'bg-amber-500'}`}
            initial={{ width: 0 }}
            animate={{ width: `${t.progreso}%` }}
            transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
          />
        </div>
      </div>
      <ul className="space-y-1 px-3.5 py-3 text-[13px] text-slate-600">
        {t.trabajos.map((trabajo) => (
          <li key={trabajo} className="flex items-center gap-2"><Wrench className="h-3.5 w-3.5 text-brand-500" aria-hidden="true" />{trabajo}</li>
        ))}
      </ul>
      <div className="flex justify-between border-t border-slate-100 px-3.5 py-2 text-[13px]">
        <span className="text-slate-500">Importe estimado</span>
        <span className="font-semibold tabular-nums">{t.importe}</span>
      </div>
    </Tarjeta>
  );
}

export default function ChatCard({ tarjeta }) {
  if (!tarjeta) return null;
  switch (tarjeta.tipo) {
    case 'precios': return <Tarjeta><Filas filas={tarjeta.filas} /></Tarjeta>;
    case 'horario': return <Tarjeta><Filas filas={tarjeta.filas} icono={Clock} /></Tarjeta>;
    case 'cita': return <Cita t={tarjeta} />;
    case 'estado': return <Estado t={tarjeta} />;
    default: return null;
  }
}
