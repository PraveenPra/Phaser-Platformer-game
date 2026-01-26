import { UIElement } from "../core/UIElement.js";

export class UIText extends UIElement {
  constructor(scene, config = {}) {
    super(scene, config);

    const {
      text = "",
      fontSize = 38,
      font = "smallFont",
      color = 0xffffff,
      anchor = "center",
    } = config;

    this.text = text;
    this.fontSize = fontSize;
    this.font = font;

    this.label = scene.add
      .bitmapText(0, 0, font, text, fontSize)
      .setOrigin(0.5);
    if (color !== undefined) this.label.setTint(color);

    this.add(this.label);
    this.setSize(this.label.width, this.label.height);
    this.anchor = anchor;
    this.applyAnchor();
  }

  setText(text) {
    this.text = text;

    // auto font logic
    const fontType = /^[A-Z0-9\s:]+$/.test(text) ? "bigFont" : "smallFont";
    this.label.setFont(fontType); // ✅ set font first

    this.label.setText(text); // then set text
    this.setSize(this.label.width, this.label.height);
  }
}
