export const EnemyArchetypes = {
  grunt: {
    hpScale: 1.0,
    attackScale: 1.0,
    defense: 0,
    aiProfile: "patrol",
    allowedAttacks: ["main"],

    combatRules: {
      reactions: {
        launch: true,
        stun: true,
      },
      statusResistance: {
        burn: 1.0,
      },
    },
  },

  elite: {
    hpScale: 1.6,
    attackScale: 1.3,
    defense: 2,
    aiProfile: "aggressive",
    allowedAttacks: ["main", "skill1"],

    combatRules: {
      reactions: {
        launch: false, // ❗ elites don't juggle
        stun: false,
      },
      statusResistance: {
        burn: 0.5, // shorter burn
      },
    },
  },

  miniBoss: {
    hpScale: 3.0,
    attackScale: 1.8,
    defense: 4,
    aiProfile: "boss",
    allowedAttacks: ["main", "skill1", "skill2"],

    combatRules: {
      reactions: {
        launch: false,
        knockback: false,
        stun: false,
      },
      statusResistance: {
        burn: 0.0, // immune
      },
    },
  },
};
