import { UIElement } from "../core/UIElement.js";
import { UISliceBox } from "./UISliceBox.js";

/**
 * UIButton
 * --------
 * Anchored button (icon or 9-slice).
 */
export class UIButton extends UIElement {
  constructor(scene, config = {}) {
    super(scene, config);

    const fontType = this.getFontForText(config?.text || "");

    const {
      text = "",
      width = 8, // tiles
      height = 4, // tiles
      style = "green",
      tileSize = 14,
      font = fontType || "smallFont",
      fontSize = 38,
      iconOnly = false,
      onClick,
    } = config;

    if (iconOnly) {
      const icon = scene.add
        .image(0, 0, "ui", "button-green-single")
        .setOrigin(0)
        .setInteractive({ useHandCursor: true });

      icon.on("pointerup", () => onClick?.());
      this.add(icon);

      this.setSize(icon.width, icon.height);
      return;
    }

    const frames = {
      green: {
        tl: "button-green-top-left",
        t: "button-green-top",
        tr: "button-green-top-right",
        l: "button-green-left",
        c: "button-green-center",
        r: "button-green-right",
        bl: "button-green-bottom-left",
        b: "button-green-bottom",
        br: "button-green-bottom-right",
      },
    };

    new UISliceBox(
      scene,
      this.container,
      width,
      height,
      "ui",
      frames[style],
      tileSize,
    );

    const wPx = width * tileSize;
    const hPx = height * tileSize;

    this.label = scene.add
      .bitmapText(wPx / 2, hPx / 2 + 1, font, text, fontSize)
      .setOrigin(0.5, 0.5);
    this.add(this.label);

    this.container.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, wPx, hPx),
      Phaser.Geom.Rectangle.Contains,
    );

    this.container.on("pointerdown", () => this.container.setScale(0.96));
    this.container.on("pointerup", () => {
      this.container.setScale(1);
      onClick?.();
    });
    this.container.on("pointerout", () => this.container.setScale(1));

    this.setSize(wPx, hPx);
  }

  getFontForText(text) {
    return /^[A-Z0-9\s]+$/.test(text) ? "bigFont" : "smallFont";
  }

  setText(text) {
    this.label.setText(text);
  }
}
