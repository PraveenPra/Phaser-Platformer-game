import { FOREST_PARALLAX } from "/src/data/level/parallaxPresets.js";

export const Level1Config = {
  tilemap: {
    mapKey: "level1-tilemap", // from Preload.js - tilemap name
    groundLayer: "GroundLayer", // the name of the layer in Tiled that has collision
    tilesets: [
      {
        name: "tile_jungle_ground_brown", // filename of ur tileset used in Tiled
        imageKey: "level1-gnd-tileset", //from Preload.js - gnd tileset name
      },
      {
        name: "tile_jungle_slopes_brown", // filename of ur tileset used in Tiled
        imageKey: "level1-slopes-tileset", //from Preload.js - slopes tileset name
      },
    ],
  },

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
