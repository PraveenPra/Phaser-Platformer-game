import { Start } from "./scenes/Start.js";
import { Preload } from "./scenes/Preload.js";
import { CharacterSelect } from "./scenes/CharacterSelect.js";

const config = {
  type: Phaser.AUTO,
  title: "Overlord Rising",
  description: "",
  parent: "game-container",
  width: 960,
  height: 540,
  backgroundColor: "#1e1e1e",
  pixelArt: true,
  scene: [Preload, CharacterSelect, Start],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 900 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

new Phaser.Game(config);
