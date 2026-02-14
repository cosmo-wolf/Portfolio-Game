/**
 * World - Tile-based map system
 * 
 * Tile types:
 * - grass: walkable grass terrain
 * - house: non-walkable structure
 * - tree: non-walkable obstacle
 * - water: non-walkable (optional for future)
 */

const TILE_SIZE = 16; // Sprout Lands uses 16x16 pixel tiles

const TILE_TYPES = {
  GRASS: "grass",
  HOUSE: "house",
  TREE: "tree",
  WATER: "water"
};

/**
 * Tile class - represents a single grid cell
 */
class Tile {
  constructor(type = TILE_TYPES.GRASS, spriteIndex = 0) {
    this.type = type;
    this.spriteIndex = spriteIndex; // Index in the tileset sprite
    this.colliding = type !== TILE_TYPES.GRASS;
  }
}

/**
 * World class - manages the game map
 */
export class World {
  constructor(width = 20, height = 16) {
    this.width = width;
    this.height = height;
    this.tiles = [];
    this.tileSet = null;
    this.projectHouse = null;

    // Initialize map
    this.generateMap();
    this.loadTileSet();
  }

  /**
   * Generate the initial game map
   * For now: grass everywhere with a house structure in the middle
   */
  generateMap() {
    for (let y = 0; y < this.height; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < this.width; x++) {
        // Mostly grass
        this.tiles[y][x] = new Tile(TILE_TYPES.GRASS, 0);
      }
    }

    // Place "Project House" in the center
    const houseX = Math.floor(this.width / 2) - 1;
    const houseY = Math.floor(this.height / 2) - 1;
    this.projectHouse = { x: houseX, y: houseY, width: 2, height: 2 };

    // Mark house tiles as non-walkable
    for (let y = 0; y < this.projectHouse.height; y++) {
      for (let x = 0; x < this.projectHouse.width; x++) {
        const tx = houseX + x;
        const ty = houseY + y;
        if (ty >= 0 && ty < this.height && tx >= 0 && tx < this.width) {
          this.tiles[ty][tx] = new Tile(TILE_TYPES.HOUSE, 1);
        }
      }
    }

