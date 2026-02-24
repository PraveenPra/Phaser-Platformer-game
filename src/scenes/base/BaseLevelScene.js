import { registerGlobalAnimations } from "/src/systems/animations/AnimationRegistry.js";

export class BaseLevelScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  create() {
    registerGlobalAnimations(this);
  }
}
