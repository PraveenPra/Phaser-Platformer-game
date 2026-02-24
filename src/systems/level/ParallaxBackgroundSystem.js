export class ParallaxBackgroundSystem {
  constructor(scene, config) {
    this.scene = scene;
    this.layers = [];

    const cam = scene.cameras.main;

    config.forEach((cfg) => {
      const img = scene.textures.get(cfg.key).getSourceImage();

      const bg = scene.add.tileSprite(
        0,
        cam.height - img.height,
        cam.width,
        img.height,
        cfg.key,
      );

      bg.setOrigin(0, 0);
      bg.setScrollFactor(0);
      bg.setDepth(cfg.depth);

      const scale = cfg.scale ?? 1.25;
      bg.setScale(scale);

      // stick to bottom after scaling
      bg.y = cam.height - bg.displayHeight;

      bg.parallaxFactor = cfg.factor;

      this.layers.push(bg);
    });
  }

  update() {
    const camX = this.scene.cameras.main.scrollX;

    for (const bg of this.layers) {
      bg.tilePositionX = camX * bg.parallaxFactor;
    }
  }

  destroy() {
    this.layers.forEach((bg) => bg.destroy());
    this.layers.length = 0;
  }
}
