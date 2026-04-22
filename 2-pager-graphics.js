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
        const blue = [0, 180, 255];
        const neutral = [34, 42, 58];
        const red = [168, 24, 36];
        const redDeep = [110, 8, 20];

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

        function percentile(sortedValues, p) {
          if (!sortedValues.length) return 0.0001;
          const idx = Math.max(0, Math.min(sortedValues.length - 1, Math.floor((sortedValues.length - 1) * p)));
          return Math.max(0.0001, sortedValues[idx]);
        }

        const slopes = [];
        const positiveSlopes = [];
        const negativeMagnitudes = [];
        for (let i = 0; i < points.length - 1; i += 1) {
          const p0 = points[i];
          const p1 = points[i + 1];
          const dx = Math.max(0.0001, p1.x - p0.x);
          const slope = (p1.y - p0.y) / dx;
          slopes.push(slope);
          if (slope > 0) positiveSlopes.push(slope);
          if (slope < 0) negativeMagnitudes.push(Math.abs(slope));
        }

        positiveSlopes.sort((a, b) => a - b);
        negativeMagnitudes.sort((a, b) => a - b);
        const posDenom = percentile(positiveSlopes, 0.82);
        const negDenom = percentile(negativeMagnitudes, 0.82);

        function smoothstep(edge0, edge1, x) {
          const t = clamp01((x - edge0) / Math.max(0.0001, edge1 - edge0));
          return t * t * (3 - (2 * t));
        }

        ctx.save();
        ctx.beginPath();
        ctx.rect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
        ctx.clip();

        const splitX = model.points[model.peakIndex].x;

        for (let i = 0; i < points.length - 1; i += 1) {
          const p0 = points[i];
          const p1 = points[i + 1];
          const slope = slopes[i];
          const xMid = (p0.x + p1.x) * 0.5;
          let color = neutral;
          let localAlpha = 0.10;

          const signedNorm = slope >= 0
            ? clamp01(slope / posDenom)
            : -clamp01(Math.abs(slope) / negDenom);

          // Keep side tint obvious through the middle: blue on left, red on right.
          const sideBlend = smoothstep(splitX - 7, splitX + 7, xMid);
          const sideColor = mixRgb(blue, red, sideBlend);

          // Smooth hue crossover removes the hard seam at the sign-change point.
          const hueT = (signedNorm + 1) * 0.5; // -1..1 -> 0..1
          const signedColor = mixRgb(red, blue, hueT);
          const hueColor = mixRgb(sideColor, signedColor, 0.45);

          // Keep middle lighter; make full steep rise/drop regions noticeably darker.
          const mag = Math.abs(signedNorm);
          const intensity = smoothstep(0.10, 0.78, mag);
          const posSteep = slope > 0 ? smoothstep(0.34, 0.72, signedNorm) : 0;
          const negSteep = slope < 0 ? smoothstep(0.34, 0.72, -signedNorm) : 0;
          const steepBandBoost = Math.max(posSteep, negSteep);

          // Stronger, earlier dark-red gradient through the full right-tail drop zone.
          const redTailProgress = slope < 0 ? smoothstep(76, 100, xMid) : 0;
          const redTailBoost = slope < 0 ? Math.pow(redTailProgress, 1.15) : 0;

          if (slope < 0) {
            const redBaseProgress = smoothstep(68, 100, xMid);
            const redBaseColor = mixRgb([128, 42, 56], red, 0.20 + (0.80 * redBaseProgress));
            const redTint = Math.min(1, 0.42 + (0.24 * intensity) + (0.16 * redBaseProgress));
            const steepNegBoost = smoothstep(0.62, 0.98, -signedNorm);
            const rightEdgeBoost = smoothstep(92, 100, xMid);
            const tailDarkBoost = Math.max(steepNegBoost, rightEdgeBoost);
            const hardTailRamp = smoothstep(90, 100, xMid);
            color = mixRgb(neutral, redBaseColor, redTint);
            color = mixRgb(color, redDeep, 0.22 + (0.26 * redTailBoost) + (0.10 * tailDarkBoost) + (0.52 * hardTailRamp));
            localAlpha = Math.min(1, 0.56 + (0.14 * intensity) + (0.14 * redBaseProgress) + (0.10 * redTailBoost) + (0.10 * tailDarkBoost) + (0.24 * hardTailRamp));
          } else {
            const baseTint = Math.min(1, 0.40 + (0.38 * intensity) + (0.14 * steepBandBoost));
            color = mixRgb(neutral, hueColor, baseTint);
            localAlpha = Math.min(1, 0.54 + (0.22 * intensity) + (0.12 * steepBandBoost));
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

  function createSeededRng(seed) {
    let state = seed >>> 0;
    return function next() {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }

  function buildMarginRevenueScatterModel() {
    const rng = createSeededRng(42021);

    function randNormal(mean, stdDev) {
      const u1 = Math.max(1e-7, rng());
      const u2 = Math.max(1e-7, rng());
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      return mean + (z * stdDev);
    }

    function clamp(v, min, max) {
      return Math.max(min, Math.min(max, v));
    }

    const cluster = [];
    for (let i = 0; i < 66; i += 1) {
      cluster.push({
        x: clamp(randNormal(12.5, 5.8), -10, 29),
        y: clamp(randNormal(56, 7.2), 36, 77)
      });
    }

    const secondary = [];
    for (let i = 0; i < 10; i += 1) {
      secondary.push({
        x: clamp(randNormal(9, 8.5), -15, 33),
        y: clamp(randNormal(52, 11), 24, 82)
      });
    }

    const outliers = [
      { x: -24, y: 92 }, // high revenue, low margin
      { x: 49, y: 19 },  // high margin, low volume
      { x: -46, y: 56 }, // extreme negative margin
      { x: 58, y: 72 }
    ];

    return {
      cluster,
      secondary,
      outliers,
      annotationTarget: outliers[0]
    };
  }

  function makeMarginRevenueScatterChart() {
    const canvas = document.getElementById("pg-margin-revenue-scatter");
    if (!canvas) return null;

    const model = buildMarginRevenueScatterModel();

    const quadrantPlugin = {
      id: "scatterQuadrants",
      beforeDatasetsDraw(chart) {
        const { ctx, chartArea, scales } = chart;
        const xScale = scales.x;
        const yScale = scales.y;
        if (!chartArea || !xScale || !yScale) return;

        const vx = xScale.getPixelForValue(0);
        const hy = yScale.getPixelForValue(50);

        ctx.save();
        ctx.strokeStyle = "rgba(75, 85, 99, 0.35)";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(vx, chartArea.top);
        ctx.lineTo(vx, chartArea.bottom);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(chartArea.left, hy);
        ctx.lineTo(chartArea.right, hy);
        ctx.stroke();
        ctx.restore();
      }
    };

    return new Chart(canvas, {
      type: "scatter",
      plugins: [quadrantPlugin],
      data: {
        datasets: [
          {
            data: model.cluster.concat(model.secondary),
            backgroundColor: "rgba(174, 182, 194, 0.88)",
            pointRadius: 4.3,
            pointHoverRadius: 4.3,
            borderWidth: 0
          },
          {
            data: model.outliers,
            backgroundColor: "#0EA5E9",
            pointRadius: 6.1,
            pointHoverRadius: 6.1,
            borderWidth: 0
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
            min: -50,
            max: 60,
            grid: { display: false },
            border: { display: true, color: "#4B5563", width: 1 },
            ticks: { display: false }
          },
          y: {
            min: 0,
            max: 100,
            grid: { display: false },
            border: { display: true, color: "#4B5563", width: 1 },
            ticks: { display: false }
          }
        },
        animation: false
      }
    });
  }

  function makeLogisticsWaterfallChart() {
    const canvas = document.getElementById("pg-logistics-waterfall");
    if (!canvas) return null;

    const labels = ["Revenue", "COGS", "Logistics", "SG&A", "Profit"];
    const starts = [0, 100, 40, 10, 0];
    const ends = [100, 40, 10, 5, 5];
    const barIndices = [0, 1, 2, 3, 4];

    const connectorPlugin = {
      id: "waterfallConnectors",
      afterDatasetsDraw(chart) {
        const { ctx, chartArea, scales } = chart;
        const xScale = scales.x;
        const yScale = scales.y;
        if (!chartArea || !xScale || !yScale) return;

        const meta = chart.getDatasetMeta(0);
        if (!meta || !meta.data || meta.data.length < 4) return;

        ctx.save();
        ctx.strokeStyle = "rgba(75, 85, 99, 0.55)";
        ctx.lineWidth = 1;

        // Draw only sequential waterfall connectors through SG&A.
        for (let i = 0; i < 3; i += 1) {
          const bar = meta.data[barIndices[i]];
          const nextBar = meta.data[barIndices[i + 1]];
          const currentEndY = yScale.getPixelForValue(ends[barIndices[i]]);
          const nextStartY = yScale.getPixelForValue(starts[barIndices[i + 1]]);
          const x1 = bar.x + (bar.width / 2);
          const x2 = nextBar.x - (nextBar.width / 2);

          if (Math.abs(ends[barIndices[i]] - starts[barIndices[i + 1]]) < 0.001) {
            ctx.beginPath();
            ctx.moveTo(x1, currentEndY);
            ctx.lineTo(x2, currentEndY);
            ctx.stroke();
          } else {
            const xm = (x1 + x2) / 2;
            ctx.beginPath();
            ctx.moveTo(x1, currentEndY);
            ctx.lineTo(xm, currentEndY);
            ctx.lineTo(xm, nextStartY);
            ctx.lineTo(x2, nextStartY);
            ctx.stroke();
          }
        }

        ctx.restore();
      }
    };

    const baselinePlugin = {
      id: "waterfallBaseline",
      afterDatasetsDraw(chart) {
        const { ctx, chartArea, scales } = chart;
        const yScale = scales.y;
        if (!chartArea || !yScale) return;

        const y0 = yScale.getPixelForValue(0);
        ctx.save();
        ctx.strokeStyle = "rgba(148, 163, 184, 0.9)";
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.moveTo(chartArea.left, y0);
        ctx.lineTo(chartArea.right, y0);
        ctx.stroke();
        ctx.restore();
      }
    };

    return new Chart(canvas, {
      type: "bar",
      plugins: [baselinePlugin, connectorPlugin],
      data: {
        labels,
        datasets: [
          {
            data: starts.map((s, i) => [s, ends[i]]),
            borderSkipped: false,
            borderRadius: 2,
            backgroundColor: [
              "#E2E8F0", // Revenue
              "#9CA3AF", // COGS
              "#0EA5E9", // Logistics
              "#6B7280", // SG&A
              "#E2E8F0"  // Profit
            ],
            barPercentage: 0.84,
            categoryPercentage: 0.9
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
            grid: { display: false },
            border: { display: false },
            ticks: { display: false }
          },
          y: {
            min: 0,
            max: 105,
            grid: { display: false },
            border: { display: true, color: "#4B5563", width: 1 },
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

  function canvasToBlob(canvas) {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
          return;
        }
        try {
          const dataUrl = canvas.toDataURL("image/png");
          const byteString = atob(dataUrl.split(",")[1]);
          const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i += 1) {
            ia[i] = byteString.charCodeAt(i);
          }
          resolve(new Blob([ab], { type: mimeString }));
        } catch (_) {
          resolve(null);
        }
      }, "image/png");
    });
  }

  function downloadCanvasPng(canvas, fileName) {
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function waitForFrame() {
    return new Promise((resolve) => requestAnimationFrame(resolve));
  }

  async function copyCanvasToClipboard(canvas) {
    if (!navigator.clipboard || !window.ClipboardItem) return null;
    const exportCanvas = buildExportCanvas(canvas);
    const blob = await canvasToBlob(exportCanvas);
    if (!blob) return null;
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    return exportCanvas;
  }

  function wireExport(buttonId, statusId, canvasId) {
    const btn = document.getElementById(buttonId);
    const status = document.getElementById(statusId);
    const canvas = document.getElementById(canvasId);
    if (!btn || !status || !canvas) return;

    btn.addEventListener("click", async () => {
      btn.disabled = true;
      const old = btn.textContent;
      btn.textContent = "Copying...";
      try {
        if (canvas.width < 4 || canvas.height < 4) {
          await waitForFrame();
          await waitForFrame();
        }

        const copiedCanvas = await copyCanvasToClipboard(canvas);
        if (copiedCanvas) {
          status.textContent = "Copied. Paste into your slide deck.";
        } else {
          const exportCanvas = buildExportCanvas(canvas);
          downloadCanvasPng(exportCanvas, `${canvasId}.png`);
          status.textContent = "Clipboard unavailable. Downloaded PNG instead.";
        }
      } catch (_) {
        try {
          const exportCanvas = buildExportCanvas(canvas);
          downloadCanvasPng(exportCanvas, `${canvasId}.png`);
          status.textContent = "Copy failed. Downloaded PNG instead.";
        } catch (__){
          status.textContent = "Copy failed. Try again.";
        }
      }
      btn.textContent = old;
      btn.disabled = false;
    });
  }

  makeWhaleChart();
  makeMarginRevenueScatterChart();
  makeLogisticsWaterfallChart();
  wireExport("pg-copy-whale", "pg-copy-status", "pg-whale-curve");
  wireExport("pg-copy-scatter", "pg-copy-scatter-status", "pg-margin-revenue-scatter");
  wireExport("pg-copy-waterfall", "pg-copy-waterfall-status", "pg-logistics-waterfall");
})();
