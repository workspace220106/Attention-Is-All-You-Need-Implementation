import { useEffect, useMemo, useState } from 'react';
import { copy } from '../../content/copy';
import { useSectionProgress } from '../../lib/useSectionProgress';
import { SceneBundle } from '../canvas/SceneRoot';

/**
 * Personalised recommendations. Three cards rise from the graph on
 * sand-coloured surfaces. "Why this?" opens an inline turmeric bar chart.
 *
 * Timeline on the shared camera: [5..6]
 *   p 0.00 - 0.20   graph fades out, cards begin to rise
 *   p 0.20 - 0.80   three cards reveal with 120 ms stagger
 *   p 0.80 - 1.00   filters settle at the top
 */
export function Recommend({ bundle }: { bundle: SceneBundle }) {
  const { ref, progress } = useSectionProgress<HTMLElement>();
  const [filters, setFilters] = useState<string[]>([]);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    bundle.camera.current = 5 + Math.min(1, progress);
    bundle.graph.current = Math.max(0, 1 - progress * 2);
    bundle.recommend.current = Math.min(1, progress * 1.3);
  }, [progress, bundle]);

  const toggle = (f: string) =>
    setFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  const cards = useMemo(() => {
    if (filters.length === 0) return copy.recommend.cards;
    return copy.recommend.cards.filter((c) => filters.every((f) => c.tags.includes(f)));
  }, [filters]);

  return (
    <section
      id="sec-6"
      ref={ref}
      className="relative z-10 min-h-[200vh] px-6 md:px-10 pt-32 md:pt-48"
    >
      <div className="max-w-[1120px] mx-auto">
        <p className="text-[0.78rem] uppercase tracking-[0.22em] text-muted mb-6">{copy.recommend.kicker}</p>
        <h2 className="font-display font-medium text-ink leading-[1.1] text-[clamp(1.8rem,4vw,3.2rem)] max-w-[18ch]">
          {copy.recommend.headline}
        </h2>
        <p className="mt-5 max-w-copy text-ink/80">{copy.recommend.sub}</p>

        {/* Filter chips */}
        <ul className="mt-10 flex flex-wrap gap-2">
          {copy.recommend.filters.map((f) => {
            const on = filters.includes(f);
            return (
              <li key={f}>
                <button
                  aria-pressed={on}
                  onClick={() => toggle(f)}
                  className={`px-3 py-1.5 rounded-full text-[0.82rem] border transition-colors duration-500 ease-soft ${on ? 'bg-ink text-bg border-ink' : 'text-ink/80 border-ink/15 hover:border-ink/40'}`}
                >
                  {f}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Three cards. Each rises with its own stagger. */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {cards.map((c, i) => {
            const start = 0.2 + i * 0.12;
            const local = Math.max(0, Math.min(1, (progress - start) / 0.3));
            const isOpen = open === i;
            return (
              <article
                key={c.name}
                className="bg-surface rounded-sm px-6 py-7 border border-ink/5 relative"
                style={{
                  opacity: local,
                  transform: `translateY(${(1 - local) * 36}px)`,
                  transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 700ms cubic-bezier(0.22,1,0.36,1)',
                }}
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-[1.4rem] text-ink">{c.name}</h3>
                  <span className="text-[0.85rem] font-medium text-leaf">{c.match}% match</span>
                </div>
                <p className="mt-2 text-[0.85rem] text-muted">{c.time}</p>

                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {c.tags.map((t) => (
                    <li
                      key={t}
                      className="text-[0.72rem] uppercase tracking-wider text-muted border border-ink/10 px-2 py-0.5 rounded"
                    >
                      {t}
                    </li>
                  ))}
                </ul>

                <button
                  className="mt-6 inline-flex items-center gap-2 px-3 py-1 text-[0.78rem] uppercase tracking-[0.18em] text-ink border border-ink/20 rounded-full hover:bg-accent hover:border-accent transition-colors duration-500 ease-soft"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  Why this?
                </button>

                {/* Reasons bar chart, revealed inline */}
                <div
                  className="overflow-hidden"
                  style={{
                    maxHeight: isOpen ? 220 : 0,
                    transition: 'max-height 700ms cubic-bezier(0.22,1,0.36,1)',
                  }}
                >
                  <ul className="mt-5 space-y-3">
                    {c.reasons.map((r) => (
                      <li key={r.label} className="text-[0.82rem]">
                        <div className="flex justify-between text-ink/80">
                          <span>{r.label}</span>
                          <span className="font-mono text-muted">{r.value}</span>
                        </div>
                        <div className="h-[2px] bg-ink/10 mt-1.5 relative">
                          <span
                            className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-700 ease-soft"
                            style={{ width: isOpen ? `${r.value}%` : '0%' }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
          {cards.length === 0 && (
            <p className="text-muted text-[0.9rem] md:col-span-3">
              No match for every filter. Remove one to see suggestions.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
