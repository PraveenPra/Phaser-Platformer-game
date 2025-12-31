import { DIGIMON_DEFAULTS } from "./DigimonDefaults.js";
import { DIGIMON_PROFILES } from "./DigimonProfiles.js";

export function resolveProfile(key) {
  const specific = DIGIMON_PROFILES[key] || {};

  return {
    body: { ...DIGIMON_DEFAULTS.body, ...specific.body },
    visual: { ...DIGIMON_DEFAULTS.visual, ...specific.visual },
    move: { ...DIGIMON_DEFAULTS.move, ...specific.move },
    combat: { ...DIGIMON_DEFAULTS.combat, ...specific.combat },
  };
}
