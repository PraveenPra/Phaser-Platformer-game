import { IdleState } from "./states/IdleState.js";
import { RunState } from "./states/RunState.js";
import { JumpState } from "./states/JumpState.js";

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
    };

    this.currentState = null;
    this.setState("idle");
  }

  setState(name) {
    if (this.currentState === this.states[name]) return;
    this.currentState = this.states[name];
    this.currentState.enter(this);
  }

  update(cursors) {
    this.currentState.update(this, cursors);
  }

  playAnim(key) {
    if (this.anims.currentAnim?.key === key) return;
    this.play(key);
  }
}
