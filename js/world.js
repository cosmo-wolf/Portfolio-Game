export class Structure {
  constructor(type, x, y, data = {}) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.data = data;
    this.radius = data.radius || 180;
  }
}

function gridNoise(x, y) {
  const v = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return v - Math.floor(v);
}

const PATH_GRID = [
  "0000000000",
  "0111111100",
  "0000010100",
  "0111010100",
  "0100010100",
  "0101110100",
  "0100000100",
  "0111111100",
  "0000000000"
];

export class World {
  constructor() {
    this.cell = 180;
    this.structures = [
      new Structure("MONOLITH", -950, -700, { title: "About", subtitle: "Interact [F]" }),
      new Structure("MONOLITH", 850, -740, { title: "Projects", subtitle: "Interact [F]" }),
      new Structure("CODE_RUIN_A", -1050, 880, { title: "Ruin A: A* Pathfinding", radius: 240 }),
      new Structure("CODE_RUIN_B", 980, 880, { title: "Ruin B: Data Stream", radius: 240 }),
      new Structure("PORTAL_GATE", 0, 1180, { title: "Biome Portal", radius: 220 }),
      new Structure("TERMINAL_GATE", 0, -1200, { title: "Ancient Console", radius: 220 })
    ];
    this.streamItems = [];
    this.streamTimer = 0;
    this.ghostT = 0;
    this.pathPoints = this.solveAStar();
  }

  update(dt) {
    this.ghostT += dt * 0.28;
    this.streamTimer += dt;
    if (this.streamTimer > 0.48) {
      this.streamTimer = 0;
      const messy = "<div><h1>user</h1><p>skills:js,py</p></div>";
      const clean = '{"user":"user","skills":["js","py"]}';
      this.streamItems.push({ messy, clean, t: 0 });
    }
    for (let i = this.streamItems.length - 1; i >= 0; i -= 1) {
      this.streamItems[i].t += dt;
      if (this.streamItems[i].t > 5) this.streamItems.splice(i, 1);
    }
  }

