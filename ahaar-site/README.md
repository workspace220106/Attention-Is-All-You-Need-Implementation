# AHAAR — scroll-driven 3D website

A minimalistic, scroll-driven product site for AHAAR, a household food
assistant for Indian kitchens.

Stack: React + Vite + TypeScript · Tailwind · Three.js (@react-three/fiber,
drei) · GSAP + ScrollTrigger · Lenis smooth scroll · Framer Motion for UI
transitions only.

## Run

```bash
cd ahaar-site
npm install
npm run dev        # http://localhost:5173
npm run build      # production bundle
```

## Current state

Base + sections built so far:

- `0` Loader
- `1` Hero — brushed-steel fridge, door opens on scroll
- `2` Guided Capture — phone viewfinder, five steps, quality gauge
- `3` Ingredient Detection — photo plane + SVG bounding boxes

Sections 4 – 12 are stubbed with a review break and will be built next.

## File tree (relevant parts)

```
src/
  App.tsx                       composition: canvas + sections
  index.css                     CSS variables, both themes
  theme/tokens.ts               palette helpers for Three materials
  lib/
    scroll.ts                   Lenis + ScrollTrigger
    useReducedMotion.ts
    useSectionProgress.ts       per-section [0..1] progress
  components/
    layout/      Nav, Loader, ScrollProgress, ScrollHint
    ui/          Button, Pill, Chip, custom line icons
    canvas/
      SceneRoot.tsx             single persistent <Canvas>
      Lighting.tsx              one warm key + soft fill + rim
      CameraRig.tsx             keyframed scroll camera
      materials.ts              matte / brushed steel / brass / paper
      scenes/
        FridgeScene.tsx         §1 Hero
        CaptureScene.tsx        §2 Capture
        DetectionScene.tsx      §3 Detection
    sections/    Hero.tsx · Capture.tsx · Detection.tsx
  content/copy.ts               every string in one place
```

## How to tune

- **Colours and fonts** — `src/index.css` (`:root` + `[data-theme="dark"]`)
  are the single source of truth. Tailwind pulls them through
  `tailwind.config.ts`. Three materials sample them via `src/theme/tokens.ts`.
- **Copy** — `src/content/copy.ts`.
- **Scroll timings** — each section's `/** Timeline */` block at the top of
  the file names the ranges that trigger each change. Edit those thresholds.
- **Camera moves** — `src/components/canvas/CameraRig.tsx`, the `KEYS` array.
  Each entry is `{ p, pos, look }` with `p` on a 0..3 timeline (0 = Hero
  start, 1 = Capture start, 2 = Detection start).
- **Swap in a GLB** — drop the file in `public/models/`, replace the
  procedural meshes in the matching `scenes/*.tsx` with a drei `<Gltf />`
  loader. Materials in `materials.ts` can be reused for consistency.

## Accessibility

- `prefers-reduced-motion` disables Lenis and the 3D canvas; sections render
  as static layouts with the same copy.
- Keyboard navigation and visible focus rings throughout; detection boxes
  are focusable with ARIA labels.
- CSS variables keep both themes above WCAG AA for body text.

## Performance notes

- Single canvas, instanced where repetition appears later.
- `dpr=[1, 2]` caps device pixel ratio.
- All current geometry is procedural — no model downloads, bundle well under
  3 MB.
