/**
 * BasePanel
 * ---------
 * Base class for all UI panels.
 * Handles visibility only.
 */
export class BasePanel {
  constructor(scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setScrollFactor(0);
    this.hide();
  }

  show() {
    this.container.setVisible(true);
    this.container.setActive(true);
  }

  hide() {
    this.container.setVisible(false);
    this.container.setActive(false);
  }
}
