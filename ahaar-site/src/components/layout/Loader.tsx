import { useEffect, useState } from 'react';

/**
 * Hero loader. A thin turmeric progress line under the wordmark.
 * Fades out just before the hero reveals (under 1.5s total).
 */
export function Loader() {
  const [done, setDone] = useState(false);
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const total = 1200;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / total);
      setP(k);
      if (k < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 180);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      aria-hidden={done}
      className={`fixed inset-0 z-[60] bg-bg flex items-center justify-center transition-opacity duration-700 ease-soft ${done ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center gap-5">
        <span className="font-display text-3xl tracking-[0.18em] text-ink">AHAAR</span>
        <div className="w-40 h-[1px] bg-ink/15 relative overflow-hidden">
          <span
            className="absolute left-0 top-0 h-full bg-accent"
            style={{ width: `${p * 100}%`, transition: 'width 120ms linear' }}
          />
        </div>
      </div>
    </div>
  );
}
