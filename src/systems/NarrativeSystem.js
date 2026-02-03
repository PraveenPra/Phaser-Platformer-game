import { NarrativeOverlay } from "/src/ui/NarrativeOverlay.js";

export class NarrativeSystem {
  constructor(scene) {
    this.scene = scene;
    this.overlay = new NarrativeOverlay(scene);

    this.queue = [];
    this.playing = false;
    this.seen = new Set();

    scene.events.on("narrative:trigger", this.enqueue, this);
  }

  enqueue(entry) {
    if (!entry || !entry.key) return;
    if (entry.once && this.seen.has(entry.key)) return;

    this.seen.add(entry.key);
    this.queue.push(entry);

    if (!this.playing) {
      this.playNext();
    }
  }

  playNext() {
    if (this.queue.length === 0) {
      this.playing = false;
      return;
    }

    this.playing = true;
    const entry = this.queue.shift();

    this.overlay.show(entry, () => this.playNext());
  }

  destroy() {
    this.scene.events.off("narrative:trigger", this.enqueue, this);
    this.overlay.destroy();
  }
}
