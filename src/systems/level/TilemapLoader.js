export function loadTilemap(scene, tilemapConfig) {
  const map = scene.make.tilemap({
    key: tilemapConfig.mapKey,
    tileWidth: 32,
    tileHeight: 32,
  });

  // Bind ALL tilesets used by this map
  const tilesets = tilemapConfig.tilesets.map((ts) =>
    map.addTilesetImage(ts.name, ts.imageKey),
  );

  // Create ground layer using ALL tilesets
  const groundLayer = map.createLayer(
    tilemapConfig.groundLayer || "GroundLayer",
    tilesets,
    0,
    0,
  );

  groundLayer.setCollisionByProperty({ collides: true });

  scene.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  scene.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  return { map, groundLayer };
}
