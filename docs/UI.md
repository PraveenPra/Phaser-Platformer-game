# UI System (Anchor-based)

## Philosophy
UI uses CSS-like anchors + margins.
No manual centering math.

## Anchors
- center
- top / bottom / left / right
- corners

## Components
- UIPanel
- UIButton
- UISlider (planned)

## Examples
- Pause Menu
- HUD Layout

## PausePanel

### Purpose
Overlay pause menu displayed above gameplay.

### Structure
- Full-screen dark overlay
- Center-anchored UIPanel
- Title + action buttons

### Layout Rules
- Screen positioning via anchors only
- Panel contents positioned locally
- No direct use of camera width/height (except overlay)

### Components Used
- UIPanel
- UIButton

## HUDPanel

### Purpose
Always-visible gameplay HUD.

### Elements
- Player health (top-left)
- Pause button (top-right)
- Currency display (top-right offset)

### Rules
- Uses anchor-based positioning
- No absolute screen coordinates
- No overlays

---

## SettingsPanel

### Purpose
Settings overlay shown from pause menu.

### Structure
- Full-screen dark overlay
- Center-anchored UIPanel
- Local layout inside panel

### Navigation
- BACK → returns to PausePanel
