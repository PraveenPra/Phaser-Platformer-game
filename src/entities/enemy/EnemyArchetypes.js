export const EnemyArchetypes = {
  grunt: {
    hpScale: 1.0,
    attackScale: 1.0,
    defense: 0,
    aiProfile: "patrol",
    allowedAttacks: ["main"],
  },

  elite: {
    hpScale: 1.6,
    attackScale: 1.3,
    defense: 2,
    aiProfile: "aggressive",
    allowedAttacks: ["main", "skill1"],
  },

  miniBoss: {
    hpScale: 3.0,
    attackScale: 1.8,
    defense: 4,
    aiProfile: "boss",
    allowedAttacks: ["main", "skill1", "skill2"],
  },
};
