export const DIGIMON_PROFILES = {
  agumon: {
    body: {
      width: 11,
      height: 14,
      offsetX: -6,
      offsetY: 16,
      gravityY: 900,
    },

    // visual: {
    //   originX: 0.5,
    //   originY: 1,
    //   yOffset: -2,
    //   anims: {
    //     "attack-A": -6,
    //     "attack-B": -3,
    //     "attack-C": -5,
    //   },
    // },

    attacks: {
      main: {
        type: "melee",
        anim: "attack-A",
        damage: 10,
        fireFrames: [4, 7], // active hit window
        hitbox: {
          width: 9,
          height: 15,
          offsetX: 19,
          offsetY: 19,
          // duration: 320,//ms
          duration: 80, // per-frame lifetime
        },
        cooldown: 300,
      },
      skill1: {
        type: "melee",
        anim: "attack-B",
        damage: 30,
        fireFrames: [5], // active hit window
        hitbox: {
          width: 11,
          height: 15,
          offsetX: 11,
          offsetY: 24,
          // duration: 320,
          // duration: 80, // per-frame lifetime
        },
        cooldown: 1500,
      },
      skill2: {
        type: "projectile",
        anim: "attack-C",
        damage: 18,
        impactVFX: "vfx-fireblast",
        projectile: {
          texture: "fireball",
          anim: "fireball_fly",
          speed: 220,
          offsetX: 26,
          offsetY: 20,
          lifetime: 1900,
        },
        fireFrame: 5,
        cooldown: 800,
      },
      skill3: {
        type: "melee",
        anim: "attack-D",
        damage: 10,
        fireFrames: [3, 4, 5, 6], // active hit window
        hitbox: {
          width: 33,
          height: 30,
          offsetX: -1,
          offsetY: 13,
          // duration: 320,
          // duration: 80, // per-frame lifetime
        },
        cooldown: 1500,
      },
      skill4: {
        type: "projectile",
        anim: "attack-E",
        damage: 18,
        projectile: {
          texture: "big-fireball",
          // scale: 0.1,
          speed: 220,
          offsetX: 15,
          offsetY: -10,
          lifetime: 900,
        },
        fireFrame: 7,
        cooldown: 800,
      },
    },

    evolution: {
      prev: null,
      next: "birdramon",
    },
  },

  gabumon: {
    body: {
      width: 11,
      height: 21,
      offsetX: -3,
      offsetY: -9,
      gravityY: 900,
    },
    move: {
      speed: 90,
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
        type: "melee",
        anim: "attack-B",
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
      skill1: {
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
    skill2: {
      type: "projectile",
      anim: "attack-B",
      damage: 10,
      projectile: {
        texture: "vfx-windball",
        speed: 260,
        offsetX: 18,
        offsetY: -10,
        lifetime: 1200,
      },
      fireFrame: 4,
      cooldown: 800,
    },

    evolution: {
      prev: null,
      next: "greymon",
    },
  },

  chivmon: {
    body: {
      width: 11,
      height: 14,
      offsetX: -3,
      offsetY: -4,
      gravityY: 900,
    },
    move: {
      speed: 100,
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
        damage: 2,
        fireFrames: [3, 5], // active hit window
        hitbox: {
          width: 11,
          height: 11,
          offsetX: 16,
          offsetY: 5,
          duration: 80, // per-frame lifetime
          // duration: 320,//ms
        },
        cooldown: 500,
      },

      skill1: {
        type: "melee",
        anim: "attack-C",
        damage: 10,
        fireFrames: [2], // active hit window
        hitbox: {
          width: 11,
          height: 10,
          offsetX: 19,
          offsetY: 4,
          duration: 80, // per-frame lifetime
          // duration: 320,
        },
        cooldown: 1500,
      },
    },

    combat: {
      maxHp: 40,
    },

    evolution: {
      prev: null,
      next: null,
    },
  },

  patamon: {
    body: {
      width: 15,
      height: 14,
      offsetX: -4,
      offsetY: -2,
      gravityY: 900,
    },
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
        damage: 10,
        hitStop: 50, // 👈 light hit
        impactVFX: "vfx-explosion",
        projectile: {
          texture: "vfx-windball",
          anim: "vfx-windball",
          scale: 0.3,
          speed: 260,
          offsetX: 25,
          offsetY: 8,
          lifetime: 1200,
        },
        fireFrame: 6,
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
      next: "patamon",
    },
  },

  magnamon: {
    body: {
      width: 11,
      height: 18,
      offsetX: -5,
      offsetY: -4,
      gravityY: 900,
    },
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

  imperialdramon: {
    body: {
      width: 18,
      height: 44,
      offsetX: -9,
      offsetY: 1,
      gravityY: 900,
    },

    movement: {
      mode: "multi-domain",
      domains: ["ground", "air"],
      default: "ground",
    },
    // visual: {
    //   originX: 0.5,
    //   originY: 1,
    //   yOffset: -4,
    //   anims: {
    //     "attack-C": -4,
    //   },
    // },

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
          offsetX: 36,
          offsetY: 17,
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
          offsetX: 28,
          offsetY: 12,
          lifetime: 1200,
        },
        fireFrame: 11,
        cooldown: 800,
      },

      skill2: {
        type: "melee",
        anim: "attack-C",
        damage: 30,
        fireFrames: [4], // active hit window
        hitbox: {
          width: 23,
          height: 24,
          offsetX: 24,
          offsetY: 35,
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
};
