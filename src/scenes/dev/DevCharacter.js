class DevCharacter extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key, profile) {
    super(scene, x, y);
    scene.add.existing(this);

    this.key = key;
    this.profile = Phaser.Utils.Objects.DeepCopy(profile);

    this.bodyLayer = new CharacterBody(scene, this, this.profile);
    this.visual = new CharacterVisual(scene, this, key, this.profile);

    this.currentAnim = "idle";
    this.currentFrameIndex = 0;

    this.playAnim("idle");
  }

  playAnim(name) {
    const key = `${this.key}_${name}`;
    this.currentAnim = name;
    this.visual.play(key);
  }

  stepFrame(dir = 1) {
    const anim = this.visual.sprite.anims.currentAnim;
    if (!anim) return;

    this.currentFrameIndex =
      (this.currentFrameIndex + dir + anim.frames.length) % anim.frames.length;

    this.visual.sprite.anims.pause();
    this.visual.sprite.anims.setCurrentFrame(
      anim.frames[this.currentFrameIndex],
    );
  }
}
