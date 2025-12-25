export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, textureKey) {
    super(scene, x, y, textureKey);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setScale(2);

    this.speed = 200;
    this.jumpPower = 420;
  }

  update(cursors) {
    if (cursors.left.isDown) {
      this.setVelocityX(-this.speed);
      this.setFlipX(true);
      this.play(`${this.texture.key}_run`, true);
    } else if (cursors.right.isDown) {
      this.setVelocityX(this.speed);
      this.setFlipX(false);
      this.play(`${this.texture.key}_run`, true);
    } else {
      this.setVelocityX(0);
      this.play(`${this.texture.key}_idle`, true);
    }

    if (cursors.up.isDown && this.body.onFloor()) {
      this.setVelocityY(-this.jumpPower);
      this.play(`${this.texture.key}_jump`, true);
    }
  }
}
