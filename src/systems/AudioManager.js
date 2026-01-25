import { GameState } from "/src/GameState.js";

let currentMusic = null;
let currentMusicKey = null;

export class AudioManager {
  // =================================================
  // SFX (fire-and-forget)
  // =================================================
  static playSFX(scene, key, config = {}) {
    if (!GameState.audio.sfxEnabled) return;

    scene.sound.play(key, {
      volume: (config.volume ?? 1) * GameState.audio.sfxVolume,
      rate: config.rate ?? 1,
      detune: config.detune ?? 0,
    });
  }

  // =================================================
  // MUSIC (persistent + resumable)
  // =================================================
  static playMusic(scene, key) {
    currentMusicKey = key;

    // IMPORTANT: resume sound system if paused
    scene.sound.resumeAll();

    if (!currentMusic) {
      currentMusic = scene.sound.add(key, {
        loop: true,
        volume: GameState.audio.musicVolume,
      });
    }

    currentMusic.setVolume(GameState.audio.musicVolume);

    if (GameState.audio.musicEnabled) {
      if (!currentMusic.isPlaying) {
        currentMusic.play();
      }
    } else {
      if (currentMusic.isPlaying) {
        currentMusic.stop();
      }
    }

    return currentMusic;
  }

  // =================================================
  // Stop music (explicit)
  // =================================================
  static stopMusic(scene) {
    if (!currentMusic) return;

    currentMusic.stop();
  }

  // =================================================
  // Toggles (used by Settings)
  // =================================================
  static toggleMusic(scene, key) {
    GameState.audio.musicEnabled = !GameState.audio.musicEnabled;

    // Always re-sync state
    this.playMusic(scene, key);
  }

  static setMusicVolume(scene, volume) {
    GameState.audio.musicVolume = Phaser.Math.Clamp(volume, 0, 1);
    if (currentMusic) {
      currentMusic.setVolume(GameState.audio.musicVolume);
    }
  }

  static setSFXVolume(volume) {
    GameState.audio.sfxVolume = Phaser.Math.Clamp(volume, 0, 1);
  }
}
