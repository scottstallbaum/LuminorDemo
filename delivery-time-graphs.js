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
            title: { display: true, text: "Volume (k units)", color: COLORS.muted },
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
    // Fixed bubble placement/size modeled from the reference composition.
    const pts = [
      { x: -46, y: 72, r: 9 },
      { x: -22, y: 61, r: 23 },
      { x: -29, y: 49, r: 24 },
      { x: -9, y: 34, r: 12 },
      { x: -43, y: 31, r: 13 },
      { x: -31, y: 24, r: 12 },
      { x: -20, y: 22, r: 20 },
      { x: -2, y: 30, r: 6 },
      { x: 0, y: 56, r: 10 },
      { x: 7, y: 53, r: 17 },
      { x: 13, y: 46, r: 9 },
      { x: 18, y: 34, r: 18 },
      { x: 16, y: 40, r: 10 },
      { x: 24, y: 63, r: 20 },
      { x: 42, y: 62, r: 25 },
      { x: 50, y: 55, r: 14 },
      { x: 34, y: 32, r: 24 },
      { x: 54, y: 24, r: 8 }
    ];

    const segCrosshairPlugin = {
      id: "segCrosshairPlugin",
      afterDraw(chart) {
        if (chart.canvas.id !== "dtg-seg-bubble") return;
        const { ctx, scales: { x, y } } = chart;
        const xZero = x.getPixelForValue(0);
        const yFifty = y.getPixelForValue(50);

        ctx.save();
        ctx.strokeStyle = "rgba(159,176,211,.7)";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(xZero, y.top);
        ctx.lineTo(xZero, y.bottom);
        ctx.moveTo(x.left, yFifty);
        ctx.lineTo(x.right, yFifty);
        ctx.stroke();

        ctx.restore();
      }
    };

    return new Chart(document.getElementById("dtg-seg-bubble"), {
      type: "bubble",
      data: {
        datasets: [{
          label: "Customer clusters",
          data: pts,
          backgroundColor: "rgba(176,194,212,.58)",
          borderColor: "rgba(176,194,212,.22)",
          borderWidth: 1
        }]
      },
      options: {
        ...baseOptions,
        layout: {
          padding: { top: 2, right: 4, bottom: 2, left: 2 }
        },
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
            title: { display: true, text: "Contribution Margin %", color: COLORS.muted },
            min: -60,
            max: 60,
            ticks: {
              color: COLORS.muted,
              callback: (v) => `${Number(v).toFixed(0)}%`
            },
            grid: { color: "rgba(159,176,211,.12)" }
          },
          y: {
            ...baseOptions.scales.y,
            title: { display: true, text: "Cost to Serve Spread", color: COLORS.muted },
            min: 20,
            max: 80,
            ticks: {
              color: COLORS.muted,
              callback: (v) => `${Number(v).toFixed(0)}%`
            },
            grid: { color: "rgba(159,176,211,.12)" }
          }
        }
      },
      plugins: [segCrosshairPlugin]
    });
  }

  const customerScatterGuidePlugin = {
    id: "customerScatterGuidePlugin",
    afterDraw(chart) {
      if (chart.canvas.id !== "dtg-customer-scatter") return;
      const { ctx, scales: { x, y } } = chart;
      const xZero = x.getPixelForValue(0);
      const yMid = y.getPixelForValue(6);

      ctx.save();
      ctx.strokeStyle = "rgba(184,170,126,.78)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(xZero, y.top);
      ctx.lineTo(xZero, y.bottom);
      ctx.moveTo(x.left, yMid);
      ctx.lineTo(x.right, yMid);
      ctx.stroke();
      ctx.restore();
    }
  };

  function makeCustomerScatter() {
    const pts = [];

    function randNormal() {
      const u = Math.max(1e-6, r3());
      const v = Math.max(1e-6, r3());
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }

    function addCluster(centerX, centerY, spreadX, spreadY, count) {
      for (let i = 0; i < count; i++) {
        pts.push({
          x: Math.max(-60, Math.min(60, centerX + (randNormal() * spreadX))),
          y: Math.max(0.15, Math.min(11.85, centerY + (randNormal() * spreadY)))
        });
      }
    }

    function addOutliers(count) {
      for (let i = 0; i < count; i++) {
        pts.push({
          x: -60 + (r3() * 120),
          y: 0.15 + (r3() * 11.7)
        });
      }
    }

    // Concentrated center/right clouds with lighter tailing, closer to the reference composition.
    addCluster(-12, 7.9, 9.5, 1.0, 180);
    addCluster(18, 8.3, 8.5, 0.95, 240);
    addCluster(-10, 4.6, 11.5, 1.0, 180);
    addCluster(18, 4.4, 10.5, 1.15, 220);
    addCluster(6, 6.0, 6.5, 2.05, 110);
    addOutliers(120);

    return new Chart(document.getElementById("dtg-customer-scatter"), {
      type: "scatter",
      data: {
        datasets: [{
          label: "Customers",
          data: pts,
          backgroundColor: "rgba(193,184,149,.34)",
          borderColor: "rgba(193,184,149,.66)",
          pointRadius: 2.2
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
              title: () => "Customer",
              label: (item) => {
                const p = item.raw || {};
                return [
                  `Contribution Margin: ${Number(p.x || 0).toFixed(0)}%`,
                  `Volume: ${Number(p.y || 0).toFixed(1)} k units`
                ];
              }
            }
          }
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
            title: { display: true, text: "Volume (k units)", color: COLORS.muted },
            min: 0,
            max: 12,
            ticks: {
              color: COLORS.muted,
              callback: (v) => `${v}`
            }
          }
        }
      },
      plugins: [customerScatterGuidePlugin]
    });
  }

  function formatBillions(value) {
    const abs = Math.abs(value).toFixed(1);
    return `${value < 0 ? "-" : ""}$${abs}B`;
  }

  function makeWaterfallBridge(canvasId, config) {
    const groupStyles = {
      "Gross to Net Sales": {
        fill: "rgba(58,178,225,.86)",
        border: "rgba(58,178,225,1)",
        anchor: "rgba(110,201,237,.28)",
        header: "#48bcea"
      },
      COGS: {
        fill: "rgba(255,190,92,.78)",
        border: "rgba(255,190,92,1)",
        anchor: "rgba(255,214,152,.22)",
        header: "#f4b24d"
      },
      Warehousing: {
        fill: "rgba(113,204,126,.8)",
        border: "rgba(113,204,126,1)",
        anchor: "rgba(113,204,126,.22)",
        header: "#63c46a"
      },
      Transportation: {
        fill: "rgba(171,156,202,.72)",
        border: "rgba(171,156,202,1)",
        anchor: "rgba(171,156,202,.2)",
        header: "#a596c9"
      },
      Marketing: {
        fill: "rgba(255,191,96,.74)",
        border: "rgba(255,191,96,1)",
        anchor: "rgba(255,191,96,.18)",
        header: "#f0b35e"
      },
      "Selling Costs": {
        fill: "rgba(255,109,109,.76)",
        border: "rgba(255,109,109,1)",
        anchor: "rgba(255,109,109,.18)",
        header: "#ff6d6d"
      },
      "Invested Capital": {
        fill: "rgba(65,193,191,.76)",
        border: "rgba(65,193,191,1)",
        anchor: "rgba(65,193,191,.2)",
        header: "#35bab5"
      },
      EC: {
        fill: "rgba(58,178,225,.86)",
        border: "rgba(58,178,225,1)",
        anchor: "rgba(58,178,225,.18)",
        header: "#48bcea"
      }
    };

    const labels = [];
    const bars = [];
    const backgroundColor = [];
    const borderColor = [];
    const modelSteps = [];
    const groups = [];
    const groupIndexes = new Map();
    let cumulative = 0;

    config.steps.forEach((step, index) => {
      const style = groupStyles[step.group] || groupStyles.COGS;
      const groupRange = groupIndexes.get(step.group);
      if (!groupRange) {
        groupIndexes.set(step.group, { start: index, end: index });
      } else {
        groupRange.end = index;
      }

      let startValue = cumulative;
      let endValue = cumulative;
      if (step.kind === "total") {
        startValue = 0;
        endValue = step.value;
        cumulative = step.value;
      } else if (step.kind === "anchor") {
        startValue = 0;
        endValue = cumulative;
      } else {
        endValue = cumulative + step.value;
        cumulative = endValue;
      }

      const low = Math.min(startValue, endValue);
      const high = Math.max(startValue, endValue);

      labels.push(step.pct);
      bars.push([low, high]);
      modelSteps.push({
        ...step,
        start: startValue,
        end: endValue,
        running: cumulative
      });

      if (step.kind === "anchor") {
        backgroundColor.push(style.anchor);
        borderColor.push("rgba(255,255,255,.04)");
      } else if (step.kind === "total") {
        backgroundColor.push(style.fill);
        borderColor.push(style.border);
      } else {
        backgroundColor.push(style.fill);
        borderColor.push(style.border);
      }
    });

    groupIndexes.forEach((range, name) => {
      groups.push({
        label: name.toUpperCase(),
        color: (groupStyles[name] || groupStyles.COGS).header,
        start: range.start,
        end: range.end
      });
    });

    const waterfallBridgePlugin = {
      id: `waterfallBridgePlugin-${canvasId}`,
      beforeDatasetsDraw(chart) {
        const { ctx, chartArea } = chart;
        const meta = chart.getDatasetMeta(0);
        if (!meta?.data?.length) return;

        const barsMeta = meta.data;
        function getBounds(idx) {
          const center = barsMeta[idx].x;
          const left = idx === 0 ? chartArea.left : (barsMeta[idx - 1].x + center) / 2;
          const right = idx === barsMeta.length - 1 ? chartArea.right : (center + barsMeta[idx + 1].x) / 2;
          return { left, right };
        }

        ctx.save();
        for (let i = 0; i < barsMeta.length; i++) {
          const { left, right } = getBounds(i);
          ctx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,.035)" : "rgba(255,255,255,.015)";
          ctx.fillRect(left, chartArea.top, right - left, chartArea.bottom - chartArea.top);
        }
        ctx.restore();
      },
      afterDatasetsDraw(chart) {
        const { ctx, chartArea, scales: { y } } = chart;
        const meta = chart.getDatasetMeta(0);
        if (!meta?.data?.length) return;
        const barsMeta = meta.data;

        function getBounds(idx) {
          const center = barsMeta[idx].x;
          const left = idx === 0 ? chartArea.left : (barsMeta[idx - 1].x + center) / 2;
          const right = idx === barsMeta.length - 1 ? chartArea.right : (center + barsMeta[idx + 1].x) / 2;
          return { left, right };
        }

        ctx.save();
        ctx.strokeStyle = "rgba(255,255,255,.18)";
        ctx.lineWidth = 1;
        for (let i = 0; i < modelSteps.length - 1; i++) {
          const current = modelSteps[i];
          const next = modelSteps[i + 1];
          if (current.kind === "total" || next.kind === "total") continue;
          const currBounds = getBounds(i);
          const nextBounds = getBounds(i + 1);
          const connectorY = y.getPixelForValue(current.end);
          ctx.beginPath();
          ctx.moveTo(currBounds.right - 2, connectorY);
          ctx.lineTo(nextBounds.left + 2, connectorY);
          ctx.stroke();
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.font = "700 10px Inter";
        groups.forEach((group) => {
          const startBounds = getBounds(group.start);
          const endBounds = getBounds(group.end);
          const mid = (startBounds.left + endBounds.right) / 2;
          ctx.strokeStyle = group.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(startBounds.left + 2, chartArea.top + 1);
          ctx.lineTo(endBounds.right - 2, chartArea.top + 1);
          ctx.stroke();

          ctx.fillStyle = group.color;
          ctx.fillText(group.label, mid, chartArea.top - 8);
        });
        ctx.restore();
      }
    };

    return new Chart(document.getElementById(canvasId), {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "$B",
          data: bars,
          borderRadius: 0,
          borderSkipped: false,
          backgroundColor,
          borderColor,
          borderWidth: 1,
          barPercentage: .94,
          categoryPercentage: .98
        }]
      },
      options: {
        ...baseOptions,
        layout: {
          padding: { top: 28, right: 6, bottom: 0, left: 0 }
        },
        plugins: {
          ...baseOptions.plugins,
          legend: { display: false },
          tooltip: {
            ...baseOptions.plugins.tooltip,
            callbacks: {
              title: (items) => {
                const step = modelSteps[items[0]?.dataIndex || 0];
                return step.group;
              },
              label: (item) => {
                const step = modelSteps[item.dataIndex];
                if (!step) return "";
                if (step.kind === "total") {
                  return [
                    `${step.pct}`,
                    `Total: ${formatBillions(step.end)}`
                  ];
                }
                if (step.kind === "anchor") {
                  return [
                    `${step.pct}`,
                    `Starting point: ${formatBillions(step.end)}`
                  ];
                }
                return [
                  `${step.pct}`,
                  `Change: ${formatBillions(step.value)}`,
                  `Running total: ${formatBillions(step.end)}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            ...baseOptions.scales.x,
            grid: { display: false },
            ticks: {
              color: COLORS.muted,
              maxRotation: 0,
              minRotation: 0,
              font: { size: 9 }
            }
          },
          y: {
            ...baseOptions.scales.y,
            min: config.min,
            max: config.max,
            title: { display: false },
            ticks: {
              color: COLORS.muted,
              callback: (v) => formatBillions(Number(v)),
              font: { size: 10 }
            },
            grid: {
              color: "rgba(159,176,211,.14)",
              borderDash: [2, 3]
            }
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

  function getChartMeta(canvas) {
    const card = canvas.closest(".dtg-card");
    const titleEl = card?.querySelector(".dtg-card-head h3");
    const subtitleEl = card?.querySelector(".dtg-card-head .dtg-subtitle");
    const noteEl = card?.querySelector(".dtg-card-head .dtg-inline-note");
    return {
      title: titleEl?.textContent?.trim() || "",
      subtitle: subtitleEl?.textContent?.trim() || "",
      note: noteEl?.textContent?.trim() || ""
    };
  }

  function buildExportCanvas(canvas) {
    const { title, subtitle, note } = getChartMeta(canvas);
    const outerPad = 34;
    const panelPadX = 18;
    const panelPadTop = 8;
    const panelPadBottom = 16;
    const panelW = canvas.width + (panelPadX * 2);
    let titleSize = 22;
    let titleLines = title ? [title] : [];

    function splitTitle(maxWidth) {
      if (!title) return [];
      const words = title.split(/\s+/).filter(Boolean);
      if (!words.length) return [];

      // Try single-line first while shrinking font.
      while (titleSize > 14) {
        if (ctx.measureText(title).width <= maxWidth) return [title];
        titleSize -= 1;
        ctx.font = `700 ${titleSize}px Inter`;
      }

      // Allow two lines for longer titles.
      titleSize = 18;
      ctx.font = `700 ${titleSize}px Inter`;
      while (titleSize > 13) {
        let line1 = "";
        let cut = -1;
        for (let i = 0; i < words.length; i++) {
          const test = line1 ? `${line1} ${words[i]}` : words[i];
          if (ctx.measureText(test).width <= maxWidth) {
            line1 = test;
            cut = i;
          } else {
            break;
          }
        }

        if (cut >= 0 && cut < words.length - 1) {
          const line2 = words.slice(cut + 1).join(" ");
          if (ctx.measureText(line2).width <= maxWidth) {
            return [line1, line2];
          }
        }

        titleSize -= 1;
        ctx.font = `700 ${titleSize}px Inter`;
      }

      // Final fallback: break title near midpoint.
      const midpoint = Math.ceil(words.length / 2);
      return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
    }

    const exportCanvas = document.createElement("canvas");
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return canvas;

    ctx.font = `700 ${titleSize}px Inter`;
    titleLines = splitTitle(panelW - 34);

    const titleLineHeight = title ? (titleSize + 2) : 0;
    const subtitleBand = subtitle ? 14 : 0;
    const noteBand = note ? 12 : 0;
    const topPad = title ? 11 : 0;
    const bottomPad = title ? 1 : 0;
    const titleBand = title ? ((titleLines.length * titleLineHeight) + subtitleBand + noteBand + topPad + bottomPad) : 16;
    const panelH = canvas.height + panelPadTop + panelPadBottom + titleBand;

    exportCanvas.width = panelW + (outerPad * 2);
    exportCanvas.height = panelH + (outerPad * 2);

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
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#e8eefc";
      ctx.font = `700 ${titleSize}px Inter`;
      const titleStartY = panelY + topPad + (titleLineHeight / 2);
      titleLines.forEach((line, idx) => {
        ctx.fillText(line, panelX + (panelW / 2), titleStartY + (idx * titleLineHeight));
      });

      if (subtitle) {
        ctx.fillStyle = "#9fb0d3";
        ctx.font = "500 12px Inter";
        const subtitleY = titleStartY + (titleLines.length * titleLineHeight) - 1;
        ctx.fillText(subtitle, panelX + (panelW / 2), subtitleY);
      }

      if (note) {
        ctx.fillStyle = "#9fb0d3";
        ctx.font = "500 12px Inter";
        const noteY = titleStartY + (titleLines.length * titleLineHeight) + (subtitle ? 13 : 1);
        ctx.fillText(note, panelX + (panelW / 2), noteY);
      }
    }

    const chartX = panelX + panelPadX;
    const chartY = panelY + titleBand + panelPadTop;
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
    makeWaterfallBridge("dtg-group1-waterfall", {
      min: -0.5,
      max: 4.0,
      steps: [
        { group: "Gross to Net Sales", kind: "total", pct: "132%", value: 3.65 },
        { group: "Gross to Net Sales", kind: "delta", pct: "29%", value: -0.82 },
        { group: "Gross to Net Sales", kind: "delta", pct: "3%", value: -0.08 },
        { group: "COGS", kind: "anchor", pct: "100%" },
        { group: "COGS", kind: "delta", pct: "11%", value: -0.24 },
        { group: "COGS", kind: "delta", pct: "9%", value: -0.21 },
        { group: "COGS", kind: "delta", pct: "11%", value: -0.29 },
        { group: "COGS", kind: "delta", pct: "6%", value: -0.16 },
        { group: "COGS", kind: "delta", pct: "15%", value: -0.42 },
        { group: "COGS", kind: "delta", pct: "18%", value: -0.52 },
        { group: "COGS", kind: "delta", pct: "7%", value: -0.14 },
        { group: "COGS", kind: "delta", pct: "23%", value: -0.26 },
        { group: "Warehousing", kind: "anchor", pct: "0%" },
        { group: "Warehousing", kind: "delta", pct: "7%", value: 0.12 },
        { group: "Warehousing", kind: "delta", pct: "1%", value: -0.04 },
        { group: "Transportation", kind: "anchor", pct: "0%" },
        { group: "Transportation", kind: "delta", pct: "2%", value: -0.18 },
        { group: "Transportation", kind: "delta", pct: "1%", value: -0.13 },
        { group: "Transportation", kind: "delta", pct: "10%", value: -0.21 },
        { group: "Marketing", kind: "anchor", pct: "2%" },
        { group: "Marketing", kind: "delta", pct: "1%", value: -0.02 },
        { group: "Selling Costs", kind: "anchor", pct: "1%" },
        { group: "Selling Costs", kind: "delta", pct: "2%", value: -0.11 },
        { group: "Invested Capital", kind: "anchor", pct: "1%" },
        { group: "Invested Capital", kind: "delta", pct: "1%", value: -0.14 },
        { group: "EC", kind: "total", pct: "-8%", value: -0.20 }
      ]
    });
    makeWaterfallBridge("dtg-group2-waterfall", {
      min: -0.2,
      max: 3.8,
      steps: [
        { group: "Gross to Net Sales", kind: "total", pct: "126%", value: 3.35 },
        { group: "Gross to Net Sales", kind: "delta", pct: "21%", value: -0.55 },
        { group: "Gross to Net Sales", kind: "delta", pct: "2%", value: -0.05 },
        { group: "COGS", kind: "anchor", pct: "100%" },
        { group: "COGS", kind: "delta", pct: "9%", value: -0.18 },
        { group: "COGS", kind: "delta", pct: "8%", value: -0.16 },
        { group: "COGS", kind: "delta", pct: "9%", value: -0.18 },
        { group: "COGS", kind: "delta", pct: "5%", value: -0.11 },
        { group: "COGS", kind: "delta", pct: "11%", value: -0.30 },
        { group: "COGS", kind: "delta", pct: "14%", value: -0.38 },
        { group: "COGS", kind: "delta", pct: "5%", value: -0.12 },
        { group: "COGS", kind: "delta", pct: "18%", value: -0.18 },
        { group: "Warehousing", kind: "anchor", pct: "0%" },
        { group: "Warehousing", kind: "delta", pct: "5%", value: 0.10 },
        { group: "Warehousing", kind: "delta", pct: "1%", value: -0.03 },
        { group: "Transportation", kind: "anchor", pct: "0%" },
        { group: "Transportation", kind: "delta", pct: "2%", value: -0.10 },
        { group: "Transportation", kind: "delta", pct: "1%", value: -0.08 },
        { group: "Transportation", kind: "delta", pct: "7%", value: -0.11 },
        { group: "Marketing", kind: "anchor", pct: "1%" },
        { group: "Marketing", kind: "delta", pct: "1%", value: -0.02 },
        { group: "Selling Costs", kind: "anchor", pct: "1%" },
        { group: "Selling Costs", kind: "delta", pct: "1%", value: -0.05 },
        { group: "Invested Capital", kind: "anchor", pct: "1%" },
        { group: "Invested Capital", kind: "delta", pct: "1%", value: 0.02 },
        { group: "EC", kind: "total", pct: "19%", value: 0.62 }
      ]
    });
    makeLeadTime();
    makeImpact();
    bindExportButtons();
  }

  init();
})();