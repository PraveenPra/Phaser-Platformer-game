export function startWingFlap(e) {
  if (e._wingFlapSound) return;

  e._wingFlapSound = e.scene.sound.add("sfx-wing-flap", {
    loop: true,
    volume: 0.25,
  });

  e._wingFlapSound.play();
}

export function stopWingFlap(e) {
  if (!e._wingFlapSound) return;

  e._wingFlapSound.stop();
  e._wingFlapSound.destroy();
  e._wingFlapSound = null;
}
