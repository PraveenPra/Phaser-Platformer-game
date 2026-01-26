/**
 * UIElement
 * ---------
 * Base class for all UI components.
 * Provides CSS-like anchor + margin positioning.
 *
 * Anchors:
 * center, top, bottom, left, right,
 * top-left, top-right, bottom-left, bottom-right
 *
 * Margins:
 * { top, right, bottom, left }
 */
export class UIElement {
  constructor(scene, config = {}) {
    this.scene = scene;

    this.anchor = config.anchor ?? "center";
    this.margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...(config.margin || {}),
    };

    this.container = scene.add.container(0, 0);
    this.container.setScrollFactor(0);

    this.width = 0;
    this.height = 0;

    this.applyAnchor();

    // 🔁 Responsive reposition
    scene.scale.on("resize", () => {
      this.applyAnchor();
    });
  }

  /**
   * Called AFTER size is known
   */
  setSize(w, h) {
    this.width = w;
    this.height = h;
    this.applyAnchor();
  }

  applyAnchor() {
    if (!this.width || !this.height) return;

    const cam = this.scene.cameras.main;
    let x = 0;
    let y = 0;

    switch (this.anchor) {
      case "center":
        x = cam.centerX - this.width / 2;
        y = cam.centerY - this.height / 2;
        break;

      case "top":
        x = cam.centerX - this.width / 2;
        y = 0;
        break;

      case "bottom":
        x = cam.centerX - this.width / 2;
        y = cam.height - this.height;
        break;

      case "left":
        x = 0;
        y = cam.centerY - this.height / 2;
        break;

      case "right":
        x = cam.width - this.width;
        y = cam.centerY - this.height / 2;
        break;

      case "top-left":
        x = 0;
        y = 0;
        break;

      case "top-right":
        x = cam.width - this.width;
        y = 0;
        break;

      case "bottom-left":
        x = 0;
        y = cam.height - this.height;
        break;

      case "bottom-right":
        x = cam.width - this.width;
        y = cam.height - this.height;
        break;
    }

    x += this.margin.left - this.margin.right;
    y += this.margin.top - this.margin.bottom;

    this.container.setPosition(x, y);
  }

  add(child) {
    this.container.add(child);
    return child;
  }

  setVisible(v) {
    this.container.setVisible(v);
  }
}