    // Add some obstacles around the map for visual variety
    this.addRandomTrees(5);
  }

  /**
   * Add random trees to the map for obstacles
   */
  addRandomTrees(count) {
    for (let i = 0; i < count; i++) {
      let x, y, valid = false;
      // Find a valid spot that's not near the house
      while (!valid) {
        x = Math.floor(Math.random() * this.width);
        y = Math.floor(Math.random() * this.height);
        const tile = this.tiles[y][x];
        const distToHouse = Math.abs(x - this.projectHouse.x) + Math.abs(y - this.projectHouse.y);
        valid = tile.type === TILE_TYPES.GRASS && distToHouse > 4;
      }
      this.tiles[y][x] = new Tile(TILE_TYPES.TREE, 2);
    }
  }

  /**
   * Load the tileset image
   * Expected: assets/sprites/tileset.png with Sprout Lands tiles
   */
  loadTileSet() {
    this.tileSet = new Image();
    this.tileSet.src = "assets/sprites/tileset.png";
    this.tileSet.onload = () => {
      // Tileset loaded
    };
  }

  /**
   * Get a tile at grid position
   */
  getTile(gridX, gridY) {
    if (gridY < 0 || gridY >= this.height || gridX < 0 || gridX >= this.width) {
      return null;
    }
    return this.tiles[gridY][gridX];
  }

  /**
   * Check if a grid position has collision
   * Used for player movement validation
   */
  isColliding(gridX, gridY) {
    const tile = this.getTile(gridX, gridY);
    if (!tile) return true; // Out of bounds is collision
    return tile.colliding;
  }

  /**
   * Render the world relative to player position
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Player} player - Player instance
   * @param {number} screenWidth - Screen width in pixels
   * @param {number} screenHeight - Screen height in pixels
   */
  render(ctx, player, screenWidth, screenHeight) {
    // Calculate which tiles are visible on screen
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;

    // Grid coordinates to start rendering from
    const startGridX = Math.max(0, Math.floor(player.gridX - centerX / TILE_SIZE));
    const endGridX = Math.min(this.width, Math.ceil(player.gridX + centerX / TILE_SIZE));
    const startGridY = Math.max(0, Math.floor(player.gridY - centerY / TILE_SIZE));
    const endGridY = Math.min(this.height, Math.ceil(player.gridY + centerY / TILE_SIZE));

    // Render tiles
    for (let gridY = startGridY; gridY < endGridY; gridY++) {
      for (let gridX = startGridX; gridX < endGridX; gridX++) {
        const tile = this.tiles[gridY][gridX];
        const screenX = centerX + (gridX - player.gridX) * TILE_SIZE;
        const screenY = centerY + (gridY - player.gridY) * TILE_SIZE;

        this.renderTile(ctx, tile, screenX, screenY);
      }
    }

    // Render house outline/visual indicator
    if (this.projectHouse) {
      this.renderProjectHouse(ctx, player, centerX, centerY);
    }
  }

  /**
   * Render a single tile
   */
  renderTile(ctx, tile, screenX, screenY) {
    // For now, render simple colored rectangles
    // When tilesetsare loaded, use ctx.drawImage with spritesheet
    switch (tile.type) {
      case TILE_TYPES.GRASS:
        ctx.fillStyle = "#2a5a2a";
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
        // Grass pattern
        ctx.fillStyle = "#3a7a3a";
        if ((Math.floor(screenX / TILE_SIZE) + Math.floor(screenY / TILE_SIZE)) % 2 === 0) {
          ctx.fillRect(screenX + 2, screenY + 2, 4, 4);
          ctx.fillRect(screenX + 12, screenY + 12, 4, 4);
        }
        break;

      case TILE_TYPES.HOUSE:
        ctx.fillStyle = "#8b4513";
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = "#ffd700";
        ctx.fillRect(screenX + 4, screenY + 4, 4, 4);
        ctx.fillRect(screenX + 12, screenY + 4, 4, 4);
        break;

      case TILE_TYPES.TREE:
        ctx.fillStyle = "#2d5a2d";
        ctx.fillRect(screenX + 4, screenY + 8, 8, 8);
        ctx.fillStyle = "#1a3a1a";
        ctx.fillRect(screenX + 6, screenY + 4, 4, 4);
        break;

      case TILE_TYPES.WATER:
        ctx.fillStyle = "#4da6ff";
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = "#3388dd";
        ctx.fillRect(screenX + 4, screenY + 4, 8, 8);
        break;

      default:
        ctx.fillStyle = "#000";
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
    }

    // Border outline
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
  }

  /**
   * Render the project house with special styling
   */
  renderProjectHouse(ctx, player, centerX, centerY) {
    const houseScreenX = centerX + (this.projectHouse.x - player.gridX) * TILE_SIZE;
    const houseScreenY = centerY + (this.projectHouse.y - player.gridY) * TILE_SIZE;
    const housePixelWidth = this.projectHouse.width * TILE_SIZE;
    const housePixelHeight = this.projectHouse.height * TILE_SIZE;

    // Draw a subtle glow around the house
    ctx.strokeStyle = "rgba(0, 255, 0, 0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      houseScreenX - 2,
      houseScreenY - 2,
      housePixelWidth + 4,
      housePixelHeight + 4
    );

    // Draw door indicator
    ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
    ctx.fillRect(
      houseScreenX + housePixelWidth - 6,
      houseScreenY + housePixelHeight - 6,
      4,
      4
    );
  }

  /**
   * Get nearby structures/points of interest
   * Could be expanded for interactive elements
   */
  getNearbyStructures(gridX, gridY, radius = 2) {
    const structures = [];
    if (this.projectHouse) {
      const distJ = Math.abs(gridX - (this.projectHouse.x + 0.5));
      const distY = Math.abs(gridY - (this.projectHouse.y + 0.5));
      if (distJ <= radius && distY <= radius) {
        structures.push({
          type: "HOUSE",
          name: "Project House",
          x: this.projectHouse.x,
          y: this.projectHouse.y
        });
      }
    }
    return structures;
  }

  /**
   * Optional: Get all tiles of a certain type
   */
  getTilesOfType(type) {
    const collection = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.tiles[y][x].type === type) {
          collection.push({ x, y });
        }
      }
    }
    return collection;
  }

  /**
   * Optional: Place a tile (for dynamic map changes)
   */
  setTile(gridX, gridY, type) {
    if (gridY >= 0 && gridY < this.height && gridX >= 0 && gridX < this.width) {
      this.tiles[gridY][gridX] = new Tile(type);
    }
  }
}
