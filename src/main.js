import { Start } from "./scenes/Start.js";
import { Preload } from "./scenes/Preload.js";
import { CharacterSelect } from "./scenes/CharacterSelect.js";
import { UIScene } from "/src/ui/UIScene.js";

const config = {
  type: Phaser.AUTO,
  title: "Overlord Rising",
  description: "",
  parent: "game-container",
  width: 960, //640,
  height: 544, //360,
  backgroundColor: "#1e1e1e",
  pixelArt: true,
  scene: [Preload, CharacterSelect, Start, UIScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 900 },
      debug: false,
      debugShowBody: false,
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
