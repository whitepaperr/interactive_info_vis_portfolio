// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {
  let cx, cy;
  const rHour = 180;
  const rMinute = 260;
  const rSecond = 300;

  p.setup = function () {
    p.createCanvas(750,750);
    cx = p.width / 2;
    cy = p.height / 2;
  };

  function two(n) {
    return (n < 10 ? '0' : '') + n;
  }

  p.draw = function () {
    p.background(245);

    // circle guide
    p.noFill();
    p.stroke(200);
    p.strokeWeight(1);
    p.circle(cx, cy, rSecond * 2);
    p.circle(cx, cy, rMinute * 2);
    p.circle(cx, cy, rHour * 2);

    // minute arc
    const m = p.minute();
    const angle = p.map(m, 0, 60, 0, p.TWO_PI);
    p.noFill();
    p.stroke(80, 140, 220); // blue
    p.strokeWeight(8);
    p.strokeCap(p.ROUND);
    // start from top (12 o'clock)
    p.arc(
      cx,
      cy,
      rMinute * 2,
      rMinute * 2,
      -p.HALF_PI,
      -p.HALF_PI + angle
    );

    // hour dot
    const h = p.hour() % 12;
    const hourAngle = p.map(h, 0, 12, 0, p.TWO_PI) - p.HALF_PI;
    const hx = cx + p.cos(hourAngle) * rHour;
    const hy = cy + p.sin(hourAngle) * rHour;
    p.noStroke();
    p.fill(60); // dark gray
    p.circle(hx, hy, 14);

    // second orbit marker
    const s = p.second();
    const secondAngle = p.map(s, 0, 60, 0, p.TWO_PI) - p.HALF_PI;
    const sx = cx + p.cos(secondAngle) * rSecond;
    const sy = cy + p.sin(secondAngle) * rSecond;
    p.fill(240, 120, 120); // pink/red
    p.circle(sx, sy, 10);

    // Interaction (extra credit): hover to reveal digital time
    const hover = p.dist(p.mouseX, p.mouseY, cx, cy) < 140;

    if (hover) {
      const hh = two(p.hour());
      const mm = two(p.minute());
      const ss = two(p.second());
      const label = `${hh}:${mm}:${ss}`;

      p.noStroke();
      p.fill(255, 230);
      p.rectMode(p.CENTER);
      p.rect(cx, cy, 170, 60, 12);

      p.fill(40);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(24);
      p.text(label, cx, cy);
    }
  };
});
