export class ReactionApplier {
  static apply(target, reaction, data = {}) {
    const body = target.bodyLayer.body;
    const source = data.source;

    // Direction
    const dir =
      source && source.x !== undefined
        ? Math.sign(target.x - source.x) || 1
        : 1;

    // Switch to air if needed
    if (reaction.state === "launch" && target.canAir) {
      target.movement?.switchDomain?.("air");
      body.setAllowGravity(true);
    }

    // Apply launch force
    if (reaction.launch) {
      body.setVelocity(reaction.launch.x * dir, reaction.launch.y);

      body.setDrag(40, 20);
    }

    // Transition to FSM state
    target.state.setState(reaction.state, {
      reaction,
      source,
    });
  }
}
