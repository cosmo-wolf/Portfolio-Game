# Quick Reference Guide

## File Overview

| File | Purpose | Size | Key Exports |
|------|---------|------|-------------|
| `index.html` | DOM structure, canvas, terminal | ~1KB | N/A |
| `css/style.css` | Retro styling, glassmorphism | ~5KB | CSS variables |
| `js/engine.js` | Game loop, input, commands | ~8KB | GameEngine |
| `js/entity.js` | Player class, animations | ~3KB | Player |
| `js/world.js` | Tile map, collision, rendering | ~7KB | World |
| `js/ui.js` | Terminal commands, UI mgmt | ~4KB | CommandParser, UIManager |
| **Total** | **Production-ready engine** | **~30KB** | **Vanilla JS** |

## Key Concepts

### Game Loop
```
60fps target
├─ Input polling (WASD, T, ?)
├─ State update (if not terminal)
│  └─ Player movement validation
├─ Tile rendering (viewport culling)
├─ Player rendering (center of screen)
└─ Next frame request
```

### Coordinate Systems
- **Grid Coordinates**: `(gridX, gridY)` - Tile-based, integer values
- **Screen Coordinates**: Pixels relative to canvas
- **World Coordinates**: Grid × 16px per tile

### State Management
- **Player State**: Position (grid), direction, animation frame
- **World State**: Tile map, structures, collision data
- **Terminal State**: Active/inactive, command history
- **Engine State**: Running, paused, frame count

## Common Tasks

### Add a New Command
**File**: `js/ui.js` → `CommandParser.getHelpText()`

```javascript
case "yourcommand":
  result = "Your response here";
  break;
```

### Change Player Speed
**File**: `js/entity.js` → `const ANIMATION_SPEED`

```javascript
const ANIMATION_SPEED = 0.15; // Slower walking
const ANIMATION_SPEED = 0.05; // Faster walking
```

### Resize World
**File**: `js/world.js` → `World.constructor(width, height)`

```javascript
new World(30, 24); // 30×24 tile world
```

### Modify Tile Colors
**File**: `js/world.js` → `renderTile()` method

```javascript
ctx.fillStyle = "#2a5a2a"; // Change to your color
```

### Change Terminal Style
**File**: `css/style.css` → `:root` CSS variables

```css
:root {
  --color-text: #00ff00;  /* Green text */
  --color-bg: #0a0a0a;    /* Dark background */
}
```

## API Reference

### GameEngine
```javascript
new GameEngine()
  .update(dt)              // Called each frame
  .render()                // Draw frame
  .executeCommand(cmd)     // Parse & run command
  .toggleTerminal()        // Show/hide
  .destroy()               // Cleanup
```

### Player
```javascript
new Player(gridX, gridY)
  .update(dt, movement, world)  // Move & animate
  .render(ctx, x, y)            // Draw sprite
  .warpTo(gridX, gridY)         // Teleport
  .getGridPosition()            // Get location
```

### World
```javascript
new World(width, height)
  .getTile(gridX, gridY)        // Get tile object
  .isColliding(gridX, gridY)    // Check collision
  .render(ctx, player, w, h)    // Draw visible area
  .setTile(gridX, gridY, type)  // Place tile
  .getNearbyStructures()        // Find POIs
```

### CommandParser
```javascript
new CommandParser()
  .getHelpText()        // All commands
  .getAboutText()       // Developer info
  .getProjectsText()    // Portfolio
  .parseCommand(input)  // Parse input
  .addToHistory(cmd)    // Save command
```

## Keyboard Events

### Supported Keys
- `KeyW`, `KeyA`, `KeyS`, `KeyD` - WASD movement
- `ArrowUp`, `ArrowLeft`, `ArrowDown`, `ArrowRight` - Arrow movement
- `KeyT` - Toggle terminal
- `Slash` (?) - Toggle terminal (alt)

### Input Handling
```javascript
const movement = this.input.getMovement();
// Returns { x: -1|0|1, y: -1|0|1 }

if (this.input.wasPressed("KeyT")) {
  // T was pressed this frame
}
```

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| FPS | 60 | Stable, consistent |
| Frame Time | 16.67ms | Max 40ms (25fps minimum) |
| Memory | <5MB | Game state only |
| CPU | <5% | Modern hardware baseline |
| Bundle | 30KB | Minified JS |

## Debugging Tips

### Enable FPS Counter
```javascript
// In engine.js render()
ctx.fillStyle = "#0f0";
ctx.font = "8px monospace";
ctx.fillText(`FPS: ${Math.round(1/dt)}`, 10, 10);
```

### Log Player Position
```javascript
console.log(`Player: ${player.gridX}, ${player.gridY}`);
```

### Check Collision at Tile
```javascript
const canWalk = !world.isColliding(x, y);
console.log(`Tile (${x},${y}): ${canWalk ? "walkable" : "blocked"}`);
```

### Profile Rendering
```javascript
const t0 = performance.now();
this.render();
const t1 = performance.now();
console.log(`Render: ${(t1-t0).toFixed(2)}ms`);
```

## Color Palette

```css
Terminal Green   #00ff00
Terminal Dim     #00aa00
Success          #37d742
Error            #ff4444
Background       #0a0a0a
Grass            #2a5a2a
Grass Light      #3a7a3a
House            #8b4513
Tree Dark        #2d5a2d
Tree Stem        #1a3a1a
```

## Common Errors & Fixes

### "Cannot read property 'getContext' of null"
- Canvas element not found
- Check `id="gameCanvas"` in HTML

### "Player not responding to input"
- Event listeners not attached
- Check `setupEventListeners()` is called
- Verify key codes match: `KeyW`, not `w`

### "Sprites appear blurry"
- `image-rendering: pixelated` not applied
- Check CSS is loaded
- Verify integer scaling (not fractional)

### "Terminal input not working"
- Input element not focused
- Check keyboard events aren't preventDefault'd
- Verify input ID: `terminalInput`

## Development Workflow

1. **Edit Code** → Changes to .js/.css files
2. **Refresh Browser** → F5 or Ctrl+R
3. **Check Console** → F12 → Console tab
4. **Test Features** → Play the game, use terminal
5. **Commit to Git** → `git add .` → `git commit`

## Optimization Checklist

- [ ] Sprites are 16×16 pixels
- [ ] No console errors on load
- [ ] FPS stable at 60
- [ ] Terminal toggles smoothly
- [ ] Player movement is responsive
- [ ] No memory leaks (check DevTools)
- [ ] Asset files exist in correct paths

## Resources

- **MDN Canvas**: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- **JavaScript.info**: https://javascript.info/
- **Game Loop Pattern**: https://gameprogrammingpatterns.com/game-loop.html
- **Pixel Art Tutorials**: Brackeys, Heartbeast (YouTube)

## Version Info

- **Engine**: 1.0
- **Target**: Vanilla JS, no dependencies
- **Browsers**: Chrome, Firefox, Safari, Mobile Safari
- **License**: Free for portfolio use

## Contact & Attribution

- **Developer**: Cosmo Wolf
- **Skills**: Python, JavaScript, Game Dev
- **Assets**: Sprout Lands by Cup Nooble
- **Fonts**: Press Start 2P (Google Fonts)

---

**Quick Reference v1.0** | Last Updated: Feb 14, 2026
