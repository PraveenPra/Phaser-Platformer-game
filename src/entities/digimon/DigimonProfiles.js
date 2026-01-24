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

    evolution: {
      prev: null,
      next: "greymon",
    },
  },

  gabumon: {
    move: {
      speed: 80,
    },

    visual: {
      originX: 0.5,
      originY: 1,
      yOffset: -5,
      anims: {
        "attack-C": -4,
      },
    },

    attacks: {
      main: {
        type: "projectile",
        anim: "attack-A",
        damage: 5,
        hitStop: 50, // 👈 light hit
        impactVFX: "impact-hit",
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

    evolution: {
      prev: null,
      next: "greymon",
    },
  },

  chivmon: {
    move: {
      speed: 80,
    },

    visual: {
      originX: 0.5,
      originY: 1,
      yOffset: -4,
      anims: {
        "attack-C": -4,
      },
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

    evolution: {
      prev: null,
      next: null,
    },
  },

  patamon: {
    movement: {
      mode: "multi-domain",
      domains: ["ground", "air"],
      default: "ground",
    },
    visual: {
      originX: 0.5,
      originY: 1,
      yOffset: -4,
      anims: {
        "attack-C": -4,
      },
    },

    attacks: {
      main: {
        type: "projectile",
        anim: "attack-A",
        damage: 18,
        hitStop: 50, // 👈 light hit
        impactVFX: "impact-hit",
        projectile: {
          texture: "big-fireball",
          speed: 260,
          offsetX: 28,
          offsetY: 0,
          lifetime: 1200,
        },
        fireFrame: 7,
        cooldown: 800,
      },
      skill1: {
        type: "projectile",
        anim: "attack-A",
        damage: 18,
        projectile: {
          texture: "big-fireball",
          speed: 260,
          offsetX: 18,
          offsetY: -10,
          lifetime: 1200,
        },
        fireFrame: 7,
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
    evolution: {
      prev: null,
      next: "greymon",
    },
  },

  seraphimon: {
    body: {
      width: 18,
      height: 40,
    },

    movement: {
      mode: "multi-domain",
      domains: ["ground", "air"],
      default: "air",
    },
    visual: {
      originX: 0.5,
      originY: 1,
      yOffset: -4,
      xOffset: -2,
      anims: {
        "attack-C": -4,
        fly: 12,
      },
    },

    attacks: {
      main: {
        type: "projectile",
        anim: "attack-A",
        damage: 18,
        hitStop: 110, // 👈 heavy hit
        impactVFX: "impact-hit",
        projectile: {
          texture: "big-fireball",
          speed: 260,
          offsetX: 28,
          offsetY: 0,
          lifetime: 1200,
        },
        fireFrame: 7,
        cooldown: 800,
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
        fireFrame: 7,
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
    evolution: {
      prev: null,
      next: null,
    },
  },

  magnamon: {
    move: {
      speed: 180,
    },

    visual: {
      originX: 0.5,
      originY: 1,
      yOffset: -5,
      anims: {
        "attack-C": -4,
      },
    },

    attacks: {
      main: {
        type: "projectile",
        anim: "attack-A",
        damage: 5,
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

    evolution: {
      prev: null,
      next: null,
    },
  },
  birdramon: {
    body: {
      width: 28,
      height: 20,
    },

    movement: {
      mode: "air",
    },
    visual: {
      originX: 0.5,
      originY: 1,
      yOffset: -20,
      xOffset: 2,
      anims: {
        // "attack-A": -4,
        fly: 12,
      },
    },

    attacks: {
      main: {
        type: "projectile",
        anim: "attack-A",
        damage: 18,
        projectile: {
          texture: "big-fireball",
          speed: 260,
          offsetX: 28,
          offsetY: 0,
          lifetime: 1200,
        },
        fireFrame: 4,
        cooldown: 800,
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
        fireFrame: 2,
        cooldown: 800,
      },
    },
    evolution: {
      prev: null,
      next: "seraphimon",
    },
  },
};
