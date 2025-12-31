export class PlayerVisual {
  constructor(scene, owner, textureKey, profile) {
    this.sprite = scene.add.sprite(0, profile.visual.yOffset, textureKey);

    this.sprite.setOrigin(profile.visual.originX, profile.visual.originY);

    owner.add(this.sprite);
    this.sprite.play(`${textureKey}_idle`);
  }

  play(key) {
    if (this.sprite.anims.currentAnim?.key === key) return;
    this.sprite.play(key);
  }

  flip(left) {
    this.sprite.setFlipX(left);
  }
}
