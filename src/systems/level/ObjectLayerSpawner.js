export class ObjectLayerSpawner {
  static spawnCollectibles(scene, map) {
    const layer = map.getObjectLayer("CollectablesLayer");
    if (!layer) return;

    scene.dataShards.clear(true, true);

    layer.objects.forEach((obj) => {
      const x = obj.x + obj.width / 2;
      const y = obj.y - obj.height / 2;

      const shard = scene.dataShards.create(x, y, "collectables");
      shard.play("data-shard-spin");

      shard.setData("value", 1);

      // floating animation
      scene.tweens.add({
        targets: shard,
        y: y - 6,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    });
  }

  // =================================================
  // TRAPS
  // =================================================
  static spawnTraps(scene, map) {
    const layer = map.getObjectLayer("TrapsLayer");
    if (!layer) return;

    scene.traps.clear(true, true);

    layer.objects.forEach((obj) => {
      const x = obj.x + obj.width / 2;
      const y = obj.y - obj.height / 2;

      const trap = scene.traps.create(x, y, "traps");

      // animation (spike for now)
      trap.play("spike-up-anim");

      // metadata (used later by damage system)
      trap.setData(
        "damage",
        obj.properties?.find((p) => p.name === "damage")?.value ?? 1,
      );

      trap.setData(
        "knockback",
        obj.properties?.find((p) => p.name === "knockback")?.value ?? true,
      );

      // match spike art (64x16-ish)
      trap.body.setSize(60, 12);
      trap.body.setOffset(2, 2);
    });
  }
}
