import { UIElement } from "../core/UIElement.js";
import { UISliceBox } from "./UISliceBox.js";

/**
 * UIPanel
 * -------
 * Anchored, responsive 9-slice panel.
 */
export class UIPanel extends UIElement {
  constructor(scene, config = {}) {
    super(scene, config);

    const {
      width = 6, // tiles
      height = 4, // tiles
      style = "green",
      tileSize = 32,
    } = config;

    const frames = {
      green: {
        tl: "panel-green-top-left",
        t: "panel-green-top",
        tr: "panel-green-top-right",
        l: "panel-green-left",
        c: "panel-green-center",
        r: "panel-green-right",
        bl: "panel-green-bottom-left",
        b: "panel-green-bottom",
        br: "panel-green-bottom-right",
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

    this.setSize(width * tileSize, height * tileSize);
  }
}
