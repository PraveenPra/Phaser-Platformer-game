export function loadTilemap(scene, tilemapConfig) {
  const map = scene.make.tilemap({
    key: tilemapConfig.mapKey,
    tileWidth: 32,
    tileHeight: 32,
  });

  const tilesets = [];

  tilemapConfig.tilesets.forEach((ts) => {
    const tileset = map.addTilesetImage(ts.name, ts.imageKey);
    if (tileset) tilesets.push(tileset);
  });

  const layers = {};

  // ===============================
  // TILED BACKGROUND (always above parallax)
  // ===============================
  if (tilemapConfig.backgroundLayer) {
    const bg = map.createLayer(tilemapConfig.backgroundLayer, tilesets, 0, 0);
    bg.setDepth(-5);
    layers.backgroundLayer = bg;
  }

  // ===============================
  // MIDGROUND (props ordering)
  // ===============================
  if (tilemapConfig.midgroundLayer) {
    const mid = map.createLayer(tilemapConfig.midgroundLayer, tilesets, 0, 0);
    mid.setDepth(0);
    layers.midgroundLayer = mid;
  }

  // ===============================
  // GROUND (collision)
  // ===============================
  const groundLayer = map.createLayer(
    tilemapConfig.groundLayer ?? "GroundLayer",
    tilesets,
    0,
    0,
  );

  groundLayer.setCollisionByProperty({ collides: true });
  groundLayer.setDepth(0);
  layers.groundLayer = groundLayer;

  // ===============================
  // FOREGROUND (over player)
  // ===============================
  if (tilemapConfig.foregroundLayer) {
    const fg = map.createLayer(tilemapConfig.foregroundLayer, tilesets, 0, 0);
    fg.setDepth(20);
    layers.foregroundLayer = fg;
  }

  scene.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  scene.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  return { map, ...layers };
}
