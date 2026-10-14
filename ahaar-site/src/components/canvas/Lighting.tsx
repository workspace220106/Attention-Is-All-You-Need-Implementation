/**
 * Warm key light from one side, soft fill from the opposite,
 * subtle ambient so shadows never go to muddy black. No glow, no neon.
 */
export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.45} color="#F6E7CC" />
      {/* Key: warm sun through a kitchen window */}
      <directionalLight
        position={[4.2, 5, 3.5]}
        intensity={1.15}
        color="#FFD79A"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Fill: cool-ish bounce from a cream wall */}
      <directionalLight position={[-3.5, 2.5, -2]} intensity={0.35} color="#F6EFE3" />
      {/* Soft rim to lift forms off the background */}
      <pointLight position={[0, -2, 4]} intensity={0.25} color="#F6EFE3" />
    </>
  );
}
