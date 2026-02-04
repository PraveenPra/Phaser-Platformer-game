export const GameState = {
  // currently active digimon key
  selectedDigimon: null, // base form at checkpoint
  currentForm: null, // runtime only (DO NOT persist on death)
  checkpoint: {
    scene: "Start",
    x: 200,
    y: 350,
  },

  playerProgression: {
    level: 1,
    maxHpBonus: 0,
    attackBonus: 0,
    defenseBonus: 0,
  },

  dataShards: {
    count: 0,
    _listeners: new Set(),

    _notify() {
      this._listeners.forEach((cb) => cb(this.count));
    },

    subscribe(cb) {
      this._listeners.add(cb);
    },

    // helper to increment
    add(value = 1) {
      this.count += value;
      this._notify();
    },

    // optional helper to set absolute value
    set(value) {
      this.count = value;
      this._notify();
    },
  },

  // base forms the player can switch to
  unlockedBaseForms: new Set(["agumon", "gabumon", "patamon"]),

  // evolutions the player has unlocked
  unlockedEvolutions: new Set([
    "imperialdramon",
    "birdramon",
    "seraphimon",
    "patamon",
  ]),

  audio: {
    musicEnabled: true,
    sfxEnabled: true,
    musicVolume: 0.01,
    sfxVolume: 0.7,
  },
};
