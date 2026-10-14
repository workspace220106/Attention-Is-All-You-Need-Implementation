import * as THREE from 'three';
import { cssVarInt, PaletteKey } from '../../theme/tokens';

/** Matte painted / ceramic — no shine, no clearcoat. */
export function makeMatte(colorKey: PaletteKey, roughness = 0.85): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: cssVarInt(colorKey),
    roughness,
    metalness: 0,
  });
}

/** Brushed steel for the fridge body — low metalness so it reads as warm, not chrome. */
export function makeBrushedSteel(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: 0xcfc9c0,
    roughness: 0.55,
    metalness: 0.35,
  });
}

/** Warm brass for small details. */
export function makeBrass(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: 0xb08840,
    roughness: 0.38,
    metalness: 0.6,
  });
}

/** Paper-like cream surface for cards and shelves. */
export function makePaper(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: cssVarInt('surface'),
    roughness: 0.95,
    metalness: 0,
  });
}
