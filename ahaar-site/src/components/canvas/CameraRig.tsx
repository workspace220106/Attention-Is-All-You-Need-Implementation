import { useFrame, useThree } from '@react-three/fiber';
import { MutableRefObject } from 'react';
import * as THREE from 'three';

type Props = { progressRef: MutableRefObject<number>; mouseRef: MutableRefObject<[number, number]> };

/**
 * Drives the single persistent camera across sections.
 * Progress in [0..3] roughly maps to: 0 Hero, 1 Capture, 2 Detection.
 *
 * Edit the keyframes below to retune timings.
 */
const KEYS: { p: number; pos: [number, number, number]; look: [number, number, number] }[] = [
  // Hero: three-quarter view of the fridge
  { p: 0.0, pos: [2.4, 1.2, 5.4], look: [0, 0.6, 0] },
  // End of hero: pull in slightly as the door opens
  { p: 0.9, pos: [1.4, 1.1, 4.4], look: [0, 0.6, 0] },
  // Capture: push into the fridge, viewfinder centred
  { p: 1.5, pos: [0, 0.9, 2.6], look: [0, 0.9, 0] },
  // Detection: flat-on to the photo plane
  { p: 2.5, pos: [0, 0, 3.6], look: [0, 0, 0] },
  // Quantity: ease out slightly as the plane dissolves
  { p: 3.0, pos: [0, 0, 4.2], look: [0, 0, 0] },
  // Graph: three-quarter view, higher so edges fan out
  { p: 4.0, pos: [2.2, 1.4, 4.6], look: [0, 0, 0] },
  { p: 4.5, pos: [1.8, 1.2, 4.2], look: [0, 0, 0] },
  // Recommend: pull back and up as cards rise
  { p: 5.0, pos: [0, 1.3, 5.4], look: [0, 0.1, 0] },
  { p: 6.0, pos: [0, 1.3, 5.4], look: [0, 0.1, 0] },
  // Family plate: directly overhead for a top-down thali
  { p: 7.0, pos: [0, 4.4, 0.001], look: [0, 0, 0] },
  // Metabolic: pull back and tilt — the dashboard is DOM, scene fades
  { p: 8.0, pos: [0, 2.4, 4.6], look: [0, 0, 0] },
  // Cook-along: side view of the pan
  { p: 9.0, pos: [0, 0.9, 3.8], look: [0, 0.2, 0] },
  // Hold through the DOM-only sections
  { p: 10.0, pos: [0, 0.9, 5.4], look: [0, 0, 0] },
];

function sampleKeyframes(k: number): { pos: THREE.Vector3; look: THREE.Vector3 } {
  for (let i = 0; i < KEYS.length - 1; i++) {
    const a = KEYS[i];
    const b = KEYS[i + 1];
    if (k >= a.p && k <= b.p) {
      const t = (k - a.p) / (b.p - a.p);
      // Soft cubic ease, matches our CSS cubic-bezier(0.22,1,0.36,1) in spirit.
      const e = 1 - Math.pow(1 - t, 3);
      return {
        pos: new THREE.Vector3().fromArray(a.pos).lerp(new THREE.Vector3().fromArray(b.pos), e),
        look: new THREE.Vector3().fromArray(a.look).lerp(new THREE.Vector3().fromArray(b.look), e),
      };
    }
  }
  const last = KEYS[KEYS.length - 1];
  return { pos: new THREE.Vector3().fromArray(last.pos), look: new THREE.Vector3().fromArray(last.look) };
}

export function CameraRig({ progressRef, mouseRef }: Props) {
  const { camera } = useThree();
  const target = new THREE.Vector3();

  useFrame(() => {
    const { pos, look } = sampleKeyframes(progressRef.current);
    // Gentle mouse parallax, strongest in the hero and decaying by the detection section.
    const parallaxGain = Math.max(0, 1 - progressRef.current / 1.5) * 0.25;
    const [mx, my] = mouseRef.current;
    pos.x += mx * parallaxGain;
    pos.y += my * parallaxGain * 0.5;

    camera.position.lerp(pos, 0.08);
    target.copy(look);
    camera.lookAt(target);
  });
  return null;
}
