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

  // ─── Export Button (canvas only) ───────────────────────────────────────────
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".dtg-export");
    if (!btn) return;
    var canvasId = btn.dataset.canvas;
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    canvas.toBlob(function (blob) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = canvasId + ".png";
      a.click();
      URL.revokeObjectURL(url);
    });
  });

  // ─── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", function () {
    var beforeFulfillment = buildBeforeFulfillment();
    var afterFulfillment = buildAfterFulfillment();

    renderGrid("dp-before-grid", {
      showCts: false,
      fulfillmentMatrix: beforeFulfillment,
    });

    renderGrid("dp-after-grid", {
      showCts: true,
      fulfillmentMatrix: afterFulfillment,
    });

    makeImpact();
  });
})();
