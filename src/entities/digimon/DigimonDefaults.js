export const DIGIMON_DEFAULTS = {
  body: {
    width: 18,
    height: 24,
    offsetX: -9,
    offsetY: -12,
    gravityY: 900,
  },

  visual: {
    originX: 0.5,
    originY: 1,
    yOffset: -2,
    xOffset: 0,
  },

  move: {
    speed: 200,
    jump: 620,
    accel: 1200, // how fast you speed up
    decel: 1600, // how fast you slow down
    airAccel: 800,
    airDecel: 600,
    maxAirSpeed: 180,
  },

  combat: {
    maxHp: 30,
  },

  movement: {
    mode: "ground",
  },
};
