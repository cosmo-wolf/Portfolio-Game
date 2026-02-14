/**
 * FileSystem - Virtual file system simulation
 */
class FileSystem {
  constructor() {
    this.currentDir = '~';
    this.files = {
      '~': {
        type: 'directory',
        name: 'home',
        contents: ['about.txt', 'skills.md', 'projects']
      },
      '~/about.txt': {
        type: 'file',
        name: 'about.txt',
        content: `╔════════════════════════════════════════╗
║          COSMO WOLF - BIO              ║
╚════════════════════════════════════════╝

Name: Cosmo Wolf
Role: Python Automation & Creative Developer
Location: Earth

ABOUT:
  Full-stack developer passionate about creating
  elegant solutions to complex problems. Obsessed
  with performance, clean code, and creative
  web experiences.

SPECIALTIES:
  • Web scraping & data automation
  • Game engine development
  • Terminal UI design
  • Full-stack JavaScript
  • Python automation

PHILOSOPHY:
  Building tools that are not just functional,
  but beautiful and enjoyable to use.

CONTACT:
  Email: cosmo@portfolio.dev
  GitHub: github.com/cosmowolf
  Portfolio: portfolio.vercel.app

═══════════════════════════════════════════════`
      },
      '~/skills.md': {
        type: 'file',
        name: 'skills.md',
        content: `# TECHNICAL SKILLS

## Frontend
  ★★★★★ JavaScript (ES6+, Vanilla)
  ★★★★☆ HTML5 & CSS3
  ★★★★☆ Canvas & WebGL Rendering
  ★★★☆☆ React.js
  ★★★☆☆ Responsive Design

## Backend
  ★★★★★ Python 3
  ★★★★☆ Node.js & Express.js
  ★★★★☆ REST API Design
  ★★★☆☆ PostgreSQL & SQL

## Game Development
  ★★★★☆ Tile-based Engines
  ★★★★☆ Sprite Animation
  ★★★★☆ Game Physics
  ★★★☆☆ Canvas Rendering

## DevOps & Tools
  ★★★☆☆ Docker
  ★★★☆☆ Git & GitHub
  ★★★☆☆ CI/CD Basics
  ★★★☆☆ Linux/Terminal

## Languages Proficiency
  Python      ████████░░ 95%
  JavaScript  █████████░ 90%
  SQL         ████████░░ 85%
  HTML/CSS    █████████░ 90%
  Bash        ███████░░░ 75%`
      },
      '~/projects': {
        type: 'directory',
        name: 'projects',
        contents: ['bar-scraper', 'portfolio-engine', 'data-pipeline']
      },
      '~/projects/bar-scraper': {
        type: 'directory',
        name: 'bar-scraper',
        contents: ['README.md', 'main.py']
      },
      '~/projects/bar-scraper/README.md': {
        type: 'file',
        name: 'README.md',
        content: `# BAR SCRAPER

A robust web scraping utility for extracting
and analyzing venue/bar information.

## Features
  ✓ Selenium browser automation
  ✓ PostgreSQL data storage
  ✓ Multi-threaded scraping
  ✓ Data validation pipeline
  ✓ CSV/JSON export

## Stack
  • Python 3.9+
  • Selenium WebDriver
  • PostgreSQL 13+
  • BeautifulSoup4
  • Pandas

## Status
  ✓ Production Ready

## GitHub
  github.com/cosmowolf/bar-scraper`
      },
      '~/projects/portfolio-engine': {
        type: 'directory',
        name: 'portfolio-engine',
        contents: ['README.md', 'index.html']
      },
      '~/projects/portfolio-engine/README.md': {
        type: 'file',
        name: 'README.md',
        content: `# PORTFOLIO ENGINE v1.0

Terminal-first interactive portfolio with
CRT aesthetics and typewriter effects.

## Features
  ✓ Interactive terminal interface
  ✓ CRT scanline effects
  ✓ Typewriter text streaming
  ✓ Virtual file system navigation
  ✓ Responsive design
  ✓ No dependencies

## Tech Stack
  • Vanilla JavaScript (ES6)
  • HTML5 & CSS3
  • Courier Prime Font
  • Canvas-less design

## Status
  ✓ Completed

## GitHub
  github.com/cosmowolf/portfolio-engine`
      },
      '~/projects/data-pipeline': {
        type: 'directory',
        name: 'data-pipeline',
        contents: ['README.md', 'dag.yaml']
      },
      '~/projects/data-pipeline/README.md': {
        type: 'file',
        name: 'README.md',
        content: `# DATA PIPELINE ETL

Automated Extract-Transform-Load workflow
for large-scale data processing.

## Features
  ✓ DAG-based orchestration
  ✓ Error handling & retries
  ✓ Data validation
  ✓ Scheduled execution
  ✓ Monitoring alerts
  ✓ Container deployment

## Tech Stack
  • Apache Airflow
  • Docker & Compose
  • Python & Pandas
  • PostgreSQL
  • AWS S3

## Status
  ⧗ In Development

## GitHub
  github.com/cosmowolf/data-pipeline`
      }
    };
  }

