export function loadTilemap(scene, mapKey, tilesetConfig) {
  const map = scene.make.tilemap({
    key: mapKey,
    tileWidth: 32,
    tileHeight: 32,
  });

  const tileset = map.addTilesetImage(
    tilesetConfig.name,
    tilesetConfig.imageKey,
  );

  const groundLayer = map.createLayer(tilesetConfig.groundLayer, tileset, 0, 0);

  groundLayer.setCollisionByProperty({ collides: true });

  // World bounds
  scene.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  scene.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  return { map, groundLayer };
}
