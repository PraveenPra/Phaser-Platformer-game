import { FOREST_PARALLAX } from "/src/data/level/parallaxPresets.js";

export const Level0Config = {
  tilemap: {
    mapKey: "level0-tilemap", // from Preload.js - tilemap name
    tileset: {
      name: "TerrainTileset_32x32", // filename of ur tileset used in Tiled
      imageKey: "level0-terrain-tileset", //from Preload.js - gnd tileset name
      groundLayer: "GroundLayer", // the name of the layer in Tiled that has collision and is considered "ground"
    },
  },

  // IMPORTANT:
  // Player spawn Y must be CLOSE to the ground.
  // Spawning too high causes Arcade Physics tunneling:
  // the player can fall through the ground due to high gravity.
  // Always spawn just above the ground tiles.
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
