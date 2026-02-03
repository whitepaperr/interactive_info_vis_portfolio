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
    p.noFill();
    p.stroke(180);
    p.strokeWeight(2);

    p.circle(cx, cy, rSecond * 2);
    p.circle(cx, cy, rMinute * 2);
    p.circle(cx, cy, rHour * 2);
  };
});
