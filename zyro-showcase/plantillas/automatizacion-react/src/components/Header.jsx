// Cabecera general: título de la demo y pestañas de canal.

import { motion } from 'framer-motion';
import { Globe, Mail, Phone, RotateCcw } from 'lucide-react';
import { useDemo } from '../state/DemoContext.jsx';

const PESTANAS = [
  { id: 'web', label: 'Asistente Web', icono: Globe },
  { id: 'email', label: 'Correo Entrante', icono: Mail },
  { id: 'voice', label: 'Llamadas con IA (Voz)', icono: Phone, destacada: true },
];

export default function Header() {
  const { state, cambiarCanal, reiniciar } = useDemo();
  const sinLeer = state.email.correos.filter((c) => c.estado === 'nuevo').length;

  return (
    <header className="border-b border-slate-200 bg-white px-4 pb-5 pt-8 sm:px-6 lg:px-8 lg:pt-10">
      <div className="mx-auto max-w-[1400px]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">Taller Ronda · Demo de automatización con IA</p>
        <h1 className="max-w-4xl text-balance text-[1.75rem] font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
          Taller Ronda atiende, da citas y <span className="text-brand-600">ordena el correo</span> sin que nadie lo haga a mano.
        </h1>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" aria-label="Canal" className="scroll-none -mx-1 flex max-w-full gap-1 overflow-x-auto rounded-full bg-slate-100 p-1">
            {PESTANAS.map(({ id, label, icono: Icono, destacada }) => {
              const activa = state.canal === id;
              return (
                <button
                  key={id}
                  role="tab"
                  type="button"
                  aria-selected={activa}
                  onClick={() => cambiarCanal(id)}
                  className={`relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activa ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {activa && (
                    <motion.span
                      layoutId="pestana-activa"
                      className="absolute inset-0 rounded-full bg-brand-800 shadow-sm"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  )}
                  <Icono className="relative h-4 w-4" aria-hidden="true" />
                  <span className="relative">{label}</span>
                  {id === 'email' && sinLeer > 0 && (
                    <span className={`relative rounded-full px-1.5 text-[11px] font-semibold ${activa ? 'bg-white/20 text-white' : 'bg-brand-600 text-white'}`}>
                      {sinLeer}
                    </span>
                  )}
                  {destacada && !activa && (
                    <span className="relative rounded-full bg-emerald-100 px-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Nuevo</span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={reiniciar}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reiniciar demo
          </button>
        </div>
      </div>
    </header>
  );
}
