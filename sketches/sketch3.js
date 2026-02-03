// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  let cx, cy;

  const hLen = 180;
  const mLen = 140;
  const sLen = 100;
  const tickR = 260;
 
  p.setup = function () {
    p.createCanvas(750,750);
    cx = p.width / 2;
    cy = p.height / 2;
  };

  function distToSegment(px, py, x1, y1, x2, y2) {
    const vx = x2 - x1, vy = y2 - y1;
    const wx = px - x1, wy = py - y1;

    const c1 = vx * wx + vy * wy;
    if (c1 <= 0) return Math.hypot(px - x1, py - y1);
    const c2 = vx * vx + vy * vy;
    if (c2 <= c1) return Math.hypot(px - x2, py - y2);

    const t = c1 / c2;
    const projx = x1 + t * vx;
    const projy = y1 + t * vy;
    return Math.hypot(px - projx, py - projy);
  }

  function drawTooltip(text, x, y) {
    p.textSize(14);
    p.textAlign(p.LEFT, p.CENTER);

    const padX = 10;
    const padY = 8;
    const w = p.textWidth(text) + padX * 2;
    const h = 30;
    const tx = p.constrain(x + 12, 10, p.width - w - 10);
    const ty = p.constrain(y - 10, 10, p.height - h - 10);

    p.noStroke();
    p.fill(255, 235);
    p.rectMode(p.CORNER);
    p.rect(tx, ty, w, h, 10);
    p.fill(40);
    p.text(text, tx + padX, ty + h / 2);
  }

  p.draw = function () {
    p.background(248);

    // background 12 ticks
    p.stroke(220);
    p.strokeWeight(2);
    for (let i = 0; i < 12; i++) {
      const a = p.map(i, 0, 12, 0, p.TWO_PI) - p.HALF_PI;
      const x1 = cx + p.cos(a) * (tickR - 10);
      const y1 = cy + p.sin(a) * (tickR - 10);
      const x2 = cx + p.cos(a) * (tickR + 4);
      const y2 = cy + p.sin(a) * (tickR + 4);
      p.line(x1, y1, x2, y2);
    }

    // time
    const h = p.hour() % 12;
    const m = p.minute();
    const s = p.second();

    // angles (start at 12 o'clock)
    const hAngle = p.map(h + m / 60, 0, 12, 0, p.TWO_PI) - p.HALF_PI;
    const mAngle = p.map(m + s / 60, 0, 60, 0, p.TWO_PI) - p.HALF_PI;
    const sAngle = p.map(s, 0, 60, 0, p.TWO_PI) - p.HALF_PI;

    // hour hand end
    const hx = cx + p.cos(hAngle) * hLen;
    const hy = cy + p.sin(hAngle) * hLen;
    // minute hand end (starts at hour tip)
    const mx = hx + p.cos(mAngle) * mLen;
    const my = hy + p.sin(mAngle) * mLen;
    // second hand end (starts at minute tip)
    const sx = mx + p.cos(sAngle) * sLen;
    const sy = my + p.sin(sAngle) * sLen;

    // Interaction (extra credit): hover detection
    const dH = distToSegment(p.mouseX, p.mouseY, cx, cy, hx, hy);
    const dM = distToSegment(p.mouseX, p.mouseY, hx, hy, mx, my);
    const dS = distToSegment(p.mouseX, p.mouseY, mx, my, sx, sy);

    const thresh = 14;
    const hoverH = dH < thresh && dH <= dM && dH <= dS;
    const hoverM = dM < thresh && dM <= dH && dM <= dS;
    const hoverS = dS < thresh && dS <= dH && dS <= dM;
    p.strokeCap(p.ROUND);

    // draw chained hands
    p.stroke(40);
    p.strokeWeight(hoverH ? 14 : 11);
    p.line(cx, cy, hx, hy);
    p.strokeWeight(hoverM ? 10 : 7);
    p.line(hx, hy, mx, my);
    p.strokeWeight(hoverS ? 6 : 3);
    p.line(mx, my, sx, sy);

    p.noStroke();
    p.fill(40);
    p.circle(cx, cy, 14);
    p.circle(hx, hy, 12);
    p.circle(mx, my, 10);
    p.circle(sx, sy, 8);

    // label
    if (hoverH) drawTooltip("Hour hand", hx, hy);
    else if (hoverM) drawTooltip("Minute hand", mx, my);
    else if (hoverS) drawTooltip("Second hand", sx, sy);
  };
});
