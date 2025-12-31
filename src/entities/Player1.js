import { IdleState } from "./states/IdleState.js";
import { RunState } from "./states/RunState.js";
import { JumpState } from "./states/JumpState.js";
import { AttackState } from "./states/AttackState.js";

export class Player1 extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, textureKey) {
    super(scene, x, y, textureKey);

    this.sprite = scene.add.sprite(0, 0, textureKey);
    this.sprite.setOrigin(1); // bottom-center feet lock
    this.add(this.sprite);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setScale(2);

    this.body.setSize(
      this.body.width,
      this.body.height,
      this.width * 0.5 - this.body.width * 0.5,
      this.height * 0.5 - this.body.height * 0.5
    );

    this.speed = 200;
    this.jumpPower = 420;

    this.states = {
      idle: new IdleState(),
      run: new RunState(),
      jump: new JumpState(),
      attack: new AttackState(),
    };

    this.currentState = null;
    this.setState("idle");

    this.attackKeys = {
      main: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
      skill1: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
      skill2: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
    };

    this.attacks = {
      main: { anim: "attack-A", unlocked: true },
      skill1: { anim: "attack-B", unlocked: false },
      skill2: { anim: "attack-C", unlocked: false },
    };

    //disable after testing
    this.attacks.skill1.unlocked = true;
    this.attacks.skill2.unlocked = true;
  }

  setState(name, data = null) {
    if (this.currentState === this.states[name]) return;
    this.currentState = this.states[name];
    this.currentState.enter(this, data);
  }

  update(cursors) {
    this.currentState.update(this, cursors);

    console.log(
      `W:${this.width} H:${this.height} --- Size - ${this.width * 0.4}x ${
        this.height * 0.4
      }(${this.body.width}, ${this.body.height})  --- Offset - ${
        this.width * 0.3
      }, ${this.height * 0.6} (${this.body.offset.x}, ${this.body.offset.y})`
    );
  }

  playAnim(key) {
    if (this.anims.currentAnim?.key === key) return;
    this.play(key);
  }

  canUseAttack(key) {
    return this.attacks[key]?.unlocked;
  }

  spawnAttackHitbox(hitboxData, damage = 1) {
    const xOffset = this.flipX ? -hitboxData.offsetX : hitboxData.offsetX;

    const hitbox = this.scene.physics.add.sprite(
      this.x + xOffset,
      this.y + hitboxData.offsetY,
      null
    );

    hitbox.body.setSize(hitboxData.width, hitboxData.height);
    hitbox.body.allowGravity = false;
    hitbox.setVisible(false);

    hitbox.damage = damage;
    hitbox.owner = this;

    // ✅ ADD TO HITBOX GROUP
    this.scene.attackHitboxes.add(hitbox);

    this.scene.time.delayedCall(60, () => hitbox.destroy());
  }
}
