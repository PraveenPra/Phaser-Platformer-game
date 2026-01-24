export function playDataScanFX({
  scene,
  sourceSprite,
  direction = "up", // "up" | "down"
  color = 0x00ff88,
  duration = 900, // ⏱️ SLOW FOR DEBUG
  onComplete,
}) {
  const parent = sourceSprite.parentContainer;

  // ✅ WORLD POSITION FIX
  const worldX = parent ? parent.x + sourceSprite.x : sourceSprite.x;
  const worldY = parent ? parent.y + sourceSprite.y : sourceSprite.y;

  const clone = scene.add.sprite(
    worldX,
    worldY,
    sourceSprite.texture.key,
    sourceSprite.frame.name,
  );

  clone.setOrigin(sourceSprite.originX, sourceSprite.originY);
  clone.setFlipX(sourceSprite.flipX);
  clone.setDepth(sourceSprite.depth + 5);
  clone.setTintFill(color);
  clone.setAlpha(0.85);

  const maskGfx = scene.make.graphics({ add: false });
  const mask = maskGfx.createGeometryMask();
  clone.setMask(mask);

  const h = clone.displayHeight;
  const w = clone.displayWidth;

  const progress = { value: direction === "up" ? 0 : h };

  scene.tweens.add({
    targets: progress,
    value: direction === "up" ? h : 0,
    duration,
    ease: "Linear",

    onUpdate: () => {
      maskGfx.clear();
      maskGfx.fillStyle(0xffffff);

      if (direction === "up") {
        maskGfx.fillRect(
          worldX - w / 2,
          worldY + h / 2 - progress.value,
          w,
          progress.value,
        );
      } else {
        maskGfx.fillRect(worldX - w / 2, worldY - h / 2, w, progress.value);
      }
    },

    onComplete: () => {
      clone.clearMask(true);
      clone.destroy();
      maskGfx.destroy();
      onComplete?.();
    },
  });
}
