export function centerPanel(scene, tilesW, tilesH, tileSize = 32) {
  const cam = scene.cameras.main;
  const w = tilesW * tileSize;
  const h = tilesH * tileSize;

  return {
    x: cam.centerX - w / 2,
    y: cam.centerY - h / 2,
  };
}
