export class ReactionApplier {
  static apply(target, reaction, data = {}) {
    const body = target.bodyLayer.body;
    const source = data.source;

    // direction
    const dir =
      source && source.x !== undefined
        ? Math.sign(target.x - source.x) || 1
        : 1;

    // domain switch
    if (reaction.switchDomain && target.canAir) {
      target.movement?.switchDomain?.(reaction.switchDomain);
      body.setAllowGravity(true);
    }

    // force
    if (reaction.force) {
      body.setVelocity(reaction.force.x * dir, reaction.force.y);
      body.setDrag(40, 20);
    }

    // invincibility
    if (reaction.invincible) {
      target.isInvincible = true;
    }

    // FSM transition
    target.state.setState(reaction.state, {
      reaction,
      source,
    });
  }
}