  getNearestStructure(x, y, maxDistance) {
    let best = null;
    let bestSq = Infinity;
    for (let i = 0; i < this.structures.length; i += 1) {
      const s = this.structures[i];
      const dx = x - s.x;
      const dy = y - s.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestSq) {
        best = s;
        bestSq = d2;
      }
    }
    if (!best) return null;
    return bestSq <= maxDistance * maxDistance ? best : null;
  }

  draw(ctx, camera, width, height, theme, biome, isNight, ts) {
    this.drawGround(ctx, camera, width, height, theme, biome);
    for (let i = 0; i < this.structures.length; i += 1) {
      this.drawStructure(ctx, camera, width, height, this.structures[i], theme, isNight, ts);
    }
    if (isNight) {
      ctx.fillStyle = "rgba(3, 5, 10, 0.28)";
      ctx.fillRect(0, 0, width, height);
    }
  }

  drawGround(ctx, camera, width, height, theme, biome) {
    const g = ctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0, theme.skyTop);
    g.addColorStop(1, theme.skyBottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
    const minX = camera.x - width * 0.5;
    const minY = camera.y - height * 0.5;
    const startX = Math.floor(minX / this.cell) - 1;
    const endX = Math.ceil((camera.x + width * 0.5) / this.cell) + 1;
    const startY = Math.floor(minY / this.cell) - 1;
    const endY = Math.ceil((camera.y + height * 0.5) / this.cell) + 1;
    for (let y = startY; y <= endY; y += 1) {
      for (let x = startX; x <= endX; x += 1) {
        const sx = x * this.cell - camera.x + width * 0.5;
        const sy = y * this.cell - camera.y + height * 0.5;
        const n = gridNoise(x, y);
        if (biome === "JUNGLE") {
          ctx.fillStyle = n > 0.58 ? "rgba(112,132,73,0.32)" : "rgba(210,220,165,0.16)";
          ctx.beginPath();
          ctx.arc(sx + n * 40, sy + n * 30, 18 + n * 22, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.strokeStyle = "rgba(68,81,101,0.35)";
          ctx.lineWidth = 1;
          ctx.strokeRect(sx, sy, this.cell - 1, this.cell - 1);
          if (n > 0.67) {
            ctx.fillStyle = "rgba(28,38,59,0.24)";
            ctx.fillRect(sx + 14, sy + 14, this.cell - 28, this.cell - 28);
          }
        }
      }
    }
  }

  drawStructure(ctx, camera, width, height, s, theme, isNight, ts) {
    const sx = s.x - camera.x + width * 0.5;
    const sy = s.y - camera.y + height * 0.5;
    if (s.type === "MONOLITH") this.drawMonolith(ctx, sx, sy, s, theme, isNight);
    else if (s.type === "CODE_RUIN_A") this.drawPathRuin(ctx, sx, sy, s, isNight, ts);
    else if (s.type === "CODE_RUIN_B") this.drawStreamRuin(ctx, sx, sy, s, isNight);
    else if (s.type === "PORTAL_GATE") this.drawPortal(ctx, sx, sy, s, isNight, ts, theme.accent);
    else if (s.type === "TERMINAL_GATE") this.drawTerminalGate(ctx, sx, sy, s, isNight, ts, theme.accent);
  }

  drawMonolith(ctx, x, y, s, theme, isNight) {
    ctx.fillStyle = isNight ? "rgba(32,40,46,0.9)" : "rgba(225,214,184,0.95)";
    ctx.fillRect(x - 54, y - 90, 108, 180);
    ctx.fillStyle = isNight ? theme.accent : "#6c6d45";
    ctx.fillRect(x - 44, y - 68, 88, 8);
    ctx.fillStyle = isNight ? "#e8f8ff" : "#413d30";
    ctx.font = "600 14px Montserrat, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(s.data.title, x, y + 10);
    ctx.font = "600 11px Montserrat, sans-serif";
    ctx.fillText(s.data.subtitle, x, y + 30);
    if (isNight) {
      ctx.shadowBlur = 12;
      ctx.shadowColor = theme.accent;
      ctx.strokeStyle = theme.accent;
      ctx.strokeRect(x - 54, y - 90, 108, 180);
      ctx.shadowBlur = 0;
    }
  }

  drawPathRuin(ctx, x, y, s, isNight, ts) {
    ctx.fillStyle = isNight ? "rgba(10,16,26,0.86)" : "rgba(244,238,222,0.95)";
    ctx.fillRect(x - 126, y - 92, 252, 184);
    const cs = 18;
    const gridX = x - 90;
    const gridY = y - 70;
    for (let r = 0; r < PATH_GRID.length; r += 1) {
      for (let c = 0; c < PATH_GRID[r].length; c += 1) {
        const wall = PATH_GRID[r][c] === "1";
        ctx.fillStyle = wall ? (isNight ? "#26335f" : "#8f9ebf") : (isNight ? "#15212f" : "#d8dded");
        ctx.fillRect(gridX + c * cs, gridY + r * cs, cs - 1, cs - 1);
      }
    }
    const idx = Math.floor((this.ghostT % 1) * this.pathPoints.length);
    const p = this.pathPoints[idx];
    ctx.fillStyle = "#90f1ff";
    ctx.beginPath();
    ctx.arc(gridX + p.c * cs + cs * 0.5, gridY + p.r * cs + cs * 0.5, 5, 0, Math.PI * 2);
    ctx.fill();
    if (isNight) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#90f1ff";
      ctx.strokeStyle = "#59d4f3";
      ctx.strokeRect(x - 126, y - 92, 252, 184);
      ctx.shadowBlur = 0;
    }
    ctx.fillStyle = isNight ? "#9de6ff" : "#334162";
    ctx.font = "600 12px Montserrat, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("A* ghost seeks exit", x - 114, y + 84);
  }

  drawStreamRuin(ctx, x, y, s, isNight) {
    ctx.fillStyle = isNight ? "rgba(8,16,10,0.9)" : "rgba(250,247,238,0.95)";
    ctx.fillRect(x - 140, y - 96, 280, 192);
    ctx.save();
    ctx.beginPath();
    ctx.rect(x - 132, y - 84, 264, 168);
    ctx.clip();
    for (let i = 0; i < this.streamItems.length; i += 1) {
      const item = this.streamItems[i];
      const sy = y + 70 - item.t * 34;
      const alpha = Math.max(0, 1 - item.t / 5);
      ctx.fillStyle = `rgba(200,100,80,${alpha * 0.7})`;
      ctx.font = "11px monospace";
      ctx.fillText(item.messy, x - 122, sy);
      ctx.fillStyle = `rgba(80,230,140,${alpha})`;
      ctx.fillText(item.clean, x - 122, sy - 14);
    }
    ctx.restore();
    ctx.fillStyle = isNight ? "#97ffb5" : "#2d5933";
    ctx.font = "600 12px Montserrat, sans-serif";
    ctx.fillText("Messy HTML -> clean JSON", x - 122, y + 88);
  }

  drawPortal(ctx, x, y, s, isNight, ts, accent) {
    const pulse = 1 + Math.sin(ts * 0.003) * 0.08;
    ctx.strokeStyle = isNight ? accent : "#4a6579";
    ctx.lineWidth = 10;
    if (isNight) {
      ctx.shadowBlur = 18;
      ctx.shadowColor = accent;
    }
    ctx.beginPath();
    ctx.arc(x, y, 72 * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = isNight ? "#9af9ff" : "#2d4755";
    ctx.font = "600 12px Montserrat, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PORTAL [F]", x, y + 110);
  }

  drawTerminalGate(ctx, x, y, s, isNight, ts, accent) {
    const jitter = Math.sin(ts * 0.017) * 2;
    ctx.fillStyle = isNight ? "rgba(0,0,0,0.85)" : "rgba(238,232,210,0.95)";
    ctx.fillRect(x - 86, y - 62, 172, 124);
    ctx.strokeStyle = isNight ? "#00ff41" : "#4a5d23";
    ctx.lineWidth = 3;
    ctx.strokeRect(x - 86 + jitter, y - 62, 172, 124);
    ctx.fillStyle = isNight ? "#00ff41" : "#4a5d23";
    ctx.font = "600 12px monospace";
    ctx.textAlign = "center";
    ctx.fillText("ANCIENT CONSOLE", x, y - 8);
    ctx.fillText("INITIATE DIVE [F]", x, y + 12);
    if (isNight) {
      ctx.shadowBlur = 14;
      ctx.shadowColor = accent;
      ctx.beginPath();
      ctx.arc(x, y, 102, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,255,65,0.34)";
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  solveAStar() {
    const rows = PATH_GRID.length;
    const cols = PATH_GRID[0].length;
    const start = { r: 0, c: 0 };
    const goal = { r: rows - 1, c: cols - 1 };
    const open = [{ ...start, g: 0, f: 0 }];
    const came = new Map();
    const cost = new Map();
    const key = (r, c) => `${r},${c}`;
    cost.set(key(start.r, start.c), 0);
    while (open.length) {
      open.sort((a, b) => a.f - b.f);
      const cur = open.shift();
      if (cur.r === goal.r && cur.c === goal.c) break;
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (let i = 0; i < dirs.length; i += 1) {
        const nr = cur.r + dirs[i][0];
        const nc = cur.c + dirs[i][1];
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (PATH_GRID[nr][nc] === "1") continue;
        const nk = key(nr, nc);
        const nextCost = cur.g + 1;
        if (!cost.has(nk) || nextCost < cost.get(nk)) {
          cost.set(nk, nextCost);
          const h = Math.abs(goal.r - nr) + Math.abs(goal.c - nc);
          open.push({ r: nr, c: nc, g: nextCost, f: nextCost + h });
          came.set(nk, key(cur.r, cur.c));
        }
      }
    }
    const path = [];
    let walk = key(goal.r, goal.c);
    while (walk) {
      const parts = walk.split(",");
      path.push({ r: Number(parts[0]), c: Number(parts[1]) });
      walk = came.get(walk);
      if (walk === key(start.r, start.c)) {
        path.push(start);
        break;
      }
    }
    path.reverse();
    return path.length ? path : [start, goal];
  }
}
