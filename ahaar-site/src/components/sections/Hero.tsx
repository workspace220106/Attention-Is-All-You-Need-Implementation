import { useEffect } from 'react';
import { Button } from '../ui/Button';
import { copy } from '../../content/copy';
import { useSectionProgress } from '../../lib/useSectionProgress';
import { SceneBundle } from '../canvas/SceneRoot';

/**
 * Hero. The 3D fridge sits in the right third; copy sits in the left third,
 * deliberately asymmetric. Scroll opens the door and spills warm light.
 *
 * Timeline:
 *   p 0.00 - 0.15   door closed, parallax only
 *   p 0.15 - 0.65   door opens linearly to fully open
 *   p 0.65 - 1.00   hold open, camera begins its push toward capture
 */
export function Hero({ bundle }: { bundle: SceneBundle }) {
  const { ref, progress } = useSectionProgress<HTMLElement>();

  useEffect(() => {
    // Hero camera lives in [0..1] on the shared CameraRig timeline.
    bundle.camera.current = Math.min(1, progress);
    // Door open ramps across p 0.15..0.65.
    const open = Math.max(0, Math.min(1, (progress - 0.15) / 0.5));
    bundle.fridgeOpen.current = open;
  }, [progress, bundle]);

  return (
    <section
      id="sec-1"
      ref={ref}
      className="relative z-10 min-h-[180vh] grid grid-cols-12 gap-6 px-6 md:px-10 pt-32 md:pt-40"
    >
      <div className="col-span-12 md:col-span-6 lg:col-span-5 md:sticky md:top-32 self-start">
        <p className="text-[0.78rem] uppercase tracking-[0.22em] text-muted mb-6">
          A household food assistant for Indian kitchens
        </p>
        <h1 className="font-display font-medium text-ink leading-[1.05] text-[clamp(2.4rem,6vw,4.4rem)]">
          {copy.hero.headline}
        </h1>
        <p className="mt-6 max-w-copy text-ink/80 text-[1.05rem]">{copy.hero.sub}</p>
        <div className="mt-10 flex items-center gap-4">
          <Button
            onClick={() =>
              document.getElementById('sec-2')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          >
            {copy.hero.cta}
          </Button>
          <span className="text-[0.85rem] text-muted">A student project, built with care.</span>
        </div>
      </div>
      {/* The 3D fridge sits in the fixed canvas; this block reserves asymmetric space */}
      <div className="hidden md:block md:col-span-6 lg:col-span-7" aria-hidden="true" />
    </section>
  );
}
