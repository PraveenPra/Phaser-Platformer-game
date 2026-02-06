export class PlayerInput {
  constructor(scene) {
    this.scene = scene;

    // keyboard
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
    this.attackSkill3 = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.V,
    );
    this.attackSkill4 = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.B,
    );
    this.switchKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.N,
    );
    this.evolveKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.M,
    );

    // mobile virtual buttons
    this.virtual = {
      left: false,
      right: false,
      jump: false,
      attackMain: false,
      attackSkill1: false,
      attackSkill2: false,
    };
  }

  update(entity) {
    entity.input = {
      left: this.cursors.left.isDown || this.virtual.left,
      right: this.cursors.right.isDown || this.virtual.right,
      up: this.cursors.up.isDown,
      down: this.cursors.down.isDown,
      jump:
        Phaser.Input.Keyboard.JustDown(this.cursors.space) ||
        this.consumeVirtual("jump"),
      attackMain:
        Phaser.Input.Keyboard.JustDown(this.attackMain) ||
        this.consumeVirtual("attackMain"),
      attackSkill1:
        Phaser.Input.Keyboard.JustDown(this.attackSkill1) ||
        this.consumeVirtual("attackSkill1"),
      attackSkill2:
        Phaser.Input.Keyboard.JustDown(this.attackSkill2) ||
        this.consumeVirtual("attackSkill2"),
      attackSkill3: Phaser.Input.Keyboard.JustDown(this.attackSkill3),
      attackSkill4: Phaser.Input.Keyboard.JustDown(this.attackSkill4),
      switchForm: Phaser.Input.Keyboard.JustDown(this.switchKey),
      evolve: Phaser.Input.Keyboard.JustDown(this.evolveKey),
    };
  }

  consumeVirtual(key) {
    if (this.virtual[key]) {
      this.virtual[key] = false;
      return true;
    }
    return false;
  }
}
