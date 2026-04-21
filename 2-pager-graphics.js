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
        y = endY + ((tailStartY - endY) * (1 - Math.pow(t, 2.8)));
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

    return new Chart(canvas, {
      type: "line",
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
              callback: (value) => (value === 0 || value === 100 || value === 180 ? `${value}%` : "")
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
