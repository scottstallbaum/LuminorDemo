(function () {
  function buildWhaleCurve() {
    const points = [];
    const itemCount = 130;
    const plateauStart = 0.30;
    const plateauEnd = 0.85;
    const peakY = 82;
    const plateauY = 68;
    const endY = 28; // end materially below peak (not 0)

    for (let i = 0; i <= itemCount; i += 1) {
      const r = i / itemCount;
      const x = r * 100;
      let y;

      if (r <= plateauStart) {
        // Steep early rise that tops out near 30%.
        const t = r / plateauStart;
        const normalized = (1 - Math.exp(-7.8 * t)) / (1 - Math.exp(-7.8));
        y = peakY * normalized;
      } else if (r <= plateauEnd) {
        // Long flat-ish middle from ~30% to ~85% with only mild erosion.
        const t = (r - plateauStart) / (plateauEnd - plateauStart);
        y = peakY - ((peakY - plateauY) * Math.pow(t, 0.85));
      } else {
        // Sharper decline in the final stretch.
        const t = (r - plateauEnd) / (1 - plateauEnd);
        y = plateauY - ((plateauY - endY) * Math.pow(t, 0.72));
      }

      // Subtle irregularity so the line feels more like real data.
      y += Math.sin((r * 17) + 0.3) * 0.4;

      points.push({ x, y });
    }

    // Ensure exact origin and a clean non-zero finish.
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

    const calloutPlugin = {
      id: "whaleCallout",
      afterDatasetsDraw(chart) {
        const ctx = chart.ctx;
        const xScale = chart.scales.x;
        const yScale = chart.scales.y;

        const peakPoint = model.points[model.peakIndex];
        const px = xScale.getPixelForValue(peakPoint.x);
        const py = yScale.getPixelForValue(peakPoint.y);

        const textX = Math.min(chart.chartArea.right - 285, px + 24);
        const textY = Math.max(chart.chartArea.top + 16, py - 30);

        ctx.save();

        // Peak dot
        ctx.beginPath();
        ctx.arc(px, py, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = "#0EA5E9";
        ctx.fill();

        // Leader line
        ctx.beginPath();
        ctx.moveTo(px + 5, py - 1);
        ctx.lineTo(textX - 8, textY - 2);
        ctx.strokeStyle = "#9ca3af";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Plain text callout (no box)
        ctx.fillStyle = "#0f172a";
        ctx.font = "600 11px Inter, sans-serif";
        ctx.textBaseline = "alphabetic";
        ctx.fillText("A small portion of the portfolio drives most profit", textX, textY);

        ctx.restore();
      }
    };

    return new Chart(canvas, {
      type: "line",
      plugins: [calloutPlugin],
      data: {
        datasets: [
          {
            data: model.points,
            parsing: false,
            borderWidth: 3,
            pointRadius: 0,
            tension: 0.18,
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
            border: { display: true, color: "#E5E7EB", width: 1 },
            ticks: { display: false }
          },
          y: {
            display: true,
            grid: { display: false },
            border: { display: true, color: "#E5E7EB", width: 1 },
            ticks: { display: false }
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

    const out = document.createElement("canvas");
    out.width = srcW;
    out.height = srcH;
    const ctx = out.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(canvas, 0, 0, out.width, out.height);

    if (ratio > 1) {
      const scaled = document.createElement("canvas");
      scaled.width = Math.round(out.width / ratio);
      scaled.height = Math.round(out.height / ratio);
      const sctx = scaled.getContext("2d");
      sctx.fillStyle = "#ffffff";
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
