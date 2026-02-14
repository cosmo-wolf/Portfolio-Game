import { Avatar } from "./entity.js";
import { ThemeManager } from "./theme.js";
import { World } from "./world.js";

const INTERACT_RADIUS = 180;

class Input {
  constructor(signal) {
    this.keys = new Set();
    this.pressed = new Set();
    window.addEventListener("keydown", (e) => this.onDown(e), { signal });
    window.addEventListener("keyup", (e) => this.onUp(e), { signal });
  }
  onDown(e) {
    const code = e.code;
    if (/^Key[WASDFTL]$/.test(code) || code === "Space") {
      if (!this.keys.has(code)) this.pressed.add(code);
      this.keys.add(code);
      e.preventDefault();
    }
  }
  onUp(e) {
    if (this.keys.has(e.code)) {
      this.keys.delete(e.code);
      e.preventDefault();
    }
  }
  axis() {
    return {
      x: (this.keys.has("KeyD") ? 1 : 0) - (this.keys.has("KeyA") ? 1 : 0),
      y: (this.keys.has("KeyS") ? 1 : 0) - (this.keys.has("KeyW") ? 1 : 0)
    };
  }
  sprint() { return this.keys.has("Space"); }
  justPressed(code) { return this.pressed.has(code); }
  endFrame() { this.pressed.clear(); }
}

class Engine {
  constructor() {
    this.canvas = document.getElementById("world");
    this.ctx = this.canvas.getContext("2d", { alpha: false, desynchronized: true });
    this.avatar = new Avatar();
    this.theme = new ThemeManager();
    this.world = new World();
    this.inputAbort = new AbortController();
    this.input = new Input(this.inputAbort.signal);
    this.camera = { x: 0, y: 0, follow: 0.09 };
    this.nearStructure = null;
    this.terminalActive = false;
    this.transition = { active: false, t: 0 };
    this.matrixChars = [];
    this.commandHistory = [];
    this.lastTs = 0;
    this.raf = 0;
    this.running = true;

    this.width = 1;
    this.height = 1;
    this.dpr = 1;
    this.resize();
    this.cacheUI();
    this.bindUI();
    this.bindSystem();
    this.loop = (ts) => this.tick(ts);
    this.raf = requestAnimationFrame(this.loop);
  }

  cacheUI() {
    this.avatarButton = document.getElementById("avatarSwitch");
    this.themeButton = document.getElementById("themeSwitch");
    this.timeButton = document.getElementById("timeSwitch");
    this.prompt = document.getElementById("exploreBubble");
    this.terminal = document.getElementById("terminalRoot");
    this.terminalOutput = document.getElementById("terminalOutput");
    this.terminalInput = document.getElementById("terminalInput");
  }