  /**
   * List directory contents
   */
  list(path = this.currentDir) {
    const entry = this.files[path];
    
    if (!entry) {
      return { error: `Directory not found: ${path}` };
    }
    
    if (entry.type !== 'directory') {
      return { error: `Not a directory: ${path}` };
    }
    
    return { contents: entry.contents, dirName: entry.name };
  }

  /**
   * Change directory
   */
  changeDir(dir) {
    if (dir === '~' || dir === '') {
      this.currentDir = '~';
      return { success: true };
    }

    let targetPath = dir.startsWith('~')
      ? dir
      : `${this.currentDir}/${dir}`;

    const entry = this.files[targetPath];
    
    if (!entry) {
      return { error: `No such directory: ${dir}` };
    }
    
    if (entry.type !== 'directory') {
      return { error: `Not a directory: ${dir}` };
    }

    this.currentDir = targetPath;
    return { success: true };
  }

  /**
   * Read file contents
   */
  cat(filename) {
    let filePath = filename.startsWith('~') || filename.startsWith('/')
      ? filename
      : `${this.currentDir}/${filename}`;
    
    const entry = this.files[filePath];

    if (!entry) {
      return { error: `File not found: ${filename}` };
    }

    if (entry.type !== 'file') {
      return { error: `Not a file: ${filename}` };
    }

    return { content: entry.content };
  }

  /**
   * Get current working directory (pwd)
   */
  pwd() {
    return this.currentDir;
  }
}

/**
 * TerminalUI - Main terminal interface with typewriter effect
 */
