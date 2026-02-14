/**
 * FileSystem - Simulates a simple file system for the terminal
 */
class FileSystem {
  constructor() {
    this.currentDir = '/';
    this.files = {
      '/': {
        type: 'directory',
        contents: ['projects', 'skills', 'about', 'contact']
      },
      '/projects': {
        type: 'directory',
        contents: ['bar_scraper.txt', 'portfolio_engine.txt', 'data_pipeline.txt']
      },
      '/projects/bar_scraper.txt': {
        type: 'file',
        content: `╔════════════════════════════════════════╗
║         PROJECT: BAR SCRAPER           ║
╚════════════════════════════════════════╝

DESCRIPTION:
  Web scraping utility for venue data collection
  and analysis. Automated data pipeline that
  extracts information from multiple sources.

TECHNOLOGIES:
  • Python 3.9+
  • Selenium WebDriver
  • PostgreSQL
  • Beautiful Soup 4
  • Pandas DataFrame

FEATURES:
  ✓ Multi-threaded scraping
  ✓ Automatic error recovery
  ✓ Data normalization
  ✓ Scheduled execution (Cron)
  ✓ Export to CSV/JSON

STATUS: COMPLETE ✓

GITHUB: github.com/cosmowolf/bar-scraper`
      },
      '/projects/portfolio_engine.txt': {
        type: 'file',
        content: `╔════════════════════════════════════════╗
║    PROJECT: PORTFOLIO ENGINE v1.0      ║
╚════════════════════════════════════════╝

DESCRIPTION:
  Terminal-first retro game engine for an
  interactive portfolio experience. Features
  tile-based gameplay with a CRT aesthetic.

TECHNOLOGIES:
  • Vanilla JavaScript (ES6)
  • HTML5 Canvas 2D
  • CSS3 Animations
  • Sprout Lands Asset Pack
  • requestAnimationFrame

FEATURES:
  ✓ Tile-based world generation
  ✓ Sprite animation system
  ✓ Collision detection
  ✓ CRT scan-line effects
  ✓ Terminal UI integration
  ✓ File system simulation

STATUS: IN PROGRESS ⧗

HOSTED: portfolio.vercel.app`
      },
      '/projects/data_pipeline.txt': {
        type: 'file',
        content: `╔════════════════════════════════════════╗
║       PROJECT: DATA PIPELINE ETL       ║
╚════════════════════════════════════════╝

DESCRIPTION:
  Automated ETL (Extract, Transform, Load)
  workflow system for processing large-scale
  data from multiple sources.

TECHNOLOGIES:
  • Apache Airflow
  • Docker & Docker Compose
  • Python Pandas
  • PostgreSQL
  • AWS S3

FEATURES:
  ✓ DAG-based workflow orchestration
  ✓ Error handling & retry logic
  ✓ Data validation pipeline
  ✓ Scheduled execution
  ✓ Monitoring & alerting
  ✓ Container deployment

STATUS: IN PROGRESS ⧗

GITHUB: github.com/cosmowolf/data-pipeline`
      },
      '/skills': {
        type: 'directory',
        contents: ['technical.txt', 'languages.txt', 'tools.txt']
      },
      '/skills/technical.txt': {
        type: 'file',
        content: `╔════════════════════════════════════════╗
║        TECHNICAL SKILLS                ║
╚════════════════════════════════════════╝

FRONTEND:
  ★★★★★ JavaScript (Vanilla, ES6+)
  ★★★★☆ React.js
  ★★★★☆ HTML5 & CSS3 (Flexbox, Grid)
  ★★★☆☆ Canvas & WebGL
  ★★★☆☆ Responsive Design

BACKEND:
  ★★★★★ Python 3
  ★★★★☆ Node.js & Express
  ★★★★☆ REST APIs
  ★★★☆☆ Database Design

GAME DEVELOPMENT:
  ★★★★☆ Tile-based engines
  ★★★★☆ Sprite animation
  ★★★☆☆ Canvas rendering
  ★★★☆☆ Game physics

DEVOPS:
  ★★★☆☆ Docker
  ★★★☆☆ Git & GitHub
  ★★☆☆☆ CI/CD Pipelines`
      },
      '/skills/languages.txt': {
        type: 'file',
        content: `╔════════════════════════════════════════╗
║     PROGRAMMING LANGUAGES              ║
╚════════════════════════════════════════╝

PRIMARY:
  • JavaScript - Web dev, game engines
  • Python - Automation, data processing
  • SQL - Database queries, optimization

SECONDARY:
  • HTML5 - Web markup
  • CSS3 - Styling & animations
  • Bash - Shell scripting

LEARNING:
  • TypeScript - Type safety
  • Go - Systems programming
  • Rust - Performance-critical code

PROFICIENCY LEVELS:
  ★★★★★ Expert
  ★★★★☆ Advanced
  ★★★☆☆ Intermediate
  ★★☆☆☆ Beginner`
      },
      '/skills/tools.txt': {
        type: 'file',
        content: `╔════════════════════════════════════════╗
║     TOOLS & ENVIRONMENTS               ║
╚════════════════════════════════════════╝

EDITORS & IDEs:
  ✓ Visual Studio Code
  ✓ PyCharm
  ✓ WebStorm
  ✓ Vim

VERSION CONTROL:
  ✓ Git
  ✓ GitHub
  ✓ GitLab

DATABASES:
  ✓ PostgreSQL
  ✓ MongoDB
  ✓ SQLite

DEPLOYMENT:
  ✓ Vercel
  ✓ Heroku
  ✓ AWS EC2
  ✓ Docker

MONITORING:
  ✓ Chrome DevTools
  ✓ Postman
  ✓ Datadog`
      },
      '/about': {
        type: 'directory',
        contents: ['profile.txt', 'experience.txt']
      },
      '/about/profile.txt': {
        type: 'file',
        content: `╔════════════════════════════════════════╗
║    COSMO WOLF - DEVELOPER PROFILE      ║
╚════════════════════════════════════════╝

TITLE: Full-Stack JavaScript & Python Developer

FOCUS AREAS:
  → Creative web experiences
  → Automated tooling systems
  → High-performance rendering
  → Game development (indie)
  → Data pipeline architecture

PHILOSOPHY:
  Building elegant solutions to complex
  problems. Obsessed with performance,
  user experience, and clean code.

CAREER HIGHLIGHTS:
  • Built web scraping pipeline (50k+ records)
  • Designed retro game engines from scratch
  • Created automated ETL systems
  • Open source contributor

CURRENT INTERESTS:
  ✓ Generative art & algorithmic design
  ✓ Game development techniques
  ✓ Performance optimization
  ✓ DevOps automation
  ✓ Creative coding`
      },
      '/about/experience.txt': {
        type: 'file',
        content: `╔════════════════════════════════════════╗
║       PROFESSIONAL EXPERIENCE          ║
╚════════════════════════════════════════╝

FREELANCE DEVELOPER (2022 - Present)
  • Built custom web applications
  • Created data pipeline systems
  • Developed game engines
  • Designed interactive portfolios

WEB DEVELOPER (2020 - 2022)
  • React.js application development
  • REST API design & implementation
  • Database optimization
  • Performance profiling

AUTOMATION ENGINEER (2018 - 2020)
  • Python automation scripts
  • Web scraping systems
  • Data processing pipelines
  • Task scheduling & monitoring

EDUCATION:
  • Self-taught developer (2016 onwards)
  • Online courses: Full-stack JS, Python
  • portfolio projects: 12+
  • Open source contributions: Active`
      },
      '/contact': {
        type: 'directory',
        contents: ['info.txt']
      },
      '/contact/info.txt': {
        type: 'file',
        content: `╔════════════════════════════════════════╗
║       CONTACT INFORMATION              ║
╚════════════════════════════════════════╝

EMAIL:
  cosmo@portfolio.dev

GITHUB:
  github.com/cosmowolf

LINKEDIN:
  linkedin.com/in/cosmowolf

PORTFOLIO:
  portfolio.vercel.app

SOCIAL:
  Twitter/X: @cosmowolf_dev
  CodePen: codepen.io/cosmowolf

RESPONSE TIME:
  Usually responds within 24 hours

AVAILABILITY:
  Open to freelance projects
  Available for consulting`
      }
    };
  }

