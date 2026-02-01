import { GameState } from "../GameState.js";

export class Preload extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  preload() {
    this.loadingScreen();

    // ================================
    // ASSETS (YOUR EXISTING CODE)
    // ================================

    this.load.atlas(
      "agumon",
      "assets/digimons/Agumon/Agumon.png",
      "assets/digimons/Agumon/Agumon.json",
    );

    this.load.atlas(
      "gabumon",
      "assets/digimons/Gabumon/Gabumon.png",
      "assets/digimons/Gabumon/Gabumon.json",
    );

    this.load.atlas(
      "chivmon",
      "assets/digimons/Chivmon/Chivmon.png",
      "assets/digimons/Chivmon/Chivmon.json",
    );

    this.load.atlas(
      "patamon",
      "assets/digimons/Patamon/Patamon.png",
      "assets/digimons/Patamon/Patamon.json",
    );

    this.load.atlas(
      "seraphimon",
      "assets/digimons/Seraphimon/Seraphimon.png",
      "assets/digimons/Seraphimon/Seraphimon.json",
    );

    this.load.atlas(
      "magnamon",
      "assets/digimons/Magnamon/Magnamon.png",
      "assets/digimons/Magnamon/Magnamon.json",
    );

    this.load.atlas(
      "birdramon",
      "assets/digimons/Birdramon/Birdramon.png",
      "assets/digimons/Birdramon/Birdramon.json",
    );

    this.load.atlas(
      "imperialdramon",
      "assets/digimons/Imperialdramon/Imperialdramon.png",
      "assets/digimons/Imperialdramon/Imperialdramon.json",
    );

    this.load.image("bg1", "assets/background_layer1.png");
    this.load.image("bg2", "assets/background_layer2.png");
    this.load.image("bg3", "assets/background_layer3.png");
    this.load.image("bg4", "assets/bg1.jpeg");

    // VFX ----------------
    this.load.image("big-fireball", "assets/vfx/big-fireball.png");

    this.load.spritesheet("fireball", "assets/vfx/fireball-vfx.png", {
      frameWidth: 17,
      frameHeight: 17,
    });

    this.load.spritesheet("impact-hit", "assets/vfx/impact-hit.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet(
      "sx-impact-hit",
      "assets/vfx/small-fireball-impact.png",
      {
        frameWidth: 64,
        frameHeight: 64,
      },
    );

    this.load.spritesheet("vfx-fireblast", "assets/vfx/fireblast.png", {
      frameWidth: 64,
      frameHeight: 49,
    });

    this.load.spritesheet("vfx-explosion", "assets/vfx/explosion.png", {
      frameWidth: 53,
      frameHeight: 47,
    });

    this.load.spritesheet("vfx-windball", "assets/vfx/windball.png", {
      frameWidth: 96,
      frameHeight: 96,
    });
    // COLLECTIBLES -------------
    this.load.atlas(
      "collectables",
      "assets/collectables/collectables.png",
      "assets/collectables/collectables.json",
    );

    //TRAPS ------------------
    this.load.atlas(
      "traps",
      "assets/traps/traps.png",
      "assets/traps/traps.json",
    );
    // TILEMAPS ----------------  ---

    this.load.image("groundTile", "assets/ground-tile.png");

    // this.load.image("level1-tileset", "assets/tilemaps/tileset_32x32.png");
    // this.load.image(
    //   "level1-tileset-enemies",
    //   "assets/tilemaps/goblin_spritesheet.png",
    // ); //dummy placeholder tileset fr enemies
    // this.load.tilemapTiledJSON("level1-map", "assets/tilemaps/Tilemap1.json");

    // LEVEL 1 TILEMAPS ----------
    this.load.image(
      "level1-tileset",
      "assets/tilemaps/Level1-Tutorial/Terrain_32x32.png",
    );
    this.load.image(
      "level1-tileset-enemies",
      "assets/tilemaps/Level1-Tutorial/Enemies_32x32.png",
    ); //dummy placeholder tileset fr enemies

    this.load.image(
      "level1-tileset-misc",
      "assets/tilemaps/Level1-Tutorial/Collectables_16x16.png",
    ); //dummy placeholder tileset fr traps, collectables

    this.load.tilemapTiledJSON(
      "level1-map",
      "assets/tilemaps/Level1-Tutorial/Level1Tutorial.json",
    );

    // SYSTEM TEXTURES ----------// This generates a 1×1 white texture in memory.
    // No asset file needed. Perfect for systems.
    // To be used for attack hitboxes.
    this.textures.generate("__hitbox", {
      data: ["1"],
      pixelWidth: 1,
      pixelHeight: 1,
    });

    // SFX ----------------------
    this.load.audio("sfx-blast-hit", "assets/sfx/shoot.mp3");
    this.load.audio("sfx-wing-flap", "assets/sfx/wing-flap.wav");
    this.load.audio("sfx-evolution", "assets/sfx/evolution.wav");
    this.load.audio("sfx-collect-shard", "assets/sfx/pick-a-coin.wav");
    this.load.audio("sfx-level-complete", "assets/sfx/level-completion.wav");
    this.load.audio("sfx-hurt", "assets/sfx/hurt-flinch.mp3");
    this.load.audio("sfx-gameover", "assets/sfx/game-over.wav");
    this.load.audio("sfx-bg-music-1", "assets/sfx/BG-MUSIC3.wav");

    // UI ATLAS -----------------
    this.load.atlas("ui", "assets/ui/ui.png", "assets/ui/ui.json");
    this.load.atlas(
      "mobile-buttons",
      "assets/ui/mobile-buttons.png",
      "assets/ui/mobile-buttons.json",
    );

    // Load bitmap fonts
    this.load.bitmapFont(
      "bigFont",
      "assets/ui/fonts/Big-font1.png",
      "assets/ui/fonts/Big-font1.xml",
    );
    this.load.bitmapFont(
      "smallFont",
      "assets/ui/fonts/Small-font1.png",
      "assets/ui/fonts/Small-font1.xml",
    );
  }

  create() {
    this.scene.start("CharacterSelect");
    // GameState.selectedDigimon = "agumon";
    // this.scene.start("Start");
  }

  loadingScreen() {
    const { width, height } = this.cameras.main;

    // ================================
    // LOADING SCREEN UI (FIRST!)
    // ================================
    const bg = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
    );

    const loadingText = this.add
      .text(width / 2, height / 2 - 50, "Loading...", {
        fontSize: "20px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const progressBox = this.add.rectangle(
      width / 2,
      height / 2,
      320,
      30,
      0x222222,
    );

    const progressBar = this.add
      .rectangle(width / 2 - 160, height / 2, 0, 24, 0xffffff)
      .setOrigin(0, 0.5);

    const percentText = this.add
      .text(width / 2, height / 2 + 40, "0%", {
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // ================================
    // LOADER EVENTS
    // ================================
    this.load.on("progress", (value) => {
      progressBar.width = 300 * value;
      percentText.setText(`${Math.floor(value * 100)}%`);
    });

    this.load.on("complete", () => {
      bg.destroy();
      loadingText.destroy();
      progressBox.destroy();
      progressBar.destroy();
      percentText.destroy();
    });
  }
}
