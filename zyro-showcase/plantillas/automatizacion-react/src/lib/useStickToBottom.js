import { useEffect, useRef } from 'react';

/**
 * Mantiene un contenedor con scroll pegado al final mientras crece su contenido
 * (mensajes nuevos o texto que se va escribiendo), salvo que la persona haya subido a leer.
 * Uso: <div ref={scrollRef} className="overflow-y-auto"><div ref={contentRef}>…</div></div>
 * `activo` (opcional) permite apagarlo mientras no esté creciendo nada, p. ej. al leer un correo ya procesado.
 */
export function useStickToBottom(activo = true) {
  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  const pegado = useRef(true);
  const activoRef = useRef(activo);
  activoRef.current = activo;

  // Al volver a activarse, se vuelve a seguir el final aunque antes se hubiera subido a leer
  useEffect(() => { if (activo) pegado.current = true; }, [activo]);

  useEffect(() => {
    const scroll = scrollRef.current;
    const contenido = contentRef.current;
    if (!scroll || !contenido) return undefined;
    const alFinal = () => { scroll.scrollTop = scroll.scrollHeight; };
    const onScroll = () => { pegado.current = scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight < 80; };
    const observador = new ResizeObserver(() => { if (activoRef.current && pegado.current) alFinal(); });
    scroll.addEventListener('scroll', onScroll, { passive: true });
    observador.observe(contenido);
    alFinal();
    return () => { scroll.removeEventListener('scroll', onScroll); observador.disconnect(); };
  }, []);

  return { scrollRef, contentRef };
}
