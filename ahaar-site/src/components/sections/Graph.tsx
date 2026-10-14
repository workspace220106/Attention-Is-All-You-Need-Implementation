import { useEffect, useState } from 'react';
import { copy } from '../../content/copy';
import { useSectionProgress } from '../../lib/useSectionProgress';
import { SceneBundle } from '../canvas/SceneRoot';
import { PANTRY_NODES } from '../canvas/scenes/GraphScene';

/**
 * Pantry knowledge graph. The 3D nodes live in the shared canvas; this DOM
 * layer carries the kicker/headline and a legend. Hover state is written to
 * `bundle.graphHover` so the scene can highlight the right node + neighbours.
 *
 * Timeline on the shared camera: [4..5]
 *   p 0.00 - 0.25   graph fades in while quantity chips settle
 *   p 0.25 - 0.75   quiet orbit, user can hover
 *   p 0.75 - 1.00   graph fades back as recommend cards rise
 */
export function Graph({ bundle }: { bundle: SceneBundle }) {
  const { ref, progress } = useSectionProgress<HTMLElement>();
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);

  useEffect(() => {
    bundle.camera.current = 4 + Math.min(1, progress);
    bundle.graph.current = Math.min(1, Math.max(0, progress < 0.75 ? progress * 2 : (1 - progress) * 4));
  }, [progress, bundle]);

  // Poll the shared hover ref each frame; keep the DOM in sync with the scene.
  useEffect(() => {
    let id = 0;
    const tick = () => {
      const h = bundle.graphHover.current;
      if (h) {
        const n = PANTRY_NODES.find((x) => x.id === h);
        setHoverLabel(n ? n.label : null);
      } else setHoverLabel(null);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [bundle]);

  const legendColors = ['bg-clay', 'bg-ink', 'bg-leaf', 'bg-muted'];

  return (
    <section
      id="sec-5"
      ref={ref}
      className="relative z-10 min-h-[220vh] grid grid-cols-12 gap-6 px-6 md:px-10 pt-32 md:pt-48"
    >
      <div className="col-span-12 md:col-span-4 md:sticky md:top-32 self-start">
        <p className="text-[0.78rem] uppercase tracking-[0.22em] text-muted mb-6">{copy.graph.kicker}</p>
        <h2 className="font-display font-medium text-ink leading-[1.1] text-[clamp(1.8rem,4vw,3.2rem)]">
          {copy.graph.headline}
        </h2>
        <p className="mt-5 max-w-copy text-ink/80">{copy.graph.sub}</p>

        <ul className="mt-10 space-y-3 text-[0.9rem] text-muted">
          {copy.graph.legend.map((l, i) => (
            <li key={l} className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${legendColors[i]}`} />
              {l}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-[0.9rem] text-muted">{copy.graph.caption}</p>
      </div>

      {/* Right column reserves space for the 3D graph. A hover list beneath
          lets keyboard + non-canvas users isolate nodes too. */}
      <div className="hidden md:block md:col-span-8 relative md:sticky md:top-32 self-start min-h-[70vh]">
        {hoverLabel && (
          <div className="absolute right-6 top-6 bg-bg border border-ink/15 px-3 py-2 rounded-sm text-[0.9rem] text-ink shadow-[0_1px_0_rgba(0,0,0,0.04)]">
            {hoverLabel}
          </div>
        )}
        <ul className="absolute left-0 bottom-6 flex flex-wrap gap-2 max-w-[80%]">
          {PANTRY_NODES.map((n) => (
            <li key={n.id}>
              <button
                aria-label={`Isolate ${n.label} in the graph`}
                onMouseEnter={() => { bundle.graphHover.current = n.id; }}
                onMouseLeave={() => { if (bundle.graphHover.current === n.id) bundle.graphHover.current = null; }}
                onFocus={() => { bundle.graphHover.current = n.id; }}
                onBlur={() => { if (bundle.graphHover.current === n.id) bundle.graphHover.current = null; }}
                className="px-2.5 py-1 text-[0.78rem] text-muted border border-ink/10 rounded-full hover:text-ink hover:border-ink/30 transition-colors duration-500 ease-soft"
              >
                {n.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile: a flat SVG legend graph. Orbit is disabled per the spec. */}
      <div className="col-span-12 md:hidden mt-6">
        <svg viewBox="0 0 240 160" className="w-full h-auto" role="img" aria-label="A compact pantry graph">
          <g stroke="var(--ink)" strokeOpacity="0.18" strokeWidth="0.6">
            <line x1="80" y1="60" x2="130" y2="70" />
            <line x1="80" y1="60" x2="150" y2="40" />
            <line x1="150" y1="40" x2="200" y2="60" />
            <line x1="130" y1="70" x2="150" y2="120" />
          </g>
          <g>
            <circle cx="80" cy="60" r="6" fill="var(--clay)" />
            <circle cx="150" cy="40" r="6" fill="var(--clay)" />
            <circle cx="200" cy="60" r="6" fill="var(--leaf)" />
            <circle cx="130" cy="70" r="7" fill="var(--ink)" />
            <circle cx="150" cy="120" r="5" fill="var(--muted)" />
          </g>
        </svg>
      </div>
    </section>
  );
}
