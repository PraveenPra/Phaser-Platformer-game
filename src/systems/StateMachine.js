export class StateMachine {
  constructor(owner, initialState, states) {
    this.owner = owner;
    this.states = states;
    this.current = null;

    this.setState(initialState);
  }

  setState(name, data) {
    // ❌ never leave dead state
    if (this.current === "dead") return;

    if (this.current === name) return;

    if (this.current && this.states[this.current]?.exit) {
      this.states[this.current].exit(this.owner);
    }

    this.current = name;

    if (this.states[name]?.enter) {
      this.states[name].enter(this.owner, data);
    }
  }

  update(dt) {
    if (!this.current) return;

    const state = this.states[this.current];
    if (state?.update) {
      state.update(this.owner, dt);
    }
  }
}
