export const ForestEnemySpawnConfig = {
  forest_basic: [
    {
      role: "grunt",
      digimons: ["botomon", "kunemon"],
      count: { min: 1, max: 3 },
      level: 1, // px horizontal spread
      ai: "guard",
    },
    {
      role: "elite",
      digimons: ["wormmon", "kunemon"],
      count: { min: 1, max: 1 },
      level: 1,
      ai: "guard",
    },
  ],

  forest_elite: [
    {
      role: "grunt",
      digimons: ["patamon"],
      count: { min: 2, max: 4 },
      level: 1,
      ai: "guard",
    },
    {
      role: "elite",
      digimons: ["ophanimon"],
      count: { min: 1, max: 2 },
      level: 1,
      ai: "guard",
    },
  ],

  swamp_poison: [
    {
      role: "boss",
      digimons: ["imperialdramon", "ophanimon"],
      count: { min: 1, max: 1 },
      level: 1,
      ai: "guard",
    },
  ],
};
