import { GameState } from "../GameState.js";
import { createAnimations } from "../systems/AnimationFactory.js";
import { resolveProfile } from "/src/entities/digimon/resolveProfile.js";
import { Character } from "../entities/common/Character.js";

export class DevCalibrationScene extends Phaser.Scene {
  constructor() {
    super("DevCalibrationScene");
  }

  create() {
    // 🔴 VISUAL CONTEXT
    this.cameras.main.setBackgroundColor("#2b2b2b");

    // 🔴 HARD-CODE FIRST (remove uncertainty)
    const key = GameState.selectedDigimon ?? "agumon";

    // 🔴 SAFETY CHECK
    if (!this.textures.exists(key)) {
      console.error("Texture not loaded:", key);
      return;
    }

    // 🔴 ENSURE ANIMS
    createAnimations(this, key);

    // 🔴 WORLD BOUNDS (important for physics containers)
    this.physics.world.setBounds(0, 0, 960, 540);

    // 🔴 SPAWN CHARACTER (same pattern as Start, minus tilemap)
    const profile = resolveProfile(key);
    this.character = new Character(this, 480, 360, key, profile, "idle");

    // 🔴 VERY IMPORTANT: make sure body exists
    this.character.body.setCollideWorldBounds(true);

    // 🔴 CAMERA
    this.cameras.main.centerOn(480, 360);

    // 🔴 DEBUG PHYSICS (PROVE BODY EXISTS)
    this.physics.world.drawDebug = true;
    // this.physics.world.debugGraphic.setAlpha(0.7);

    // 🔴 VISUAL ANCHOR (temporary)
    const originDot = this.add.circle(480, 360, 3, 0xff0000);
    originDot.setDepth(1000);

    console.log("DevCalibrationScene ready:", key);
  }

  update(_, dt) {
    this.character.update(dt);
  }
}
