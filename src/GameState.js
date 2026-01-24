export const GameState = {
  // currently active digimon key
  selectedDigimon: null, // base form at checkpoint
  currentForm: null, // runtime only (DO NOT persist on death)
  checkpoint: {
    scene: "Start",
    x: 200,
    y: 350,
  },

  playerStats: {
    maxHp: 100,
    hp: 100,
  },

  // base forms the player can switch to
  unlockedBaseForms: new Set(["agumon", "gabumon", "patamon"]),

  // evolutions the player has unlocked
  unlockedEvolutions: new Set([
    // "greymon",
    "birdramon",
    "seraphimon",
    "patamon",
  ]),
};
