import { setupHitboxCollisions } from "./setupHitboxCollisions.js";

export function spawnProjectile(scene, owner, attack) {
  const dir = owner.visual.sprite.flipX ? -1 : 1;
  const proj = attack.projectile;

  const p = scene.physics.add.sprite(
    owner.x + proj.offsetX * dir,
    owner.y + proj.offsetY,
    proj.texture,
  );

  scene.projectiles.add(p);

  // p.setBounce(0);
  // p.setDragX(2000);

  if (proj.scale !== undefined) {
    p.setScale(proj.scale);
  }

  // =============
  p.motion = proj.motion ?? "linear";
  console.log("motion:", proj.motion, "blocked.down:");

  p.body.allowGravity = false;

  if (p.motion === "linear") {
    p.setVelocityX(proj.speed * dir);
  }
  // =================
  if (p.motion === "arc") {
    p.body.allowGravity = true;
    p.body.setGravityY(proj.gravityY ?? 800);

    const vx = (proj.speedX ?? proj.speed ?? 200) * dir;
    const vy = proj.speedY ?? -250;

    p.setVelocity(vx, vy);
  }

  p.explode = function () {
    if (!this.active) return;

    this._hasHitGround = true;

    this.setVelocity(0, 0);
    this.body.stop();

    this.body.enable = false;
    this.setVisible(false);

    const vfx = this.scene.add.sprite(this.x, this.y, "vfx");
    vfx.play(this.impactVFX ?? "vfx-explosion");
    vfx.once("animationcomplete", () => vfx.destroy());

    this.destroy();
  };

  // =====
  if (proj.anim) {
    p.play(proj.anim);
  }

  // =========================
  // Combat metadata (same as hitbox)
  // =========================
  p.damage = owner.getOutgoingDamage(attack);
  p.owner = owner;
  p.hitStop = attack.hitStop;
  // Reactions
  p.hitReaction = attack.projectile.hitReaction ?? "flinch";

  // Status Effects(burn,freeze)
  p.statusEffect = attack.projectile.statusEffect ?? null;

  const currentAttackKey = owner?.currentAttackKey || null;

  p.impactVFX =
    owner?.profile?.attacks[currentAttackKey]?.impactVFX || "vfx-fireblast";
  // p.impactVFX = attack.impactVFX || "vfx-fireblast";

  p.hitTargets = new Set(); // prevent multi-hit

  // =========================
  // Collision → damage
  // =========================
  setupHitboxCollisions(scene, p, owner.getAttackTargets(scene), {
    destroyOnHit: true, // projectiles vanish on hit
  });

  // =========================
  // Lifetime cleanup
  // =========================
  scene.time.delayedCall(proj.lifetime, () => {
    if (p.active) p.destroy();
  });

  return p;
}
