import { GameState } from "/src/GameState.js";

let persistentMusic = null; // Persistent game-level music
let persistentKey = null;

let activeSceneMusic = null; // Scene or situation-specific music
let activeSceneKey = null;

export class AudioManager {
  // =================================================
  // SFX (fire-and-forget, respects SFX settings)
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
  // Persistent Game Music (background music)
  // =================================================
  static playPersistentMusic(scene, key) {
    persistentKey = key;

    if (!persistentMusic || persistentMusic.destroyed) {
      persistentMusic = scene.sound.add(key, {
        loop: true,
        volume: GameState.audio.musicVolume,
      });
    }

    if (GameState.audio.musicEnabled) {
      if (!persistentMusic.isPlaying) persistentMusic.play();
    } else {
      if (persistentMusic.isPlaying) persistentMusic.stop();
    }

    persistentMusic.setVolume(GameState.audio.musicVolume);
    return persistentMusic;
  }

  static stopPersistentMusic(fadeOutMs = 0) {
    if (!persistentMusic || persistentMusic.destroyed) return;

    if (fadeOutMs > 0) {
      persistentMusic.stop(fadeOutMs);
    } else {
      persistentMusic.stop();
    }
  }

  static setPersistentVolume(volume) {
    GameState.audio.musicVolume = Phaser.Math.Clamp(volume, 0, 1);
    if (persistentMusic && !persistentMusic.destroyed) {
      persistentMusic.setVolume(GameState.audio.musicVolume);
    }
  }

  static togglePersistentMusic(scene) {
    GameState.audio.musicEnabled = !GameState.audio.musicEnabled;
    if (persistentKey) this.playPersistentMusic(scene, persistentKey);
  }

  // =================================================
  // Scene or Situation Music (temporary, can overlay)
  // =================================================
  static playSceneMusic(
    scene,
    key,
    { volume = 1, loop = true, fadeInMs = 500 } = {},
  ) {
    // Stop previous scene music
    if (activeSceneMusic && !activeSceneMusic.destroyed) {
      activeSceneMusic.stop();
    }

    activeSceneKey = key;
    activeSceneMusic = scene.sound.add(key, { loop, volume: 0 });

    // Fade in scene music
    activeSceneMusic.play();
    scene.tweens.add({
      targets: activeSceneMusic,
      volume: volume * GameState.audio.musicVolume,
      duration: fadeInMs,
    });

    return activeSceneMusic;
  }

  static stopSceneMusic(scene, fadeOutMs = 500) {
    if (!activeSceneMusic || activeSceneMusic.destroyed) return;

    if (fadeOutMs > 0) {
      scene.tweens.add({
        targets: activeSceneMusic,
        volume: 0,
        duration: fadeOutMs,
        onComplete: () => activeSceneMusic.stop(),
      });
    } else {
      activeSceneMusic.stop();
    }

    activeSceneMusic = null;
    activeSceneKey = null;
  }

  // =================================================
  // Resync persistent music on scene change
  // =================================================
  static syncPersistentMusic(scene) {
    if (persistentKey) this.playPersistentMusic(scene, persistentKey);
  }

  // =================================================
  // Global SFX & Music volume
  // =================================================
  static setSFXVolume(volume) {
    GameState.audio.sfxVolume = Phaser.Math.Clamp(volume, 0, 1);
  }

  static setMusicVolume(volume) {
    GameState.audio.musicVolume = Phaser.Math.Clamp(volume, 0, 1);
    if (persistentMusic && !persistentMusic.destroyed) {
      persistentMusic.setVolume(GameState.audio.musicVolume);
    }
    if (activeSceneMusic && !activeSceneMusic.destroyed) {
      activeSceneMusic.setVolume(GameState.audio.musicVolume);
    }
  }

  static toggleSFX() {
    GameState.audio.sfxEnabled = !GameState.audio.sfxEnabled;
  }

  static toggleMusic(scene) {
    GameState.audio.musicEnabled = !GameState.audio.musicEnabled;
    if (persistentKey) this.playPersistentMusic(scene, persistentKey);
    if (activeSceneKey) this.playSceneMusic(scene, activeSceneKey);
  }
}
