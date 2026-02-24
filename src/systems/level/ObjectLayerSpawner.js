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
}
