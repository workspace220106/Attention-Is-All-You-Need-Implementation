import { useEffect } from 'react';
import { copy } from '../../content/copy';
import { useSectionProgress } from '../../lib/useSectionProgress';
import { SceneBundle } from '../canvas/SceneRoot';
import { Pill } from '../ui/Pill';

/**
 * Metabolic overlay — future scope. A dashed glucose line in muted brown
 * sits above the (now dim) plate. Fully DOM, kept calm.
 *
 * Timeline on the shared camera: [7..8]
 *   p 0.00 - 0.30   plate fades, graph (behind) stays off
 *   p 0.30 - 1.00   dashed line draws itself in
 */
export function Metabolic({ bundle }: { bundle: SceneBundle }) {
  const { ref, progress } = useSectionProgress<HTMLElement>();

  useEffect(() => {
    bundle.camera.current = 7 + Math.min(1, progress);
    bundle.plate.current = Math.max(0, 1 - progress * 2);
  }, [progress, bundle]);

  const drawT = Math.max(0, Math.min(1, (progress - 0.3) / 0.6));

  // A small CGM-ish curve, hand-sampled so the shape reads.
  const path =
    'M4 44 C 14 20, 24 20, 34 32 S 54 54, 64 36 S 86 22, 96 30';
  const pathLen = 220;

  return (
    <section
      id="sec-8"
      ref={ref}
      className="relative z-10 min-h-[160vh] grid grid-cols-12 gap-6 px-6 md:px-10 pt-32 md:pt-48"
    >
      <div className="col-span-12 md:col-span-5 md:sticky md:top-32 self-start">
        <p className="text-[0.78rem] uppercase tracking-[0.22em] text-muted mb-6">{copy.metabolic.kicker}</p>
        <div className="mb-4"><Pill>{copy.metabolic.pill}</Pill></div>
        <h2 className="font-display font-medium text-ink leading-[1.1] text-[clamp(1.8rem,4vw,3.2rem)]">
          {copy.metabolic.headline}
        </h2>
        <p className="mt-5 max-w-copy text-ink/80">{copy.metabolic.sub}</p>
        <p className="mt-8 text-[0.9rem] text-muted">{copy.metabolic.caption}</p>
      </div>

      <div className="col-span-12 md:col-span-7 md:sticky md:top-32 self-start">
        <div className="bg-surface/60 border border-ink/5 rounded-sm px-6 py-8 max-w-[560px] ml-auto">
          <div className="flex items-center justify-between text-[0.78rem] text-muted">
            <span>Glucose · indicative</span>
            <span className="font-mono">mg/dL</span>
          </div>
          <svg viewBox="0 0 100 60" className="w-full h-auto mt-4" role="img" aria-label="Dashed glucose curve, indicative">
            {/* Horizontal reference lines, extremely subtle */}
            <g stroke="var(--ink)" strokeOpacity="0.08">
              <line x1="0" y1="20" x2="100" y2="20" />
              <line x1="0" y1="40" x2="100" y2="40" />
            </g>
            <path
              d={path}
              fill="none"
              stroke="var(--muted)"
              strokeWidth={0.6}
              strokeDasharray={`${pathLen} ${pathLen}`}
              style={{
                strokeDashoffset: (1 - drawT) * pathLen,
                transition: 'stroke-dashoffset 600ms cubic-bezier(0.22,1,0.36,1)',
              }}
            />
          </svg>
          <p className="mt-6 text-[0.82rem] text-muted max-w-copy">
            Portions nudged a little smaller when a response like this is predicted.
            A little larger when it isn't.
          </p>
        </div>
      </div>
    </section>
  );
}
