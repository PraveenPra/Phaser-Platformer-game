/**
 * UIScale
 * Central place for UI scaling logic (like CSS media queries)
 *
 * Base design resolution: 960x540
 */

export function getUIScale(scene) {
  const w = scene.scale.width;
  const h = scene.scale.height;

  // Mobile (phones)
  if (w <= 600) {
    return {
      scale: 1.25,
      font: 1.2,
      padding: 1.3,
    };
  }

  // Tablet
  if (w <= 1024) {
    return {
      scale: 1.1,
      font: 1.05,
      padding: 1.1,
    };
  }

  // Desktop / Laptop
  return {
    scale: 1,
    font: 1,
    padding: 1,
  };
}
