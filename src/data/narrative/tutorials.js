export const Tutorials = {
  INTRO: {
    key: "intro",
    type: "narration",
    text: "The Digital World evolves endlessly...\n\nBut something new is watching.",
    mode: "blocking", // 🔒 locks input
    duration: 3500,
  },

  MOVE: {
    key: "tutorial-move",
    type: "tutorial",
    text: "Use ← → to move",
    once: true,
    duration: 2500,
  },

  JUMP: {
    key: "tutorial-jump",
    type: "tutorial",
    text: "Press SPACE to jump",
    once: true,
  },

  DOUBLE_JUMP: {
    key: "tutorial-double-jump",
    type: "tutorial",
    text: "Jump again in mid-air!",
    once: true,
  },
};
