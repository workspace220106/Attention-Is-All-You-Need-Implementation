// Single source for colours, type and motion tokens.
// CSS variables remain the authoritative light/dark values; this file
// exposes helpers so Three.js materials can sample the same palette.

export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;
export const DUR = { short: 0.6, base: 0.75, long: 0.9 } as const;

export const PALETTE_KEYS = [
  'bg',
  'surface',
  'ink',
  'muted',
  'accent',
  'chilli',
  'leaf',
  'clay',
] as const;
export type PaletteKey = (typeof PALETTE_KEYS)[number];

/** Read a CSS custom property (`--bg`, …) as a string. */
export function cssVar(name: PaletteKey): string {
  if (typeof window === 'undefined') return '#000';
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${name}`)
    .trim();
}

/** Convert #rrggbb to a 24-bit integer suitable for THREE.Color. */
export function cssVarInt(name: PaletteKey): number {
  const v = cssVar(name).replace('#', '');
  return parseInt(v.length === 3 ? v.split('').map((c) => c + c).join('') : v, 16);
}
