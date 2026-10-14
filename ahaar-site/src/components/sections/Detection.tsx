import { useEffect, useState } from 'react';
import { copy } from '../../content/copy';
import { useSectionProgress } from '../../lib/useSectionProgress';
import { SceneBundle } from '../canvas/SceneRoot';
import { Pill } from '../ui/Pill';

/**
 * Detection. The 3D photo plane fades in behind this DOM; thin turmeric
 * bounding boxes draw themselves on top in SVG, with ink labels and
 * confidence percentages. Hover a box to isolate it.
 *
 * Timeline on the shared camera: [2..3]
 *   p 0.00 - 0.20   photo plane flattens and fades in
 *   p 0.20 - 0.90   boxes draw one by one (stroke-dashoffset)
 *   p 0.90 - 1.00   labels settle, confidence counts to final value
 */
export function Detection({ bundle }: { bundle: SceneBundle }) {
  const { ref, progress } = useSectionProgress<HTMLElement>();
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    bundle.camera.current = 2 + Math.min(1, progress);
    bundle.detect.current = Math.max(0, Math.min(1, progress * 1.4));
    // Fade capture out as detection takes over
    bundle.captureVisible.current = Math.max(0, 1 - progress * 2);
    bundle.fridgeOpen.current = 1;
  }, [progress, bundle]);

  // Each box starts drawing when global progress crosses a per-box threshold.
  const boxes = copy.detection.items.map((it, i) => {
    const start = 0.2 + i * 0.14;
    const local = Math.max(0, Math.min(1, (progress - start) / 0.18));
    return { ...it, i, local };
  });

  return (
    <section
      id="sec-3"
      ref={ref}
      className="relative z-10 min-h-[200vh] grid grid-cols-12 gap-6 px-6 md:px-10 pt-32 md:pt-48"
    >
      <div className="col-span-12 md:col-span-4 md:sticky md:top-32 self-start">
        <p className="text-[0.78rem] uppercase tracking-[0.22em] text-muted mb-6">{copy.detection.kicker}</p>
        <h2 className="font-display font-medium text-ink leading-[1.1] text-[clamp(1.8rem,4vw,3.2rem)]">
          {copy.detection.headline}
        </h2>
        <p className="mt-5 max-w-copy text-ink/80">{copy.detection.sub}</p>
        <div className="mt-6">
          <Pill>{copy.detection.model}</Pill>
        </div>
        <p className="mt-8 text-[0.9rem] text-muted">{copy.detection.caption}</p>
      </div>

      {/* Photo plane overlay — SVG rides on top of the 3D canvas */}
      <div className="col-span-12 md:col-span-8 md:sticky md:top-28 self-start">
        <div className="relative mx-auto w-full max-w-[720px] aspect-[16/10]">
          {/* Soft sand backdrop so the plane reads whether or not WebGL is live */}
          <div className="absolute inset-0 bg-surface rounded-sm shadow-[0_1px_0_rgba(0,0,0,0.04)]" />
          <svg
            viewBox="0 0 100 62.5"
            className="absolute inset-0 w-full h-full"
            role="img"
            aria-label="Detected ingredients with bounding boxes and confidence percentages"
          >
            {boxes.map(({ label, conf, x, y, w, h, local, i }) => {
              const perim = (w + h) * 2;
              const dash = perim * (1 - local);
              const isHovered = hovered === i;
              const dim = hovered !== null && !isHovered;
              return (
                <g
                  key={label}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${label}, ${conf} percent confidence`}
                  style={{ cursor: 'pointer', opacity: dim ? 0.25 : 1, transition: 'opacity 500ms cubic-bezier(0.22,1,0.36,1)' }}
                >
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill="transparent"
                    stroke="var(--accent)"
                    strokeWidth={0.3}
                    strokeDasharray={perim}
                    strokeDashoffset={dash}
                    style={{ transition: 'stroke-dashoffset 300ms linear' }}
                  />
                  {/* Label chip, appears once the stroke has mostly drawn */}
                  <g opacity={local > 0.8 ? 1 : 0} style={{ transition: 'opacity 500ms cubic-bezier(0.22,1,0.36,1)' }}>
                    <rect x={x} y={y - 3.6} width={label.length * 1.5 + 7} height={3} fill="var(--bg)" stroke="var(--ink)" strokeWidth={0.1} />
                    <text x={x + 0.8} y={y - 1.4} fontSize={1.9} fontFamily="Figtree, sans-serif" fill="var(--ink)">
                      {label} · {Math.round(conf * local)}%
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
          {/* Hover tooltip, DOM so it's keyboard-accessible */}
          {hovered !== null && (
            <div className="absolute left-3 bottom-3 bg-bg border border-ink/15 px-3 py-2 rounded-sm text-[0.85rem] text-ink">
              <strong className="font-medium">{copy.detection.items[hovered].label}</strong>
              <span className="text-muted"> · confidence {copy.detection.items[hovered].conf}%</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
