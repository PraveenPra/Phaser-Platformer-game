import { AudioManager } from "/src/systems/AudioManager.js";
import { GameState } from "/src/GameState.js";

export class DataShardSystem {
  static setup(scene) {
    if (!scene.player || !scene.dataShards) return;

    scene.physics.add.overlap(
      scene.player,
      scene.dataShards,
      DataShardSystem.collect,
      null,
      scene,
    );
  }

  static collect(player, shard) {
    if (!shard || !shard.active) return;

    const value = shard.getData("value") || 1;

    shard.destroy();

    AudioManager.playSFX(player.scene, "sfx-collect-shard");
    GameState.dataShards.add(value);
  }
}
