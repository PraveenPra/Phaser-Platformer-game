import { FOREST_PARALLAX } from "/src/data/level/parallaxPresets.js";

export const Level1Config = {
  tilemap: {
    mapKey: "level1-tilemap", // from Preload.js - tilemap name
    tileset: {
      name: "tile_jungle_ground_brown", // filename of ur tileset used in Tiled
      imageKey: "level1-tileset", //from Preload.js - gnd tileset name
      groundLayer: "GroundLayer", // the name of the layer in Tiled that has collision and is considered "ground"
    },
  },

  // IMPORTANT:
  // Player spawn Y must be CLOSE to the ground.
  // Spawning too high causes Arcade Physics tunneling:
  // the player can fall through the ground due to high gravity.
  // Always spawn just above the ground tiles.
  playerSpawn: {
    x: 120,
    y: 400,
  },

  collectibles: false,
  traps: false,
  enemies: false,

  goal: {
    offsetX: 180,
    offsetY: 260,
    width: 200,
    height: 300,
  },

  parallax: FOREST_PARALLAX,
};
