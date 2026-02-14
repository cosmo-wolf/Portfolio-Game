/**
 * CommandParser - Handles all terminal commands
 * 
 * Available commands:
 * - help: Show available commands
 * - about: Display developer info
 * - projects: List portfolio projects
 * - status: Show current player status
 * - clear: Clear terminal output
 */
export class CommandParser {
  constructor() {
    this.commandHistory = [];
    this.maxHistory = 50;
  }

  /**
   * Get help text listing all available commands
   */
  getHelpText() {
    return `
COSMO'S PORTFOLIO ENGINE v1.0
==============================

Available Commands:
  about     - About Cosmo Wolf
  projects  - View portfolio projects
  status    - Show current game status
  help      - Show this help message
  clear     - Clear terminal output

Examples:
  > about
  > projects
  > status

Press 'T' to toggle terminal
Type 'help' for more information`;
  }

  /**
   * Get developer information
   */
  getAboutText() {
    return `
╔════════════════════════════════════════╗
║         COSMO WOLF                     ║
║   Python Automation &                  ║
║   Creative Developer                   ║
╚════════════════════════════════════════╝

Skills:
  • JavaScript (Vanilla, React)
  • Python (Automation, Web Scraping)
  • Canvas/WebGL Rendering
  • Game Development
  • Web Design & UI/UX
  • Node.js & Backend Dev

Focus:
  Building creative, high-performance
  web applications and tools that
  solve real-world problems.

Contact:
  GitHub: github.com/cosmowolf
  Email:  cosmo@portfolio.dev`;
  }

  /**
   * Get projects list
   */
  getProjectsText() {
    return `
╔════════════════════════════════════════╗
║      PORTFOLIO PROJECTS                ║
╚════════════════════════════════════════╝

[1] BAR SCRAPER
    Web scraping utility for venue data
    Tech: Python, Selenium, PostgreSQL
    Status: ✓ Complete

[2] PORTFOLIO ENGINE
    Tile-based retro game portfolio
    Tech: Vanilla JS, Canvas, Sprout Lands
    Status: ⧗ In Progress

[3] DATA PIPELINE
    Automated ETL workflow system
    Tech: Python, Airflow, Docker
    Status: ⧗ In Progress

More projects available at:
github.com/cosmowolf

Want to explore? Use arrow keys
to navigate the game world!`;
  }

  /**
   * Format a command line for display
   */
  formatCommand(command) {
    return `$ ${command}`;
  }

  /**
   * Add command to history
   */
  addToHistory(command) {
    this.commandHistory.push(command);
    if (this.commandHistory.length > this.maxHistory) {
      this.commandHistory.shift();
    }
  }

  /**
   * Get command history
   */
  getHistory() {
    return [...this.commandHistory];
  }

  /**
   * Parse and validate command format
   */
  parseCommand(input) {
    const trimmed = input.trim();
    if (!trimmed) return null;

    const parts = trimmed.toLowerCase().split(/\s+/);
    return {
      raw: trimmed,
      command: parts[0],
      args: parts.slice(1)
    };
  }
}

/**
 * UIManager - Handles UI state and interactions
 */
export class UIManager {
  constructor() {
    this.terminalInput = document.getElementById("terminalInput");
    this.terminalOutput = document.getElementById("terminalOutput");
    this.terminalOverlay = document.getElementById("terminalOverlay");
  }

  /**
   * Log a line to the terminal
   */
  log(text, className = "output") {
    const line = document.createElement("div");
    line.className = `terminal-line ${className}`;
    line.textContent = text;
    this.terminalOutput.appendChild(line);
    this.scrollToBottom();
  }

  /**
   * Log a command
   */
  logCommand(command) {
    this.log(`$ ${command}`, "command");
  }

  /**
   * Log output
   */
  logOutput(text) {
    this.log(text, "output");
  }

  /**
   * Log an error
   */
  logError(text) {
    this.log(text, "error");
  }

  /**
   * Log success
   */
  logSuccess(text) {
    this.log(text, "success");
  }

  /**
   * Scroll terminal to bottom
   */
  scrollToBottom() {
    this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
  }

  /**
   * Clear terminal
   */
  clear() {
    this.terminalOutput.innerHTML = "";
  }

  /**
   * Get terminal input value
   */
  getInputValue() {
    return this.terminalInput.value;
  }

  /**
   * Set terminal input value
   */
  setInputValue(value) {
    this.terminalInput.value = value;
  }

  /**
   * Focus terminal input
   */
  focus() {
    this.terminalInput.focus();
  }

  /**
   * Show terminal
   */
  show() {
    this.terminalOverlay.classList.add("active");
  }

  /**
   * Hide terminal
   */
  hide() {
    this.terminalOverlay.classList.remove("active");
  }

  /**
   * Toggle terminal visibility
   */
  toggle() {
    this.terminalOverlay.classList.toggle("active");
  }
}

