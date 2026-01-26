export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: "UIScene" });
  }

  create() {
    // UI should NOT scroll with the world
    this.cameras.main.setScroll(0, 0);

    // Root container for HUD
    this.ui = this.add.container(0, 0);
    this.ui.setScrollFactor(0);

    // =================================================
    // TEST PANEL (9-slice built manually)
    // =================================================
    this.createGreenPanel(40, 40, 8, 4);

    this.add
      .bitmapText(
        80, // x
        60, // y
        "bigFont", // font key
        "PAUSED", // text
        32, // font size (important!)
      )
      .setOrigin(0)
      .setScrollFactor(0);

    this.add
      .bitmapText(80, 110, "smallFont", "Press ESC to Resume", 16)
      .setOrigin(0)
      .setScrollFactor(0);

    // =================================================
    // TEST BUTTON
    // =================================================

    this.createGreenButton(200, 140, "Resume", () => {
      this.scene.resume("Start");
      this.scene.stop();
    });

    this.createGreenButton(200, 180, "Quit", () => {
      this.scene.stop("Start");
      this.scene.start("CharacterSelect");
    });
  }

  // =================================================
  // GREEN PANEL (9-slice, 32x32 tiles)
  // =================================================
  createGreenPanel(x, y, tilesWide, tilesHigh) {
    const TILE = 32;

    const parts = {
      tl: "panel-green-top-left",
      t: "panel-green-top",
      tr: "panel-green-top-right",
      l: "panel-green-left",
      c: "panel-green-center",
      r: "panel-green-right",
      bl: "panel-green-bottom-left",
      b: "panel-green-bottom",
      br: "panel-green-bottom-right",
    };

    const panel = this.add.container(x, y);

    for (let row = 0; row < tilesHigh; row++) {
      for (let col = 0; col < tilesWide; col++) {
        let frame = parts.c;

        if (row === 0 && col === 0) frame = parts.tl;
        else if (row === 0 && col === tilesWide - 1) frame = parts.tr;
        else if (row === tilesHigh - 1 && col === 0) frame = parts.bl;
        else if (row === tilesHigh - 1 && col === tilesWide - 1)
          frame = parts.br;
        else if (row === 0) frame = parts.t;
        else if (row === tilesHigh - 1) frame = parts.b;
        else if (col === 0) frame = parts.l;
        else if (col === tilesWide - 1) frame = parts.r;

        const tile = this.add
          .image(col * TILE, row * TILE, "ui", frame)
          .setOrigin(0);

        panel.add(tile);
      }
    }

    this.ui.add(panel);

    // PANEL TITLE
    const title = this.add
      .bitmapText(TILE * 0.5, -20, "bigFont", "SETTINGS", 24)
      .setOrigin(0);

    panel.add(title);

    return panel;
  }

  // =================================================
  // GREEN BUTTON (simple test)
  // =================================================
  createGreenButton(x, y, label, onClick) {
    const btn = this.add.image(0, 0, "ui", "button-green-single");
    btn.setInteractive({ useHandCursor: true });

    const text = this.add
      .bitmapText(0, 2, "smallFont", label, 14)
      .setOrigin(0.5);

    const container = this.add.container(x, y, [btn, text]);

    btn.on("pointerdown", () => {
      container.setScale(0.95);
    });

    btn.on("pointerup", () => {
      container.setScale(1);
      onClick?.();
    });

    btn.on("pointerout", () => {
      container.setScale(1);
    });

    this.ui.add(container);
    return container;
  }
}
