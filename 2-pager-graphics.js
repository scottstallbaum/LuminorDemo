(function () {
  function buildWhaleCurve() {
    const points = [];
    const itemCount = 130;
    const plateauStart = 0.30;
    const plateauEnd = 0.82;
    const topY = 176;
    const endY = 100;

    for (let i = 0; i <= itemCount; i += 1) {
      const r = i / itemCount;
      const x = r * 100;
      let y = 0;

      if (r <= plateauStart) {
        // Very steep early lift (left side of the whale).
        const t = r / plateauStart;
        const k = 6.7;
        const norm = (1 - Math.exp(-k * t)) / (1 - Math.exp(-k));
        y = topY * norm;
      } else if (r <= plateauEnd) {
        // Long flat-ish middle that starts declining right after 30%.
        const t = (r - plateauStart) / (plateauEnd - plateauStart);
        y = topY - (3.6 * t) - (2.6 * Math.pow(t, 1.8));
      } else {
        // Late, accelerating drop to baseline.
        const t = (r - plateauEnd) / (1 - plateauEnd);
        const tailStartY = topY - 6.2;
        // Tiny local kick removes the immediate flat shelf without changing the rest of the tail.
        const dropShape = Math.pow(t, 2.8) + (0.03 * t * Math.exp(-10 * t));
        y = tailStartY - ((tailStartY - endY) * dropShape);
      }

      points.push({ x, y });
    }

    // Ensure exact anchors.
    points[0].y = 0;
    points[points.length - 1].y = endY;

    let maxY = -Infinity;
    let maxIndex = 0;
    for (let i = 0; i < points.length; i += 1) {
      if (points[i].y > maxY) {
        maxY = points[i].y;
        maxIndex = i;
      }
    }

    return { points, peakIndex: maxIndex, peakY: maxY };
  }

  function makeWhaleChart() {
    const canvas = document.getElementById("pg-whale-curve");
    if (!canvas) return null;

    const model = buildWhaleCurve();

    const marginHeatFillPlugin = {
      id: "marginHeatFill",
      beforeDatasetsDraw(chart) {
        const { ctx, chartArea, scales } = chart;
        const xScale = scales.x;
        const yScale = scales.y;
        if (!chartArea || !xScale || !yScale) return;

        const baselinePx = yScale.getPixelForValue(0);
        const points = model.points;
        const mutedBlue = [58, 98, 132];
        const blue = [0, 180, 255];
        const neutral = [44, 52, 68];
        const mutedRed = [125, 62, 78];
        const red = [255, 58, 58];

        function clamp01(v) {
          return Math.max(0, Math.min(1, v));
        }

        function mixRgb(a, b, t) {
          return [
            Math.round(a[0] + ((b[0] - a[0]) * t)),
            Math.round(a[1] + ((b[1] - a[1]) * t)),
            Math.round(a[2] + ((b[2] - a[2]) * t))
          ];
        }

        const slopes = [];
        let maxPositiveSlope = 0;
        let maxNegativeMagnitude = 0;
        for (let i = 0; i < points.length - 1; i += 1) {
          const p0 = points[i];
          const p1 = points[i + 1];
          const dx = Math.max(0.0001, p1.x - p0.x);
          const slope = (p1.y - p0.y) / dx;
          slopes.push(slope);
          if (slope > maxPositiveSlope) maxPositiveSlope = slope;
          if (slope < 0) maxNegativeMagnitude = Math.max(maxNegativeMagnitude, Math.abs(slope));
        }

        const posDenom = Math.max(0.0001, maxPositiveSlope);
        const negDenom = Math.max(0.0001, maxNegativeMagnitude);

        ctx.save();
        ctx.beginPath();
        ctx.rect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
        ctx.clip();

        for (let i = 0; i < points.length - 1; i += 1) {
          const p0 = points[i];
          const p1 = points[i + 1];
          const slope = slopes[i];
          let color = neutral;
          let localAlpha = 0.10;

          if (slope > 0) {
            const tRaw = clamp01(slope / posDenom);
            const t = 0.34 + (0.66 * Math.pow(tRaw, 2.6));
            color = mixRgb(mutedBlue, blue, t);
            localAlpha = 0.34 + (0.50 * Math.pow(tRaw, 2.4));
          } else if (slope < 0) {
            const tRaw = clamp01(Math.abs(slope) / negDenom);
            const darkenStart = 0.28;
            const ramp = tRaw <= darkenStart
              ? 0
              : Math.pow((tRaw - darkenStart) / (1 - darkenStart), 1.25);
            const t = 0.34 + (0.66 * ramp);
            color = mixRgb(mutedRed, red, t);
            localAlpha = 0.34 + (0.56 * ramp);
          } else {
            localAlpha = 0.30;
          }

          const fill = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${localAlpha})`;

          const x0 = xScale.getPixelForValue(p0.x);
          const x1 = xScale.getPixelForValue(p1.x);
          const y0 = yScale.getPixelForValue(p0.y);
          const y1 = yScale.getPixelForValue(p1.y);

          ctx.fillStyle = fill;
          ctx.beginPath();
          ctx.moveTo(x0, baselinePx);
          ctx.lineTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.lineTo(x1, baselinePx);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }
    };

    return new Chart(canvas, {
      type: "line",
      plugins: [marginHeatFillPlugin],
      data: {
        datasets: [
          {
            data: model.points,
            parsing: false,
            borderWidth: 3,
            pointRadius: 0,
            tension: 0,
            segment: {
              borderColor: (ctx) => (ctx.p0DataIndex < model.peakIndex ? "#0EA5E9" : "#EF4444")
            }
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { top: 8, right: 10, bottom: 4, left: 6 }
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: {
          x: {
            type: "linear",
            display: true,
            min: 0,
            max: 100,
            grid: { display: false },
            border: { display: true, color: "#9CA3AF", width: 1 },
            ticks: {
              display: true,
              color: "#9fb0d3",
              stepSize: 20,
              callback: (value) => `${value}%`
            }
          },
          y: {
            display: true,
            min: 0,
            max: 180,
            grid: {
              color: (ctx) => (ctx.tick.value === 100 ? "rgba(159,176,211,.35)" : "rgba(159,176,211,.16)"),
              lineWidth: (ctx) => (ctx.tick.value === 100 ? 1.1 : 0.8)
            },
            border: { display: true, color: "#9CA3AF", width: 1 },
            ticks: {
              display: true,
              color: "#9fb0d3",
              stepSize: 20,
              callback: (value) => (value === 0 || value === 100 ? `${value}%` : "")
            }
          }
        },
        animation: false
      }
    });
  }

  function buildExportCanvas(canvas) {
    const ratio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const srcW = canvas.width;
    const srcH = canvas.height;
    const exportBg = "#0d1528";

    const out = document.createElement("canvas");
    out.width = srcW;
    out.height = srcH;
    const ctx = out.getContext("2d");

    ctx.fillStyle = exportBg;
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(canvas, 0, 0, out.width, out.height);

    if (ratio > 1) {
      const scaled = document.createElement("canvas");
      scaled.width = Math.round(out.width / ratio);
      scaled.height = Math.round(out.height / ratio);
      const sctx = scaled.getContext("2d");
      sctx.fillStyle = exportBg;
      sctx.fillRect(0, 0, scaled.width, scaled.height);
      sctx.drawImage(out, 0, 0, scaled.width, scaled.height);
      return scaled;
    }

    return out;
  }

  async function copyCanvasToClipboard(canvas) {
    if (!navigator.clipboard || !window.ClipboardItem) return false;
    const exportCanvas = buildExportCanvas(canvas);
    const blob = await new Promise((resolve) => exportCanvas.toBlob(resolve, "image/png"));
    if (!blob) return false;
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    return true;
  }

  function wireExports() {
    const btn = document.getElementById("pg-copy-whale");
    const status = document.getElementById("pg-copy-status");
    const canvas = document.getElementById("pg-whale-curve");
    if (!btn || !status || !canvas) return;

    btn.addEventListener("click", async () => {
      btn.disabled = true;
      const old = btn.textContent;
      btn.textContent = "Copying...";
      try {
        const copied = await copyCanvasToClipboard(canvas);
        if (copied) {
          status.textContent = "Copied. Paste into your slide deck.";
        } else {
          status.textContent = "Clipboard copy unavailable in this browser. Right-click image to save.";
        }
      } catch (_) {
        status.textContent = "Copy failed. Try again.";
      }
      btn.textContent = old;
      btn.disabled = false;
    });
  }

  makeWhaleChart();
  wireExports();
})();
