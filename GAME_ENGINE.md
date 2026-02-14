# Retro Pokémon-Style Portfolio Engine

A high-performance, vanilla JavaScript game engine featuring a tile-based world, player movement, and an interactive terminal overlay. Built entirely without external libraries.

## Features

### 🎮 Game Core
- **Tile-Based Map System**: 16x16 pixel tiles with collision detection
- **Player Controller**: WASD/Arrow key movement with 4-directional animation support
- **State Machine**: Walking animations (4 directions × 4 frames each)
- **Collision Detection**: Prevent player movement through obstacles (houses, trees)
- **Grid-Based Movement**: Classic Pokémon-style tile movement

### 💻 Terminal Interface
- **Glassmorphism Overlay**: Blurred background with modern styling
- **Command Parser**: Interactive console for portfolio information
- **Press Start 2P Font**: Retro typography for authentic 8-bit aesthetic
- **Non-blocking Input**: Terminal pauses game while open, smooth transitions

### 🎨 Retro Aesthetics
- **Pixel-Perfect Rendering**: Image smoothing disabled for crisp pixel art
- **16-Color Palette**: Classic retro color scheme
- **Sprout Lands Compatible**: Ready for 16x16 tilesets
- **Dark Terminal**: Matrix-style green-on-black interface with scanlines effect

## Architecture

### File Structure

```
E:\Codes\Portfolio\
├── index.html           # HTML structure with canvas and terminal
├── css/style.css       # Retro styling, glassmorphism, responsiveness
├── js/
│   ├── engine.js       # Main game loop, input handling, initialization
│   ├── entity.js       # Player class with animation system
│   ├── world.js        # Tile map, collision system, rendering
│   └── ui.js           # Terminal commands and UI management
├── assets/
│   └── sprites/
│       ├── character.png   # Player spritesheet (4 directions × 4 frames)
│       └── tileset.png     # Sprout Lands tileset
└── GAME_ENGINE.md      # This documentation
```

### Core Classes

#### **GameEngine** (engine.js)
Main orchestrator handling:
- Game loop with `requestAnimationFrame`
- Input processing (WASD/Arrow keys)
- Terminal overlay management
- Command parsing and execution
- Frame timing and delta-time calculation

**Key Methods:**
- `update(dt)` - Update game state
- `render()` - Render frame
- `executeCommand(cmd)` - Process terminal commands
- `toggleTerminal()` - Show/hide terminal

#### **Player** (entity.js)
Entity class managing:
- Grid-based position (tiles, not pixels)
- 4-directional animation state
- Movement validation against world collision
- Sprite rendering with animation frames

**Key Methods:**
- `update(dt, movement, world)` - Update player state
- `updateAnimation(dt)` - Animate walking frames
- `render(ctx, x, y)` - Draw player sprite
- `warpTo(gridX, gridY)` - Teleport player

#### **World** (world.js)
Tile map system providing:
- Tile generation and management
- Collision detection
- Viewport-based rendering optimization
- Structure placement (houses, obstacles)

**Key Methods:**
- `getTile(gridX, gridY)` - Get tile at position
- `isColliding(gridX, gridY)` - Check collision
- `render(ctx, player, width, height)` - Draw visible tiles
- `addRandomTrees(count)` - Generate obstacles

#### **CommandParser** (ui.js)
Terminal command system with:
- `help` - Show available commands
- `about` - Developer information (Cosmo Wolf)
- `projects` - Portfolio projects list
- `status` - Current player location
- `clear` - Clear terminal output

## Getting Started

### 1. Setup
```bash
cd E:\Codes\Portfolio
# No build step required - vanilla JavaScript!
# Simply open index.html in a modern browser
```

### 2. Prepare Assets
Place your Sprout Lands sprites in the assets folder:

```
assets/sprites/
├── character.png    # 64×16px (4 frames × 4 directions)
└── tileset.png      # Sprout Lands tileset (any size, indexed below code)
```

**Character Spritesheet Format:**
The character sprite should be organized as:
- **Width**: 4 frames × 16px = 64px
- **Height**: 4 directions × 16px = 64px
- **Layout**:
  - Row 0: Down direction (frames 0-3)
  - Row 1: Right direction (frames 0-3)
  - Row 2: Up direction (frames 0-3)
  - Row 3: Left direction (frames 0-3)

### 3. Start Playing
```bash
# Use local server for best results:
python -m http.server 8000
# Open: http://localhost:8000
```

## Controls

| Key | Action |
|-----|--------|
| **W** / **↑** | Move up |
| **A** / **←** | Move left |
| **S** / **↓** | Move down |
| **D** / **→** | Move right |
| **T** | Toggle terminal |
| **?** | Show help (same as T) |

## Terminal Commands

### `help`
Display available commands and keyboard controls.

### `about`
Show information about Cosmo Wolf:
- Skills and expertise
- Focus areas
- Contact information

### `projects`
List portfolio projects:
- Bar Scraper (Python web scraping)
- Portfolio Engine (this project)
- Data Pipeline (ETL automation)

### `status`
Show current player position:
```
Player at grid(8, 10) on grass
```

### `clear`
Clear all terminal output.

## Game Loop Flow

