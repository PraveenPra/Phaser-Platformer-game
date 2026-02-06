export const HitReactions = {
  light: {
    state: "hit",
    invincible: true,
  },

  launch: {
    state: "launch",
    force: { x: 180, y: -420 },
    timing: {
      toRecover: 260,
      fallThreshold: 60,
    },
    switchDomain: "air",
    invincible: true,
  },
};
