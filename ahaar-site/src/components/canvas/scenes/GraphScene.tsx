import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { cssVarInt } from '../../../theme/tokens';
import { makeMatte } from '../materials';

type NodeKind = 'ingredient' | 'dish' | 'nutrient' | 'substitute';
type Node = { id: string; kind: NodeKind; pos: THREE.Vector3; label: string };

// A hand-authored force-directed-looking layout. We skip actual simulation
// to keep the frame budget free; the layout is designed to read in one glance.
const NODES: Node[] = [
  // Ingredients (clay)
  { id: 'tomato', kind: 'ingredient', pos: new THREE.Vector3(-1.1, 0.4, 0), label: 'Tomato' },
  { id: 'paneer', kind: 'ingredient', pos: new THREE.Vector3(-0.5, -0.7, 0.2), label: 'Paneer' },
  { id: 'spinach', kind: 'ingredient', pos: new THREE.Vector3(-1.3, -0.5, -0.2), label: 'Spinach' },
  { id: 'onion', kind: 'ingredient', pos: new THREE.Vector3(0.2, 0.6, -0.3), label: 'Onion' },
  { id: 'milk', kind: 'ingredient', pos: new THREE.Vector3(-0.1, -1.1, 0.1), label: 'Milk' },
  { id: 'dal', kind: 'ingredient', pos: new THREE.Vector3(0.8, -0.9, 0.3), label: 'Toor dal' },
  { id: 'rice', kind: 'ingredient', pos: new THREE.Vector3(1.4, -0.1, 0), label: 'Rice' },
  // Dishes (ink)
  { id: 'palak', kind: 'dish', pos: new THREE.Vector3(-0.9, 0.4, 0.9), label: 'Palak Paneer' },
  { id: 'tdal', kind: 'dish', pos: new THREE.Vector3(0.5, -0.3, 0.9), label: 'Tomato Dal' },
  { id: 'pulao', kind: 'dish', pos: new THREE.Vector3(1.2, 0.6, 0.7), label: 'Veg Pulao' },
  // Nutrients (leaf)
  { id: 'protein', kind: 'nutrient', pos: new THREE.Vector3(-1.6, 0.9, 0.6), label: 'Protein' },
  { id: 'iron', kind: 'nutrient', pos: new THREE.Vector3(-1.7, -0.2, 0.5), label: 'Iron' },
  // Substitutes (muted)
  { id: 'tofu', kind: 'substitute', pos: new THREE.Vector3(-0.1, -1.4, 0.9), label: 'Tofu (for paneer)' },
];

const EDGES: [string, string][] = [
  ['spinach', 'palak'], ['paneer', 'palak'], ['onion', 'palak'],
  ['tomato', 'tdal'], ['dal', 'tdal'], ['onion', 'tdal'],
  ['rice', 'pulao'], ['onion', 'pulao'],
  ['paneer', 'protein'], ['dal', 'protein'], ['milk', 'protein'],
  ['spinach', 'iron'],
  ['paneer', 'tofu'],
];

function kindColor(k: NodeKind): number {
  switch (k) {
    case 'ingredient': return cssVarInt('clay');
    case 'dish': return cssVarInt('ink');
    case 'nutrient': return cssVarInt('leaf');
    case 'substitute': return cssVarInt('muted');
  }
}

/**
 * Pantry knowledge graph.
 *   progressRef — [0..1] fades the whole graph in and gently floats it.
 *   hoveredRef  — id of the hovered node, or null; highlights it + neighbours.
 */
export function GraphScene({
  progressRef,
  hoveredRef,
}: {
  progressRef: { current: number };
  hoveredRef: { current: string | null };
}) {
  const root = useRef<THREE.Group>(null);

  const materials = useMemo(() => {
    const m: Record<NodeKind, THREE.MeshStandardMaterial> = {
      ingredient: makeMatte('clay', 0.85),
      dish: makeMatte('ink', 0.9),
      nutrient: makeMatte('leaf', 0.85),
      substitute: makeMatte('muted', 0.9),
    };
    Object.values(m).forEach((mat) => { mat.transparent = true; });
    return m;
  }, []);

  const accent = useMemo(() => makeMatte('accent', 0.6), []);
  accent.transparent = true;

  const edgeGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pts: number[] = [];
    const map = new Map(NODES.map((n) => [n.id, n.pos]));
    for (const [a, b] of EDGES) {
      const pa = map.get(a)!; const pb = map.get(b)!;
      pts.push(pa.x, pa.y, pa.z, pb.x, pb.y, pb.z);
    }
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  const edgeMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: cssVarInt('ink'), transparent: true, opacity: 0.18 }),
    [],
  );

  // Neighbour lookup for the hover highlight
  const neighbours = useMemo(() => {
    const n = new Map<string, Set<string>>();
    for (const id of NODES.map((x) => x.id)) n.set(id, new Set());
    for (const [a, b] of EDGES) { n.get(a)!.add(b); n.get(b)!.add(a); }
    return n;
  }, []);

  // One mesh per node so we can tint individually; cheap at ~15 nodes.
  useFrame(({ clock }) => {
    const p = progressRef.current;
    if (!root.current) return;
    root.current.visible = p > 0.02;
    root.current.position.y = Math.sin(clock.elapsedTime * 0.4) * 0.03;
    root.current.rotation.y = -0.1 + Math.sin(clock.elapsedTime * 0.15) * 0.08;

    const hov = hoveredRef.current;
    const highlight = hov ? neighbours.get(hov) ?? new Set() : null;
    const fade = Math.min(1, p * 1.3);
    edgeMat.opacity = 0.18 * fade;

    root.current.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh && obj.userData.nodeId) {
        const id = obj.userData.nodeId as string;
        const kind = obj.userData.kind as NodeKind;
        const isHit = hov === id || (highlight && highlight.has(id));
        const mat = (isHit ? accent : materials[kind]) as THREE.MeshStandardMaterial;
        (obj as THREE.Mesh).material = mat;
        mat.opacity = fade * (hov ? (isHit ? 1 : 0.18) : 1);
        (obj as THREE.Mesh).scale.setScalar(isHit ? 1.15 : 1);
      }
    });
  });

  return (
    <group ref={root}>
      <lineSegments geometry={edgeGeo} material={edgeMat} />
      {NODES.map((n) => (
        <mesh
          key={n.id}
          position={n.pos}
          userData={{ nodeId: n.id, kind: n.kind }}
          castShadow
          onPointerOver={(e) => { e.stopPropagation(); hoveredRef.current = n.id; }}
          onPointerOut={(e) => { e.stopPropagation(); if (hoveredRef.current === n.id) hoveredRef.current = null; }}
        >
          {n.kind === 'dish' ? (
            <boxGeometry args={[0.18, 0.18, 0.18]} />
          ) : (
            <sphereGeometry args={[n.kind === 'ingredient' ? 0.12 : 0.09, 24, 18]} />
          )}
          <meshStandardMaterial color={kindColor(n.kind)} transparent />
        </mesh>
      ))}
    </group>
  );
}

// Re-export node table so the DOM caption can read labels if needed later.
export const PANTRY_NODES = NODES;
