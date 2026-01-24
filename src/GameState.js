export const GameState = {
  // currently active digimon key
  selectedDigimon: null,

  // base forms the player can switch to
  unlockedBaseForms: new Set(["agumon", "gabumon", "patamon"]),

  // evolutions the player has unlocked
  unlockedEvolutions: new Set([
    // "greymon",
    // "birdramon",
    "seraphimon",
  ]),
};
