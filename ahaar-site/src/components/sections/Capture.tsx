import { useEffect, useMemo } from 'react';
import { copy } from '../../content/copy';
import { useSectionProgress } from '../../lib/useSectionProgress';
import { SceneBundle } from '../canvas/SceneRoot';
import { Pill } from '../ui/Pill';

/**
 * Guided capture. The phone viewfinder (3D) hovers in front of the camera.
 * Steps light up one at a time as progress crosses 0.1, 0.3, 0.5, 0.7, 0.9.
 *
 * Timeline on the shared camera: [1..2]
 *   p 0.00 - 0.15   push into the fridge (camera z moves in)
 *   p 0.15 - 0.75   steps appear, quality gauge fills
 *   p 0.55 - 0.65   brief shake on the "retake" moment
 *   p 0.75 - 1.00   frame turns leaf green, caption settles
 */
export function Capture({ bundle }: { bundle: SceneBundle }) {
  const { ref, progress } = useSectionProgress<HTMLElement>();

  const activeStep = useMemo(() => Math.max(0, Math.min(4, Math.floor(progress * 5))), [progress]);
  const quality = Math.max(0, Math.min(1, (progress - 0.15) / 0.6));
  // A brief "bad shot" moment, then clears.
  const shake = progress > 0.55 && progress < 0.65 ? 1 : 0;

  useEffect(() => {
    bundle.camera.current = 1 + Math.min(1, progress);
    bundle.captureVisible.current = Math.max(0, Math.min(1, progress * 1.3));
    bundle.captureQuality.current = quality > 0.6 ? 1 : 0;
    bundle.captureShake.current = shake;
    // Keep the door open at this depth.
    bundle.fridgeOpen.current = 1;
  }, [progress, bundle, quality, shake]);

  return (
    <section
      id="sec-2"
      ref={ref}
      className="relative z-10 min-h-[220vh] grid grid-cols-12 gap-6 px-6 md:px-10 pt-32 md:pt-48"
    >
      <div className="col-span-12 md:col-span-5 md:sticky md:top-32 self-start">
        <p className="text-[0.78rem] uppercase tracking-[0.22em] text-muted mb-6">{copy.capture.kicker}</p>
        <h2 className="font-display font-medium text-ink leading-[1.1] text-[clamp(1.8rem,4vw,3.2rem)]">
          {copy.capture.headline}
        </h2>
        <p className="mt-5 max-w-copy text-ink/80">{copy.capture.sub}</p>

        {/* The five steps, revealed one by one */}
        <ol className="mt-10 space-y-3">
          {copy.capture.steps.map((s, i) => {
            const on = i <= activeStep;
            return (
              <li
                key={s}
                className={`flex items-center gap-4 text-[1rem] transition-colors duration-500 ease-soft ${on ? 'text-ink' : 'text-ink/30'}`}
              >
                <span
                  className={`w-6 text-right font-mono text-[0.78rem] ${on ? 'text-accent' : 'text-ink/30'}`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="h-px flex-1 bg-ink/10 relative">
                  <span
                    className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-700 ease-soft"
                    style={{ width: on ? '28%' : '0%' }}
                  />
                </span>
                <span className="min-w-[12rem]">{s}</span>
              </li>
            );
          })}
        </ol>

        {/* Quality gauge */}
        <div className="mt-10">
          <div className="flex items-center justify-between text-[0.8rem] text-muted">
            <span>Shot quality</span>
            <span className={quality > 0.6 ? 'text-leaf' : shake ? 'text-chilli' : 'text-muted'}>
              {quality > 0.6 ? copy.capture.good : shake ? copy.capture.retake : '—'}
            </span>
          </div>
          <div className="mt-2 h-[2px] bg-ink/10 relative">
            <span
              className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-300 ease-soft"
              style={{ width: `${Math.round(quality * 100)}%` }}
            />
          </div>
        </div>

        <p className="mt-8 text-[0.9rem] text-muted">{copy.capture.caption}</p>
      </div>

      {/* Right column: visually reserved for the 3D phone frame */}
      <div className="hidden md:block md:col-span-7" aria-hidden="true" />

      {/* Mobile fallback: static viewfinder */}
      <div className="col-span-12 md:hidden flex items-center justify-center mt-6">
        <div className="w-56 h-80 rounded-[32px] border border-ink/40 relative">
          <div
            className={`absolute inset-6 rounded-xl border transition-colors duration-500 ease-soft ${quality > 0.6 ? 'border-leaf' : shake ? 'border-chilli' : 'border-ink/40'}`}
          />
          <Pill className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-bg">
            {quality > 0.6 ? copy.capture.good : shake ? copy.capture.retake : copy.capture.steps[activeStep]}
          </Pill>
        </div>
      </div>
    </section>
  );
}
