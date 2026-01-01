export const DIGIMON_DEFAULTS = {
  body: {
    width: 18,
    height: 24,
    offsetX: -9,
    offsetY: -12,
    gravityY: 900,
  },

  visual: {
    originX: 0.5,
    originY: 1,
    yOffset: -2,
  },

  move: {
    speed: 200,
    jump: 420,
  },

  combat: {
    maxHp: 100,
    attack: 10,
    defense: 5,
    attackCooldown: 300, // ms
  },
};