export class TerminalUI {
  constructor() {
    this.input = document.getElementById('terminalInput');
    this.output = document.getElementById('output');
    this.fileSystem = new FileSystem();
    this.isTyping = false;
    this.commandHistory = [];
    this.historyIndex = -1;

    this.setupEventListeners();
    this.showWelcome();
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.executeCommand(this.input.value);
        this.input.value = '';
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        this.navigateHistory(-1);
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        this.navigateHistory(1);
        e.preventDefault();
      }
    });

    // Auto-focus input
    this.input.focus();
    window.addEventListener('click', () => this.input.focus());
  }

  /**
   * Navigate command history
   */
  navigateHistory(direction) {
    const newIndex = this.historyIndex + direction;
    
    if (newIndex >= -1 && newIndex < this.commandHistory.length) {
      this.historyIndex = newIndex;
      this.input.value = newIndex === -1 ? '' : this.commandHistory[newIndex];
    }
  }

  /**
   * Show welcome message on startup
   */
  showWelcome() {
    const welcome = `╔════════════════════════════════════════╗
║  Welcome to COSMO WOLF Terminal v1.0   ║
║                                        ║
║  Type 'help' for available commands    ║
╚════════════════════════════════════════╝`;
    
    this.typeOut(welcome, 'output');
  }

  /**
   * Display typewriter effect
   */
  async typeOut(text, className = 'output') {
    // Return promise if text is empty
    if (!text || text.length === 0) return;

    this.isTyping = true;
    const delay = 5; // milliseconds per character

    const line = document.createElement('div');
    line.className = `output-line ${className}`;
    this.output.appendChild(line);

    for (let i = 0; i < text.length; i++) {
      line.textContent += text[i];
      await new Promise(resolve => setTimeout(resolve, delay));
      // Auto-scroll to bottom
      this.output.scrollTop = this.output.scrollHeight;
    }

    this.isTyping = false;
    this.output.scrollTop = this.output.scrollHeight;
  }

  /**
   * Display output without typewriter (for faster display)
   */
  displayOutput(text, className = 'output') {
    const line = document.createElement('div');
    line.className = `output-line ${className}`;
    line.textContent = text;
    this.output.appendChild(line);
    this.output.scrollTop = this.output.scrollHeight;
  }

  /**
   * Clear terminal
   */
  clearTerminal() {
    this.output.innerHTML = '';
  }

  /**
   * Execute command
   */
  async executeCommand(cmd) {
    const trimmed = cmd.trim();
    
    if (!trimmed) return;

    // Add to history
    this.commandHistory.unshift(trimmed);
    this.historyIndex = -1;

    // Display command
    this.displayOutput(`cosmo@aura-sentinel:~$ ${trimmed}`, 'command');

    // Parse command
    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Execute
    switch (command) {
      case 'help':
        await this.cmdHelp();
        break;
      case 'whoami':
        await this.cmdWhoami();
        break;
      case 'about':
        await this.cmdAbout();
        break;
      case 'projects':
        await this.cmdProjects();
        break;
      case 'ls':
        await this.cmdLs(args);
        break;
      case 'cat':
        await this.cmdCat(args);
        break;
      case 'cd':
        await this.cmdCd(args);
        break;
      case 'pwd':
        await this.cmdPwd();
        break;
      case 'clear':
        this.clearTerminal();
        break;
      default:
        this.displayOutput(`command not found: ${command}`, 'error');
    }
  }

  /**
   * Command: help
   */
  async cmdHelp() {
    const help = `AVAILABLE COMMANDS:

  help      - Show this help message
  whoami    - Display user information
  about     - About Cosmo Wolf
  projects  - View portfolio projects
  ls        - List directory contents
  cat [file]- Display file contents
  cd [dir]  - Change directory
  pwd       - Print working directory
  clear     - Clear terminal

EXAMPLE USAGE:
  > ls
  > cat about.txt
  > cd projects
  > cat bar-scraper/README.md

═══════════════════════════════════════════════`;

    await this.typeOut(help, 'info');
  }

  /**
   * Command: whoami
   */
  async cmdWhoami() {
    const whoami = `user: cosmo
hostname: aura-sentinel
shell: /bin/cosmo-shell
home: ~
status: Online & Ready`;

    await this.typeOut(whoami, 'output');
  }

  /**
   * Command: about
   */
  async cmdAbout() {
    const result = this.fileSystem.cat('~/about.txt');
    
    if (result.error) {
      this.displayOutput(result.error, 'error');
      return;
    }

    await this.typeOut(result.content, 'output');
  }

  /**
   * Command: projects
   */
  async cmdProjects() {
    const projects = `PORTFOLIO PROJECTS:

[1] bar-scraper
    Web scraping utility for venue data
    Status: ✓ Complete
    
    > cd projects && cat bar-scraper/README.md

[2] portfolio-engine
    Terminal-first interactive portfolio
    Status: ✓ Complete
    
    > cat projects/portfolio-engine/README.md

[3] data-pipeline
    Automated ETL workflow system
    Status: ⧗ In Development
    
    > cat projects/data-pipeline/README.md

═══════════════════════════════════════════════`;

    await this.typeOut(projects, 'output');
  }

  /**
   * Command: ls (list directory)
   */
  async cmdLs(args) {
    const dir = args.length > 0 ? args[0] : this.fileSystem.currentDir;
    const result = this.fileSystem.list(dir);

    if (result.error) {
      this.displayOutput(result.error, 'error');
      return;
    }

    const items = result.contents.map(name => {
      const fullPath = `${this.fileSystem.currentDir === '~' ? '~' : this.fileSystem.currentDir}/${name}`;
      const entry = this.fileSystem.files[fullPath];
      const isDir = entry && entry.type === 'directory';
      return isDir ? `[${name}]` : ` ${name}`;
    });

    const output = `\n${items.join('\n')}`;
    await this.typeOut(output, 'output');
  }

  /**
   * Command: cat (display file)
   */
  async cmdCat(args) {
    if (args.length === 0) {
      this.displayOutput('Usage: cat [filename]', 'error');
      return;
    }

    const filename = args[0];
    const result = this.fileSystem.cat(filename);

    if (result.error) {
      this.displayOutput(result.error, 'error');
      return;
    }

    await this.typeOut(result.content, 'output');
  }

  /**
   * Command: cd (change directory)
   */
  async cmdCd(args) {
    if (args.length === 0) {
      this.fileSystem.changeDir('~');
      this.displayOutput(`~/`, 'output');
      return;
    }

    const dir = args[0];
    const result = this.fileSystem.changeDir(dir);

    if (result.error) {
      this.displayOutput(result.error, 'error');
      return;
    }

    this.displayOutput(`${this.fileSystem.pwd()}/`, 'output');
  }

  /**
   * Command: pwd (print working directory)
   */
  async cmdPwd() {
    this.displayOutput(this.fileSystem.pwd(), 'output');
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  new TerminalUI();
});

