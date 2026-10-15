import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { cssVarInt } from '../../../theme/tokens';
import { makeBrushedSteel, makeBrass } from '../materials';

/**
 * A low 3D pan seen slightly from above. The food inside shifts colour
 * from pale (raw) through turmeric-tinted (temper) to cooked clay (simmer)
 * to green-flecked (serve) as `stepRef` moves 0..3.
 */
export function PanScene({
  progressRef,
  stepRef,
}: {
  progressRef: { current: number };
  stepRef: { current: number };
}) {
  const group = useRef<THREE.Group>(null);
  const foodMatRef = useRef<THREE.MeshStandardMaterial | null>(null);

  const steel = useMemo(() => makeBrushedSteel(), []);
  const brass = useMemo(() => makeBrass(), []);
  const foodMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ color: cssVarInt('surface'), roughness: 0.9 });
    foodMatRef.current = m;
    return m;
  }, []);

  // Colours per step. We lerp between them for smooth transitions.
  const stepColors = useMemo(
    () => [
      new THREE.Color(cssVarInt('surface')), // raw
      new THREE.Color(cssVarInt('accent')),  // temper (turmeric)
      new THREE.Color(cssVarInt('clay')),    // simmer
      new THREE.Color(cssVarInt('leaf')),    // serve, with greens
    ],
    [],
  );

  useFrame((state) => {
    const p = progressRef.current;
    if (!group.current) return;
    group.current.visible = p > 0.02;
    group.current.position.y = -0.3 + (1 - p) * 0.4;

    const s = Math.max(0, Math.min(3, stepRef.current));
    const i0 = Math.floor(s);
    const i1 = Math.min(3, i0 + 1);
    const t = s - i0;
    const c = stepColors[i0].clone().lerp(stepColors[i1], t);
    if (foodMatRef.current) foodMatRef.current.color.copy(c);

    // Slow idle rotation for a sense of life
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
  });

  return (
    <group ref={group}>
      {/* Pan body — shallow steel cylinder */}
      <mesh material={steel} rotation={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.0, 0.95, 0.22, 48]} />
      </mesh>
      {/* Interior food surface */}
      <mesh material={foodMat} position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.02, 48]} />
      </mesh>
      {/* Brass handle rivet */}
      <mesh material={brass} position={[1.1, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.06, 0.06]} />
      </mesh>
    </group>
  );
}
