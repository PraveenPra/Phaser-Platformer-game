export const vfxSpritesheets = [
  { key: "fireball", path: "assets/vfx/fireball-vfx.png", w: 17, h: 17 },
  { key: "impact-hit", path: "assets/vfx/impact-hit.png", w: 32, h: 32 },
  {
    key: "sx-impact-hit",
    path: "assets/vfx/small-fireball-impact.png",
    w: 64,
    h: 64,
  },
  { key: "vfx-fireblast", path: "assets/vfx/fireblast.png", w: 64, h: 49 },
  { key: "vfx-explosion", path: "assets/vfx/explosion.png", w: 53, h: 47 },
  { key: "vfx-windball", path: "assets/vfx/windball.png", w: 96, h: 96 },
  { key: "vfx-leafball", path: "assets/vfx/leafball.png", w: 96, h: 32 },
  { key: "vfx-rainbowball", path: "assets/vfx/rainbowball.png", w: 32, h: 32 },
  { key: "burn-fx", path: "assets/vfx/burn-fx.png", w: 16, h: 16 },
  { key: "vfx-gnd-blast", path: "assets/vfx/gnd-blast.png", w: 32, h: 32 },
  {
    key: "vfx-tiny-fire-impact",
    path: "assets/vfx/tiny-fire-impact.png",
    w: 32,
    h: 32,
  },
];

export function loadVFX(scene) {
  scene.load.image("big-fireball", "assets/vfx/big-fireball.png");

  vfxSpritesheets.forEach((v) => {
    scene.load.spritesheet(v.key, v.path, {
      frameWidth: v.w,
      frameHeight: v.h,
    });
  });
}
