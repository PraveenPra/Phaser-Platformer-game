export const gabumon = {
  body: {
    width: 11,
    height: 21,
    offsetX: -4,
    offsetY: 10,
    gravityY: 900,
  },
  move: {
    speed: 90,
  },

  attacks: {
    main: {
      type: "melee",
      anim: "attack-B",
      power: 1.0,
      fireFrames: [2], // active hit window
      hitbox: {
        width: 20,
        height: 18,
        offsetX: 21,
        offsetY: 18,
        duration: 80, // per-frame lifetime
        // duration: 320,
      },
      cooldown: 1500,
    },
    skill1: {
      type: "projectile",
      anim: "attack-A",
      power: 1.0,
      antiAir: true, // 👈 jump check
      projectile: {
        texture: "vfx-windball",
        speed: 260,
        offsetX: 17,
        offsetY: 20,
        lifetime: 1200,
      },
      fireFrame: 9,
      cooldown: 800,
    },
    skill2: {
      type: "melee",
      anim: "attack-C",
      power: 1.0,
      punish: true, // 👈 catches greedy players
      fireFrames: [5], // active hit window
      hitbox: {
        width: 20,
        height: 18,
        offsetX: 21,
        offsetY: 20,
        duration: 80, // per-frame lifetime
        // duration: 320,
      },
      cooldown: 1500,
    },
    skill3: {
      type: "melee",
      anim: "attack-D",
      power: 1.0,
      punish: true, // 👈 catches greedy players
      fireFrames: [4], // active hit window
      hitbox: {
        width: 20,
        height: 18,
        offsetX: 21,
        offsetY: 20,
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
};
