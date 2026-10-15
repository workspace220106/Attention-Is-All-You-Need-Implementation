import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { cssVarInt } from '../../../theme/tokens';
import { makeMatte, makePaper } from '../materials';

/**
 * Top-down ceramic thali with four small plates arranged around it.
 * portions ref holds [p0..p3] in [0..1]; each plate's food dots scale with it.
 */
export function PlateScene({
  progressRef,
  portionsRef,
}: {
  progressRef: { current: number };
  portionsRef: { current: [number, number, number, number] };
}) {
  const group = useRef<THREE.Group>(null);
  const platesRef = useRef<THREE.Group[]>([]);

  const ceramic = useMemo(() => makePaper(), []);
  const roti = useMemo(() => makeMatte('surface', 0.95), []);
  const rice = useMemo(() => makeMatte('bg', 0.98), []);
  const dal = useMemo(() => makeMatte('accent', 0.85), []);
  const sabzi = useMemo(() => makeMatte('leaf', 0.85), []);

  // Four small plate positions, laid around the big thali.
  const slots: [number, number][] = [
    [-1.1, -0.7], [1.1, -0.7], [-1.1, 0.9], [1.1, 0.9],
  ];

  useFrame(() => {
    const p = progressRef.current;
    if (!group.current) return;
    group.current.visible = p > 0.02;
    group.current.position.y = -0.1 + (1 - p) * 0.4;
    group.current.scale.setScalar(0.85 + p * 0.15);

    const ps = portionsRef.current;
    platesRef.current.forEach((g, i) => {
      if (!g) return;
      g.scale.setScalar(0.9 + ps[i] * 0.25);
    });
  });

  return (
    <group ref={group} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      {/* Big central thali */}
      <mesh material={ceramic} position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[1.4, 1.4, 0.08, 48]} />
      </mesh>
      <mesh material={ceramic} position={[0, 0.05, 0]}>
        <torusGeometry args={[1.4, 0.03, 12, 48]} />
      </mesh>

      {/* The four family plates */}
      {slots.map(([x, z], i) => (
        <group key={i} position={[x, 0.09, z]} ref={(el) => el && (platesRef.current[i] = el)}>
          <mesh material={ceramic} castShadow receiveShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.05, 32]} />
          </mesh>
          {/* Four food shapes at 12 / 3 / 6 / 9 o'clock */}
          <mesh material={roti} position={[0, 0.04, -0.22]}>
            <cylinderGeometry args={[0.1, 0.1, 0.01, 24]} />
          </mesh>
          <mesh material={rice} position={[0.22, 0.04, 0]}>
            <sphereGeometry args={[0.08, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
          <mesh material={dal} position={[0, 0.04, 0.22]}>
            <cylinderGeometry args={[0.09, 0.09, 0.02, 24]} />
          </mesh>
          <mesh material={sabzi} position={[-0.22, 0.04, 0]}>
            <sphereGeometry args={[0.08, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
