import { MovementController } from "./MovementController.js";
import { GroundMovement } from "./GroundMovement.js";
import { AirMovement } from "./AirMovement.js";

export class MultiDomainMovement extends MovementController {
  /**
   * @param {Phaser.GameObjects.Container} entity
   * @param {object} config - { domains: ["ground","air"], default: "ground" }
   */
  constructor(entity, config) {
    super(entity);

    this.entity = entity;
    this.domains = {};
    this.activeDomain = config.default || config.domains[0];

    // Create instances for each domain
    for (const domain of config.domains) {
      switch (domain) {
        case "ground":
          this.domains.ground = new GroundMovement(entity);
          break;
        case "air":
          this.domains.air = new AirMovement(entity);
          break;
        default:
      }
    }
  }

  /** Switch active domain */
  switchDomain(domain) {
    if (this.domains[domain]) {
      this.activeDomain = domain;
      // Optional: reset velocities/accelerations
      const body = this.entity.bodyLayer.body;
      // body.setVelocity(0, 0);
      body.setAcceleration(0, 0);

      // Apply gravity settings for domain
      if (domain === "ground") body.setAllowGravity(true);
      else body.setAllowGravity(false);
    } else {
    }
  }

  /** Forward calls to the active domain */
  stop() {
    this.domains[this.activeDomain].stop();
  }

  moveHorizontal(dir) {
    this.domains[this.activeDomain].moveHorizontal(dir);
  }

  moveVertical(dir) {
    // Only exists in air/swim movement
    if (this.domains[this.activeDomain].moveVertical) {
      this.domains[this.activeDomain].moveVertical(dir);
    }
  }

  jump() {
    if (this.domains[this.activeDomain].jump) {
      this.domains[this.activeDomain].jump();
    }
  }

  airControl(dir) {
    if (this.domains[this.activeDomain].airControl) {
      this.domains[this.activeDomain].airControl(dir);
    }
  }
}
