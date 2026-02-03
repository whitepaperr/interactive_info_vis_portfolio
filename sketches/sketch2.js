// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {
  let cx, cy;
  const rHour = 180;
  const rMinute = 260;
  const rSecond = 300;

  const hourMarkerR = 10;
  const triSize = 18

  p.setup = function () {
    p.createCanvas(750,750);
    cx = p.width / 2;
    cy = p.height / 2;
  };

  function two(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function drawTriangleAt(x, y, size, angleRad) {
    const tipX = x + p.cos(angleRad) * (size * 0.9);
    const tipY = y + p.sin(angleRad) * (size * 0.9);

    const leftX = x + p.cos(angleRad + p.radians(120)) * (size * 0.6);
    const leftY = y + p.sin(angleRad + p.radians(120)) * (size * 0.6);

    const rightX = x + p.cos(angleRad - p.radians(120)) * (size * 0.6);
    const rightY = y + p.sin(angleRad - p.radians(120)) * (size * 0.6);

    p.triangle(tipX, tipY, leftX, leftY, rightX, rightY);
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
    p.arc(
      cx,
      cy,
      rMinute * 2,
      rMinute * 2,
      -p.HALF_PI,
      -p.HALF_PI + angle
    );

    // hour dot
    let h12 = p.hour() % 12;
    if (h12 === 0) h12 = 12;

    for (let i = 1; i <= 12; i++) {
      const a = p.map(i, 0, 12, 0, p.TWO_PI) - p.HALF_PI;
      const x = cx + p.cos(a) * rHour;
      const y = cy + p.sin(a) * rHour;
      const isFilled = i <= h12;

      // style: filled vs unfilled
      if (isFilled) {
        p.fill(60);
        p.stroke(60);
      } else {
        p.fill(245);
        p.stroke(160);
      }
      p.strokeWeight(2);

      if (i === 3 || i === 6 || i === 9 || i === 12) {
        drawTriangleAt(x, y, triSize, a + p.PI);
      } else {
        p.circle(x, y, hourMarkerR * 2);
      }
    }

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
