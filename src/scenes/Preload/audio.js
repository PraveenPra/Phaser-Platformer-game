export const audioFiles = [
  { key: "sfx-blast-hit", path: "assets/sfx/shoot.mp3" },
  { key: "sfx-wing-flap", path: "assets/sfx/wing-flap.wav" },
  { key: "sfx-evolution", path: "assets/sfx/evolution.wav" },
  { key: "sfx-collect-shard", path: "assets/sfx/pick-a-coin.wav" },
  { key: "sfx-level-complete", path: "assets/sfx/level-completion.wav" },
  { key: "sfx-hurt", path: "assets/sfx/hurt-flinch.mp3" },
  { key: "sfx-gameover", path: "assets/sfx/game-over.wav" },
  { key: "sfx-bg-music-1", path: "assets/sfx/BG-MUSIC3.wav" },
];

export function loadAudio(scene) {
  audioFiles.forEach((a) => {
    scene.load.audio(a.key, a.path);
  });
}
