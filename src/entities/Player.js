import { IdleState } from "./states/IdleState.js";
import { RunState } from "./states/RunState.js";
import { JumpState } from "./states/JumpState.js";
import { AttackState } from "./states/AttackState.js";

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, textureKey) {
    super(scene, x, y, textureKey);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setScale(2);
    this.setOrigin(0.5, 1); // Set origin to bottom center so legs align with ground

    //add after physics body is created
    // This does:Smaller collision box.Anchors collision to lower body (legs)
    this.body.setSize(this.width * 0.4, this.height * 1.4);

    this.body.setOffset(this.width * 0.1, this.height * 0.2);

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
