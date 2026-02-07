export class StatusVFX {
  static attach(owner, key) {
    const scene = owner.scene;

    // example: small looping particles / sprite
    const vfx = scene.add.sprite(owner.x, owner.y, key);

    vfx.setDepth(owner.depth + 1);
    vfx.play(key);

    // follow owner
    vfx.followTarget = owner;

    scene.events.on("update", () => {
      if (!vfx.active || !owner.active) return;
      vfx.setPosition(owner.x, owner.y);
    });

    return vfx;
  }

  static pulse(vfx) {
    if (!vfx) return;

    vfx.setAlpha(1);
    vfx.scene.tweens.add({
      targets: vfx,
      alpha: 0.6,
      duration: 150,
      yoyo: true,
    });
  }

  static remove(vfx) {
    if (!vfx) return;
    vfx.destroy();
  }
}
