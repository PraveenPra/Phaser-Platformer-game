export class PlayerInput {
  constructor(scene) {
    this.cursors = scene.input.keyboard.createCursorKeys();

    this.attackMain = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.Z,
    );
    this.attackSkill1 = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.X,
    );
    this.attackSkill2 = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.C,
    );
    this.switchKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.V,
    );

    this.evolveKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.B,
    );
  }

  update(entity) {
    entity.input = {
      left: this.cursors.left.isDown,
      right: this.cursors.right.isDown,
      up: this.cursors.up.isDown,
      down: this.cursors.down.isDown,
      jump: Phaser.Input.Keyboard.JustDown(this.cursors.space),
      attackMain: Phaser.Input.Keyboard.JustDown(this.attackMain),
      attackSkill1: Phaser.Input.Keyboard.JustDown(this.attackSkill1),
      attackSkill2: Phaser.Input.Keyboard.JustDown(this.attackSkill2),
      switchForm: Phaser.Input.Keyboard.JustDown(this.switchKey),
      evolve: Phaser.Input.Keyboard.JustDown(this.evolveKey),
    };
  }
}
