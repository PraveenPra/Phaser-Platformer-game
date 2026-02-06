export const HitReactions = {
  LIGHT: {
    state: "hit",
  },

  LAUNCH: {
    state: "launch",

    launch: {
      x: 180,
      y: -420,
    },

    timing: {
      toRecover: 260, // ms before airRecover
      fallThreshold: 60, // velocity.y > this → recover
    },
  },
};
