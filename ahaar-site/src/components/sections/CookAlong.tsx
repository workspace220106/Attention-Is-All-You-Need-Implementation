import { useEffect, useMemo } from 'react';
import { copy } from '../../content/copy';
import { useSectionProgress } from '../../lib/useSectionProgress';
import { SceneBundle } from '../canvas/SceneRoot';

/**
 * Cook-along. One step at a time, big and quiet. A circular timer wraps
 * around the step number; the 3D pan behind shifts colour as the step moves.
 *
 * Timeline on the shared camera: [8..9]
 *   p 0.00 - 0.15   pan fades in, step 0 (Chop)
 *   p 0.15 - 0.90   step index advances through 4 states, one per quarter
 *   p 0.90 - 1.00   serve, caption settles
 */
export function CookAlong({ bundle }: { bundle: SceneBundle }) {
  const { ref, progress } = useSectionProgress<HTMLElement>();

  // Four steps live in [0..3] float; the pan samples this smoothly.
  const stepF = useMemo(() => Math.max(0, Math.min(3, (progress - 0.15) / 0.75 * 3)), [progress]);
  const activeStep = Math.round(stepF);

  useEffect(() => {
    bundle.camera.current = 8 + Math.min(1, progress);
    bundle.pan.current = Math.min(1, progress * 1.3);
    bundle.panStep.current = stepF;
  }, [progress, bundle, stepF]);

  const step = copy.cook.steps[activeStep];
  const inStepProgress = stepF - activeStep + 0.5; // rough timer fraction
  const tFrac = Math.max(0, Math.min(1, inStepProgress));
  const circumference = 2 * Math.PI * 36;

  return (
    <section
      id="sec-9"
      ref={ref}
      className="relative z-10 min-h-[220vh] grid grid-cols-12 gap-6 px-6 md:px-10 pt-32 md:pt-48"
    >
      <div className="col-span-12 md:col-span-5 md:sticky md:top-32 self-start">
        <p className="text-[0.78rem] uppercase tracking-[0.22em] text-muted mb-6">{copy.cook.kicker}</p>
        <h2 className="font-display font-medium text-ink leading-[1.1] text-[clamp(1.8rem,4vw,3.2rem)]">
          {copy.cook.headline}
        </h2>
        <ol className="mt-10 space-y-2 text-[0.9rem]">
          {copy.cook.steps.map((s, i) => (
            <li
              key={s.title}
              className={`flex items-center gap-3 transition-colors duration-500 ease-soft ${i === activeStep ? 'text-ink' : 'text-ink/30'}`}
            >
              <span className="font-mono w-6 text-right">{String(i + 1).padStart(2, '0')}</span>
              {s.title}
            </li>
          ))}
        </ol>
      </div>

      {/* The big step card on a sand surface */}
      <div className="col-span-12 md:col-span-7 md:sticky md:top-32 self-start">
        <div className="bg-surface border border-ink/5 rounded-sm px-10 py-12 max-w-[560px] ml-auto">
          <div className="flex items-center gap-6">
            {/* Circular timer */}
            <svg viewBox="0 0 80 80" className="w-20 h-20 shrink-0" aria-hidden="true">
              <circle cx="40" cy="40" r="36" fill="none" stroke="var(--ink)" strokeOpacity="0.1" strokeWidth="2" />
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - tFrac)}
                transform="rotate(-90 40 40)"
                style={{ transition: 'stroke-dashoffset 400ms cubic-bezier(0.22,1,0.36,1)' }}
              />
              <text
                x="40"
                y="46"
                textAnchor="middle"
                fontFamily="Fraunces, serif"
                fontSize="22"
                fill="var(--ink)"
              >
                {activeStep + 1}
              </text>
            </svg>
            <div>
              <p className="text-[0.78rem] uppercase tracking-[0.2em] text-muted">Step {activeStep + 1} of 4</p>
              <h3 className="font-display text-[2rem] leading-tight text-ink mt-1">{step.title}</h3>
            </div>
          </div>
          <p className="mt-8 text-ink/80 text-[1.05rem] max-w-copy">{step.hint}</p>
        </div>
      </div>
    </section>
  );
}
