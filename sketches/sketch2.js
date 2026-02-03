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

  p.draw = function () {
    p.background(245);

    // circle guide
    p.noFill();
    p.stroke(200);
    p.strokeWeight(1.5);
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
  };
});
