import { useEffect, useState } from 'react';
import { copy } from '../../content/copy';
import { useSectionProgress } from '../../lib/useSectionProgress';
import { SceneBundle } from '../canvas/SceneRoot';

/**
 * Quantity. Detection boxes have collapsed to chips here. Each chip's count
 * animates from 0 to its target as that chip's slice of progress fills.
 *
 * Timeline on the shared camera: [3..4]
 *   p 0.00 - 0.15   photo plane finishes fading out
 *   p 0.15 - 0.95   chips appear, counts tick up in sequence
 */
export function Quantity({ bundle }: { bundle: SceneBundle }) {
  const { ref, progress } = useSectionProgress<HTMLElement>();
  const [editing, setEditing] = useState<number | null>(null);

  useEffect(() => {
    bundle.camera.current = 3 + Math.min(1, progress);
    bundle.detect.current = Math.max(0, 1 - progress * 2);
    bundle.graph.current = Math.max(0, (progress - 0.75) * 2);
  }, [progress, bundle]);

  return (
    <section
      id="sec-4"
      ref={ref}
      className="relative z-10 min-h-[180vh] grid grid-cols-12 gap-6 px-6 md:px-10 pt-32 md:pt-48"
    >
      <div className="col-span-12 md:col-span-5 md:sticky md:top-32 self-start">
        <p className="text-[0.78rem] uppercase tracking-[0.22em] text-muted mb-6">{copy.quantity.kicker}</p>
        <h2 className="font-display font-medium text-ink leading-[1.1] text-[clamp(1.8rem,4vw,3.2rem)]">
          {copy.quantity.headline}
        </h2>
        <p className="mt-5 max-w-copy text-ink/80">{copy.quantity.sub}</p>
        <p className="mt-8 text-[0.9rem] text-muted">{copy.quantity.note}</p>
      </div>

      <div className="col-span-12 md:col-span-7">
        {/* A loose, asymmetric cluster of chips. Each reveals + ticks on its own stagger. */}
        <div className="relative mx-auto max-w-[560px] py-6">
          <ul className="flex flex-wrap gap-3 md:gap-4">
            {copy.quantity.chips.map((c, i) => {
              const start = 0.15 + i * 0.1;
              const local = Math.max(0, Math.min(1, (progress - start) / 0.2));
              return (
                <li
                  key={c.name}
                  className="transition-all duration-700 ease-soft"
                  style={{
                    opacity: local,
                    transform: `translateY(${(1 - local) * 14}px)`,
                  }}
                >
                  <button
                    onClick={() => setEditing(editing === i ? null : i)}
                    className="flex items-baseline gap-2 pl-4 pr-5 py-3 bg-surface border border-ink/10 rounded-full hover:border-accent transition-colors duration-500 ease-soft"
                  >
                    <span className="text-[0.95rem] text-ink">{c.name}</span>
                    <span className="font-mono text-[0.9rem] text-muted">
                      {renderTick(c.value, local)}
                    </span>
                  </button>
                  {editing === i && (
                    <div className="mt-2 ml-4 text-[0.78rem] text-muted">
                      Tap again to confirm, or edit the value in the app.
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

// Ticks the trailing number up to its final value based on local progress.
function renderTick(v: string, k: number): string {
  const m = v.match(/(-?\d+(?:\.\d+)?)/);
  if (!m) return v;
  const n = parseFloat(m[1]);
  const now = n * k;
  const rounded = Number.isInteger(n) ? Math.round(now).toString() : now.toFixed(1);
  return v.replace(m[1], rounded);
}
