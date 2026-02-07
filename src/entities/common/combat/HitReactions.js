export const HitReactions = {
  // Main / weak attacks
  flinch: {
    state: "hit",
    invincible: true,
  },

  // Strong normals / heavy skills (ground knockback)
  knockbackHeavy: {
    state: "hit",
    force: { x: 220, y: -120 },
    invincible: true,
  },

  // Air launcher (keep as-is)
  launch: {
    state: "launch",
    force: { x: 180, y: -420 },
    timing: {
      toRecover: 260,
      fallThreshold: 60,
    },
    invincible: true,
  },
};
