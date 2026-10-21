const dos = (n) => String(n).padStart(2, '0');

/** 14:05 */
export const hhmm = (ts = Date.now()) => {
  const d = new Date(ts);
  return `${dos(d.getHours())}:${dos(d.getMinutes())}`;
};

/** 14:05:09 (marca de tiempo de cada línea del log) */
export const hhmmss = (ts = Date.now()) => {
  const d = new Date(ts);
  return `${dos(d.getHours())}:${dos(d.getMinutes())}:${dos(d.getSeconds())}`;
};

/** 75 → "01:15" (cronómetro de la llamada) */
export const mmss = (segundos) => `${dos(Math.floor(segundos / 60))}:${dos(Math.floor(segundos % 60))}`;
