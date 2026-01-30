import { UIElement } from "../core/UIElement.js";
import { UISliceBox } from "./UISliceBox.js";
import { UIButton } from "./UIButton.js";
import { UIText } from "./UIText.js";

export class UISwitch extends UIElement {
  constructor(scene, config = {}) {
    super(scene, config);

    const {
      width = 12, // total width in tiles
      height = 4,
      tileSize = 14,
      label = "MUSIC",
      labelFontFace = "smallFont",
      valueFontFace = "bigFont",
      trueLabel = "ON",
      falseLabel = "OFF",
      value = false,
      style = "green",
      onToggle,
    } = config;

    this.value = value;
    this.onToggle = onToggle;
    this.baseLabel = label;

    // 9-slice background
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

    // Left label
    this.textLabel = new UIText(scene, {
      text: label,
      font: labelFontFace,
      anchor: "left",
    });
    this.textLabel.container.setPosition(6, hPx / 2); // padding from left
    this.add(this.textLabel.container);

    // ON/OFF button
    this.toggleBtn = new UIButton(scene, {
      text: value ? trueLabel : falseLabel,
      width: 4,
      height: 2,
      font: valueFontFace,
      onClick: () => this.toggle(),
    });
    this.toggleBtn.container.setPosition(
      wPx - this.toggleBtn.width - 3,
      (hPx - this.toggleBtn.height) / 2,
    );
    this.add(this.toggleBtn.container);

    this.setSize(wPx, hPx);
  }

  toggle() {
    this.value = !this.value;
    this.toggleBtn.setText(this.value ? "ON" : "OFF");
    this.onToggle?.(this.value);
  }
}
