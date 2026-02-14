import { Player } from "./entity.js";
import { World } from "./world.js";
import { CommandParser } from "./ui.js";

/**
 * Input Handler - manages keyboard input for movement and actions
 */
class Input {
  constructor(signal) {
    this.keys = new Set();
    this.justPressed = new Set();
    
    window.addEventListener("keydown", (e) => this.onKeyDown(e), { signal });
    window.addEventListener("keyup", (e) => this.onKeyUp(e), { signal });
  }

  onKeyDown(e) {
    const code = e.code;
    // Support both WASD and Arrow keys
    const isMovement = /^Key[WSAD]$|^Arrow/.test(code);
    const isAction = code === "KeyT" || code === "Slash" || code === "KeyT";
    
    if (isMovement || isAction) {
      if (!this.keys.has(code)) {
        this.justPressed.add(code);
      }
      this.keys.add(code);
      e.preventDefault();
    }
  }

  onKeyUp(e) {
    this.keys.delete(e.code);
  }

  /**
   * Get movement axis (-1, 0, 1) for both dimensions
   */
  getMovement() {
    const x = 
      (this.keys.has("KeyD") || this.keys.has("ArrowRight") ? 1 : 0) -
      (this.keys.has("KeyA") || this.keys.has("ArrowLeft") ? 1 : 0);
    const y = 
      (this.keys.has("KeyS") || this.keys.has("ArrowDown") ? 1 : 0) -
      (this.keys.has("KeyW") || this.keys.has("ArrowUp") ? 1 : 0);
    
    return { x, y };
  }

  /**
   * Check if a key was just pressed this frame
   */
  wasPressed(code) {
    return this.justPressed.has(code);
  }

  /**
   * Clear the just-pressed set (call once per frame update)
   */
  clearFrame() {
    this.justPressed.clear();
  }
}

/**
 * Main Game Engine - orchestrates game loop, rendering, and updates
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
    this.player = new Player(8, 8); // Start at tile (8, 8)
    this.world = new World();
    this.commandParser = new CommandParser();
    
    // Input management
    this.inputAbort = new AbortController();
    this.input = new Input(this.inputAbort.signal);
    
    // Terminal state
    this.terminalActive = false;
    
    // Frame management
    this.lastTs = 0;
    this.frameCount = 0;
    this.running = true;

    // Setup
    this.setupDisplay();
    this.setupEventListeners();
    this.startGameLoop();
  }

  /**
   * Configure canvas and display properties
   */
  setupDisplay() {
    this.handleResize();
    window.addEventListener("resize", () => this.handleResize(), {
      signal: this.inputAbort.signal,
      passive: true
    });
  }

  /**
   * Handle window resize - maintain pixel-perfect rendering
   */
  handleResize() {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;

    // Scale context for DPR
    this.ctx.scale(dpr, dpr);
    
    this.width = w;
    this.height = h;
  }

  /**
   * Setup event listeners for terminal and system events
   */
  setupEventListeners() {
    const terminalOverlay = document.getElementById("terminalOverlay");
    const terminalInput = document.getElementById("terminalInput");
    const terminalClose = document.getElementById("terminalClose");

    // Terminal toggle (T key or ?)
    document.addEventListener("keydown", (e) => {
      if (e.code === "KeyT" || (e.key === "?" && e.shiftKey)) {
        this.toggleTerminal();
        e.preventDefault();
      }
    }, { signal: this.inputAbort.signal });

    // Terminal command submission
    terminalInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const command = e.target.value.trim();
        if (command) {
          this.executeCommand(command);
          e.target.value = "";
        }
      }
    }, { signal: this.inputAbort.signal });

    // Close terminal button
    terminalClose.addEventListener("click", () => this.toggleTerminal(), {
      signal: this.inputAbort.signal
    });

    // Page visibility
    document.addEventListener("visibilitychange", () => {
      this.running = !document.hidden;
    }, { signal: this.inputAbort.signal });

    // Cleanup on unload
    window.addEventListener("beforeunload", () => this.destroy(), {
      signal: this.inputAbort.signal
    });
  }

  /**
   * Toggle terminal visibility
   */
  toggleTerminal() {
    this.terminalActive = !this.terminalActive;
    const overlay = document.getElementById("terminalOverlay");
    const input = document.getElementById("terminalInput");

    overlay.classList.toggle("active", this.terminalActive);
    
    if (this.terminalActive) {
      input.focus();
      // Clear output and show help on open
      if (document.getElementById("terminalOutput").children.length === 0) {
        this.executeCommand("help");
      }
    }
  }

  /**
   * Execute terminal command
   */
  executeCommand(command) {
    const output = document.getElementById("terminalOutput");
    const parser = this.commandParser;

    // Display command
    const cmdLine = document.createElement("div");
    cmdLine.className = "terminal-line command";
    cmdLine.textContent = `$ ${command}`;
    output.appendChild(cmdLine);

    // Parse and execute
    let result = "";
    const parts = command.toLowerCase().split(/\s+/);
    const cmd = parts[0];

    switch (cmd) {
      case "help":
      case "?":
        result = parser.getHelpText();
        break;
      case "about":
        result = parser.getAboutText();
        break;
      case "projects":
        result = parser.getProjectsText();
        break;
      case "status":
        result = this.getPlayerStatus();
        break;
      case "clear":
        output.innerHTML = "";
        return;
      default:
        result = `Unknown command: ${command}. Type 'help' for available commands.`;
    }

    // Display result
    const resultLine = document.createElement("div");
    resultLine.className = "terminal-line output";
    resultLine.textContent = result;
    output.appendChild(resultLine);

    // Auto-scroll to bottom
    output.scrollTop = output.scrollHeight;
  }

  /**
   * Get current player status for terminal
   */
  getPlayerStatus() {
    const tile = this.world.getTile(this.player.gridX, this.player.gridY);
    const tileType = tile ? tile.type : "unknown";
    return `Player at grid(${this.player.gridX}, ${this.player.gridY}) on ${tileType}`;
  }

  /**
   * Main game loop - called via requestAnimationFrame
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
      this.input.clearFrame();
      this.frameCount++;

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  };

  /**
   * Update game state
   */
  update(dt) {
    if (this.terminalActive) return; // Freeze game while terminal open

    const movement = this.input.getMovement();
    this.player.update(dt, movement, this.world);
  }

  /**
   * Render game frame
   */
  render() {
    // Clear canvas
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw world relative to player
    this.world.render(this.ctx, this.player, this.width, this.height);

    // Draw player in center
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    this.player.render(this.ctx, centerX, centerY);

    // Draw HUD info (optional)
    this.drawHUD();
  }

  /**
   * Draw heads-up display elements
   */
  drawHUD() {
    // Could add FPS counter, minimap, etc here
    // Keep minimal for performance
  }

  /**
   * Cleanup on destroy
   */
  destroy() {
    this.running = false;
    this.inputAbort.abort();
  }
}

// Initialize game when DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  const engine = new GameEngine();
});
