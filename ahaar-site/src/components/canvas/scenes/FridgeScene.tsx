import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { makeBrushedSteel, makeMatte, makeBrass, makePaper } from '../materials';

/**
 * A minimal brushed-steel fridge. One body, one door, three shelves,
 * a handful of ingredients on the shelves. No chrome, no glow.
 *
 * `openT` in [0..1] controls door opening and warm-light spill.
 */
export function FridgeScene({ openTRef }: { openTRef: { current: number } }) {
  const doorRef = useRef<THREE.Group>(null);
  const spillRef = useRef<THREE.PointLight>(null);

  const steel = useMemo(() => makeBrushedSteel(), []);
  const brass = useMemo(() => makeBrass(), []);
  const paper = useMemo(() => makePaper(), []);
  const tomato = useMemo(() => makeMatte('chilli', 0.7), []);
  const onion = useMemo(() => makeMatte('clay', 0.8), []);
  const paneer = useMemo(() => makeMatte('surface', 0.95), []);
  const milk = useMemo(() => makeMatte('bg', 0.95), []);
  const chilli = useMemo(() => makeMatte('leaf', 0.75), []);
  const spinach = useMemo(() => makeMatte('leaf', 0.9), []);

  useFrame(() => {
    const t = openTRef.current;
    if (doorRef.current) doorRef.current.rotation.y = -t * (Math.PI * 0.55);
    if (spillRef.current) spillRef.current.intensity = t * 1.2;
  });

  // --- Static body ----------------------------------------------------
  return (
    <group position={[0, -0.3, 0]}>
      {/* Floor shadow catcher */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.25, 0]} receiveShadow>
        <circleGeometry args={[6, 48]} />
        <shadowMaterial opacity={0.08} />
      </mesh>

      {/* Fridge body (steel) */}
      <mesh material={steel} position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 2.6, 0.9]} />
      </mesh>

      {/* Interior cavity — slightly inset, paper-cream so warm light reads */}
      <mesh material={paper} position={[0, 0.6, 0.02]}>
        <boxGeometry args={[1.44, 2.44, 0.72]} />
      </mesh>

      {/* Three shelves */}
      {[1.25, 0.55, -0.15].map((y, i) => (
        <mesh key={i} material={paper} position={[0, y, 0.08]} castShadow>
          <boxGeometry args={[1.4, 0.03, 0.68]} />
        </mesh>
      ))}

      {/* Ingredients — low-poly placeholders in true colours */}
      {/* Top shelf: milk carton + two tomatoes */}
      <mesh material={milk} position={[-0.45, 1.45, 0.1]} castShadow>
        <boxGeometry args={[0.22, 0.38, 0.22]} />
      </mesh>
      <mesh material={tomato} position={[0.0, 1.33, 0.15]} castShadow>
        <sphereGeometry args={[0.1, 20, 16]} />
      </mesh>
      <mesh material={tomato} position={[0.22, 1.33, 0.1]} castShadow>
        <sphereGeometry args={[0.1, 20, 16]} />
      </mesh>

      {/* Middle shelf: paneer block + onion + green chilli */}
      <mesh material={paneer} position={[-0.35, 0.73, 0.1]} castShadow>
        <boxGeometry args={[0.3, 0.14, 0.22]} />
      </mesh>
      <mesh material={onion} position={[0.05, 0.68, 0.14]} castShadow>
        <sphereGeometry args={[0.1, 20, 16]} />
      </mesh>
      <mesh material={chilli} position={[0.35, 0.67, 0.15]} rotation={[0, 0, Math.PI / 2.5]} castShadow>
        <capsuleGeometry args={[0.025, 0.14, 6, 10]} />
      </mesh>

      {/* Bottom shelf: spinach bundle */}
      <mesh material={spinach} position={[-0.15, 0.0, 0.1]} castShadow>
        <sphereGeometry args={[0.18, 20, 14]} />
      </mesh>

      {/* Door, hinged on the left */}
      <group ref={doorRef} position={[-0.8, 0.6, 0.47]}>
        <mesh material={steel} position={[0.8, 0, 0]} castShadow>
          <boxGeometry args={[1.6, 2.6, 0.08]} />
        </mesh>
        {/* Brass handle */}
        <mesh material={brass} position={[1.5, 0, 0.06]} castShadow>
          <boxGeometry args={[0.03, 0.5, 0.03]} />
        </mesh>
      </group>

      {/* Warm interior spill light, intensity ramps with door open */}
      <pointLight ref={spillRef} position={[0, 0.6, 0.4]} color="#FFC982" intensity={0} distance={2.4} />
    </group>
  );
}
