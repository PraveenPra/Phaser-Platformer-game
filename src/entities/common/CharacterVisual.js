export class CharacterVisual {
  constructor(scene, owner, textureKey, profile) {
    this.textureKey = textureKey;
    this.profile = profile;

    this.baseYOffset = profile.visual.yOffset ?? 0;
    this.animOffsets = profile.visual.anims ?? {};

    this.sprite = scene.add.sprite(0, this.baseYOffset, textureKey);
    this.sprite.setOrigin(profile.visual.originX, profile.visual.originY);

    owner.add(this.sprite);

    this.play(`${textureKey}_idle`);
  }

  play(key) {
    if (this.sprite.anims.currentAnim?.key === key) return;

    const animName = key.replace(`${this.textureKey}_`, "");
    const animYOffset = this.animOffsets[animName] ?? 0;

    this.sprite.y = this.baseYOffset + animYOffset;
    this.sprite.play(key);
  }

  flip(left) {
    this.sprite.setFlipX(left);
  }
}
