function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

function normalizeAngle(rad) {
  let r = rad;
  while (r > Math.PI) r -= Math.PI * 2;
  while (r < -Math.PI) r += Math.PI * 2;
  return r;
}

export class Entity {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.targetAngle = 0;
  }
}

export class Avatar extends Entity {
  constructor() {
    super();
    this.biome = "JUNGLE";
    this.jungleForm = "TORTOISE";
    this.type = "TORTOISE";
    this.walkPhase = 0;
    this.lean = 0;
    this.isSprinting = false;
    this.drift = 0.18;
    this.setBiome("JUNGLE");
  }

  toggleJungleForm() {
    this.jungleForm = this.jungleForm === "TORTOISE" ? "JAGUAR" : "TORTOISE";
    if (this.biome === "JUNGLE") this.setType(this.jungleForm);
  }

  setBiome(biome) {
    this.biome = biome;
    if (biome === "CITY") this.setType("CYBER");
    else this.setType(this.jungleForm);
  }

  setType(type) {
    this.type = type;
    if (type === "JAGUAR") {
      this.baseMaxSpeed = 330;
      this.accel = 980;
      this.friction = 0.86;
      this.turnRate = 7.2;
      this.size = 26;
      this.sprintMultiplier = 2.4;
      this.drift = 0.2;
    } else if (type === "CYBER") {
      this.baseMaxSpeed = 300;
      this.accel = 760;
      this.friction = 0.93;
      this.turnRate = 6.2;
      this.size = 24;
      this.sprintMultiplier = 1.7;
      this.drift = 0.68;
    } else {
      this.baseMaxSpeed = 175;
      this.accel = 330;
      this.friction = 0.91;
      this.turnRate = 3.0;
      this.size = 32;
      this.sprintMultiplier = 1.9;
      this.drift = 0.16;
    }
  }

  getCurrentMaxSpeed() {
    return this.isSprinting ? this.baseMaxSpeed * this.sprintMultiplier : this.baseMaxSpeed;
  }

  getSpeed() {
    return Math.hypot(this.vx, this.vy);
  }

  update(dt, axis, sprintHeld) {
    this.isSprinting = sprintHeld;
    let ix = axis.x;
    let iy = axis.y;
    const lenSq = ix * ix + iy * iy;
    if (lenSq > 0.0001) {
      const inv = 1 / Math.sqrt(lenSq);
      ix *= inv;
      iy *= inv;
      this.vx += ix * this.accel * dt;
      this.vy += iy * this.accel * dt;
    }

    const maxSpeed = this.getCurrentMaxSpeed();
    const speed = this.getSpeed();
    if (speed > maxSpeed) {
      const m = maxSpeed / speed;
      this.vx *= m;
      this.vy *= m;
    }

    if (this.type === "CYBER") {
      const moveAngle = Math.atan2(this.vy, this.vx);
      const turnDelta = normalizeAngle(this.targetAngle - moveAngle);
      const driftScale = clamp(Math.abs(turnDelta) / Math.PI, 0, 1);
      const driftDrag = Math.pow(this.friction + this.drift * driftScale * 0.06, dt * 60);
      this.vx *= driftDrag;
      this.vy *= driftDrag;
    } else {
      const drag = Math.pow(this.friction, dt * 60);
      this.vx *= drag;
      this.vy *= drag;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    const currentSpeed = this.getSpeed();
    if (currentSpeed > 2) this.targetAngle = Math.atan2(this.vy, this.vx);
    const delta = normalizeAngle(this.targetAngle - this.angle);
    this.angle += clamp(delta, -this.turnRate * dt, this.turnRate * dt);
    const targetLean = clamp(Math.sin(delta) * 0.16, -0.2, 0.2);
    this.lean += (targetLean - this.lean) * Math.min(1, dt * 10);
    this.walkPhase += dt * (4 + currentSpeed * 0.03);
  }

  draw(ctx, sx, sy, night) {
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(this.angle + this.lean);
    if (this.type === "JAGUAR") this.drawJaguar(ctx);
    else if (this.type === "CYBER") this.drawCyber(ctx, night);
    else this.drawTortoise(ctx);
    ctx.restore();
  }

  drawTortoise(ctx) {
    const stride = Math.sin(this.walkPhase) * 5;
    ctx.fillStyle = "#819163";
    ctx.beginPath();
    ctx.ellipse(0, 0, 32, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(41,53,29,0.6)";
    ctx.stroke();
    ctx.fillStyle = "#9bad81";
    ctx.beginPath();
    ctx.ellipse(36, 0, 13, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#74855a";
    ctx.fillRect(-20, -17 + stride * 0.06, 8, 7);
    ctx.fillRect(-20, 10 - stride * 0.06, 8, 7);
    ctx.fillRect(14, -17 - stride * 0.06, 8, 7);
    ctx.fillRect(14, 10 + stride * 0.06, 8, 7);
  }

  drawJaguar(ctx) {
    const stride = Math.sin(this.walkPhase * 1.2) * 6;
    ctx.fillStyle = "#d0b277";
    ctx.beginPath();
    ctx.ellipse(0, 0, 30, 17, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e5cc97";
    ctx.beginPath();
    ctx.ellipse(30, 0, 12, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#8c683a";
    ctx.fillRect(-18, -15 + stride * 0.08, 7, 6);
    ctx.fillRect(-18, 9 - stride * 0.08, 7, 6);
    ctx.fillRect(14, -15 - stride * 0.08, 7, 6);
    ctx.fillRect(14, 9 + stride * 0.08, 7, 6);
  }

  drawCyber(ctx, night) {
    ctx.fillStyle = "#1f2b3b";
    ctx.beginPath();
    ctx.roundRect(-24, -14, 48, 28, 6);
    ctx.fill();
    ctx.fillStyle = night ? "#19f7ff" : "#1aa4e1";
    ctx.fillRect(-20, -10, 40, 3);
    ctx.fillRect(-20, -1, 34, 3);
    ctx.fillRect(-20, 8, 28, 3);
    if (night) {
      ctx.shadowBlur = 14;
      ctx.shadowColor = "#19f7ff";
      ctx.fillRect(17, -12, 5, 24);
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = "#0d6f9e";
      ctx.fillRect(17, -12, 5, 24);
    }
  }
}
