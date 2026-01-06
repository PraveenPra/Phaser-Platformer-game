export const DIGIMON_PROFILES = {
  agumon: {
    visual: {
      originX: 0.5,
      originY: 1,
      yOffset: -2,
      anims: {
        "attack-A": -6,
        "attack-B": -3,
        "attack-C": -5,
      },
    },

    stats: {
      hp: 100,
      attack: 40,
      defense: 5,
      speed: 200,
      jump: 420,
    },

    attacks: {
      main: {
        type: "melee",
        anim: "attack-A",
        damage: 10,
        fireFrames: [3, 5], // active hit window
        hitbox: {
          width: 20,
          height: 18,
          offsetX: 16,
          offsetY: -8,
          // duration: 320,//ms
          duration: 80, // per-frame lifetime
        },
        cooldown: 300,
      },
      skill1: {
        type: "projectile",
        anim: "attack-B",
        damage: 18,
        projectile: {
          texture: "fireball",
          anim: "fireball_fly",
          speed: 220,
          offsetX: 20,
          offsetY: -3,
          lifetime: 900,
        },
        fireFrame: 11,
        cooldown: 800,
      },

      skill2: {
        type: "melee",
        anim: "attack-C",
        damage: 30,
        fireFrames: [1, 2, 3, 7], // active hit window
        hitbox: {
          width: 20,
          height: 18,
          offsetX: 16,
          offsetY: -8,
          // duration: 320,
          // duration: 80, // per-frame lifetime
        },
        cooldown: 1500,
      },
    },

    evolution: "greymon",
  },

  gabumon: {
    move: {
      speed: 80,
      jump: 420,
    },

    visual: {
      originX: 0.5,
      originY: 1,
      yOffset: -5,
      anims: {
        "attack-C": -4,
      },
    },

    stats: {
      hp: 90,
      attack: 12,
      defense: 4,
      speed: 2,
      jump: 410,
    },

    attacks: {
      main: {
        type: "melee",
        anim: "attack-A",
        damage: 10,
        fireFrames: [3, 4, 5], // active hit window
        hitbox: {
          width: 20,
          height: 18,
          offsetX: 16,
          offsetY: -8,
          duration: 80, // per-frame lifetime
          // duration: 320,//ms
        },
        cooldown: 300,
      },
      skill1: {
        type: "projectile",
        anim: "attack-B",
        damage: 18,
        projectile: {
          texture: "big-fireball",
          speed: 260,
          offsetX: 18,
          offsetY: -10,
          lifetime: 1200,
        },
        fireFrame: 4,
        cooldown: 800,
      },

      skill2: {
        type: "melee",
        anim: "attack-C",
        damage: 30,
        fireFrames: [3, 4, 5], // active hit window
        hitbox: {
          width: 20,
          height: 18,
          offsetX: 16,
          offsetY: -8,
          duration: 80, // per-frame lifetime
          // duration: 320,
        },
        cooldown: 1500,
      },
    },

    evolution: "garurumon",
  },

  chivmon: {
    move: {
      speed: 80,
      jump: 420,
    },

    visual: {
      originX: 0.5,
      originY: 1,
      yOffset: -4,
      anims: {
        "attack-C": -4,
      },
    },

    stats: {
      hp: 90,
      attack: 12,
      defense: 4,
      speed: 2,
      jump: 410,
    },

    attacks: {
      main: {
        type: "melee",
        anim: "attack-A",
        damage: 10,
        fireFrames: [3, 4, 5], // active hit window
        hitbox: {
          width: 20,
          height: 18,
          offsetX: 16,
          offsetY: -8,
          duration: 80, // per-frame lifetime
          // duration: 320,//ms
        },
        cooldown: 300,
      },
      skill1: {
        type: "projectile",
        anim: "attack-B",
        damage: 18,
        projectile: {
          texture: "big-fireball",
          speed: 260,
          offsetX: 18,
          offsetY: -10,
          lifetime: 1200,
        },
        fireFrame: 4,
        cooldown: 800,
      },

      skill2: {
        type: "melee",
        anim: "attack-C",
        damage: 30,
        fireFrames: [3, 4, 5], // active hit window
        hitbox: {
          width: 20,
          height: 18,
          offsetX: 16,
          offsetY: -8,
          duration: 80, // per-frame lifetime
          // duration: 320,
        },
        cooldown: 1500,
      },
    },

    evolution: "garurumon",
  },
};
