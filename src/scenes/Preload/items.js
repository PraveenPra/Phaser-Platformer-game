export function loadItems(scene) {
  // Collectibles
  scene.load.atlas(
    "collectables",
    "assets/collectables/collectables.png",
    "assets/collectables/collectables.json",
  );

  // Traps
  scene.load.atlas(
    "traps",
    "assets/traps/traps.png",
    "assets/traps/traps.json",
  );
}
