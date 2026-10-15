import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef } from 'react';
import { Lighting } from './Lighting';
import { CameraRig } from './CameraRig';
import { FridgeScene } from './scenes/FridgeScene';
import { CaptureScene } from './scenes/CaptureScene';
import { DetectionScene } from './scenes/DetectionScene';
import { GraphScene } from './scenes/GraphScene';
import { PlateScene } from './scenes/PlateScene';
import { PanScene } from './scenes/PanScene';
import { useReducedMotion } from '../../lib/useReducedMotion';

/**
 * Single persistent canvas behind the DOM. Each section writes to a shared
 * ref bundle instead of mounting its own scene — one draw loop, three states.
 */
export type SceneBundle = {
  // 0..3 — section-level camera progress (see CameraRig)
  camera: { current: number };
  // Hero door open [0..1]
  fridgeOpen: { current: number };
  // Capture phone visible [0..1], good/leaf-green [0..1], shake [0..1]
  captureVisible: { current: number };
  captureQuality: { current: number };
  captureShake: { current: number };
  // Detection photo plane fade [0..1]
  detect: { current: number };
  // Pantry graph fade [0..1] and currently-hovered node id (shared with DOM)
  graph: { current: number };
  graphHover: { current: string | null };
  // Recommend scene fade — graph fades out as cards rise
  recommend: { current: number };
  // Family plate: fade and per-member portion scale
  plate: { current: number };
  portions: { current: [number, number, number, number] };
  // Cook-along: pan fade and current step index (0..3)
  pan: { current: number };
  panStep: { current: number };
  // Normalised mouse [-1..1, -1..1] for parallax
  mouse: { current: [number, number] };
};

export function SceneRoot({ bundle }: { bundle: SceneBundle }) {
  const reduced = useReducedMotion();
  const container = useRef<HTMLDivElement>(null);

  // Normalised mouse position fuels gentle parallax (hero only).
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      bundle.mouse.current = [x, -y];
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [bundle]);

  if (reduced) {
    // Fallback: no canvas, no scroll-linked motion. Sections render on their own
    // with flat SVG stand-ins (see each section's reduced-motion branch).
    return null;
  }

  return (
    <div ref={container} className="canvas-fixed" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        shadows
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [2.4, 1.2, 5.4], fov: 32 }}
      >
        <Suspense fallback={null}>
          <Lighting />
          <CameraRig progressRef={bundle.camera} mouseRef={bundle.mouse} />
          <FridgeScene openTRef={bundle.fridgeOpen} />
          <CaptureScene
            visibleRef={bundle.captureVisible}
            qualityRef={bundle.captureQuality}
            shakeRef={bundle.captureShake}
          />
          <DetectionScene progressRef={bundle.detect} />
          <GraphScene progressRef={bundle.graph} hoveredRef={bundle.graphHover} />
          <PlateScene progressRef={bundle.plate} portionsRef={bundle.portions} />
          <PanScene progressRef={bundle.pan} stepRef={bundle.panStep} />
        </Suspense>
      </Canvas>
    </div>
  );
}
