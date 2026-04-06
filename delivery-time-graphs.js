(function () {
  const COLORS = {
    text: "#e8eefc",
    muted: "#9fb0d3",
    line: "rgba(159,176,211,.16)",
    accent: "#45d0a2",
    warn: "#ffae57",
    danger: "#ff6d6d",
    blue: "#58b2ff"
  };

  function rand(seed) {
    let t = seed;
    return function () {
      t += 0x6D2B79F5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  const r1 = rand(11);
  const r2 = rand(22);
  const r3 = rand(33);

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: COLORS.muted }
      },
      tooltip: {
        backgroundColor: "rgba(15,26,45,.95)",
        borderColor: "rgba(159,176,211,.2)",
        borderWidth: 1,
        titleColor: COLORS.muted,
        bodyColor: COLORS.text,
        padding: 10
      }
    },
    scales: {
      x: {
        ticks: { color: COLORS.muted },
        grid: { color: COLORS.line }
      },
      y: {
        ticks: { color: COLORS.muted },
        grid: { color: COLORS.line }
      }
    }
  };

  const skuScatterGuidePlugin = {
    id: "skuScatterGuidePlugin",
    afterDraw(chart) {
      if (chart.canvas.id !== "dtg-sku-scatter") return;
      const { ctx, scales: { x, y } } = chart;

      const xZero = x.getPixelForValue(0);
      const yMid = y.getPixelForValue(6);

      ctx.save();

      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = "rgba(159,176,211,.55)";
      ctx.beginPath();
      ctx.moveTo(xZero, y.top);
      ctx.lineTo(xZero, y.bottom);
      ctx.moveTo(x.left, yMid);
      ctx.lineTo(x.right, yMid);
      ctx.stroke();

      ctx.setLineDash([]);

      ctx.restore();
    }
  };

  function makeSkuScatter() {
    const quadTopLeft = [];
    const quadTopRight = [];
    const quadBottomLeft = [];
    const quadBottomRight = [];

    function addPointToQuadrant(point) {
      const { x, y } = point;
      if (x < 0 && y >= 6) {
        quadTopLeft.push(point);
      } else if (x >= 0 && y >= 6) {
        quadTopRight.push(point);
      } else if (x < 0 && y < 6) {
        quadBottomLeft.push(point);
      } else {
        quadBottomRight.push(point);
      }
    }

    function randNormal() {
      const u = Math.max(1e-6, r1());
      const v = Math.max(1e-6, r1());
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }

    function addCluster(centerX, centerY, spreadX, spreadY, count) {
      for (let i = 0; i < count; i++) {
        const x = centerX + (randNormal() * spreadX);
        const y = centerY + (randNormal() * spreadY);
        addPointToQuadrant({
          x: Math.max(-60, Math.min(60, x)),
          y: Math.max(0.15, Math.min(11.85, y))
        });
      }
    }

    // Natural-looking quadrant clouds (closer to the original reference style).
    addCluster(-22, 8.2, 14.5, 1.35, 260);
    addCluster(22, 8.3, 14.5, 1.35, 300);
    addCluster(-21, 2.6, 14.5, 1.75, 290);
    addCluster(22, 2.8, 14.5, 1.85, 320);

    // Add a light center cloud so the split lines feel less artificial.
    addCluster(0, 6.0, 8.5, 1.0, 120);

    return new Chart(document.getElementById("dtg-sku-scatter"), {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Quadrant 1",
            data: quadTopLeft,
            backgroundColor: "rgba(255,109,109,.68)",
            borderColor: "rgba(255,109,109,1)",
            pointRadius: 1.8
          },
          {
            label: "Quadrant 2",
            data: quadTopRight,
            backgroundColor: "rgba(255,174,87,.68)",
            borderColor: "rgba(255,174,87,1)",
            pointRadius: 1.8
          },
          {
            label: "Quadrant 3",
            data: quadBottomLeft,
            backgroundColor: "rgba(88,178,255,.62)",
            borderColor: "rgba(88,178,255,1)",
            pointRadius: 1.7
          },
          {
            label: "Quadrant 4",
            data: quadBottomRight,
            backgroundColor: "rgba(69,208,162,.72)",
            borderColor: "rgba(69,208,162,1)",
            pointRadius: 1.7
          }
        ]
      },
      options: {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          legend: { display: false }
        },
        scales: {
          x: {
            ...baseOptions.scales.x,
            title: { display: true, text: "Contribution Margin %", color: COLORS.muted },
            min: -60,
            max: 60,
            ticks: {
              color: COLORS.muted,
              callback: (v) => `${Number(v).toFixed(0)}%`
            }
          },
          y: {
            ...baseOptions.scales.y,
            title: { display: true, text: "Volume (units)", color: COLORS.muted },
            min: 0,
            max: 12,
            ticks: {
              color: COLORS.muted,
              callback: (v) => `${v}`
            }
          }
        }
      },
      plugins: [skuScatterGuidePlugin]
    });
  }

  function makeSegBubble() {
    const pts = [];

    const centers = [
      { x: -30, y: 26 },
      { x: 24, y: 24 },
      { x: -24, y: -20 },
      { x: 26, y: -18 },
      { x: 0, y: 4 }
    ];

    for (let i = 0; i < 42; i++) {
      const c = centers[Math.floor(r2() * centers.length)];
      const x = c.x + ((r2() - 0.5) * 26);
      const y = c.y + ((r2() - 0.5) * 24);
      const skew = Math.pow(r2(), 2.2);
      let r = 4 + (skew * 42);
      if (r2() > 0.88) r += 9;
      r = Math.max(4, Math.min(56, r));
      pts.push({ x, y, r });
    }

    return new Chart(document.getElementById("dtg-seg-bubble"), {
      type: "bubble",
      data: {
        datasets: [{
          label: "Customer clusters",
          data: pts,
          backgroundColor: "rgba(159,176,211,.34)",
          borderColor: "rgba(159,176,211,.82)",
          borderWidth: 1.2
        }]
      },
      options: {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          legend: { display: false },
          tooltip: {
            ...baseOptions.plugins.tooltip,
            callbacks: {
              title: () => "Customer Group",
              label: (item) => {
                const p = item.raw || {};
                return [
                  `Economic Contribution: ${Number(p.x || 0).toFixed(0)}`,
                  `Cost to Serve Spread: ${Number(p.y || 0).toFixed(0)}`,
                  `Relative Group Size: ${Math.round((p.r || 0) * 8)}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            ...baseOptions.scales.x,
            title: { display: true, text: "Economic Contribution ($)", color: COLORS.muted },
            min: -55,
            max: 55
          },
          y: {
            ...baseOptions.scales.y,
            title: { display: true, text: "Cost to Serve Spread", color: COLORS.muted },
            min: -55,
            max: 55
          }
        }
      }
    });
  }

  const benchmarkBoxesPlugin = {
    id: "benchmarkBoxesPlugin",
    afterDraw(chart) {
      if (chart.canvas.id !== "dtg-customer-scatter") return;
      const { ctx, scales: { x, y } } = chart;
      const left = x.getPixelForValue(-100);
      const mid = x.getPixelForValue(0);
      const right = x.getPixelForValue(100);
      const top = y.getPixelForValue(12);
      const split = y.getPixelForValue(6);

      ctx.save();
      ctx.strokeStyle = "rgba(88,178,255,.85)";
      ctx.fillStyle = "rgba(88,178,255,.13)";
      ctx.lineWidth = 1;
      ctx.fillRect(left, top, mid - left, split - top);
      ctx.strokeRect(left, top, mid - left, split - top);
      ctx.fillStyle = "rgba(69,208,162,.13)";
      ctx.strokeStyle = "rgba(69,208,162,.85)";
      ctx.fillRect(mid, top, right - mid, split - top);
      ctx.strokeRect(mid, top, right - mid, split - top);
      ctx.fillStyle = COLORS.muted;
      ctx.font = "600 12px Inter";
      ctx.fillText("Benchmark Group 1", left + 10, top + 18);
      ctx.fillText("Benchmark Group 2", mid + 10, top + 18);
      ctx.restore();
    }
  };

  function makeCustomerScatter() {
    const pts = [];
    for (let i = 0; i < 700; i++) {
      const x = (r3() * 200) - 100;
      const y = Math.max(0.1, (r3() * 10) + (x < 0 ? 0.8 : -0.2));
      pts.push({ x, y });
    }
    return new Chart(document.getElementById("dtg-customer-scatter"), {
      type: "scatter",
      data: {
        datasets: [{
          label: "Customers",
          data: pts,
          backgroundColor: "rgba(255,174,87,.26)",
          borderColor: "rgba(255,174,87,.6)",
          pointRadius: 2
        }]
      },
      options: {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          legend: { display: false }
        },
        scales: {
          x: {
            ...baseOptions.scales.x,
            title: { display: true, text: "Economic Contribution %", color: COLORS.muted },
            min: -100,
            max: 100,
            ticks: { color: COLORS.muted, callback: (v) => `${v}%` }
          },
          y: {
            ...baseOptions.scales.y,
            title: { display: true, text: "Volume", color: COLORS.muted },
            min: 0,
            max: 12
          }
        }
      },
      plugins: [benchmarkBoxesPlugin]
    });
  }

  function makeGroupBar(canvasId, series, maxVal) {
    return new Chart(document.getElementById(canvasId), {
      type: "bar",
      data: {
        labels: [
          "Gross to Net", "COGS", "Warehousing", "Transportation", "Marketing", "Selling", "Working Capital", "EC"
        ],
        datasets: [{
          label: "$/unit",
          data: series,
          borderRadius: 4,
          backgroundColor: series.map((v) => v >= 0 ? "rgba(88,178,255,.72)" : "rgba(255,109,109,.72)"),
          borderColor: series.map((v) => v >= 0 ? "rgba(88,178,255,1)" : "rgba(255,109,109,1)"),
          borderWidth: 1
        }]
      },
      options: {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          legend: { display: false }
        },
        scales: {
          x: {
            ...baseOptions.scales.x,
            ticks: { color: COLORS.muted, maxRotation: 0, minRotation: 0 }
          },
          y: {
            ...baseOptions.scales.y,
            min: -0.6,
            max: maxVal,
            title: { display: true, text: "$/unit", color: COLORS.muted }
          }
        }
      }
    });
  }

  function makeLeadTime() {
    const labels = Array.from({ length: 34 }, (_, i) => `C${i + 1}`);
    const high = labels.map(() => 13 + (r1() * 3.8));
    const low = labels.map(() => 12 + (r2() * 6.2));
    const highAvg = high.reduce((a, b) => a + b, 0) / high.length;

    return new Chart(document.getElementById("dtg-leadtime"), {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "High-profit customers",
            data: high,
            borderColor: COLORS.accent,
            backgroundColor: "rgba(69,208,162,.2)",
            pointRadius: 2.7,
            tension: 0.26
          },
          {
            label: "Unprofitable customers",
            data: low,
            borderColor: COLORS.danger,
            backgroundColor: "rgba(255,109,109,.2)",
            pointRadius: 2.7,
            tension: 0.26
          },
          {
            label: "Average (high-profit)",
            data: labels.map(() => highAvg),
            borderColor: "#8da8cb",
            borderDash: [6, 4],
            pointRadius: 0,
            tension: 0
          }
        ]
      },
      options: {
        ...baseOptions,
        scales: {
          x: {
            ...baseOptions.scales.x,
            title: { display: true, text: "Customers (ranked by profitability)", color: COLORS.muted },
            ticks: { display: false },
            grid: { display: false }
          },
          y: {
            ...baseOptions.scales.y,
            title: { display: true, text: "Average Lead Time (days)", color: COLORS.muted },
            min: 8,
            max: 20
          }
        }
      }
    });
  }

  function makeImpact() {
    const labels = [
      "OB Transportation",
      "Expedited Shipping",
      "Avoided Penalties",
      "Inventory",
      "IB Transportation",
      "Manufacturing",
      "Total Savings"
    ];
    const vals = [2.5, 0.9, 0.7, 0.6, 0.2, 0.15, 5.05];
    return new Chart(document.getElementById("dtg-impact"), {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "$MM",
          data: vals,
          backgroundColor: labels.map((l) => l === "Total Savings" ? "rgba(69,208,162,.72)" : "rgba(88,178,255,.72)"),
          borderColor: labels.map((l) => l === "Total Savings" ? "rgba(69,208,162,1)" : "rgba(88,178,255,1)"),
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        ...baseOptions,
        indexAxis: "y",
        plugins: {
          ...baseOptions.plugins,
          legend: { display: false }
        },
        scales: {
          x: {
            ...baseOptions.scales.x,
            title: { display: true, text: "Estimated Annual Impact ($MM)", color: COLORS.muted },
            min: 0,
            max: 5.6
          },
          y: {
            ...baseOptions.scales.y,
            grid: { display: false }
          }
        }
      }
    });
  }

  function getChartTitle(canvas) {
    const card = canvas.closest(".dtg-card");
    const titleEl = card?.querySelector(".dtg-card-head h3");
    return titleEl?.textContent?.trim() || "";
  }

  function buildExportCanvas(canvas) {
    const title = getChartTitle(canvas);
    const outerPad = 34;
    const panelPad = 18;
    const titleBand = title ? 54 : 16;
    const panelW = canvas.width + (panelPad * 2);
    const panelH = canvas.height + (panelPad * 2) + titleBand;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = panelW + (outerPad * 2);
    exportCanvas.height = panelH + (outerPad * 2);
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return canvas;

    const panelX = outerPad;
    const panelY = outerPad;

    function roundRectPath(x, y, w, h, r) {
      const rr = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + w, y, x + w, y + h, rr);
      ctx.arcTo(x + w, y + h, x, y + h, rr);
      ctx.arcTo(x, y + h, x, y, rr);
      ctx.arcTo(x, y, x + w, y, rr);
      ctx.closePath();
    }

    // Keep outer area transparent so pasted image does not show a dark rectangle.
    ctx.clearRect(0, 0, exportCanvas.width, exportCanvas.height);

    ctx.shadowColor = "rgba(0,0,0,.22)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 5;
    roundRectPath(panelX, panelY, panelW, panelH, 14);
    ctx.fillStyle = "#121c2f";
    ctx.fill();

    ctx.shadowColor = "transparent";
    roundRectPath(panelX, panelY, panelW, panelH, 14);
    ctx.strokeStyle = "#24314d";
    ctx.lineWidth = 1;
    ctx.stroke();

    if (title) {
      ctx.fillStyle = "#e8eefc";
      ctx.font = "700 22px Inter";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(title, panelX + (panelW / 2), panelY + (titleBand / 2) + 2);
    }

    const chartX = panelX + panelPad;
    const chartY = panelY + titleBand + panelPad;
    ctx.drawImage(canvas, chartX, chartY);

    return exportCanvas;
  }

  function downloadCanvasPng(canvas, id) {
    const exportCanvas = buildExportCanvas(canvas);
    const a = document.createElement("a");
    a.href = exportCanvas.toDataURL("image/png", 1.0);
    a.download = `${id}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function copyCanvasToClipboard(canvas) {
    if (!navigator.clipboard || !window.ClipboardItem) return false;
    const exportCanvas = buildExportCanvas(canvas);
    const blob = await new Promise((resolve) => exportCanvas.toBlob(resolve, "image/png"));
    if (!blob) return false;
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    return true;
  }

  function flashButton(btn, text) {
    const original = btn.textContent;
    btn.textContent = text;
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 900);
  }

  function bindExportButtons() {
    document.querySelectorAll(".dtg-export").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-canvas");
        const canvas = document.getElementById(id);
        if (!canvas) return;

        // Primary action: copy image for direct Ctrl+V into PowerPoint.
        try {
          const copied = await copyCanvasToClipboard(canvas);
          if (copied) {
            flashButton(btn, "Copied");
            return;
          }
        } catch (_err) {
          // Fallback handled below.
        }

        // Fallback for environments without clipboard-image support.
        downloadCanvasPng(canvas, id);
        flashButton(btn, "Downloaded");
      });
    });
  }

  function init() {
    makeSkuScatter();
    makeSegBubble();
    makeCustomerScatter();
    makeGroupBar("dtg-group1-waterfall", [3.4, 2.7, 0.4, 0.3, -0.2, -0.15, 0.08, 0.35], 3.8);
    makeGroupBar("dtg-group2-waterfall", [3.0, 2.1, 0.28, 0.19, -0.14, -0.1, 0.04, 0.62], 3.4);
    makeLeadTime();
    makeImpact();
    bindExportButtons();
  }

  init();
})();