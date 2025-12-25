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
      main: { anim: "attack-A", duration: 280 },
      skill1: { anim: "attack-B", duration: 300 },
      skill2: { anim: "attack-C", duration: 360 },
    };
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
}
