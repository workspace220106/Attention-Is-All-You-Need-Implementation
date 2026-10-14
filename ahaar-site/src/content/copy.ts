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
  quantity: {
    kicker: '03 — Quantity estimation',
    headline: 'How much, roughly.',
    sub: 'Each ingredient is counted or weighed by eye. You can correct any value.',
    chips: [
      { name: 'Tomato', value: '× 4' },
      { name: 'Paneer', value: '~ 250 g' },
      { name: 'Milk', value: '0.5 L' },
      { name: 'Onion', value: '× 2' },
      { name: 'Spinach', value: '~ 180 g' },
      { name: 'Green chilli', value: '× 3' },
    ],
    note: 'Approximate. You can correct it.',
  },
  graph: {
    kicker: '04 — Pantry knowledge graph',
    headline: 'Not a list. A map of what goes with what.',
    sub: 'Ingredients, dishes, nutrients and substitutes form one connected view.',
    legend: ['Ingredient', 'Dish', 'Nutrient', 'Substitute'],
    caption: 'Hover a node to isolate it and its neighbours.',
  },
  recommend: {
    kicker: '05 — Personalised recommendations',
    headline: 'Three meals that fit tonight.',
    sub: 'Chosen for what you have, what you prefer, and how your body responds.',
    filters: ['Veg', 'Low GI', 'High protein', 'Quick'],
    cards: [
      {
        name: 'Palak Paneer',
        match: 94,
        time: '28 min',
        tags: ['Veg', 'High protein'],
        reasons: [
          { label: 'Uses what you have', value: 92 },
          { label: 'Fits your diet', value: 88 },
          { label: 'Low glycaemic index', value: 71 },
        ],
      },
      {
        name: 'Tomato Dal',
        match: 89,
        time: '22 min',
        tags: ['Veg', 'Low GI', 'Quick'],
        reasons: [
          { label: 'Uses what you have', value: 95 },
          { label: 'Fits your diet', value: 82 },
          { label: 'Low glycaemic index', value: 86 },
        ],
      },
      {
        name: 'Veg Pulao',
        match: 81,
        time: '35 min',
        tags: ['Veg'],
        reasons: [
          { label: 'Uses what you have', value: 78 },
          { label: 'Fits your diet', value: 80 },
          { label: 'Low glycaemic index', value: 54 },
        ],
      },
    ],
  },
  team: {
    group: 'Group 19',
    members: ['Rajiv Agarwal', 'Alan Joseph', 'Aryan Raina'],
    guide: 'Ms. Sharlene Rebeiro',
    year: 'AY 2026-27',
  },
};