  list(dir = this.currentDir) {
    const path = dir === '/' ? '/' : `/${dir.replace(/^\//, '').replace(/\/$/, '')}`;
    const entry = this.files[path];
    
    if (!entry) {
      return { error: `Directory not found: ${path}` };
    }
    
    if (entry.type !== 'directory') {
      return { error: `Not a directory: ${path}` };
    }
    
    return { contents: entry.contents };
  }

  changeDir(dir) {
    if (dir === '/' || dir === '') {
      this.currentDir = '/';
      return { success: true };
    }

    let targetPath = dir.startsWith('/') ? dir : `${this.currentDir}${this.currentDir === '/' ? '' : '/'}${dir}`;
    targetPath = targetPath.replace(/\/$/, '');

    const entry = this.files[targetPath];
    
    if (!entry) {
      return { error: `Directory not found: ${dir}` };
    }
    
    if (entry.type !== 'directory') {
      return { error: `Not a directory: ${dir}` };
    }

    this.currentDir = targetPath === '/' ? '/' : targetPath;
    return { success: true };
  }

  cat(filename) {
    let filePath = filename.startsWith('/') 
      ? filename 
      : `${this.currentDir}${this.currentDir === '/' ? '' : '/'}${filename}`;
    
    filePath = filePath.replace(/\/$/, '');
    const entry = this.files[filePath];

    if (!entry) {
      return { error: `File not found: ${filename}` };
    }

    if (entry.type !== 'file') {
      return { error: `Not a file: ${filename}` };
    }

    return { content: entry.content };
  }

