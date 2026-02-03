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

    // draw chained hands
    p.strokeCap(p.ROUND);
    p.stroke(40);
    p.strokeWeight(18);
    p.strokeCap(p.ROUND);
    p.line(cx, cy, hx, hy);
    p.strokeWeight(10);
    p.line(hx, hy, mx, my);
    p.strokeWeight(3);
    p.line(mx, my, sx, sy);

    p.noStroke();
    p.fill(40);
    p.circle(cx, cy, 14);
    p.circle(hx, hy, 12);
    p.circle(mx, my, 10);
    p.circle(sx, sy, 8);
  };
});
