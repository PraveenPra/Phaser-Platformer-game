export const StatusEffects = {
  burn: {
    id: "burn",
    duration: 3000,
    tickInterval: 500,
    damagePerTick: 2,
    stackable: false,
    refreshOnReapply: true,
    vfx: "burn",
  },

  poison: {
    id: "poison",
    duration: 5000,
    tickInterval: 1000,
    damagePerTick: 1,
    stackable: true,
    maxStacks: 5,
    refreshOnReapply: false,
    vfx: "poison",
  },

  stun: {
    id: "stun",
    duration: 800,
    disablesMovement: true,
    disablesAttack: true,
  },

  slow: {
    id: "slow",
    duration: 2000,
    speedMultiplier: 0.01,
  },
};
