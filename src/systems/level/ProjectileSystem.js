export class ProjectileSystem {
  constructor(scene) {
    this.scene = scene;

    this.group = scene.physics.add.group();

    // expose to scene (for enemies / player attacks)
    scene.projectiles = this.group;

    // Ground collision logic (same as Start)
    if (scene.groundLayer) {
      scene.physics.add.collider(
        this.group,
        scene.groundLayer,
        this.onGroundHit,
        null,
        this,
      );
    }
  }

  onGroundHit(proj) {
    if (!proj || !proj.body || !proj.active) return;

    if (
      proj.motion === "arc" &&
      !proj._hasHitGround &&
      proj.body.blocked.down
    ) {
      proj._hasHitGround = true;
      proj.explode?.();
    }
  }

  destroy() {
    // During scene restart, physics world may already be gone
    if (!this.group || !this.group.scene) return;

    // Safely disable children only
    this.group.children.each((child) => {
      if (!child) return;
      child.destroy();
    });

    // Do NOT call group.clear() or group.destroy()
    this.scene.projectiles = null;
    this.group = null;
  }
}
