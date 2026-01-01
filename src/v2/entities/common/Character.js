import { CharacterBody } from "./CharacterBody.js";
import { CharacterVisual } from "./CharacterVisual.js";
import { StateMachine } from "../../systems/StateMachine.js";

export class Character extends Phaser.GameObjects.Container {
  constructor(scene, x, y, textureKey, profile, states, initialState) {
    super(scene, x, y);
    scene.add.existing(this);

    this.key = textureKey;
    this.profile = profile;

    this.bodyLayer = new CharacterBody(scene, this, profile);
    this.visual = new CharacterVisual(scene, this, textureKey, profile);

    this.state = new StateMachine(this, initialState, states);
  }

  update(dt) {
    this.state.update(dt);
  }
}
