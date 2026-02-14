# Documentation

## 1. System Overview

The engine is split into four runtime modules:

1. `ThemeManager` (`js/theme.js`)
2. `World` + `Structure` (`js/world.js`)
3. `Avatar` (`js/entity.js`)
4. `Engine` (`js/engine.js`)

All rendering is procedural Canvas 2D to minimize asset loading.

## 2. Theme & Global State

`ThemeManager` owns global visual/game state:

- `biome`: `JUNGLE | CITY`
- `time`: `DAY | NIGHT`
- `terminalMode`: `ECO_LIGHT | MATRIX_DARK`

### Public methods

- `toggleBiome()`
- `toggleTime()`
- `toggleTerminalMode()`
- `getWorldTheme()`
- `isNight()`

`Engine` reads these values every frame and updates:
- World render palette
- HUD CSS variables
- Terminal skin classes
- Avatar biome mode

## 3. World & Structures

`World` defines interactable structures:

- `MONOLITH`
- `CODE_RUIN_A` (A* pathfinding ghost)
- `CODE_RUIN_B` (messy HTML -> clean JSON stream)
- `PORTAL_GATE` (biome switch)
- `TERMINAL_GATE` (digital dive transition)

### Interaction flow

1. `Engine` finds nearest structure in radius.
2. UI prompt displays `Press [F] ...`.
3. On `F`, `Engine.handleStructureInteraction()` routes action.

## 4. Avatar & Physics

`Avatar` supports biome-specific forms:

- Jungle:
  - `TORTOISE`: higher inertia, lower speed
  - `JAGUAR`: high acceleration and speed
- City:
  - `CYBER`: drift-oriented handling (low-friction turning feel)

Physics are frame-rate independent using `dt` from rAF.

## 5. Engine Loop

`Engine.tick(ts)`:

1. Compute `dt` (clamped for stability)
2. Update (input, avatar, world, camera, interactions)
3. Render (world -> structures -> avatar -> overlays)
4. Queue next `requestAnimationFrame`

Camera uses follow lag:
- `camera.x += (targetX - camera.x) * smooth`
- `camera.y += (targetY - camera.y) * smooth`

## 6. Terminal Transition & Modes

### Transition

`startTerminalTransition()`:

1. Starts timed transition state
2. Draws zoom/fade/glitch-like overlay during transition
3. Mounts terminal UI at completion

### Terminal skins

- `ECO_LIGHT`:
  - Background: `#fdfdf5`
  - Text: `#4a5d23`
- `MATRIX_DARK`:
  - Background: `#000000`
  - Text: `#00FF41`
  - CRT scanlines + matrix glyph overlay

## 7. Extending the Project

### Add a new structure type

1. Add a `Structure(...)` instance in `World` constructor.
2. Add drawing function in `World.drawStructure(...)`.
3. Add action routing in `Engine.handleStructureInteraction(...)`.

### Add a terminal command

In `Engine.executeTerminalCommand(raw)` add a new branch:

```js
else if (raw === "my-command") {
  this.pushTerminalLine("...");
}
```

### Add a new theme axis

1. Extend theme maps in `js/theme.js`.
2. Add state + toggles in `ThemeManager`.
3. Apply in `Engine.applyCssTheme()` and render paths.
