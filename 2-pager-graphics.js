(function () {
  function buildWhaleCurve() {
    const points = [{ x: 0, y: 0 }];
    const itemCount = 130;

    function contributionAt(rankRatio) {
      if (rankRatio < 0.08) {
        return 14.0 - (rankRatio * 100); // very steep profitable head
      }
      if (rankRatio < 0.30) {
        return 6.0 - ((rankRatio - 0.08) * 22); // flatten toward the peak zone
      }
      if (rankRatio < 0.50) {
        return 1.16 - ((rankRatio - 0.30) * 14); // cross through zero around 38%
      }
      // Tail: gradual, slightly irregular decline so it feels less synthetic.
      return -1.64 - ((rankRatio - 0.50) * 6) +
        (Math.sin(rankRatio * 30) * 0.18) +
        (Math.cos(rankRatio * 19) * 0.10);
    }

    let cumulative = 0;
    let peakY = 0;
    let peakIndex = 0;

    for (let i = 0; i < itemCount; i += 1) {
      const rankRatio = i / (itemCount - 1);
      cumulative += contributionAt(rankRatio);
      const x = ((i + 1) / itemCount) * 100;
      const y = cumulative;
      points.push({ x, y });
      if (y > peakY) {
        peakY = y;
        peakIndex = points.length - 1;
      }
    }

    // Keep the whale-curve ending materially below peak (not returning to 0).
    const endY = points[points.length - 1].y;
    const targetEnd = peakY * 0.36;
    if (endY <= targetEnd) {
      let newPeakY = -Infinity;
      let newPeakIndex = 0;
      for (let i = 0; i < points.length; i += 1) {
        if (points[i].y > newPeakY) {
          newPeakY = points[i].y;
          newPeakIndex = i;
        }
      }
      return { points, peakIndex: newPeakIndex, peakY: newPeakY };
    }

    const drift = (endY - targetEnd) / (points.length - 1);
    for (let i = 1; i < points.length; i += 1) {
      points[i].y -= drift * i;
    }

    let adjPeakY = -Infinity;
    let adjPeakIndex = 0;
    for (let i = 0; i < points.length; i += 1) {
      if (points[i].y > adjPeakY) {
        adjPeakY = points[i].y;
        adjPeakIndex = i;
      }
    }

    return { points, peakIndex: adjPeakIndex, peakY: adjPeakY };
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
