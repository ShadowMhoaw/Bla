import { useEffect, useState } from 'react';

/**
 * Efecto máquina de escribir. No lleva temporizador propio: calcula cuántas letras se ven a partir de
 * `startedAt` y `speed` (ms por letra), así que si el componente se vuelve a montar (cambio de pestaña)
 * retoma justo donde iba. Con `done` o sin `speed` (movimiento reducido) muestra el texto entero.
 */
export default function Typewriter({ text, startedAt, speed, done, caret = false, className = '' }) {
  const total = text.length;
  const instantaneo = done || !speed;
  const visibles = () => (instantaneo ? total : Math.min(total, Math.floor((Date.now() - startedAt) / speed)));
  const [n, setN] = useState(visibles);

  useEffect(() => {
    if (instantaneo) { setN(total); return undefined; }
    let raf;
    const paso = () => {
      const k = Math.min(total, Math.floor((Date.now() - startedAt) / speed));
      setN(k);
      if (k < total) raf = requestAnimationFrame(paso);
    };
    paso();
    return () => cancelAnimationFrame(raf);
  }, [instantaneo, total, startedAt, speed]);

  const escribiendo = !instantaneo && n < total;
  return (
    <span className={className}>
      {/* Lectores de pantalla: el texto completo de una vez, no letra a letra */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{text.slice(0, n)}</span>
      {(escribiendo || caret) && (
        <span aria-hidden="true" className="ml-px inline-block h-[1.05em] w-[2px] translate-y-[2px] animate-blink bg-current align-baseline" />
      )}
    </span>
  );
}
