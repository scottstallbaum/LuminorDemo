(function () {
  function buildWhaleCurve() {
    const points = [];
    const itemCount = 120;
    const contrib = [];

    for (let i = 0; i < itemCount; i += 1) {
      let c;
      if (i < 14) {
        c = 10.8 - (i * 0.42); // steeply profitable head
      } else if (i < 72) {
        c = 1.35 - ((i - 14) * 0.022); // flattening middle
      } else {
        c = -0.55 - ((i - 72) * 0.135); // unprofitable tail
      }
      contrib.push(c);
    }

    let cumulative = 0;
    let peakY = -Infinity;
    let peakIndex = 0;

    for (let i = 0; i < contrib.length; i += 1) {
      cumulative += contrib[i];
      const x = (i / (contrib.length - 1)) * 100;
      const y = cumulative;
      points.push({ x, y });
      if (y > peakY) {
        peakY = y;
        peakIndex = i;
      }
    }

    return { points, peakIndex, peakY };
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

        const boxX = Math.min(chart.chartArea.right - 290, px + 26);
        const boxY = Math.max(chart.chartArea.top + 12, py - 64);
        const boxW = 268;
        const boxH = 46;

        ctx.save();

        // Pointer line
        ctx.beginPath();
        ctx.moveTo(px + 4, py - 2);
        ctx.lineTo(boxX, boxY + 22);
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Callout box
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1;
        ctx.shadowColor = "rgba(15, 23, 42, 0.08)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 8);
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.stroke();

        ctx.fillStyle = "#0f172a";
        ctx.font = "600 12px Inter, sans-serif";
        ctx.textBaseline = "middle";
        ctx.fillText("A small portion of the portfolio drives most profit", boxX + 10, boxY + 24);

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
            tension: 0.32,
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
          padding: { top: 10, right: 12, bottom: 8, left: 8 }
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: {
          x: {
            type: "linear",
            display: false,
            min: 0,
            max: 100,
            grid: { display: false },
            border: { display: false },
            ticks: { display: false }
          },
          y: {
            display: false,
            grid: { display: false },
            border: { display: false },
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
