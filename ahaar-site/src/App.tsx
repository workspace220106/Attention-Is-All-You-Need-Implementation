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
import { FamilyPlate } from './components/sections/FamilyPlate';
import { Metabolic } from './components/sections/Metabolic';
import { CookAlong } from './components/sections/CookAlong';
import { Pipeline } from './components/sections/Pipeline';
import { Trust } from './components/sections/Trust';
import { Footer } from './components/sections/Footer';
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
    plate: { current: 0 },
    portions: { current: [1, 1, 1, 1] },
    pan: { current: 0 },
    panStep: { current: 0 },
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
        <FamilyPlate bundle={bundle} />
        <Metabolic bundle={bundle} />
        <CookAlong bundle={bundle} />
        <Pipeline bundle={bundle} />
        <Trust />
        <Footer />
      </main>

      <ScrollHint />
    </>
  );
}