  pwd() {
    return this.currentDir === '/' ? '/' : this.currentDir;
  }
}

/**
 * CommandParser - Handles terminal commands (ls, cd, cat, move, etc)
 */
export class CommandParser {
  constructor(engineRef) {
    this.commandHistory = [];
    this.maxHistory = 50;
    this.fileSystem = new FileSystem();
    this.engine = engineRef;
  }

  /**
   * Get help text
   */
  getHelpText() {
    return `
COSMO WOLF - SYSTEM v1.0
═══════════════════════════════════════════

TERMINAL COMMANDS:
  help          - Display this help message
  ls            - List directory contents
  cd [path]     - Change directory
  cat [file]    - Display file contents
  pwd           - Print working directory
  move [dir]    - Move character (up/down/left/right)
  clear         - Clear terminal history

DIRECTORY STRUCTURE:
  / – Root directory
    /projects – Portfolio projects
    /skills – Technical skills
    /about – Profile information
    /contact – Contact details

EXAMPLES:
  > cd /projects
  > cat bar_scraper.txt
  > ls
  > move right
  > pwd

MOVEMENT:
  move up       - Move character upward
  move down     - Move character downward
  move left     - Move character leftward
  move right    - Move character rightward`;
  }

  /**
   * Get welcome message
   */
  getWelcomeText() {
    return `
╔═══════════════════════════════════════════╗
║  COSMO WOLF - SYSTEM v1.0                 ║
║  Terminal-First Portfolio Experience     ║
║═══════════════════════════════════════════╣
║  Type 'help' to view available commands   ║
║  Type 'ls' to explore the file system     ║
╚═══════════════════════════════════════════╝

Current Directory: /
Type your first command...`;
  }

