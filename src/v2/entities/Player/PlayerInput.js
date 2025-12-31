export class PlayerInput {
  constructor(scene) {
    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  update(entity) {
    entity.input = {
      left: this.cursors.left.isDown,
      right: this.cursors.right.isDown,
      jump: Phaser.Input.Keyboard.JustDown(this.cursors.space),
    };
  }
}
