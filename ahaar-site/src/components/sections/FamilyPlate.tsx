import { useEffect, useState } from 'react';
import { copy } from '../../content/copy';
import { useSectionProgress } from '../../lib/useSectionProgress';
import { SceneBundle } from '../canvas/SceneRoot';

/**
 * Family plate. The 3D thali lives in the shared canvas, overhead.
 * Age and activity sliders here rescale each member's portion live.
 *
 * Timeline on the shared camera: [6..7]
 *   p 0.00 - 0.25   fade recommend out, bring the plate overhead
 *   p 0.25 - 1.00   hold, user explores the sliders
 */
export function FamilyPlate({ bundle }: { bundle: SceneBundle }) {
  const { ref, progress } = useSectionProgress<HTMLElement>();
  const [age, setAge] = useState(32);
  const [activity, setActivity] = useState(2); // 1 light, 2 moderate, 3 active

  useEffect(() => {
    bundle.camera.current = 6 + Math.min(1, progress);
    bundle.recommend.current = Math.max(0, 1 - progress * 2);
    bundle.plate.current = Math.min(1, progress * 1.4);

    // Per-member portion = base × age factor × activity factor.
    const activityFactor = 0.85 + activity * 0.08; // 0.93 / 1.01 / 1.09
    const ageFactor = 0.9 + Math.max(0, Math.min(1, (age - 18) / 60)) * 0.2;
    const base = copy.plate.members.map((m) => m.portion);
    const scaled = base.map((b) => Math.max(0.4, Math.min(1.4, b * activityFactor * ageFactor)));
    bundle.portions.current = [scaled[0], scaled[1], scaled[2], scaled[3]];
  }, [progress, bundle, age, activity]);

  return (
    <section
      id="sec-7"
      ref={ref}
      className="relative z-10 min-h-[200vh] grid grid-cols-12 gap-6 px-6 md:px-10 pt-32 md:pt-48"
    >
      <div className="col-span-12 md:col-span-5 md:sticky md:top-32 self-start">
        <p className="text-[0.78rem] uppercase tracking-[0.22em] text-muted mb-6">{copy.plate.kicker}</p>
        <h2 className="font-display font-medium text-ink leading-[1.1] text-[clamp(1.8rem,4vw,3.2rem)]">
          {copy.plate.headline}
        </h2>
        <p className="mt-5 max-w-copy text-ink/80">{copy.plate.sub}</p>

        {/* Sliders */}
        <div className="mt-10 space-y-6 max-w-sm">
          <label className="block">
            <span className="flex justify-between text-[0.85rem] text-ink">
              <span>Age</span>
              <span className="font-mono text-muted">{age}</span>
            </span>
            <input
              type="range"
              min={5}
              max={78}
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value, 10))}
              className="w-full mt-2 accent-[color:var(--accent)]"
              aria-label="Age"
            />
          </label>
          <label className="block">
            <span className="flex justify-between text-[0.85rem] text-ink">
              <span>Activity</span>
              <span className="font-mono text-muted">
                {['Light', 'Moderate', 'Active'][activity - 1]}
              </span>
            </span>
            <input
              type="range"
              min={1}
              max={3}
              value={activity}
              onChange={(e) => setActivity(parseInt(e.target.value, 10))}
              className="w-full mt-2 accent-[color:var(--accent)]"
              aria-label="Activity level"
            />
          </label>
        </div>

        <p className="mt-8 text-[0.9rem] text-muted">{copy.plate.caption}</p>
      </div>

      {/* Right column: a labelled key for who's who, no faces */}
      <div className="col-span-12 md:col-span-7 md:sticky md:top-32 self-start">
        <ul className="grid grid-cols-2 gap-3 max-w-md ml-auto">
          {copy.plate.members.map((m, i) => (
            <li key={m.name} className="bg-surface border border-ink/5 px-4 py-3 rounded-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink font-medium">{m.name}</span>
                <span className="font-mono text-[0.78rem] text-muted">
                  {Math.round(bundle.portions.current[i] * 100)}%
                </span>
              </div>
              <p className="text-[0.78rem] text-muted mt-0.5">{m.note}</p>
            </li>
          ))}
        </ul>
        <ul className="mt-6 flex gap-4 justify-end text-[0.78rem] text-muted">
          {copy.plate.items.map((it) => (
            <li key={it} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-ink/40" />
              {it}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
