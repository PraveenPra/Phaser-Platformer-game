/**
 * UISliceBox
 * ----------
 * Low-level 9-slice renderer.
 * Does NOT control layout or position.
 * Draws into a provided container.
 */
export class UISliceBox {
  constructor(
    scene,
    container,
    tilesWide,
    tilesHigh,
    atlasKey,
    frames,
    tileSize,
  ) {
    this.scene = scene;
    this.container = container;
    this.tileSize = tileSize;
    this.atlasKey = atlasKey;
    this.frames = frames;

    this.draw(tilesWide, tilesHigh);
  }

  draw(w, h) {
    const t = this.tileSize;
    const f = this.frames;

    for (let row = 0; row < h; row++) {
      for (let col = 0; col < w; col++) {
        let frame = f.c;

        if (row === 0 && col === 0) frame = f.tl;
        else if (row === 0 && col === w - 1) frame = f.tr;
        else if (row === h - 1 && col === 0) frame = f.bl;
        else if (row === h - 1 && col === w - 1) frame = f.br;
        else if (row === 0) frame = f.t;
        else if (row === h - 1) frame = f.b;
        else if (col === 0) frame = f.l;
        else if (col === w - 1) frame = f.r;

        const img = this.scene.add
          .image(col * t, row * t, this.atlasKey, frame)
          .setOrigin(0);

        this.container.add(img);
      }
    }
  }
}
