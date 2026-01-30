import { GameState } from "../GameState.js";
import { createAnimations } from "../systems/AnimationFactory.js";
import { resolveProfile } from "/src/entities/digimon/resolveProfile.js";
import { Character } from "../entities/common/Character.js";

export class DevCalibrationScene extends Phaser.Scene {
  constructor() {
    super("DevCalibrationScene");
    this.frameCursor = 0;
    this.currentAnimKey = null;
    this.editStep = 1; // base step size
    this.currentAttackKey = null;
  }

  create() {
    // 🔴 VISUAL CONTEXT
    this.cameras.main.setBackgroundColor("#ff9dad"); // light gray
    this.physics.world.drawDebug = false;

    // ─────────────────────────────────────────────
    // UI CAMERA (screen space, no zoom)
    // ─────────────────────────────────────────────
    this.uiCam = this.cameras.add(0, 0, 960, 540);
    this.uiCam.setScroll(0, 0);
    this.uiCam.setZoom(1);

    // 🔴 HARD-CODE FIRST (remove uncertainty)
    const key = GameState.selectedDigimon ?? "agumon";

    // 🔴 SAFETY CHECK
    if (!this.textures.exists(key)) {
      console.error("Texture not loaded:", key);
      return;
    }

    // 🔴 ENSURE ANIMS
    createAnimations(this, key);

    // 🔴 WORLD BOUNDS (important for physics containers)
    this.physics.world.setBounds(0, 0, 960, 540);

    // 🔴 SPAWN CHARACTER (same pattern as Start, minus tilemap)
    const profile = resolveProfile(key);
    this.character = new Character(this, 480, 360, key, profile, "idle");

    // 🔴 VERY IMPORTANT: make sure body exists
    this.character.body.setCollideWorldBounds(true);

    // 🔴 CAMERA
    this.cameras.main.centerOn(480, 360);

    // 🔴 DEBUG PHYSICS (PROVE BODY EXISTS)
    this.physics.world.drawDebug = true;
    // this.physics.world.debugGraphic.setAlpha(0.7);

    // 🔴 VISUAL ANCHOR (temporary)
    const originDot = this.add.circle(480, 360, 3, 0xff0000);
    originDot.setDepth(1000);

    console.log("DevCalibrationScene ready:", key);

    // ─────────────────────────────────────────────
    // STEP 1: Freeze physics (stable calibration)
    // ─────────────────────────────────────────────
    this.character.body.setAllowGravity(false);
    this.character.body.setVelocity(0, 0);
    this.character.body.moves = false;
    // ─────────────────────────────────────────────
    // Editable BODY profile (source of truth)
    // ─────────────────────────────────────────────
    this.editBody = this.character.profile.body;

    // safety defaults
    this.editBody.width ??= 32;
    this.editBody.height ??= 48;
    this.editBody.offsetX ??= 0;
    this.editBody.offsetY ??= 0;
    this.applyBodyFromProfile();

    // ─────────────────────────────────────────────
    // STEP 2: Debug graphics (we draw everything ourselves)
    // ─────────────────────────────────────────────
    this.debugGfx = this.add.graphics();
    this.debugGfx.setDepth(1000);
    this.gridSize = 16;
    this.showGrid = true;

    // ─────────────────────────────────────────────
    // STEP 3: Animation switching
    // ─────────────────────────────────────────────
    this.input.keyboard.on("keydown-A", () => {
      this.playAnim("idle");
    });

    this.input.keyboard.on("keydown-S", () => {
      this.playAnim("run");
    });

    this.input.keyboard.on("keydown-D", () => {
      this.playAnim("jump");
    });

    this.input.keyboard.on("keydown-F", () => {
      this.playAnim("fly");
    });

    // ─────────────────────────────────────────────
    // STEP 5: Pause / resume animation
    // ─────────────────────────────────────────────
    this.input.keyboard.on("keydown-SPACE", () => {
      const sprite = this.character.visual.sprite;

      if (sprite.anims.isPaused) {
        sprite.anims.resume();
      } else {
        sprite.anims.pause();
      }
    });

    // ─────────────────────────────────────────────
    // STEP 6: Frame stepping
    // ─────────────────────────────────────────────
    this.input.keyboard.on("keydown-RIGHT", () => {
      this.stepFrame(1);
    });

    this.input.keyboard.on("keydown-LEFT", () => {
      this.stepFrame(-1);
    });

    // ─────────────────────────────────────────────
    // Attack list from profile
    // ─────────────────────────────────────────────
    this.attackKeys = Object.keys(this.character.profile.attacks || {});
    this.attackIndex = 0;

    const atk = this.character.profile.attacks[this.currentAttackKey];

    if (atk?.type === "projectile") {
      drawMuzzle(atk.projectile);
    }

    if (atk?.type === "melee") {
      drawHitbox(atk.hitbox);
    }

    // ─────────────────────────────────────────────
    // Cycle attacks
    // ─────────────────────────────────────────────

    this.input.keyboard.on("keydown-Z", () => {
      this.currentAttackKey = "main";
      this.playAnim("attack-A");
    });

    this.input.keyboard.on("keydown-X", () => {
      this.currentAttackKey = "skill1";
      this.playAnim("attack-B");
    });

    this.input.keyboard.on("keydown-C", () => {
      this.currentAttackKey = "skill2";
      this.playAnim("attack-C");
    });

    this.input.keyboard.on("keydown-V", () => {
      this.currentAttackKey = "skill3";
      this.playAnim("attack-D");
    });
    this.input.keyboard.on("keydown-B", () => {
      this.currentAttackKey = "skill4";
      this.playAnim("attack-E");
    });

    this.input.keyboard.on("keydown", (e) => {
      if (!e.altKey) return; // 🔑 ALT is mandatory for editing

      const b = this.editBody;
      const step = e.ctrlKey || e.metaKey ? 1 : this.editStep;

      // ── OFFSET EDIT ─────────────────────────
      if (!e.shiftKey) {
        if (e.key === "ArrowLeft") b.offsetX -= step;
        if (e.key === "ArrowRight") b.offsetX += step;
        if (e.key === "ArrowUp") b.offsetY -= step;
        if (e.key === "ArrowDown") b.offsetY += step;
      }

      // ── SIZE EDIT ───────────────────────────
      if (e.shiftKey) {
        if (e.key === "ArrowLeft") b.width = Math.max(2, b.width - step);
        if (e.key === "ArrowRight") b.width += step;
        if (e.key === "ArrowUp") b.height = Math.max(2, b.height - step);
        if (e.key === "ArrowDown") b.height += step;
      }

      // ── SAVE PROFILE ────────────────────────
      if (e.key === "Enter") {
        console.log("✅ BODY PROFILE SAVE:");
        console.log(JSON.stringify(this.character.profile.body, null, 2));
      }
    });

    this.input.keyboard.on("keydown", (e) => {
      if (!e.ctrlKey) return;
      if (!this.currentAttackKey) return;

      const atk = this.character.profile.attacks[this.currentAttackKey];
      if (!atk) return;

      const step = e.shiftKey ? this.editStep : this.editStep;

      // ───────────────────────────────
      // PROJECTILE → MUZZLE EDIT
      // ───────────────────────────────
      if (atk.type === "projectile" && atk.projectile) {
        const p = atk.projectile;

        if (!e.shiftKey) {
          if (e.key === "ArrowLeft") p.offsetX -= step;
          if (e.key === "ArrowRight") p.offsetX += step;
          if (e.key === "ArrowUp") p.offsetY -= step;
          if (e.key === "ArrowDown") p.offsetY += step;
        }
      }

      // ───────────────────────────────
      // MELEE → HITBOX EDIT
      // ───────────────────────────────
      if (atk.type === "melee" && atk.hitbox) {
        const h = atk.hitbox;

        if (!e.shiftKey) {
          if (e.key === "ArrowLeft") h.offsetX -= step;
          if (e.key === "ArrowRight") h.offsetX += step;
          if (e.key === "ArrowUp") h.offsetY -= step;
          if (e.key === "ArrowDown") h.offsetY += step;
        } else {
          if (e.key === "ArrowLeft") h.width = Math.max(2, h.width - step);
          if (e.key === "ArrowRight") h.width += step;
          if (e.key === "ArrowUp") h.height = Math.max(2, h.height - step);
          if (e.key === "ArrowDown") h.height += step;
        }
      }
    });

    // ─────────────────────────────────────────────
    // Debug text (profile values)
    // ─────────────────────────────────────────────

    this.debugText = this.add
      .text(10, 10, "", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#000000",
        backgroundColor: "#ffffff",
        padding: { x: 6, y: 4 },
      })
      .setScrollFactor(0) // 🔑 critical
      .setDepth(10000); // 🔑 above everything

