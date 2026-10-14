import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { cssVarInt } from '../../../theme/tokens';

/**
 * The "photo plane" that flattens into view as detection begins.
 * progressRef in [0..1] fades it in and widens it slightly.
 * We leave the bounding boxes to the 2D overlay — they animate crisper there.
 */
export function DetectionScene({ progressRef }: { progressRef: { current: number } }) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: cssVarInt('surface'),
        roughness: 0.95,
        metalness: 0,
        transparent: true,
      }),
    [],
  );

  useFrame(() => {
    const t = progressRef.current;
    if (!ref.current) return;
    mat.opacity = Math.min(1, t * 1.6);
    ref.current.scale.setScalar(0.9 + t * 0.1);
    ref.current.rotation.x = (1 - t) * -0.3;
  });

  return (
    <mesh ref={ref} material={mat} position={[0, 0, 0]}>
      <planeGeometry args={[3.4, 2.1]} />
    </mesh>
  );
}