```
requestAnimationFrame
    ↓
GameEngine.tick(timestamp)
    ├─ Calculate deltaTime
    ├─ GameEngine.update(dt)      [if not terminal active]
    │   └─ Player.update(dt, movement, world)
    │       ├─ Validate movement
    │       ├─ Update grid position
    │       └─ Animate walking frame
    │
    ├─ GameEngine.render()
    │   ├─ Clear canvas
    │   ├─ World.render(player)    [viewport culling]
    │   │   └─ Render visible tiles
    │   └─ Player.render()         [center of screen]
    │
    └─ Request next frame
```

## Collision System

**How It Works:**
1. Player attempts movement in world coordinates
2. Calculate new grid position: `newX = gridX + movement.x`
3. Query world for collision: `world.isColliding(newX, newY)`
4. If clear, update player position; otherwise, stay in place

**Collision Types:**
- `GRASS` - Walkable (collision = false)
- `HOUSE` - Non-walkable structure (collision = true)
- `TREE` - Non-walkable obstacle (collision = true)
- `WATER` - Non-walkable (collision = true, optional)
- Out of bounds - Always collision

**Performance Optimization:**
Each tile stores a single `colliding` boolean flag, making collision checks O(1) time complexity.

## Animation System

### Walking Animation
- **Speed**: 0.1 seconds per frame (10 fps)
- **Frames**: 4 frames per direction
- **Looping**: Cycles continuously while moving

### Direction Handling
Movement input determines facing direction:
```javascript
if (x > 0) direction = DIRECTIONS.RIGHT;
else if (x < 0) direction = DIRECTIONS.LEFT;
else if (y > 0) direction = DIRECTIONS.DOWN;
else if (y < 0) direction = DIRECTIONS.UP;
```

### Frame Selection
Animation frame is calculated from:
```javascript
srcX = frameIndex * 16;  // 0-3 frames
srcY = direction * 16;   // 0-3 directions @ 16px each
```

## Performance Considerations

### Optimizations Implemented
✅ **Viewport Culling**: Only render visible tiles
✅ **Delta Time Clamping**: Cap max dt at 40ms (25 fps minimum)
✅ **Image Smoothing Disabled**: CSS `image-rendering: pixelated`
✅ **Context Reuse**: Single canvas context throughout
✅ **DPR Scaling**: Handle high-DPI displays efficiently
✅ **Deferred Rendering**: Batch tile draws before display
✅ **No External Libraries**: Vanilla JavaScript only

### Resource Usage (Target)
- **Memory**: < 5MB
- **CPU**: < 5% on modern hardware
- **FPS**: Stable 60fps target
- **Bundle Size**: ~15KB JavaScript (minified)

## Extending the Engine

### Add Custom Commands
Edit `js/ui.js` CommandParser class:

```javascript
case "mycommand":
  result = "My custom response";
  break;
```

### Add Structures
Edit `js/world.js` World class:

```javascript
addRandomTrees(count) {
  // Place obstacles on map
}
```

### Add New Tile Types
Define in `js/world.js` TILE_TYPES:

```javascript
const TILE_TYPES = {
  GRASS: "grass",
  HOUSE: "house",
  TREE: "tree",
  WATER: "water",
  SAND: "sand"  // New!
};
```

### Modify Player Animation
Edit `js/entity.js` Player class animation constants:

```javascript
const ANIMATION_SPEED = 0.1; // Slower = 0.15, Faster = 0.05
```

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome/Edge | ✅ Full support |
| Firefox | ✅ Full support |
| Safari | ✅ Full support |
| Mobile Safari | ✅ Full support (landscape mode recommended) |

**Requirements:**
- ES6+ JavaScript support
- Canvas 2D rendering context
- CSS Grid & Flexbox
- CSS backdropFilters (for glassmorphism blur)

## CSS Custom Properties

Customize colors via CSS variables in `:root`:

```css
:root {
  --color-text: #00ff00;           /* Terminal text */
  --color-text-dim: #00aa00;       /* Dimmed text */
  --color-success: #37d742;        /* Success messages */
  --color-error: #ff4444;          /* Error messages */
  --color-bg: #0a0a0a;             /* Background */
}
```

## Troubleshooting

### Player not moving
- Check input event listeners are attached
- Verify `world.isColliding()` isn't always returning true
- Check console for JavaScript errors

### Sprites not rendering
- Verify sprite paths in `entity.js` and `world.js`
- Check image dimensions match expected layout
- Confirm images are in correct format (PNG with transparency)

### Terminal not responding
- Ensure `#terminalInput` element exists in HTML
- Check CSS `.terminal-overlay.active` displays correctly
- Verify event listeners are bound (check `setupEventListeners()`)

### Performance issues
- Reduce map size in `World` constructor
- Disable complex background gradients
- Check for memory leaks in developer tools

## Resources

### Sprites
- **Sprout Lands Asset Pack**: [itch.io](https://cupnooble.itch.io/sprout-lands-character-pack)
- **Open Game Art**: Community-provided tilesets

### Fonts
- **Press Start 2P**: [Google Fonts](https://fonts.google.com/specimen/Press+Start+2P)

### References
- [Canvas API Docs](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [RequestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [Game Programming Patterns](https://gameprogrammingpatterns.com/)

## License

Free to use and modify for portfolio purposes. Credit to Sprout Lands asset creator appreciated.

## Credits

- **Engine**: Built vanilla JavaScript
- **Assets**: Sprout Lands by Cup Nooble
- **Inspiration**: Classic Pokémon games, retro game design
- **Portfolio**: Cosmo Wolf - Python Automation & Creative Developer

---

**Last Updated**: February 14, 2026
**Engine Version**: 1.0
**State**: Production Ready
