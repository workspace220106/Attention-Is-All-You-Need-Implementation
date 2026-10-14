import { useEffect, useRef } from 'react';
import { Loader } from './components/layout/Loader';
import { Nav } from './components/layout/Nav';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { ScrollHint } from './components/layout/ScrollHint';
import { SceneRoot, SceneBundle } from './components/canvas/SceneRoot';
import { Hero } from './components/sections/Hero';
import { Capture } from './components/sections/Capture';
import { Detection } from './components/sections/Detection';
import { Quantity } from './components/sections/Quantity';
import { Graph } from './components/sections/Graph';
import { Recommend } from './components/sections/Recommend';
import { initSmoothScroll } from './lib/scroll';
import { useReducedMotion } from './lib/useReducedMotion';

export default function App() {
  const reduced = useReducedMotion();

  // One ref bundle, shared by the canvas and every section.
  const bundle = useRef<SceneBundle>({
    camera: { current: 0 },
    fridgeOpen: { current: 0 },
    captureVisible: { current: 0 },
    captureQuality: { current: 0 },
    captureShake: { current: 0 },
    detect: { current: 0 },
    graph: { current: 0 },
    graphHover: { current: null },
    recommend: { current: 0 },
    mouse: { current: [0, 0] },
  }).current;

  useEffect(() => {
    initSmoothScroll(reduced);
  }, [reduced]);

  return (
    <>
      <Loader />
      <ScrollProgress />
      <Nav />
      <SceneRoot bundle={bundle} />

      <main id="top" className="relative z-10">
        <Hero bundle={bundle} />
        <Capture bundle={bundle} />
        <Detection bundle={bundle} />
        <Quantity bundle={bundle} />
        <Graph bundle={bundle} />
        <Recommend bundle={bundle} />
        <section className="relative z-10 py-32 px-6 md:px-10 border-t border-ink/10 mt-20">
          <p className="text-[0.78rem] uppercase tracking-[0.22em] text-muted">Review break</p>
          <p className="mt-3 max-w-copy text-ink/70">
            Sections 7 — 12 (Family Plate, Metabolic, Cook-Along, Pipeline, Trust, Footer) build next.
          </p>
        </section>
      </main>

      <ScrollHint />
    </>
  );
}
