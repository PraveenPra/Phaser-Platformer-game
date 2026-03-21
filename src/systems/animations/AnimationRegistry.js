export function registerGlobalAnimations(scene) {
  //   if (scene.anims.exists("fireball_fly")) return;

  // =================================================
  // SHARED ANIMATIONS (GLOBAL)
  // =================================================
  scene.anims.create({
    key: "fireball_fly",
    frames: scene.anims.generateFrameNumbers("fireball", { start: 0, end: 1 }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: "impact-hit",
    frames: scene.anims.generateFrameNumbers("impact-hit", {
      start: 0,
      end: 5,
    }),
    frameRate: 18,
    repeat: 0,
  });

  scene.anims.create({
    key: "sx-impact-hit",
    frames: scene.anims.generateFrameNumbers("sx-impact-hit", {
      start: 2,
      end: 4,
    }),
    frameRate: 24,
    repeat: 0,
  });

  scene.anims.create({
    key: "vfx-fireblast",
    frames: scene.anims.generateFrameNumbers("vfx-fireblast", {
      start: 2,
      end: 5, //intentionally keeping it 1 frame short
    }),
    frameRate: 24,
    repeat: 0,
  });

  scene.anims.create({
    key: "vfx-explosion",
    frames: scene.anims.generateFrameNumbers("vfx-explosion", {
      start: 0,
      end: 5, //intentionally keeping it 1 frame short
    }),
    frameRate: 24,
    repeat: 0,
  });

  scene.anims.create({
    key: "vfx-windball",
    frames: scene.anims.generateFrameNumbers("vfx-windball", {
      start: 0,
      end: 4,
    }),
    frameRate: 24,
    repeat: -1,
  });

  scene.anims.create({
    key: "vfx-leafball",
    frames: scene.anims.generateFrameNumbers("vfx-leafball", {
      start: 0,
      end: 2,
    }),
    frameRate: 24,
    repeat: -1,
  });

  scene.anims.create({
    key: "vfx-rainbowball",
    frames: scene.anims.generateFrameNumbers("vfx-rainbowball", {
      start: 0,
      end: 3,
    }),
    frameRate: 24,
    repeat: -1,
  });

  scene.anims.create({
    key: "burn-fx",
    frames: scene.anims.generateFrameNumbers("burn-fx", {
      start: 0,
      end: 1,
    }),
    frameRate: 12,
    repeat: -1,
  });
  scene.anims.create({
    key: "vfx-gnd-blast",
    frames: scene.anims.generateFrameNumbers("vfx-gnd-blast", {
      start: 0,
      end: 9,
    }),
    frameRate: 24,
    repeat: 0,
  });
  scene.anims.create({
    key: "vfx-tiny-fire-impact",
    frames: scene.anims.generateFrameNumbers("vfx-tiny-fire-impact", {
      start: 0,
      end: 9,
    }),
    frameRate: 24,
    repeat: 0,
  });

  scene.anims.create({
    key: "vfx-watergun-stream",
    frames: scene.anims.generateFrameNumbers("vfx-watergun-stream", {
      start: 0,
      end: 1,
    }),
    frameRate: 12,
    repeat: -1,
  });

  scene.anims.create({
    key: "vfx-watergun-impact",
    frames: scene.anims.generateFrameNumbers("vfx-watergun-impact", {
      start: 0,
      end: 7,
    }),
    frameRate: 24,
    repeat: 0,
  });

  scene.anims.create({
    key: "vfx-watergun-muzzle",
    frames: scene.anims.generateFrameNumbers("vfx-watergun-muzzle", {
      start: 0,
      end: 6,
    }),
    frameRate: 24,
    repeat: -1,
  });
  // =================================================
  // COLLECTIBLE + TRAP ANIMATIONS
  // =================================================

  // Data Shard rotate
  scene.anims.create({
    key: "data-shard-spin",
    frames: [
      { key: "collectables", frame: "data-shard-rotate-1" },
      { key: "collectables", frame: "data-shard-rotate-2" },
      { key: "collectables", frame: "data-shard-rotate-3" },
      { key: "collectables", frame: "data-shard-rotate-4" },
    ],
    frameRate: 8,
    repeat: -1,
  });

  // Spike (up)
  scene.anims.create({
    key: "spike-up-anim",
    frames: [
      { key: "traps", frame: "Spike-up-1" },
      { key: "traps", frame: "Spike-up-2" },
      { key: "traps", frame: "Spike-up-3" },

      // hold at peak
      { key: "traps", frame: "Spike-up-4" },
      { key: "traps", frame: "Spike-up-4" },
      { key: "traps", frame: "Spike-up-4" },

      // retract
      { key: "traps", frame: "Spike-up-3" },
      { key: "traps", frame: "Spike-up-2" },
      { key: "traps", frame: "Spike-up-1" },
    ],
    frameRate: 6,
    repeat: -1,
  });
}