  bindUI() {
    this.syncButtons();
    this.avatarButton.addEventListener("click", () => {
      this.avatar.toggleJungleForm();
      this.syncButtons();
    }, { signal: this.inputAbort.signal });
    this.themeButton.addEventListener("click", () => this.toggleBiome(), { signal: this.inputAbort.signal });
    this.timeButton.addEventListener("click", () => {
      this.theme.toggleTime();
      this.syncButtons();
      this.applyCssTheme();
    }, { signal: this.inputAbort.signal });
    this.terminalInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.executeTerminalCommand(this.terminalInput.value.trim());
        this.terminalInput.value = "";
      }
    }, { signal: this.inputAbort.signal });
  }

  bindSystem() {
    window.addEventListener("resize", () => this.resize(), { signal: this.inputAbort.signal, passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.running = false;
        cancelAnimationFrame(this.raf);
      } else {
        this.running = true;
        this.lastTs = performance.now();
        this.raf = requestAnimationFrame(this.loop);
      }
    }, { signal: this.inputAbort.signal, passive: true });
    window.addEventListener("beforeunload", () => this.destroy(), { signal: this.inputAbort.signal, passive: true });
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.max(1, Math.floor(this.width * this.dpr));
    this.canvas.height = Math.max(1, Math.floor(this.height * this.dpr));
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  tick(ts) {
    if (!this.running) return;
    if (!this.lastTs) this.lastTs = ts;
    let dt = (ts - this.lastTs) / 1000;
    this.lastTs = ts;
    if (dt > 0.04) dt = 0.04;

    this.update(dt, ts);
    this.render(ts);
    this.input.endFrame();
    this.raf = requestAnimationFrame(this.loop);
  }

  update(dt, ts) {
    if (this.transition.active) {
      this.transition.t += dt / 0.8;
      if (this.transition.t >= 1) {
        this.transition.active = false;
        this.transition.t = 1;
        this.terminalActive = !this.terminalActive;
        this.terminal.classList.toggle("open", this.terminalActive);
        if (this.terminalActive) this.terminalInput.focus();
      }
      this.updateMatrix(dt);
      return;
    }
    if (this.terminalActive) {
      this.updateMatrix(dt);
      if (this.input.justPressed("KeyT")) this.toggleTerminalMode();
      return;
    }

    this.avatar.update(dt, this.input.axis(), this.input.sprint());
    this.world.update(dt);

    const smooth = 1 - Math.pow(1 - this.camera.follow, dt * 60);
    this.camera.x += (this.avatar.x - this.camera.x) * smooth;
    this.camera.y += (this.avatar.y - this.camera.y) * smooth;
    this.nearStructure = this.world.getNearestStructure(this.avatar.x, this.avatar.y, INTERACT_RADIUS);
    this.updateInteractionPrompt();

    if (this.input.justPressed("KeyF") && this.nearStructure) {
      this.handleStructureInteraction(this.nearStructure);
    }
    if (this.input.justPressed("KeyL")) this.theme.toggleTerminalMode();
    if (this.input.justPressed("KeyT")) {
      this.theme.toggleTime();
      this.syncButtons();
      this.applyCssTheme();
    }
  }

  updateInteractionPrompt() {
    if (this.nearStructure) {
      this.prompt.classList.add("active");
      this.prompt.textContent = `Press [F] ${this.nearStructure.data.title || this.nearStructure.type}`;
    } else {
      this.prompt.classList.remove("active");
      this.prompt.textContent = "";
    }
  }

  handleStructureInteraction(s) {
    if (s.type === "PORTAL_GATE") this.toggleBiome();
    else if (s.type === "TERMINAL_GATE") this.startTerminalTransition();
    else if (s.type === "MONOLITH") this.pushTerminalLine(`${s.data.title}: lore archive synced.`);
    else if (s.type === "CODE_RUIN_A") this.pushTerminalLine("Ruin A online: A* route stabilized.");
    else if (s.type === "CODE_RUIN_B") this.pushTerminalLine("Ruin B online: stream parser active.");
  }

  toggleBiome() {
    this.theme.toggleBiome();
    this.avatar.setBiome(this.theme.biome);
    this.syncButtons();
    this.applyCssTheme();
  }

  toggleTerminalMode() {
    this.theme.toggleTerminalMode();
    this.applyTerminalSkin();
  }

  syncButtons() {
    this.avatarButton.textContent = `Avatar: ${this.avatar.jungleForm}`;
    this.themeButton.textContent = `Biome: ${this.theme.biome}`;
    this.timeButton.textContent = `Time: ${this.theme.time}`;
  }

  applyCssTheme() {
    const t = this.theme.getWorldTheme();
    document.documentElement.style.setProperty("--hud-surface", t.uiSurface);
    document.documentElement.style.setProperty("--hud-text", t.uiText);
    document.documentElement.style.setProperty("--accent", t.accent);
  }

  applyTerminalSkin() {
    const dark = this.theme.terminalMode === "MATRIX_DARK";
    this.terminal.classList.toggle("matrix-dark", dark);
    this.terminal.classList.toggle("eco-light", !dark);
  }

  pushTerminalLine(text) {
    this.commandHistory.push(text);
    if (this.commandHistory.length > 32) this.commandHistory.shift();
    this.renderTerminalOutput();
  }

  renderTerminalOutput() {
    this.terminalOutput.innerHTML = this.commandHistory.map((line) => `<div>${line}</div>`).join("");
    this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
  }

  executeTerminalCommand(raw) {
    if (!raw) return;
    this.pushTerminalLine(`> ${raw}`);
    if (raw === "help") {
      this.pushTerminalLine("Commands: ls, help, python sentinel.py, theme --toggle");
    } else if (raw === "ls") {
      this.pushTerminalLine("about projects ruins portal terminal");
    } else if (raw === "python sentinel.py") {
      this.pushTerminalLine("sentinel.py: biome integrity = OK, city neon = armed");
    } else if (raw === "theme --toggle") {
      this.toggleTerminalMode();
      this.pushTerminalLine(`terminal mode -> ${this.theme.terminalMode}`);
    } else {
      this.pushTerminalLine("unknown command");
    }
  }

  updateMatrix(dt) {
    if (this.theme.terminalMode !== "MATRIX_DARK") return;
    if (!this.matrixChars.length) {
      for (let i = 0; i < 48; i += 1) {
        this.matrixChars.push({ x: Math.random(), y: Math.random(), s: 0.1 + Math.random() * 0.4 });
      }
    }
    for (let i = 0; i < this.matrixChars.length; i += 1) {
      const c = this.matrixChars[i];
      c.y += dt * c.s * 0.35;
      if (c.y > 1.2) c.y = -0.1;
    }
  }

  render(ts) {
    const theme = this.theme.getWorldTheme();
    this.world.draw(this.ctx, this.camera, this.width, this.height, theme, this.theme.biome, this.theme.isNight(), ts);
    const sx = this.avatar.x - this.camera.x + this.width * 0.5;
    const sy = this.avatar.y - this.camera.y + this.height * 0.5;
    this.avatar.draw(this.ctx, sx, sy, this.theme.isNight());
    this.prompt.style.transform = `translate(${sx}px, ${sy - this.avatar.size - 20}px) translate(-50%, -120%)`;
    if (this.transition.active) this.drawTransition();
    if (this.terminalActive) this.drawMatrixOverlay();
  }

  drawTransition() {
    const z = this.transition.t;
    const alpha = z < 0.5 ? z * 1.6 : (1 - z) * 1.6;
    this.ctx.fillStyle = `rgba(255,255,255,${Math.max(0, alpha)})`;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.strokeStyle = "rgba(0,255,65,0.65)";
    this.ctx.lineWidth = 2;
    const r = Math.max(10, 260 * (1 - z));
    this.ctx.beginPath();
    this.ctx.arc(this.width * 0.5, this.height * 0.5, r, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  drawMatrixOverlay() {
    if (this.theme.terminalMode !== "MATRIX_DARK") return;
    const overlay = document.getElementById("matrixOverlay");
    overlay.innerHTML = this.matrixChars.map((c, i) => {
      const x = Math.floor(c.x * 100);
      const y = Math.floor(c.y * 100);
      const char = String.fromCharCode(0x30a0 + ((i * 17 + Math.floor(c.y * 1000)) % 96));
      return `<span style="left:${x}%;top:${y}%;opacity:${0.35 + c.s};">${char}</span>`;
    }).join("");
  }

  startTerminalTransition() {
    if (this.transition.active) return;
    this.transition.active = true;
    this.transition.t = 0;
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.inputAbort.abort();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const engine = new Engine();
  engine.applyCssTheme();
  engine.applyTerminalSkin();
  engine.pushTerminalLine("Digital Dive ready. Type help.");
});
