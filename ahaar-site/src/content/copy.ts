// All user-facing strings. Edit here, not in components.

export const copy = {
  brand: 'AHAAR',
  nav: ['How it works', 'Pantry graph', 'Family plate', 'Under the hood', 'Team'],
  hero: {
    headline: 'Open the fridge. Know what’s for dinner.',
    sub: 'Photograph your kitchen. AHAAR does the rest.',
    cta: 'See how it works',
    hint: 'Scroll',
  },
  capture: {
    kicker: '01 — Guided capture',
    headline: 'A clear photo, or no advice.',
    sub: 'AHAAR walks you through a shot that the model can actually read.',
    steps: ['Hold steady', 'Open fully', 'Good light', 'Whole shelf visible', 'Capture'],
    retake: 'Retake — the shot is blurry or dim.',
    good: 'Good shot. Ready to detect.',
    caption: 'No clear photo, no unreliable advice.',
  },
  detection: {
    kicker: '02 — Ingredient detection',
    headline: 'Ingredients, named and bounded.',
    sub: 'Thin boxes mark every item it finds — with the confidence it has in each.',
    model: 'YOLOv8 + CLIP',
    items: [
      { label: 'Tomato', conf: 96, x: 18, y: 24, w: 22, h: 18, color: 'chilli' },
      { label: 'Paneer', conf: 91, x: 48, y: 20, w: 20, h: 22, color: 'ink' },
      { label: 'Spinach', conf: 88, x: 14, y: 56, w: 28, h: 20, color: 'leaf' },
      { label: 'Onion', conf: 94, x: 54, y: 54, w: 18, h: 16, color: 'clay' },
      { label: 'Milk', conf: 97, x: 76, y: 22, w: 14, h: 36, color: 'ink' },
    ],
    caption: 'Hover a box to read the label and confidence.',
  },
  team: {
    group: 'Group 19',
    members: ['Rajiv Agarwal', 'Alan Joseph', 'Aryan Raina'],
    guide: 'Ms. Sharlene Rebeiro',
    year: 'AY 2026-27',
  },
};
