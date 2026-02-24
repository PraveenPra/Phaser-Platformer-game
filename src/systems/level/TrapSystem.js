import { createDamagePacket } from "/src/combat/DamageTypes.js";

export class TrapSystem {
  static setup(scene) {
    if (!scene.player || !scene.traps) return;

    scene.physics.add.overlap(
      scene.player.bodyLayer.body,
      scene.traps,
      TrapSystem.onHit,
      null,
      scene,
    );
  }

  static onHit(player, trap) {
    if (!player || player.isDead || !trap) return;

    const damage = trap.getData("damage") ?? 1;

    const packet = createDamagePacket({
      amount: damage,
      source: null, // environment
      type: "environment",
      flags: {
        environmental: true,
        ignoresHitReaction: false,
      },
    });

    player.receiveDamage(packet);
  }
}
