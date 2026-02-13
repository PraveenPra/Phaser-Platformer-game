export const EnemyArchetypes = {
  grunt: {
    hpScale: 1.0,
    attackScale: 1.0,
    defense: 0,
    aiProfile: "patrol",
    allowedAttacks: ["main"],
    skillUnlockTime: Infinity,
    engagement: {
      aggroRadius: 160,
      disengageRadius: 240,
      commitDelay: 300, // hesitation before aggro
      chaseConfidence: 0.4, // how far they pursue
    },

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
    allowedAttacks: ["main", "skill1", "skill2"],
    skillUnlockTime: 0, // almost immediate
    repeatAttackLockMs: 400,
    forceSkillOnce: true,
    attackBias: {
      skillWeight: 4,
      openerChance: 0.9,
    },
    engagement: {
      aggroRadius: 260,
      disengageRadius: 420,
      commitDelay: 80,
      chaseConfidence: 0.85,
    },

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
    skillUnlockTime: 1200, // ramps
    repeatAttackLockMs: 1000,
    engagement: {
      aggroRadius: 420,
      disengageRadius: 9999,
      commitDelay: 0,
      chaseConfidence: 1.0,
    },

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
