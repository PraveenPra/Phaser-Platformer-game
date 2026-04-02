export const tilemaps = [
  // LEVEL 0
  {
    key: "level0-tilemap",
    json: "assets/tilemaps/Level0/Level0.json",
    tilesets: [
      {
        key: "level0-terrain-tileset",
        path: "assets/tilemaps/Level0/TerrainTileset_32x32.png",
      },
      {
        key: "level0-enemies-tileset",
        path: "assets/tilemaps/Level0/EnemiesTileset_32x32.png",
      },
      {
        key: "level0-misc-tileset",
        path: "assets/tilemaps/Level0/CollectablesTileset_16x16.png",
      },
    ],
  },

  // LEVEL 1
  {
    key: "level1-tilemap",
    json: "assets/tilemaps/Level1/Level1.json",
    tilesets: [
      {
        key: "level1-gnd-tileset",
        path: "assets/tilemaps/Level1/tile_jungle_ground_brown.png",
      },
      {
        key: "level1-slopes-tileset",
        path: "assets/tilemaps/Level1/tile_jungle_slopes_brown.png",
      },
      {
        key: "level1-gnd-slopes-tileset",
        path: "assets/tilemaps/Level1/tile_jungle_bottom_brown.png",
      },
      {
        key: "level1-plants-tileset",
        path: "assets/tilemaps/Level1/tile_jungle_plants_objects.png",
      },
      {
        key: "level1-tree-dark-tileset",
        path: "assets/tilemaps/Level1/tile_jungle_tree_dark.png",
      },
    ],
  },

  // SURVIVAL 1
  {
    key: "survival1-tilemap",
    json: "assets/tilemaps/Survival/Survival1.json",
    tilesets: [
      {
        key: "survival1-gnd-tileset",
        path: "assets/tilemaps/Survival/plainsOfPassage.png",
      },
    ],
  },
];

export function loadTilemaps(scene) {
  tilemaps.forEach((map) => {
    map.tilesets.forEach((ts) => {
      scene.load.image(ts.key, ts.path);
    });

    scene.load.tilemapTiledJSON(map.key, map.json);
  });
}
