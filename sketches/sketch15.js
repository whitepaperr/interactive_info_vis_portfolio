// sketches/sketch15.js
// INFO 474 HW5 — Narrative Visualization (P5.js, instance mode)
// Data: data/weather2017.csv


registerSketch("sk15", (p) => {
  let table;

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep"];
  const YEAR = 2017;
  const STATE = "WA";

  const UNIT = "in";
  const RAIN_DAY_THRESHOLD = 0.01;
  const MAX_W = 1600;
  const H = 700;

  const M = { top: 110, right: 140, bottom: 95, left: 120 };
  let plot = { x: 0, y: 0, w: 0, h: 0 };

  let total = Array(9).fill(0);
  let rainy = Array(9).fill(0);
  let maxTotal = 1;
  let maxRainy = 1;
  let yMaxTotalNice = 1;

  let hover = -1;

  const BAR_SHIFT = 0.10;
  const HOVER_TEXT_OFFSET = 18;

  p.preload = () => {
    table = p.loadTable("data/weather2017.csv", "csv", "header");
  };

  p.setup = () => {
    const holder = document.getElementById("sketch-container-sk15");
    const cw = holder ? holder.clientWidth : 1800;

    const w = Math.min(MAX_W, cw);
    const c = p.createCanvas(w, H);
    p.pixelDensity(2);
    p.textFont("system-ui");
    if (holder) c.parent(holder);

    layout();
    recompute();
  };

  p.windowResized = () => {
    const holder = document.getElementById("sketch-container-sk15");
    if (!holder) return;
    const w = Math.min(MAX_W, holder.clientWidth);
    p.resizeCanvas(w, H);
    layout();
  };

  function layout() {
    plot.x = M.left;
    plot.y = M.top;
    plot.w = p.width - M.left - M.right;
    plot.h = p.height - M.top - M.bottom;
  }

  function recompute() {
    total.fill(0);
    rainy.fill(0);

    for (let r = 0; r < table.getRowCount(); r++) {
      const st = (table.getString(r, "state") || "").trim();
      if (st !== STATE) continue;

      const d = parseYYYYMMDD(table.getString(r, "date"));
      if (!d || d.getFullYear() !== YEAR) continue;

      const m = d.getMonth();
	  if (m >= 9) continue;
      let prcp = parseFloat(table.getString(r, "PRCP"));
      if (isNaN(prcp)) prcp = 0;

      total[m] += prcp;
      if (prcp > RAIN_DAY_THRESHOLD) rainy[m] += 1;
    }

    maxTotal = Math.max(...total, 0) || 1;
    maxRainy = Math.max(...rainy, 0) || 1;

    yMaxTotalNice = niceMax(maxTotal * 1.12);
  }

  p.draw = () => {
    p.background(255);

    hover = -1;
    const step = plot.w / 9;
    if (p.mouseX >= plot.x && p.mouseX <= plot.x + plot.w && p.mouseY >= plot.y && p.mouseY <= plot.y + plot.h) {
      hover = p.constrain(Math.floor((p.mouseX - plot.x) / step), 0, 11);
    }

    seasonalBackdrop();
    header();
    axes();
    bars();
    rainyLine();
    precipClouds();
    hoverReadout();
  };

  function header() {
    p.noStroke();
    p.fill(15);
    p.textAlign(p.LEFT, p.TOP);
    p.textStyle(p.BOLD);
    p.textSize(22);
    p.text("Many Rainy Days in Seattle (2017) — But Low Intensity", M.left, 14);

    p.textStyle(p.NORMAL);
    p.fill(75);
    p.textSize(13);
    p.text("Bars: total precipitation • Line: rainy days • Cloud size: precipitation", M.left, 40);

    p.fill(95);
    p.textSize(12);
    p.text(`Washington (Seattle area) • ${YEAR} • PRCP (${UNIT})`, M.left, 60);
  }

  function seasonalBackdrop() {
    const step = plot.w / 9;
    for (let i = 0; i < 9; i++) {
      const t = (-Math.cos((i / 11) * Math.PI * 2) + 1) / 2;
      const c = lerpRGB({ r: 200, g: 225, b: 255 }, { r: 255, g: 230, b: 200 }, t);
      p.noStroke();
      p.fill(c.r, c.g, c.b, 26);
      p.rect(plot.x + step * i, plot.y, step, plot.h);
    }
  }

  function axes() {
    p.stroke(0, 35);
    p.strokeWeight(2);
    p.line(plot.x, plot.y, plot.x, plot.y + plot.h);
    p.line(plot.x, plot.y + plot.h, plot.x + plot.w, plot.y + plot.h);

    const ticks = 4;
    for (let i = 0; i <= ticks; i++) {
      const t = i / ticks;
      const y = p.lerp(plot.y + plot.h, plot.y, t);

      p.stroke(0, 10);
      p.strokeWeight(1);
      p.line(plot.x, y, plot.x + plot.w, y);

      p.noStroke();
      p.fill(95);
      p.textSize(11);

      p.textAlign(p.RIGHT, p.CENTER);
      p.text((yMaxTotalNice * t).toFixed(2), plot.x - 10, y);

      p.textAlign(p.LEFT, p.CENTER);
      p.text(Math.round(maxRainy * t), plot.x + plot.w + 10, y);
    }

    p.fill(40);
    p.textStyle(p.BOLD);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text(`Total PRCP (${UNIT})`, plot.x, plot.y - 8);
    p.textAlign(p.RIGHT, p.BOTTOM);
    p.text("Rainy days", plot.x + plot.w, plot.y - 8);
    p.textStyle(p.NORMAL);

    const step = plot.w / 9;
    p.fill(70);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    for (let i = 0; i < 9; i++) {
      p.text(MONTHS[i], plot.x + step * (i + 0.5), plot.y + plot.h + 8);
    }
  }

  function bars() {
    const step = plot.w / 9;

    for (let i = 0; i < 9; i++) {
      const cx = plot.x + step * (i + 0.5 + BAR_SHIFT);
      const bw = step * 0.58;
      const h = p.map(total[i], 0, yMaxTotalNice, 0, plot.h);
      const x = cx - bw / 2;
      const y = plot.y + plot.h - h;

      p.noStroke();
      p.fill(0, 14);
      p.rect(x + 2, y + 3, bw, h, 10);

      p.fill(60, 170, 220, i === hover ? 235 : 175);
      p.rect(x, y, bw, h, 10);
    }
  }

  function rainyLine() {
    const step = plot.w / 9;

    p.stroke(120, 70, 170, 170);
    p.strokeWeight(3);
    p.noFill();
    p.beginShape();
    for (let i = 0; i < 9; i++) {
      const cx = plot.x + step * (i + 0.5);
      const y = p.map(rainy[i], 0, maxRainy, plot.y + plot.h, plot.y);
      p.vertex(cx, y);
    }
    p.endShape();

    p.noStroke();
    for (let i = 0; i < 9; i++) {
      const cx = plot.x + step * (i + 0.5);
      const y = p.map(rainy[i], 0, maxRainy, plot.y + plot.h, plot.y);
      p.fill(120, 70, 170, i === hover ? 255 : 200);
      p.circle(cx, y, i === hover ? 10 : 7);
    }
  }

  function precipClouds() {
    const step = plot.w / 9;

    for (let i = 0; i < 9; i++) {
      const cx = plot.x + step * (i + 0.5);
      const yLine = p.map(rainy[i], 0, maxRainy, plot.y + plot.h, plot.y);

      const s = p.map(total[i], 0, yMaxTotalNice, 12, 30);
      const a = (i === hover) ? 255 : 230;

      cloud(cx, yLine - 18, s, a);
    }
  }

  function hoverReadout() {
    if (hover < 0) return;

    const step = plot.w / 9;
    const cx = plot.x + step * (hover + 0.5);
    const yLine = p.map(rainy[hover], 0, maxRainy, plot.y + plot.h, plot.y);
    const tx = cx - HOVER_TEXT_OFFSET;
    const ty = yLine - 42;

    p.noStroke();
    p.textAlign(p.RIGHT, p.TOP);

    p.fill(30);
    p.textStyle(p.BOLD);
    p.textSize(12);
    p.text(`${MONTHS[hover]}`, tx, ty);

    p.fill(60);
    p.textStyle(p.NORMAL);
    p.textSize(11);
    p.text(`PRCP: ${total[hover].toFixed(2)} ${UNIT}`, tx, ty + 16);
    p.text(`Rainy days: ${rainy[hover]}`, tx, ty + 31);
  }

  function cloud(cx, cy, s, a) {
    p.noStroke();
    p.fill(120, 70, 170, a);
    p.rectMode(p.CENTER);
    p.rect(cx, cy + s * 0.12, s * 1.35, s * 0.65, s * 0.3);
    p.circle(cx - s * 0.35, cy, s * 0.75);
    p.circle(cx, cy - s * 0.15, s * 0.95);
    p.circle(cx + s * 0.35, cy, s * 0.75);
    p.fill(255, 255, 255, Math.min(50, a * 0.22));
    p.circle(cx - s * 0.12, cy - s * 0.10, s * 0.30);
  }

  function parseYYYYMMDD(s) {
    if (!s) return null;
    const str = String(s).trim();
    if (str.length !== 8) return null;
    const y = parseInt(str.slice(0, 4), 10);
    const m = parseInt(str.slice(4, 6), 10) - 1;
    const d = parseInt(str.slice(6, 8), 10);
    if ([y, m, d].some(v => Number.isNaN(v))) return null;
    return new Date(y, m, d);
  }

  function lerpRGB(a, b, t) {
    return {
      r: Math.round(a.r + (b.r - a.r) * t),
      g: Math.round(a.g + (b.g - a.g) * t),
      b: Math.round(a.b + (b.b - a.b) * t),
    };
  }

  function niceMax(v) {
    if (v <= 0) return 1;
    const exp = Math.floor(Math.log10(v));
    const base = Math.pow(10, exp);
    const n = v / base;

    let nice;
    if (n <= 1) nice = 1;
    else if (n <= 2) nice = 2;
    else if (n <= 5) nice = 5;
    else nice = 10;

    return nice * base;
  }
});
