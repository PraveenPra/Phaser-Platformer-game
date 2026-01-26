import { UIPanel, UIButton } from "./components/index.js";

export class UIFactory {
  constructor(scene) {
    this.scene = scene;
  }

  panel(x, y, w, h, style) {
    return new UIPanel(this.scene, x, y, w, h, style);
  }

  button(x, y, label, onClick, options) {
    return new UIButton(this.scene, x, y, label, onClick, options);
  }

  title(x, y, text) {
    return this.scene.add
      .bitmapText(x, y, "bigFont", text, 24)
      .setScrollFactor(0);
  }

  label(x, y, text) {
    return this.scene.add
      .bitmapText(x, y, "smallFont", text, 14)
      .setScrollFactor(0);
  }
}
