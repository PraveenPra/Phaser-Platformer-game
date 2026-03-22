import { FOREST_PARALLAX } from "/src/data/level/parallaxPresets.js";

export const SurvivalConfig = {
  tilemap: {
    mapKey: "survival1-tilemap", // from Preload.js - tilemap name
    groundLayer: "GroundLayer", // the name of the layer in Tiled that has collision
    midgroundLayer: "MidgroundLayer",
    tilesets: [
      {
        name: "plainsOfPassage", // filename of ur tileset used in Tiled
        imageKey: "survival1-gnd-tileset", //from Preload.js - gnd tileset name
      },
    ],
  },

  playerSpawn: {
    x: 120,
    y: 300,
  },

  collectibles: false,
  traps: false,
  enemies: false,

  goal: null,

  parallax: FOREST_PARALLAX,
};
