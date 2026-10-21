// Visualizador de onda de audio. Cada barra pulsa con su propia altura y velocidad mientras alguien habla.
//   speaker: 'ia' | 'client' | null     thinking: la IA está procesando (onda baja y lenta)

import { useMemo } from 'react';
import { motion } from 'framer-motion';

const BARRAS = 44;

/** Números "aleatorios" repetibles para que la onda no cambie en cada render. */
function pseudo(i, k) {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export default function Waveform({ speaker, thinking, className = '' }) {
  const barras = useMemo(
    () =>
      Array.from({ length: BARRAS }, (_, i) => {
        const centro = 1 - Math.abs(i - (BARRAS - 1) / 2) / (BARRAS / 2); // más alta en el centro
        const pico = 14 + centro * 46 * (0.55 + pseudo(i, 1) * 0.45);
        return {
          habla: [6, pico, 8 + pseudo(i, 2) * pico * 0.5, pico * (0.6 + pseudo(i, 3) * 0.4), 6],
          dur: 0.55 + pseudo(i, 4) * 0.6,
          retardo: pseudo(i, 5) * 0.4,
        };
      }),
    [],
  );
  const color = speaker === 'client' ? 'bg-white' : 'bg-sky-300';

  return (
    <div className={`flex h-16 items-center justify-center gap-[3px] ${className}`} aria-hidden="true">
      {barras.map((b, i) => {
        let animate = { height: 4, opacity: 0.35 };
        let transition = { duration: 0.3 };
        if (speaker) {
          animate = { height: b.habla, opacity: 1 };
          transition = { duration: b.dur, repeat: Infinity, ease: 'easeInOut', delay: b.retardo };
        } else if (thinking) {
          animate = { height: [4, 10 + (i % 5) * 2, 4], opacity: 0.7 };
          transition = { duration: 1.1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.03 };
        }
        return <motion.span key={i} className={`w-[3px] rounded-full ${thinking && !speaker ? 'bg-sky-200' : color}`} animate={animate} transition={transition} />;
      })}
    </div>
  );
}
