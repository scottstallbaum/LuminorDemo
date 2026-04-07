(function () {
  "use strict";

  // ─── Shared Chart Options ──────────────────────────────────────────────────
  const COLORS = {
    text: "#e8eefc",
    muted: "#9fb0d3",
    line: "rgba(159,176,211,.16)",
    accent: "#45d0a2",
  };

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: COLORS.muted } },
      tooltip: {
        backgroundColor: "rgba(15,26,45,.95)",
        borderColor: "rgba(159,176,211,.2)",
        borderWidth: 1,
        titleColor: COLORS.muted,
        bodyColor: COLORS.text,
        padding: 10,
      },
    },
    scales: {
      x: { ticks: { color: COLORS.muted }, grid: { color: COLORS.line } },
      y: { ticks: { color: COLORS.muted }, grid: { color: COLORS.line } },
    },
  };

  // ─── Seeded RNG ────────────────────────────────────────────────────────────
  function rand(seed) {
    let t = seed;
    return function () {
      t += 0x6d2b79f5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ─── Customer / SKU Data ───────────────────────────────────────────────────
  const CUSTOMERS = [
    { name: "Customer 1",  cts: 18, priority: true  },
    { name: "Customer 2",  cts: 34, priority: false },
    { name: "Customer 3",  cts: 27, priority: false },
    { name: "Customer 4",  cts: 21, priority: true  },
    { name: "Customer 5",  cts: 16, priority: true  },
    { name: "Customer 6",  cts: 39, priority: false },
    { name: "Customer 7",  cts: 43, priority: false },
    { name: "Customer 8",  cts: 29, priority: false },
    { name: "Customer 9",  cts: 37, priority: false },
    { name: "Customer 10", cts: 46, priority: false },
  ];

  const NUM_SKUS = 15;
  const SKU_LABELS = Array.from({ length: NUM_SKUS }, (_, i) => "SKU-" + (i + 1));

  // Sparse demand matrix — seeded so render is deterministic.
  // Each cell uses two RNG draws: one for presence (60% fill), one for magnitude (2–10).
  const DEMAND = (function () {
    const rng = rand(77);
    return CUSTOMERS.map(function () {
      return SKU_LABELS.map(function () {
        var presence = rng();
        var magnitude = rng();
        return presence < 0.60 ? Math.round(2 + magnitude * 8) : 0;
      });
    });
  })();

  const MAX_DEMAND = DEMAND.flat().reduce(function (m, v) { return Math.max(m, v); }, 1);

  // Fill rates
  const BEFORE_RATE = 0.65; // peanut-butter spread

  function sumRow(row) {
    return row.reduce(function (sum, val) { return sum + val; }, 0);
  }

  function allocateRowByRatio(row, ratio) {
    return row.map(function (demand) {
      return Math.round(demand * ratio);
    });
  }

  function allocateRowByTotal(row, allocatedTotal) {
    var rowDemand = sumRow(row);
    if (rowDemand <= 0 || allocatedTotal <= 0) {
      return row.map(function () { return 0; });
    }
    if (allocatedTotal >= rowDemand) {
      return row.slice();
    }

    var scaled = row.map(function (demand) {
      return (demand * allocatedTotal) / rowDemand;
    });
    var fulfillment = scaled.map(function (v) { return Math.floor(v); });
    var filled = sumRow(fulfillment);
    var remaining = allocatedTotal - filled;

    var order = scaled
      .map(function (v, idx) {
        return { idx: idx, frac: v - Math.floor(v) };
      })
      .sort(function (a, b) {
        return b.frac - a.frac;
      });

    for (var i = 0; i < order.length && remaining > 0; i += 1) {
      var si = order[i].idx;
      if (fulfillment[si] < row[si]) {
        fulfillment[si] += 1;
        remaining -= 1;
      }
    }

    return fulfillment;
  }

  function buildBeforeFulfillment() {
    return DEMAND.map(function (row) {
      return allocateRowByRatio(row, BEFORE_RATE);
    });
  }

  function buildAfterFulfillment() {
    var totalDemand = sumRow(DEMAND.flat());
    var totalSupply = Math.round(totalDemand * BEFORE_RATE);
    var remainingSupply = totalSupply;

    var customerOrder = CUSTOMERS.map(function (customer, idx) {
      return {
        idx: idx,
        priority: customer.priority,
        cts: customer.cts,
      };
    }).sort(function (a, b) {
      if (a.priority !== b.priority) {
        return a.priority ? -1 : 1;
      }
      return a.cts - b.cts;
    });

    var fulfillment = DEMAND.map(function (row) {
      return row.map(function () { return 0; });
    });

    customerOrder.forEach(function (customerMeta) {
      var ci = customerMeta.idx;
      var row = DEMAND[ci];
      var rowDemand = sumRow(row);

      if (rowDemand <= 0 || remainingSupply <= 0) {
        return;
      }

      var allocatedToCustomer = Math.min(rowDemand, remainingSupply);
      fulfillment[ci] = allocateRowByTotal(row, allocatedToCustomer);
      remainingSupply -= sumRow(fulfillment[ci]);
    });

    return fulfillment;
  }

  // ─── Grid Renderer ─────────────────────────────────────────────────────────
  function renderGrid(containerId, options) {
    var showCts = options.showCts;
    var fulfillmentMatrix = options.fulfillmentMatrix;

    var container = document.getElementById(containerId);
    if (!container) return;

    var table = document.createElement("table");
    table.className = "dp-grid-table";

    // ── Header row ──
    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");

    var blankTh = document.createElement("th");
    blankTh.className = "dp-row-header dp-row-header-top";
    headerRow.appendChild(blankTh);

    SKU_LABELS.forEach(function (sku) {
      var th = document.createElement("th");
      th.className = "dp-col-header";
      th.textContent = sku;
      headerRow.appendChild(th);
    });

    if (showCts) {
      var ctsTh = document.createElement("th");
      ctsTh.className = "dp-cts-header";
      ctsTh.textContent = "Cost-to-Serve";
      headerRow.appendChild(ctsTh);
    }

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // ── Data rows ──
    var tbody = document.createElement("tbody");

    CUSTOMERS.forEach(function (customer, ci) {
      var tr = document.createElement("tr");
      if (customer.priority) tr.classList.add("dp-priority-row");

      // Customer name cell
      var nameTh = document.createElement("th");
      nameTh.className = "dp-row-header";
      nameTh.textContent = customer.name;
      tr.appendChild(nameTh);

      // SKU data cells
      SKU_LABELS.forEach(function (_, si) {
        var demand = DEMAND[ci][si];
        var fulfillment = fulfillmentMatrix[ci][si];
        var td = document.createElement("td");
        td.className = "dp-data-cell";

        if (demand > 0) {
          var dPct = Math.round((demand / MAX_DEMAND) * 100);
          var fPct = Math.round((fulfillment / MAX_DEMAND) * 100);
          td.innerHTML =
            '<div class="dp-cell-bars">' +
            '<div class="dp-bar dp-demand-bar" style="height:' + dPct + '%"></div>' +
            '<div class="dp-bar dp-fulfill-bar" style="height:' + fPct + '%"></div>' +
            "</div>";
        }

        tr.appendChild(td);
      });

      // Cost-to-serve cell
      if (showCts) {
        var ctsTd = document.createElement("td");
        ctsTd.className =
          "dp-cts-cell " + (customer.priority ? "dp-cts-priority" : "dp-cts-normal");
        ctsTd.textContent = customer.cts + "%";
        tr.appendChild(ctsTd);
      }

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);
  }

  function renderSkuShortageStrip(containerId, fulfillmentMatrix) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var totalDemandBySku = SKU_LABELS.map(function (_, si) {
      return DEMAND.reduce(function (sum, row) { return sum + row[si]; }, 0);
    });
    var totalFulfilledBySku = SKU_LABELS.map(function (_, si) {
      return fulfillmentMatrix.reduce(function (sum, row) { return sum + row[si]; }, 0);
    });

    var shortageBySku = totalDemandBySku.map(function (demand, si) {
      return Math.max(0, demand - totalFulfilledBySku[si]);
    });

    var hasAnyShortage = shortageBySku.some(function (v) { return v > 0; });
    var subtitle = hasAnyShortage
      ? "Red = unmet demand units by SKU"
      : "All SKU demand is fully met";

    var chips = SKU_LABELS.map(function (sku, si) {
      var shortage = shortageBySku[si];
      var cls = shortage > 0 ? "dp-unit-chip is-short" : "dp-unit-chip is-ok";
      var txt = shortage > 0 ? ("-" + shortage) : "OK";
      return (
        '<div class="' + cls + '">' +
        '<span class="dp-unit-sku">' + sku + '</span>' +
        '<strong class="dp-unit-val">' + txt + '</strong>' +
        "</div>"
      );
    }).join("");

    container.innerHTML =
      '<div class="dp-units-head">' +
      '<span class="dp-units-title">SKU Shortage vs Demand (Units)</span>' +
      '<span class="dp-units-subtitle">' + subtitle + '</span>' +
      "</div>" +
      '<div class="dp-units-grid">' + chips + "</div>";
  }

  // ─── Impact Chart ──────────────────────────────────────────────────────────
  function makeImpact() {
    var labels = [
      ["Product Contribution", "Margin"],
      ["Standard OB", "Transportation"],
      ["Expedited", "Shipping"],
      ["Penalties", "Paid"],
      ["DC Labor", "(OT Handling)"],
      ["Returns Processing", "& Disposals"],
      ["Customer Service", "OT Labor"],
      ["Total EC", "Impact"],
    ];

    var benefitVals = [7.3, 3.9, 1.1, 0.8, 0.5, 0.9, 0.4];
    var totalSavings = benefitVals.reduce(function (s, v) { return s + v; }, 0);

    var running = 0;
    var bars = benefitVals.map(function (val) {
      var start = running;
      running += val;
      return [start, running];
    });
    bars.push([0, totalSavings]);

    var isTotal = labels.map(function (l) {
      return (Array.isArray(l) ? l.join(" ") : l).indexOf("Total") >= 0;
    });
    var barColors   = isTotal.map(function (t) { return t ? "rgba(69,208,162,.72)" : "rgba(88,178,255,.72)"; });
    var borderColors = isTotal.map(function (t) { return t ? "rgba(69,208,162,1)"   : "rgba(88,178,255,1)";   });

    return new Chart(document.getElementById("dp-impact"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "$M",
          data: bars,
          backgroundColor: barColors,
          borderColor: borderColors,
          borderWidth: 1,
          borderRadius: 4,
        }],
      },
      options: Object.assign({}, baseOptions, {
        indexAxis: "y",
        scales: {
          x: Object.assign({}, baseOptions.scales.x, {
            title: { display: true, text: "Estimated Annual Impact ($M)", color: COLORS.muted },
            min: 0,
            max: 18,
          }),
          y: Object.assign({}, baseOptions.scales.y, {
            grid: { display: false },
          }),
        },
        plugins: Object.assign({}, baseOptions.plugins, {
          legend: { display: false },
          tooltip: Object.assign({}, baseOptions.plugins.tooltip, {
            callbacks: {
              label: function (item) {
                var idx = item.dataIndex;
                if (idx === labels.length - 1) {
                  return "Total: $" + totalSavings.toFixed(1) + "M";
                }
                var val = benefitVals[idx];
                var cumulative = bars[idx][1];
                return [
                  "Benefit: $" + val.toFixed(1) + "M",
                  "Cumulative: $" + cumulative.toFixed(1) + "M",
                ];
              },
            },
          }),
        }),
      }),
    });
  }

  function getCardMeta(el) {
    var card = el.closest(".dtg-card");
    var titleEl = card ? card.querySelector(".dtg-card-head h3") : null;
    var subtitleEl = card ? card.querySelector(".dtg-card-head .dtg-subtitle") : null;
    var noteEl = card ? card.querySelector(".dtg-card-head .dtg-inline-note") : null;
    return {
      title: titleEl ? titleEl.textContent.trim() : "",
      subtitle: subtitleEl ? subtitleEl.textContent.trim() : "",
      note: noteEl ? noteEl.textContent.trim() : "",
    };
  }

  function buildExportCanvas(sourceCanvas, metaEl) {
    var meta = getCardMeta(metaEl);
    var title = meta.title;
    var subtitle = meta.subtitle;
    var note = meta.note;

    var outerPad = 34;
    var panelPadX = 18;
    var panelPadTop = 8;
    var panelPadBottom = 16;
    var panelW = sourceCanvas.width + (panelPadX * 2);
    var titleSize = 22;
    var titleLines = title ? [title] : [];

    var exportCanvas = document.createElement("canvas");
    var ctx = exportCanvas.getContext("2d");
    if (!ctx) return sourceCanvas;

    function splitTitle(maxWidth) {
      if (!title) return [];
      var words = title.split(/\s+/).filter(Boolean);
      if (!words.length) return [];

      while (titleSize > 14) {
        if (ctx.measureText(title).width <= maxWidth) return [title];
        titleSize -= 1;
        ctx.font = "700 " + titleSize + "px Inter";
      }

      titleSize = 18;
      ctx.font = "700 " + titleSize + "px Inter";
      while (titleSize > 13) {
        var line1 = "";
        var cut = -1;
        for (var i = 0; i < words.length; i += 1) {
          var test = line1 ? (line1 + " " + words[i]) : words[i];
          if (ctx.measureText(test).width <= maxWidth) {
            line1 = test;
            cut = i;
          } else {
            break;
          }
        }
        if (cut >= 0 && cut < words.length - 1) {
          var line2 = words.slice(cut + 1).join(" ");
          if (ctx.measureText(line2).width <= maxWidth) {
            return [line1, line2];
          }
        }
        titleSize -= 1;
        ctx.font = "700 " + titleSize + "px Inter";
      }

      var midpoint = Math.ceil(words.length / 2);
      return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
    }

    ctx.font = "700 " + titleSize + "px Inter";
    titleLines = splitTitle(panelW - 34);

    var titleLineHeight = title ? (titleSize + 2) : 0;
    var subtitleBand = subtitle ? 14 : 0;
    var noteBand = note ? 12 : 0;
    var topPad = title ? 11 : 0;
    var bottomPad = title ? 1 : 0;
    var titleBand = title ? ((titleLines.length * titleLineHeight) + subtitleBand + noteBand + topPad + bottomPad) : 16;
    var panelH = sourceCanvas.height + panelPadTop + panelPadBottom + titleBand;

    exportCanvas.width = panelW + (outerPad * 2);
    exportCanvas.height = panelH + (outerPad * 2);

    var panelX = outerPad;
    var panelY = outerPad;

    function roundRectPath(x, y, w, h, r) {
      var rr = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + w, y, x + w, y + h, rr);
      ctx.arcTo(x + w, y + h, x, y + h, rr);
      ctx.arcTo(x, y + h, x, y, rr);
      ctx.arcTo(x, y, x + w, y, rr);
      ctx.closePath();
    }

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
      ctx.font = "700 " + titleSize + "px Inter";
      var titleStartY = panelY + topPad + (titleLineHeight / 2);
      titleLines.forEach(function (line, idx) {
        ctx.fillText(line, panelX + (panelW / 2), titleStartY + (idx * titleLineHeight));
      });

      if (subtitle) {
        ctx.fillStyle = "#9fb0d3";
        ctx.font = "500 12px Inter";
        var subtitleY = titleStartY + (titleLines.length * titleLineHeight) - 1;
        ctx.fillText(subtitle, panelX + (panelW / 2), subtitleY);
      }

      if (note) {
        ctx.fillStyle = "#9fb0d3";
        ctx.font = "500 12px Inter";
        var noteY = titleStartY + (titleLines.length * titleLineHeight) + (subtitle ? 13 : 1);
        ctx.fillText(note, panelX + (panelW / 2), noteY);
      }
    }

    var chartX = panelX + panelPadX;
    var chartY = panelY + titleBand + panelPadTop;
    ctx.drawImage(sourceCanvas, chartX, chartY);

    return exportCanvas;
  }

  function canvasToBlob(canvas) {
    return new Promise(function (resolve) {
      canvas.toBlob(resolve, "image/png");
    });
  }

  async function copyExportToClipboard(sourceCanvas, metaEl) {
    if (!navigator.clipboard || !window.ClipboardItem) return false;
    var exportCanvas = buildExportCanvas(sourceCanvas, metaEl);
    var blob = await canvasToBlob(exportCanvas);
    if (!blob) return false;
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    return true;
  }

  function downloadExportPng(sourceCanvas, metaEl, id) {
    var exportCanvas = buildExportCanvas(sourceCanvas, metaEl);
    var a = document.createElement("a");
    a.href = exportCanvas.toDataURL("image/png", 1.0);
    a.download = id + ".png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function flashButton(btn, text) {
    var original = btn.textContent;
    btn.textContent = text;
    btn.disabled = true;
    setTimeout(function () {
      btn.textContent = original;
      btn.disabled = false;
    }, 900);
  }

  async function captureGridCanvas(gridEl) {
    if (!window.html2canvas) return null;
    return window.html2canvas(gridEl, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      logging: false,
    });
  }

  function bindExportButtons() {
    document.querySelectorAll(".dtg-export").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        var canvasId = btn.getAttribute("data-canvas");
        var gridId = btn.getAttribute("data-grid");
        var exportId = btn.getAttribute("data-export-id") || canvasId || gridId || "export";
        var sourceCanvas = null;
        var metaEl = null;

        if (gridId) {
          var gridEl = document.getElementById(gridId);
          if (!gridEl) return;
          sourceCanvas = await captureGridCanvas(gridEl);
          metaEl = gridEl;
        } else if (canvasId) {
          sourceCanvas = document.getElementById(canvasId);
          metaEl = sourceCanvas;
        }

        if (!sourceCanvas || !metaEl) return;

        try {
          var copied = await copyExportToClipboard(sourceCanvas, metaEl);
          if (copied) {
            flashButton(btn, "Copied");
            return;
          }
        } catch (_err) {
          // Fallback handled below.
        }

        downloadExportPng(sourceCanvas, metaEl, exportId);
        flashButton(btn, "Downloaded");
      });
    });
  }

  // ─── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", function () {
    var beforeFulfillment = buildBeforeFulfillment();
    var afterFulfillment = buildAfterFulfillment();

    renderGrid("dp-before-grid", {
      showCts: false,
      fulfillmentMatrix: beforeFulfillment,
    });
    renderSkuShortageStrip("dp-before-units", beforeFulfillment);

    renderGrid("dp-after-grid", {
      showCts: true,
      fulfillmentMatrix: afterFulfillment,
    });
    renderSkuShortageStrip("dp-after-units", afterFulfillment);

    makeImpact();
    bindExportButtons();
  });
})();