  /**
   * Format command for display
   */
  formatCommand(command) {
    return `[COSMO]$ ${command}`;
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
   * Parse and execute command
   */
  executeCommand(input) {
    const trimmed = input.trim();
    if (!trimmed) return '';

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output = '';

    switch (cmd) {
      case 'help':
      case '?':
        output = this.getHelpText();
        break;

      case 'ls':
      case 'dir':
        output = this.executeLS(args);
        break;

      case 'cd':
        output = this.executeCD(args);
        break;

      case 'pwd':
        output = this.executePWD();
        break;

      case 'cat':
        output = this.executeCAT(args);
        break;

      case 'move':
        output = this.executeMOVE(args);
        break;

      case 'clear':
        return { action: 'clear' };

      default:
        output = `command not found: ${cmd}\nType 'help' for available commands`;
    }

    return output;
  }

  /**
   * List directory contents
   */
  executeLS(args) {
    const dir = args.length > 0 ? args[0] : this.fileSystem.currentDir;
    const result = this.fileSystem.list(dir);

    if (result.error) {
      return `ERROR: ${result.error}`;
    }

    const items = result.contents.map(name => {
      const fullPath = `${this.fileSystem.currentDir}${this.fileSystem.currentDir === '/' ? '' : '/'}${name}`;
      const entry = this.fileSystem.files[fullPath];
      const isDir = entry && entry.type === 'directory';
      return isDir ? `[${name}]` : ` ${name} `;
    });

    return `Directory listing: ${this.fileSystem.pwd()}\n\n${items.join('\n')}`;
  }

  /**
   * Change directory
   */
  executeCD(args) {
    if (args.length === 0) {
      return 'ERROR: cd requires a directory argument';
    }

    const dir = args[0];
    const result = this.fileSystem.changeDir(dir);

    if (result.error) {
      return `ERROR: ${result.error}`;
    }

    return `Changed directory to: ${this.fileSystem.pwd()}`;
  }

  /**
   * Print working directory
   */
  executePWD() {
    return `Current directory: ${this.fileSystem.pwd()}`;
  }

  /**
   * Display file contents
   */
  executeCAT(args) {
    if (args.length === 0) {
      return 'ERROR: cat requires a file argument';
    }

    const filename = args[0];
    const result = this.fileSystem.cat(filename);

    if (result.error) {
      return `ERROR: ${result.error}`;
    }

    return result.content;
  }

  /**
   * Move character in game
   */
  executeMOVE(args) {
    if (args.length === 0) {
      return 'ERROR: move requires a direction (up/down/left/right)';
    }

    const direction = args[0].toLowerCase();
    const validDirections = ['up', 'down', 'left', 'right'];

    if (!validDirections.includes(direction)) {
      return `ERROR: invalid direction '${direction}'. Use: up, down, left, or right`;
    }

    // Send movement to game engine
    if (this.engine && this.engine.player) {
      const movement = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 }
      };

      const move = movement[direction];
      const newX = this.engine.player.gridX + move.x;
      const newY = this.engine.player.gridY + move.y;

      // Check collision
      if (this.engine.world.canWalkOn(newX, newY)) {
        this.engine.player.gridX = newX;
        this.engine.player.gridY = newY;
        return `Character moved ${direction} to (${newX}, ${newY})`;
      } else {
        return `Can't move ${direction} - obstacle detected at (${newX}, ${newY})`;
      }
    }

    return `Movement failed - game engine not ready`;
  }
}

/**
 * UIManager - Manages terminal UI state
 */
export class UIManager {
  constructor(engineRef) {
    this.terminalInput = document.getElementById("terminalInput");
    this.terminalOutput = document.getElementById("terminalOutput");
    this.engine = engineRef;
  }

  log(text, className = "output") {
    const line = document.createElement("div");
    line.className = `terminal-line ${className}`;
    line.textContent = text;
    this.terminalOutput.appendChild(line);
    this.scrollToBottom();
  }

  logCommand(command) {
    this.log(`[COSMO]$ ${command}`, "command");
  }

  logOutput(text) {
    this.log(text, "output");
  }

  logError(text) {
    this.log(text, "error");
  }

  logSuccess(text) {
    this.log(text, "success");
  }

  scrollToBottom() {
    this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
  }

  clear() {
    this.terminalOutput.innerHTML = "";
  }

  getInputValue() {
    return this.terminalInput.value;
  }

  setInputValue(value) {
    this.terminalInput.value = value;
  }

  focus() {
    this.terminalInput.focus();
  }
}

