import { FOREST_PARALLAX } from "/src/data/level/parallaxPresets.js";

export const Level1Config = {
  tilemap: {
    mapKey: "level0-tilemap",
    tileset: {
      name: "TerrainTileset_32x32",
      imageKey: "level0-terrain-tileset",
      groundLayer: "GroundLayer",
    },
  },

  playerSpawn: {
    x: 120,
    y: 100,
  },

  collectibles: true,
  traps: true,
  enemies: true,

  goal: {
    offsetX: 180,
    offsetY: 260,
    width: 200,
    height: 300,
  },

  parallax: FOREST_PARALLAX,
};
