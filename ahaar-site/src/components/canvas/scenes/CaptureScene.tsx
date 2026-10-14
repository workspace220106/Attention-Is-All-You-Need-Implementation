import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { cssVarInt } from '../../../theme/tokens';

/**
 * A phone-shaped frame hovering in front of the camera, with a viewfinder
 * rectangle inside it. visibleRef in [0..1] fades it in and out; shakeRef
 * nudges it horizontally for the "retake" state. qualityRef draws the
 * leaf-green frame when the shot is good.
 */
export function CaptureScene({
  visibleRef,
  qualityRef,
  shakeRef,
}: {
  visibleRef: { current: number };
  qualityRef: { current: number };
  shakeRef: { current: number };
}) {
  const group = useRef<THREE.Group>(null);
  const frameRef = useRef<THREE.LineSegments>(null);

  const inkEdges = useMemo(() => {
    const g = new THREE.BoxGeometry(1.08, 2.0, 0.08);
    return new THREE.EdgesGeometry(g);
  }, []);

  const viewfinderEdges = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.88, 1.5);
    return new THREE.EdgesGeometry(g);
  }, []);

  const lineInk = useMemo(
    () => new THREE.LineBasicMaterial({ color: cssVarInt('ink'), transparent: true, opacity: 0.8 }),
    [],
  );
  const lineGood = useMemo(
    () => new THREE.LineBasicMaterial({ color: cssVarInt('leaf'), transparent: true, opacity: 0.95 }),
    [],
  );
  const lineBad = useMemo(
    () => new THREE.LineBasicMaterial({ color: cssVarInt('chilli'), transparent: true, opacity: 0.95 }),
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    const v = visibleRef.current;
    const q = qualityRef.current;
    const shake = shakeRef.current;
    group.current.visible = v > 0.02;
    group.current.position.x = Math.sin(state.clock.elapsedTime * 24) * shake * 0.04;
    group.current.position.z = 1.2 * v;
    // Fade the children by swapping line materials. We cheat by using opacity on the single material.
    lineInk.opacity = (1 - q) * 0.8 * v;
    lineGood.opacity = q * 0.95 * v;
    lineBad.opacity = shake * 0.95 * v;
  });

  return (
    <group ref={group}>
      {/* Phone body outline — thin ink lines, no fill */}
      <lineSegments geometry={inkEdges} material={lineInk} />
      {/* Viewfinder — swaps between ink / good / bad */}
      <lineSegments ref={frameRef} geometry={viewfinderEdges} material={lineGood} position={[0, 0.05, 0.05]} />
      <lineSegments geometry={viewfinderEdges} material={lineBad} position={[0, 0.05, 0.05]} />
      <lineSegments geometry={viewfinderEdges} material={lineInk} position={[0, 0.05, 0.05]} />
    </group>
  );
}
