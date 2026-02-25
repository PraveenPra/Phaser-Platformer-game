import { FOREST_PARALLAX } from "/src/data/level/parallaxPresets.js";

export const Level0Config = {
  tilemap: {
    mapKey: "level0-tilemap",
    tileset: {
      name: "TerrainTileset_32x32",
      imageKey: "level0-terrain-tileset",
      groundLayer: "GroundLayer",
    },
  },

  playerSpawn: {
    x: 200,
    y: 270,
  },

  collectibles: true,
  traps: true,
  enemies: true,

  goal: {
    offsetX: 200,
    offsetY: 300,
    width: 200,
    height: 300,
  },

  parallax: FOREST_PARALLAX,

  nextLevel: "Level1",
};
