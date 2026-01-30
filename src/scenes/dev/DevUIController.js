class DevUIController {
  constructor(scene, char, overlay) {
    this.scene = scene;
    this.char = char;
    this.overlay = overlay;

    this.keys = scene.input.keyboard.addKeys({
      left: "LEFT",
      right: "RIGHT",
      up: "UP",
      down: "DOWN",
      export: "P",
    });
  }

  update() {
    const body = this.char.bodyLayer.body;
    const v = this.char.profile.visual;

    if (Phaser.Input.Keyboard.JustDown(this.keys.left)) {
      this.char.stepFrame(-1);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.right)) {
      this.char.stepFrame(1);
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.export)) {
      console.log("EXPORT PROFILE ↓↓↓");
      console.log(JSON.stringify(this.char.profile, null, 2));
    }
  }
}
