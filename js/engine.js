import { Player } from "./entity.js";
import { World } from "./world.js";
import { CommandParser, UIManager } from "./ui.js";

/**
 * Main Game Engine - Terminal-First Architecture
 * The terminal is the primary interface, game viewport is secondary
 */
class GameEngine {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d", { 
      alpha: false,
      desynchronized: true,
      willReadFrequently: false
    });
    
    // Game state
    this.player = new Player(8, 8);
    this.world = new World();
    
    // UI Management
    this.commandParser = new CommandParser(this);
    this.uiManager = new UIManager(this);
    
    // Frame management
    this.lastTs = 0;
    this.frameCount = 0;
    this.running = true;

    // Setup
    this.setupDisplay();
    this.setupEventListeners();
    this.initializeTerminal();
    this.startGameLoop();
  }

  /**
   * Configure canvas for small viewport window
   */
  setupDisplay() {
    this.handleResize();
    window.addEventListener("resize", () => this.handleResize(), { passive: true });
  }

  /**
   * Handle viewport canvas sizing
   */
  handleResize() {
    // Canvas should be 320x240 for the small viewport window
    const dpr = window.devicePixelRatio || 1;
    const w = 320;
    const h = 240;

    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;

    this.ctx.scale(dpr, dpr);
    this.width = w;
    this.height = h;
  }

  /**
   * Setup event listeners - Terminal is primary input
   */
  setupEventListeners() {
    const terminalInput = document.getElementById("terminalInput");

    // Terminal command submission (Enter key)
    terminalInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const command = terminalInput.value.trim();
        if (command) {
          // Log the command
          this.uiManager.logCommand(command);
          
          // Execute the command
          const result = this.commandParser.executeCommand(command);
          
          // Handle result
          if (result && typeof result === 'object' && result.action === 'clear') {
            this.uiManager.clear();
          } else if (result) {
            this.uiManager.logOutput(result);
          }
          
          // Add to history and clear input
          this.commandParser.addToHistory(command);
          terminalInput.value = "";
        }
        e.preventDefault();
      }
    });

    // Always keep terminal input focused
    terminalInput.addEventListener("blur", () => {
      setTimeout(() => terminalInput.focus(), 10);
    });

    // Page visibility
    document.addEventListener("visibilitychange", () => {
      this.running = !document.hidden;
    });

    // Cleanup on unload
    window.addEventListener("beforeunload", () => this.destroy());
  }

  /**
   * Initialize terminal with welcome message
   */
  initializeTerminal() {
    const terminalInput = document.getElementById("terminalInput");
    
    // Show welcome message
    this.uiManager.logOutput(this.commandParser.getWelcomeText());
    
    // Focus terminal input
    terminalInput.focus();
  }

  /**
   * Main game loop
   */
  startGameLoop = () => {
    const loop = (timestamp) => {
      if (!this.running) {
        requestAnimationFrame(loop);
        return;
      }

      if (!this.lastTs) this.lastTs = timestamp;
      const deltaTime = Math.min((timestamp - this.lastTs) / 1000, 0.04);
      this.lastTs = timestamp;

      this.update(deltaTime);
      this.render();
      this.frameCount++;

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  };

  /**
   * Update game state
   * Characters move via terminal commands, not keyboard input
   */
  update(dt) {
    // Update player animation regardless (always animate idle)
    this.player.updateAnimation(dt);
  }

  /**
   * Render game frame to small viewport
   */
  render() {
    // Clear canvas
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw world relative to player center
    this.world.render(this.ctx, this.player, this.width, this.height);

    // Draw player in center of viewport
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    this.player.render(this.ctx, centerX, centerY);
  }

  /**
   * Cleanup on destroy
   */
  destroy() {
    this.running = false;
  }
}

// Initialize game when DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  const engine = new GameEngine();
});
