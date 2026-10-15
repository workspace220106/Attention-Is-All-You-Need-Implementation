import { useEffect, useMemo } from 'react';
import { copy } from '../../content/copy';
import { useSectionProgress } from '../../lib/useSectionProgress';
import { SceneBundle } from '../canvas/SceneRoot';

/**
 * Pipeline. A clean horizontal line of ink dots joined by thin segments.
 * Each dot fills with turmeric as its slice of progress fills. Below it,
 * a tidy row of tech labels, with future items shown as dashed outlines.
 *
 * Timeline on the shared camera: [9..10]
 *   p 0.00 - 0.10   pan fades out
 *   p 0.10 - 0.80   pipeline nodes fill in sequence
 *   p 0.80 - 1.00   tech labels settle, caption appears
 */
export function Pipeline({ bundle }: { bundle: SceneBundle }) {
  const { ref, progress } = useSectionProgress<HTMLElement>();

  useEffect(() => {
    bundle.camera.current = 9 + Math.min(1, progress);
    bundle.pan.current = Math.max(0, 1 - progress * 2);
  }, [progress, bundle]);

  const nodes = copy.pipeline.nodes;
  // Per-node fill timing in [0.1 .. 0.8]
  const perNode = useMemo(() => {
    const span = 0.7;
    const slice = span / nodes.length;
    return nodes.map((_, i) => Math.max(0, Math.min(1, (progress - (0.1 + i * slice)) / slice)));
  }, [progress, nodes]);

  return (
    <section
      id="sec-10"
      ref={ref}
      className="relative z-10 min-h-[160vh] px-6 md:px-10 pt-32 md:pt-48"
    >
      <div className="max-w-[1120px] mx-auto">
        <p className="text-[0.78rem] uppercase tracking-[0.22em] text-muted mb-6">{copy.pipeline.kicker}</p>
        <h2 className="font-display font-medium text-ink leading-[1.1] text-[clamp(1.8rem,4vw,3.2rem)] max-w-[22ch]">
          {copy.pipeline.headline}
        </h2>

        {/* The horizontal pipeline */}
        <div className="mt-16 relative">
          <div className="hidden md:block absolute left-0 right-0 top-[11px] h-px bg-ink/15" />
          <ol className="relative grid grid-cols-2 md:grid-cols-8 gap-x-4 gap-y-10 text-center">
            {nodes.map((n, i) => {
              const t = perNode[i];
              return (
                <li key={n} className="flex flex-col items-center">
                  <span
                    className="relative inline-flex w-6 h-6 rounded-full border border-ink/60 bg-bg transition-colors duration-700 ease-soft"
                    style={{ borderColor: t > 0.5 ? 'var(--accent)' : undefined }}
                  >
                    <span
                      className="absolute inset-1 rounded-full bg-accent transition-opacity duration-700 ease-soft"
                      style={{ opacity: t }}
                    />
                  </span>
                  <span className="mt-3 text-[0.82rem] text-ink">{n}</span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Tech labels row */}
        <div className="mt-20">
          <p className="text-[0.78rem] uppercase tracking-[0.22em] text-muted">Stack</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {copy.pipeline.stack.map((s) => (
              <li
                key={s}
                className="px-3 py-1 text-[0.82rem] border border-ink/15 text-ink rounded"
              >
                {s}
              </li>
            ))}
            {copy.pipeline.future.map((s) => (
              <li
                key={s}
                className="px-3 py-1 text-[0.82rem] border border-dashed border-ink/40 text-muted rounded"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
