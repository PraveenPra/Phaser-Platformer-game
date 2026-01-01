export class PlayerBody {
  constructor(scene, owner, profile) {
    scene.physics.add.existing(owner);

    this.body = owner.body;
    this.body.setSize(profile.body.width, profile.body.height);
    this.body.setOffset(profile.body.offsetX, profile.body.offsetY);
    this.body.setGravityY(profile.body.gravityY);
    this.body.setCollideWorldBounds(true);
  }
}
