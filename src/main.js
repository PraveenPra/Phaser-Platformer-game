import { Start } from "./scenes/backups/Start.js";
import { Preload } from "./scenes/Preload/Preload.js";
import { CharacterSelect } from "./scenes/CharacterSelect.js";
import { UIScene } from "/src/ui/UIScene.js";
import { DevCalibrationScene } from "./scenes/DevCalibrationScene.js";
import { Level0 } from "./scenes/levels/Level0.js";
import { Level1 } from "./scenes/levels/Level1.js";

const config = {
  type: Phaser.AUTO,
  title: "Overlord Rising",
  description: "",
  parent: "game-container",
  width: 960, //768, //960, //640,
  height: 544, //432, //544, //360, 416
  backgroundColor: "#1e1e1e",
  pixelArt: true,
  scene: [
    Preload,
    CharacterSelect,
    Start,
    UIScene,
    DevCalibrationScene,
    Level0,
    Level1,
  ],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 900 },
      debug: true,
      debugShowBody: true,
      debugShowVelocity: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    // width: 960,
    // height: 544,
  },
};

new Phaser.Game(config);