    this.gridText = this.add
      .text(0, 0, "", {
        fontFamily: "monospace",
        fontSize: "10px",
        color: "#000000",
      })
      .setDepth(999)
      .setAlpha(0.6);

    this.debugText.setDepth(10000);

    // 🔑 THIS IS THE KEY LINE
    this.cameras.main.ignore(this.debugText);
    this.uiCam.ignore(this.character);
    this.uiCam.ignore(this.debugGfx);

    const test = this.add.text(300, 200, "DEBUG TEXT OK", {
      fontSize: "24px",
      color: "#ff0000",
      backgroundColor: "#ffffff",
    });

    test.setDepth(99999);
    this.cameras.main.ignore(test);

    this.playAnim("idle");
  }
  stepFrame(dir) {
    if (!this.currentAnimKey) return;

    const sprite = this.character.visual.sprite;
    const anim = this.anims.get(this.currentAnimKey);
    if (!anim) return;

    const frames = anim.frames;

    this.frameCursor += dir;

    if (this.frameCursor < 0) {
      this.frameCursor = frames.length - 1;
    }
    if (this.frameCursor >= frames.length) {
      this.frameCursor = 0;
    }

    sprite.anims.pause();
    sprite.setFrame(frames[this.frameCursor].frame.name);
  }

  playAnim(animKey) {
    const sprite = this.character.visual.sprite;
    const fullKey = `${this.character.key}_${animKey}`;

    const anim = this.anims.get(fullKey);
    if (!anim) {
      console.warn("Animation not found:", fullKey);
      return;
    }

    this.currentAnimKey = fullKey;
    this.frameCursor = 0;

    sprite.anims.play(fullKey, true);
  }
  applyBodyFromProfile() {
    const body = this.character.body;
    const b = this.editBody;

    body.setSize(b.width, b.height);
    body.setOffset(b.offsetX, b.offsetY);
  }

  update(_, dt) {
    this.character.update(dt);
    this.applyBodyFromProfile();

    // ─────────────────────────────────────────────
    // STEP 8: Draw calibration visuals
    // ─────────────────────────────────────────────
    this.debugGfx.clear();

    const atk =
      this.currentAttackKey &&
      this.character.profile.attacks[this.currentAttackKey];

    if (atk?.type === "projectile") {
      this.drawMuzzle(atk.projectile);
    }

    if (atk?.type === "melee") {
      const fireFrames = (atk.fireFrames || []).map((f) => f - 1);

      const sprite = this.character.visual.sprite;
      const frameIndex = sprite.anims.currentFrame?.index;

      const isActive = fireFrames.includes(frameIndex);

      this.drawHitbox(atk.hitbox, isActive);
    }

    // Physics body
    const body = this.character.body;
    this.debugGfx.lineStyle(2, 0x00ff00);
    this.debugGfx.strokeRect(body.x, body.y, body.width, body.height);

    // Sprite origin (pivot)
    const sprite = this.character.visual.sprite;
    const m = sprite.getWorldTransformMatrix();

    if (this.showGrid) {
      const cam = this.cameras.main;
      const g = this.debugGfx;

      g.lineStyle(1, 0x000000, 0.15);

      for (let x = 0; x < 960; x += this.gridSize) {
        g.strokeLineShape(new Phaser.Geom.Line(x, 0, x, 540));
      }

      for (let y = 0; y < 540; y += this.gridSize) {
        g.strokeLineShape(new Phaser.Geom.Line(0, y, 960, y));
      }
    }

    this.debugGfx.lineStyle(1, 0xff0000);
    this.debugGfx.strokeLineShape(
      new Phaser.Geom.Line(m.tx - 6, m.ty, m.tx + 6, m.ty),
    );
    this.debugGfx.strokeLineShape(
      new Phaser.Geom.Line(m.tx, m.ty - 6, m.tx, m.ty + 6),
    );

    // const body = this.character.body;
    const profileBody = this.character.profile.body || {};

    this.debugText.setText([
      `EDIT MODE:`,
      ` Arrows      → move body`,
      ` Shift+Arrows→ resize body`,
      ` Ctrl        → fine adjust`,
      ` Enter       → log profile`,
      ` G           → toggle grid`,
      ``,

      `ANIM: ${this.currentAnimKey}`,
      `FRAME: ${this.frameCursor}`,
      ``,
      `BODY (PROFILE):`,
      `  width : ${profileBody.width}`,
      `  height: ${profileBody.height}`,
      `  offsetX: ${profileBody.offsetX}`,
      `  offsetY: ${profileBody.offsetY}`,
      ``,
      `BODY (LIVE):`,
      `  x: ${body.x.toFixed(1)}`,
      `  y: ${body.y.toFixed(1)}`,
      `  w: ${body.width}`,
      `  h: ${body.height}`,
      "",
      "EDIT MODE:",
      "CTRL + Arrows        → move muzzle / hitbox",
      "CTRL + SHIFT + Arrows→ resize hitbox",
      "",
      `ATTACK: ${this.currentAttackKey ?? "none"}`,
      `TYPE: ${atk?.type ?? "-"}`,
    ]);

    if (profileBody.width) {
      this.debugGfx.lineStyle(1, 0x0000ff, 0.8);
      this.debugGfx.strokeRect(
        body.x + profileBody.offsetX,
        body.y + profileBody.offsetY,
        profileBody.width,
        profileBody.height,
      );
    }
    this.gridText.setText(`Grid: ${this.gridSize}px\nOrigin: (0,0)`);

    if (this.showGrid) {
      this.debugGfx.fillStyle(0x000000, 0.4);
      for (let x = 0; x < 960; x += this.gridSize * 4) {
        this.debugGfx.fillText?.(`${x}`, x + 2, 12);
      }
    }
  }

  drawMuzzle(projectile) {
    if (!projectile) return;

    const sprite = this.character.visual.sprite;
    const m = sprite.getWorldTransformMatrix();

    const x = m.tx + projectile.offsetX * sprite.scaleX;
    const y = m.ty + projectile.offsetY * sprite.scaleY;

    // yellow dot = muzzle
    this.debugGfx.fillStyle(0xffd400, 1);
    this.debugGfx.fillCircle(x, y, 3);

    // line from origin to muzzle
    this.debugGfx.lineStyle(1, 0xffd400, 0.6);
    this.debugGfx.strokeLineShape(new Phaser.Geom.Line(m.tx, m.ty, x, y));
  }

  drawHitbox(hitbox, isActive) {
    if (!hitbox) return;

    const sprite = this.character.visual.sprite;
    const m = sprite.getWorldTransformMatrix();

    const x = m.tx + hitbox.offsetX * sprite.scaleX - hitbox.width / 2;
    const y = m.ty + hitbox.offsetY * sprite.scaleY - hitbox.height / 2;

    this.debugGfx.lineStyle(
      2,
      isActive ? 0xff0000 : 0xaa0000,
      isActive ? 1 : 0.4,
    );

    this.debugGfx.strokeRect(x, y, hitbox.width, hitbox.height);
  }
}
