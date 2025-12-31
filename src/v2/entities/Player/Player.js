import { resolveProfile } from "../digimon/resolveProfile.js";
import { PlayerBody } from "./PlayerBody.js";
import { PlayerVisual } from "./PlayerVisual.js";
import { PlayerInput } from "./PlayerInput.js";
import { StateMachine } from "../../systems/StateMachine.js";
import { GroundStates } from "../common/states/groundStates.js";

export class Player extends Phaser.GameObjects.Container {
  constructor(scene, x, y, textureKey) {
    super(scene, x, y);
    scene.add.existing(this);

    this.key = textureKey;
    this.profile = resolveProfile(textureKey);

    this.bodyLayer = new PlayerBody(scene, this, this.profile);
    this.visual = new PlayerVisual(scene, this, textureKey, this.profile);
    this.inputHandler = new PlayerInput(scene);

    this.state = new StateMachine(this, "idle", GroundStates);
  }

  update(dt) {
    this.inputHandler.update(this);
    this.state.update(dt);
  }
}
