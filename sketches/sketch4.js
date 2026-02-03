// Instance-mode sketch for tab 4
registerSketch('sk4', function (p) {
  let cx, cy;

  // layout radii
  const rTime = 260;
  const hourRingStart = 30;
  const hourRingGap = 6;
  const maxHours = 24;

  p.setup = function () {
    p.createCanvas(750,750);
    cx = p.width / 2;
    cy = p.height / 2;
  };

  p.draw = function () {
    p.background(248);

    // time ring (minute + second)
    p.noFill();
    p.stroke(180);
    p.strokeWeight(10);
    p.circle(cx, cy, rTime * 2);

    // center base for hour accumulation
    p.noFill();
    p.stroke(200);
    p.strokeWeight(2);

    for (let i = 0; i < maxHours; i++) {
      const r = hourRingStart + i * hourRingGap;
      p.circle(cx, cy, r * 2);
    }
  };
});
