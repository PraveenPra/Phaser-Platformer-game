export class UIStateManager {
  constructor(scene) {
    this.scene = scene;
    this.panels = {};
    this.active = null;
  }

  register(name, panel) {
    this.panels[name] = panel;
    panel.hide();
  }

  show(name) {
    if (this.active) {
      this.panels[this.active].hide();
    }
    this.panels[name].show();
    this.active = name;
  }

  hide() {
    if (!this.active) return;
    this.panels[this.active].hide();
    this.active = null;
  }

  isActive() {
    return this.active !== null;
  }
}
