export class StatusVFX {
  static attach(owner, key, offset = { x: 0, y: 0 }) {
    const scene = owner.scene;

    const vfx = scene.add.sprite(0, 0, key);
    vfx.setDepth(owner.depth + 1);
    vfx.play(key);

    vfx.followTarget = owner;
    vfx.offset = offset;

    scene.events.on("update", () => {
      if (!vfx.active || !owner.active) return;

      const body = owner.bodyLayer?.body;

      if (body) {
        // anchor to physics body center
        vfx.setPosition(
          body.center.x + vfx.offset.x,
          body.center.y + vfx.offset.y,
        );
      } else {
        // fallback (should almost never hit)
        vfx.setPosition(owner.x + vfx.offset.x, owner.y + vfx.offset.y);
      }
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
