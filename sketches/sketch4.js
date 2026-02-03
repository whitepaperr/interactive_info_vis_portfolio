// Instance-mode sketch for tab 4
registerSketch('sk4', function (p) {
  let cx, cy;

  // layout radii
  const rTime = 260;
  const hourRingStart = 30;
  const hourRingGap = 9;
  const maxHours = 25;
  
  const hourHoverRadius = hourRingStart + hourRingGap * maxHours;

  p.setup = function () {
    p.createCanvas(750,750);
    cx = p.width / 2;
    cy = p.height / 2;
  };

  function two(n) {
    return (n < 10 ? '0' : '') + n;
  }

  p.draw = function () {
    p.background(248);

    // time ring (minute + second)
    p.noFill();
    p.stroke(180);
    p.strokeWeight(10);
    p.circle(cx, cy, rTime * 2);

    // center base for hour accumulation
    const h24 = p.hour();
    p.noFill();
    p.strokeWeight(2);

    for (let i = 0; i < maxHours; i++) {
      const r = hourRingStart + i * hourRingGap;
      // filled hours highlighted
      if (i <= h24) {
        p.stroke(220, 80, 90); // red
      } else {
        p.stroke(220); // light gray
      }
      p.circle(cx, cy, r * 2);
    }

    // minute arc 
    const m = p.minute();
    const mAngle = p.map(m, 0, 60, 0, p.TWO_PI);
    p.noFill();
    p.stroke(80, 140, 220); // blue
    p.strokeWeight(7);
    p.strokeCap(p.ROUND);
    p.arc(
      cx,
      cy,
      rTime * 2,
      rTime * 2,
      -p.HALF_PI,
      -p.HALF_PI + mAngle
    );

    // second dot
    const s = p.second();
    const sAngle = p.map(s, 0, 60, 0, p.TWO_PI) - p.HALF_PI;
    const sx = cx + p.cos(sAngle) * rTime;
    const sy = cy + p.sin(sAngle) * rTime;
    p.noStroke();
    p.stroke(240, 140, 170); // pink
    p.circle(sx, sy, 10);

    // Interaction (extra credit): hover to reveal digital time
    const d = p.dist(p.mouseX, p.mouseY, cx, cy);
    if (d < hourHoverRadius) {
      const hh = two(p.hour());
      const mm = two(p.minute());
      const ss = two(p.second());
      const label = `${hh}:${mm}:${ss}`;

      p.noStroke();
      p.fill(255, 235);
      p.rectMode(p.CENTER);
      p.rect(cx, cy, 170, 55, 14);

      p.fill(40);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(22);
      p.text(label, cx, cy);
    }
  };
});
