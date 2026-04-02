export class CharacterVisual {
  constructor(scene, owner, textureKey, profile) {
    this.textureKey = textureKey;
    this.profile = profile;

    this.baseYOffset = 0;
    this.baseXOffset = 0;

    this.sprite = scene.add.sprite(
      this.baseXOffset,
      this.baseYOffset,
      textureKey,
    );

    owner.add(this.sprite);

    this.play(`${textureKey}_idle`);
  }

  play(key) {
    if (!this.sprite.anims) return;
    if (!this.sprite.anims.animationManager.exists(key)) return;

    if (this.sprite.anims.currentAnim?.key === key) return;

    const animName = key.replace(`${this.textureKey}_`, "");

    this.sprite.y = this.baseYOffset;
    this.sprite.play(key);
  }

  flip(left) {
    this.sprite.setFlipX(left);
  }

  onAnimComplete(key, callback) {
    this.sprite.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + key,
      callback,
    );
  }
}
