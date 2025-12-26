export class EnemyBase extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, textureKey) {
    super(scene, x, y, textureKey);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setScale(2);

    this.maxHp = 3;
    this.hp = this.maxHp;
    this.isDead = false;

    // ✅ PLAY IDLE ANIMATION IMMEDIATELY
    // ✅ IMPORTANT: play idle animation
    this.play(`${textureKey}_idle`);
  }

  takeDamage(amount) {
    if (this.isDead) return;

    this.hp -= amount;

    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.disableBody(true, true);
  }
}
