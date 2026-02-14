# Multi-Biome Portfolio Engine

A modular, procedural Canvas portfolio engine with:
- Dual biomes: `JUNGLE` and `CITY`
- Dynamic time states: `DAY` and `NIGHT`
- Dual terminal modes: `ECO_LIGHT` and `MATRIX_DARK`
- Interactive structures (monoliths, code ruins, portal gate, terminal gate)
- Smooth camera + delta-time game loop via `requestAnimationFrame`

## Project Structure

```text
Portfolio/
  index.html
  css/
    style.css
  js/
    engine.js
    world.js
    entity.js
    theme.js
```

## Core Modules

- `js/engine.js`: Main loop, input, camera, interactions, terminal transition, command handling.
- `js/world.js`: Structure system + procedural world rendering + code ruin animations.
- `js/entity.js`: Avatar movement, biome-specific physics, and procedural avatar rendering.
- `js/theme.js`: Global `ThemeManager` for biome/time/terminal state.
- `css/style.css`: HUD + terminal styling (including scanlines and matrix overlays).

## Controls

- `W A S D`: Move
- `Space`: Sprint
- `F`: Interact with nearby structure
- `T`: Toggle day/night
- `L`: Toggle terminal skin

## Terminal Commands

- `help`
- `ls`
- `python sentinel.py`
- `theme --toggle`

## Local Run (Quick)

This is a static project. Open with any static server:

```powershell
# Option 1: Python
python -m http.server 5500

# Option 2: Node (if installed)
npx serve .
```

Then open `http://localhost:5500` (or the port printed by your server).

## Full Docs

- Architecture and internals: `DOCUMENTATION.md`
- Local setup details: `SETUP.md`
- Vercel deployment: `README.vercel.md`
