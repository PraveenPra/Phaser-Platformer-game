export class StatusVFX {
  static attach(owner, key, offset = { x: 0, y: 0 }) {
    const scene = owner.scene;
    const vfx = scene.add.sprite(0, 0, key);

    vfx.setDepth(owner.depth + 1);
    vfx.play(key);

    const updateHandler = () => {
      if (!vfx.active || !owner.active) return;

      const body = owner.bodyLayer?.body;
      if (body) {
        vfx.setPosition(body.center.x + offset.x, body.center.y + offset.y);
      }
    };

    scene.events.on("update", updateHandler);

    // 🔥 cleanup hook
    vfx.once("destroy", () => {
      scene.events.off("update", updateHandler);
    });

    return vfx;
  }

  static pulse(vfx) {
    if (!vfx) return;
    if (!vfx.active) return;
    if (!vfx.scene) return;

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
