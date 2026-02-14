/**
 * Player Entity - handles movement, animation, and rendering
 * 
 * Animation frames are organized as:
 * [Down 0-3] [Right 0-3] [Up 0-3] [Left 0-3]
 * From a typical character spritesheet (16x16 frames)
 */

const TILE_SIZE = 16; // Sprite Lands uses 16x16 pixel tiles
const ANIMATION_SPEED = 0.1; // Seconds per frame

const DIRECTIONS = {
  DOWN: 0,
  RIGHT: 1,
  UP: 2,
  LEFT: 3
};

export class Player {
  constructor(gridX = 8, gridY = 8) {
    // Grid position (tile-based)
    this.gridX = gridX;
    this.gridY = gridY;

    // Animation state
    this.direction = DIRECTIONS.DOWN;
    this.frameIndex = 0;
    this.animationTimer = 0;
    this.isMoving = false;

    // Rendering
    this.spriteSheet = null;
    this.loadSpriteSheet();
  }

  /**
   * Load the character spritesheet
   * Expected: character sprite with 4 directions × 4 frames (16x16 each)
   */
  loadSpriteSheet() {
    this.spriteSheet = new Image();
    // Point to your character sheet in assets/sprites/
    this.spriteSheet.src = "assets/sprites/character.png";
    this.spriteSheet.onload = () => {
      // Spritesheet loaded and ready
    };
  }

  /**
   * Update player state based on movement input
   */
  update(dt, movement, world) {
    const { x, y } = movement;

    // Determine if trying to move
    if (x !== 0 || y !== 0) {
      // Update facing direction
      if (x > 0) this.direction = DIRECTIONS.RIGHT;
      else if (x < 0) this.direction = DIRECTIONS.LEFT;
      else if (y > 0) this.direction = DIRECTIONS.DOWN;
      else if (y < 0) this.direction = DIRECTIONS.UP;

      // Try to move to new grid position
      const newX = this.gridX + x;
      const newY = this.gridY + y;

      if (!world.isColliding(newX, newY)) {
        this.gridX = newX;
        this.gridY = newY;
        this.isMoving = true;
      }
    }

    // Update animation
    this.updateAnimation(dt);
  }

  /**
   * Update animation frame based on movement state
   */
  updateAnimation(dt) {
    this.animationTimer += dt;

    if (this.isMoving) {
      // Walking animation cycles through 4 frames
      if (this.animationTimer >= ANIMATION_SPEED) {
        this.animationTimer -= ANIMATION_SPEED;
        this.frameIndex = (this.frameIndex + 1) % 4;
      }
    } else {
      // Idle at frame 0
      this.frameIndex = 0;
      this.animationTimer = 0;
    }
  }

  /**
   * Render player sprite on canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - Screen X position (center of player)
   * @param {number} y - Screen Y position (center of player)
   */
  render(ctx, x, y) {
    if (!this.spriteSheet || !this.spriteSheet.complete) {
      // Fallback: draw a simple rectangle if spritesheet not loaded
      ctx.fillStyle = "#0f0";
      ctx.fillRect(x - 8, y - 8, 16, 16);
      return;
    }

    // Calculate source sprite position in spritesheet
    // 4 directions × 4 frames = spritesheet layout
    const srcX = this.frameIndex * TILE_SIZE;
    const srcY = this.direction * TILE_SIZE;

    // Draw sprite from spritesheet to canvas
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      this.spriteSheet,
      srcX, srcY,           // Source position in spritesheet
      TILE_SIZE, TILE_SIZE, // Source size
      x - 8, y - 8,         // Destination position (centered)
      16, 16                // Destination size (2x scale for visibility)
    );
  }

  /**
   * Get grid positions in view (for debugging/minimap)
   */
  getGridPosition() {
    return { x: this.gridX, y: this.gridY };
  }

  /**
   * Teleport player to grid position
   */
  warpTo(gridX, gridY) {
    this.gridX = gridX;
    this.gridY = gridY;
  }
}
