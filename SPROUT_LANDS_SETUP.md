# Sprout Lands Asset Integration Guide

This guide explains how to prepare and integrate Sprout Lands assets into your retro portfolio engine.

## Asset Structure

```
assets/
├── sprites/
│   ├── character.png       # Player character spritesheet
│   ├── tileset.png         # World tileset
│   ├── ui/                 # Optional UI elements
│   └── sfx/                # Sound effects (future)
```

## Character Spritesheet Setup

### Expected Format
- **Filename**: `assets/sprites/character.png`
- **Dimensions**: 64×64 pixels (minimum)
- **Layout**: 4 columns (frames) × 4 rows (directions)
- **Tile Size**: 16×16 pixels each

### Spritesheet Layout

```
                Frame 0   Frame 1   Frame 2   Frame 3
Direction 0     [  ↓  ]  [  ↓  ]  [  ↓  ]  [  ↓  ]  (DOWN)
Direction 1     [  →  ]  [  →  ]  [  →  ]  [  →  ]  (RIGHT)
Direction 2     [  ↑  ]  [  ↑  ]  [  ↑  ]  [  ↑  ]  (UP)
Direction 3     [  ←  ]  [  ←  ]  [  ←  ]  [  ←  ]  (LEFT)
```

### Creating from Sprout Lands

If using the Sprout Lands Character Pack:

1. **Extract the character sprite** you want (farmer, girl, etc.)
2. **Create a new 64×64 image** with transparency
3. **Arrange the 4 directions** × **4 frames** as shown above:
   - Copy the down-facing walk animation (4 frames) → Row 0
   - Copy the right-facing walk animation (4 frames) → Row 1
   - Copy the up-facing walk animation (4 frames) → Row 2
   - Copy the left-facing walk animation (4 frames) → Row 3
4. **Save as PNG** in `assets/sprites/character.png`

### Tools for Editing
- **Aseprite** (Paid, Professional)
- **Piskel** (Free, Web-based)
- **Krita** (Free, Powerful)
- **GIMP** (Free, Feature-rich)

## Tileset Setup

### Expected Format
- **Filename**: `assets/sprites/tileset.png`
- **Tile Size**: 16×16 pixels
- **Layout**: Any arrangement (referenced by sprite index)
- **Format**: PNG with transparency

### Sprout Lands Tileset

The Sprout Lands asset pack includes complete tilesets for:
- Grass terrain
- Water
- Paths
- Structures
- Vegetation

### Organization Tips

Create tiles in this order for easy indexing:
```
Index 0: Grass tile (default, walkable)
Index 1: House/Structure (non-walkable)
Index 2: Tree (non-walkable)
Index 3+: Additional terrain/decorations
```

### Map Rendering

The engine renders tiles based on their type:

```javascript
switch (tile.type) {
  case TILE_TYPES.GRASS:
    // Green grass pattern
    break;
  case TILE_TYPES.HOUSE:
    // Brown house tiles
    break;
  case TILE_TYPES.TREE:
    // Dark tree sprite
    break;
}
```

### To Use Custom Tileset Graphics

Modify `js/world.js` in the `renderTile()` method:

```javascript
renderTile(ctx, tile, screenX, screenY) {
  if (this.tileSet && this.tileSet.complete) {
    // Calculate source from spritesheet
    const tileCol = (tile.spriteIndex % 16); // Assumes 16 tiles per row
    const tileRow = Math.floor(tile.spriteIndex / 16);
    const srcX = tileCol * TILE_SIZE;
    const srcY = tileRow * TILE_SIZE;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      this.tileSet,
      srcX, srcY,
      TILE_SIZE, TILE_SIZE,
      screenX, screenY,
      TILE_SIZE, TILE_SIZE
    );
  } else {
    // Fallback: solid color rectangles
    // (see current implementation)
  }
}
```

## Asset Optimization

### Image Compression
- Use **PNG format** with optimization tools:
  ```bash
  # Using pngquant
  pngquant --ext .png assets/sprites/*.png
  ```
  - Target: < 50KB per spritesheet

### Sprite Packing
For larger games, consider sprite atlases:
- Combine multiple spritesheets into one
- Reduces HTTP requests and memory usage
- Update tile rendering math accordingly

## Performance Checklist

- [ ] Character sprite is exactly 64×64 pixels
- [ ] Tileset sprite has transparent background
- [ ] Images are in PNG format with alpha channel
- [ ] File sizes are optimized (pngquant, etc.)
- [ ] Images are placed in correct directories
- [ ] No console errors when loading
- [ ] Sprites render crisp without blurring

## Asset Download Links

### Sprout Lands Official
- **Itch.io**: https://cupnooble.itch.io/sprout-lands-asset-pack
- **Includes**: Character pack, tileset, UI elements

### Free Alternatives
- **OpenGameArt.org**: https://opengameart.org
- **Itch.io Free Games**: https://itch.io/game-assets
- **Kenney.nl**: https://kenney.nl/assets

## File Format Reference

### PNG Settings
- **Color Type**: RGBA (32-bit with transparency)
- **Compression**: 9 (maximum)
- **Interlacing**: None (Adam7 not needed for games)
- **Transparency**: Preserve alpha channel

### Pixel Art Best Practices
- Use no anti-aliasing (keep sharp edges)
- Maintain consistent 16×16 pixel grid
- Test at actual screen size (no zooming transforms)
- Ensure no semi-transparent pixels at edges

## Troubleshooting Asset Loading

### Sprites Not Appearing

**Problem**: Canvas shows grey fallback
**Solution**:
1. Check browser console for CORS errors
2. Verify file paths are relative: `assets/sprites/character.png`
3. Ensure PNG is valid (test opening in image viewer)
4. Check image is not corrupted (compare file size)

### Sprites Blurry

**Problem**: Pixel art looks smoothed/blurry
**Solution**:
1. Verify CSS `image-rendering: pixelated` is applied
2. Check context has `imageSmoothingEnabled = false`
3. Ensure scaling is integer multiple (not 1.5x, 2.3x, etc.)

### Performance Issues

**Problem**: FPS drops or lag with sprites
**Solution**:
1. Reduce sprite size (16×16 is optimal)
2. Combine multiple spritesheets using atlases
3. Use sprite caching (load once, reuse)
4. Profile memory usage in DevTools

## Asset Pipeline Workflow

```
1. Download Sprout Lands Pack
   ↓
2. Extract/Organize Assets
   ↓
3. Create Character Spritesheet (64×64 PNG)
   │  └─ 4 directions × 4 walk frames
   ↓
4. Extract Tileset (PNG)
   │  └─ Optimize & organize by type
   ↓
5. Place in assets/sprites/
   ├── character.png
   └── tileset.png
   ↓
6. Test in Engine
   ├─ Check console for errors
   ├─ Verify rendering
   └─ Adjust if needed
```

## Future Asset Expansion

As the engine grows, consider adding:

- **Additional Characters**: Multiple player skins
- **Animated Objects**: Flags, torches, doors
- **UI Elements**: Buttons, inventory, HUD
- **Particle Effects**: Dust clouds, sparkles
- **Sound Effects**: Movement, interactions, ambience
- **Music**: Background loops, transition themes

## Credits & Attribution

When using Sprout Lands assets in your portfolio:

```
Character & Tileset Assets: Sprout Lands by Cup Nooble
License: Free for personal and commercial use
Attribution: Not required, but appreciated
```

---

**Last Updated**: February 14, 2026
**Compatibility**: All Sprout Lands variant packs
