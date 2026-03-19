const baseData = [
  { period: "2026-Q1", plant: "Denver", family: "Core Lager", sku: "LGR-12OZ-6PK", packaging: "Can", channel: "Retail", volume: 64000, asp: 9.8, materialCpu: 2.1, laborCpu: 0.78, freightCpu: 0.44, overheadCpu: 1.05, operatingCpu: 0.94 },
  { period: "2026-Q1", plant: "Denver", family: "Core Lager", sku: "LGR-16OZ-4PK", packaging: "Can", channel: "Retail", volume: 52000, asp: 8.9, materialCpu: 1.95, laborCpu: 0.72, freightCpu: 0.41, overheadCpu: 0.97, operatingCpu: 0.88 },
  { period: "2026-Q1", plant: "Denver", family: "IPA", sku: "IPA-12OZ-6PK", packaging: "Can", channel: "Retail", volume: 48000, asp: 10.6, materialCpu: 2.44, laborCpu: 0.82, freightCpu: 0.43, overheadCpu: 1.02, operatingCpu: 1.03 },
  { period: "2026-Q1", plant: "Denver", family: "Seasonal", sku: "SNS-12OZ-6PK", packaging: "Can", channel: "Retail", volume: 22000, asp: 11.9, materialCpu: 2.71, laborCpu: 0.91, freightCpu: 0.46, overheadCpu: 1.11, operatingCpu: 1.12 },
  { period: "2026-Q1", plant: "Asheville", family: "Core Lager", sku: "LGR-12OZ-6PK", packaging: "Bottle", channel: "Wholesale", volume: 59000, asp: 9.2, materialCpu: 2.34, laborCpu: 0.83, freightCpu: 0.53, overheadCpu: 1.09, operatingCpu: 0.98 },
  { period: "2026-Q1", plant: "Asheville", family: "IPA", sku: "IPA-12OZ-6PK", packaging: "Bottle", channel: "Wholesale", volume: 41000, asp: 10.1, materialCpu: 2.66, laborCpu: 0.87, freightCpu: 0.56, overheadCpu: 1.12, operatingCpu: 1.09 },
  { period: "2026-Q2", plant: "Denver", family: "Core Lager", sku: "LGR-12OZ-6PK", packaging: "Can", channel: "Retail", volume: 67000, asp: 9.85, materialCpu: 2.14, laborCpu: 0.79, freightCpu: 0.45, overheadCpu: 1.04, operatingCpu: 0.93 },
  { period: "2026-Q2", plant: "Denver", family: "IPA", sku: "IPA-12OZ-6PK", packaging: "Can", channel: "Retail", volume: 50000, asp: 10.55, materialCpu: 2.46, laborCpu: 0.83, freightCpu: 0.44, overheadCpu: 1.01, operatingCpu: 1.04 },
  { period: "2026-Q2", plant: "Denver", family: "Seasonal", sku: "SNS-12OZ-6PK", packaging: "Can", channel: "Direct", volume: 26000, asp: 12.35, materialCpu: 2.83, laborCpu: 0.95, freightCpu: 0.38, overheadCpu: 1.15, operatingCpu: 1.18 },
  { period: "2026-Q2", plant: "Asheville", family: "Core Lager", sku: "LGR-12OZ-6PK", packaging: "Bottle", channel: "Wholesale", volume: 61000, asp: 9.28, materialCpu: 2.37, laborCpu: 0.84, freightCpu: 0.54, overheadCpu: 1.08, operatingCpu: 1.01 },
  { period: "2026-Q2", plant: "Asheville", family: "IPA", sku: "IPA-12OZ-6PK", packaging: "Bottle", channel: "Wholesale", volume: 42500, asp: 10.18, materialCpu: 2.68, laborCpu: 0.88, freightCpu: 0.57, overheadCpu: 1.11, operatingCpu: 1.08 },
  { period: "2026-Q2", plant: "Asheville", family: "Seasonal", sku: "SNS-12OZ-6PK", packaging: "Keg", channel: "On-Premise", volume: 15000, asp: 138.0, materialCpu: 41.5, laborCpu: 14.4, freightCpu: 8.9, overheadCpu: 15.0, operatingCpu: 13.2 }
];

const drillOptions = [
  { value: "plant", label: "Plant" },
  { value: "family", label: "Product Family" },
  { value: "sku", label: "SKU" },
  { value: "packaging", label: "Packaging" },
  { value: "channel", label: "Channel" }
];

const els = {
  filters: {
    period: document.getElementById("filter-period"),
    plant: document.getElementById("filter-plant"),
    family: document.getElementById("filter-family"),
    sku: document.getElementById("filter-sku"),
    packaging: document.getElementById("filter-packaging"),
    channel: document.getElementById("filter-channel")
  },
  drillDimension: document.getElementById("drill-dimension"),
  drillValue: document.getElementById("drill-value"),
  upload: document.getElementById("csv-upload"),
  dataSourceNote: document.getElementById("data-source-note"),
  reset: document.getElementById("btn-reset"),
  kpis: document.getElementById("kpi-cards"),
  table: document.getElementById("sku-table"),
  waterfall: document.getElementById("waterfall"),
  waterfallBreakout: document.getElementById("waterfall-breakout"),
  insights: document.getElementById("insights")
};

const state = {
  records: [...baseData],
  filters: {
    period: "All",
    plant: "All",
    family: "All",
    sku: "All",
    packaging: "All",
    channel: "All"
  },
  drill: {
    dimension: "plant",
    value: "All"
  }
};

let marginChart;

function toMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value || 0);
}

function toPct(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function parseNum(value) {
  if (typeof value === "number") return value;
  if (!value) return 0;
  return Number(String(value).replace(/[$,%\s,]/g, "")) || 0;
}

function normalizeImportedRow(row) {
  return {
    period: (row.period || row.Period || row.year || row.Year || "Unknown").trim(),
    plant: (row.plant || row.Plant || "Unknown").trim(),
    family: (row.family || row.product_family || row.ProductFamily || row.Product_Family || "Unknown").trim(),
    sku: (row.sku || row.SKU || row.Sku || "Unknown").trim(),
    packaging: (row.packaging || row.Packaging || "Unknown").trim(),
    channel: (row.channel || row.Channel || "Unknown").trim(),
    volume: parseNum(row.volume || row.Volume),
    asp: parseNum(row.asp || row.price_per_unit || row.avg_selling_price || row.ASP),
    materialCpu: parseNum(row.material_cpu || row.Material_CPU || row.material_cost_per_unit),
    laborCpu: parseNum(row.labor_cpu || row.Labor_CPU || row.labor_cost_per_unit),
    freightCpu: parseNum(row.freight_cpu || row.Freight_CPU || row.freight_cost_per_unit),
    overheadCpu: parseNum(row.overhead_cpu || row.Overhead_CPU || row.overhead_cost_per_unit),
    operatingCpu: parseNum(row.operating_cpu || row.Operating_CPU || row.opex_cpu || row.opex_cost_per_unit)
  };
}

function computeRow(row) {
  const unitCogs = row.materialCpu + row.laborCpu + row.freightCpu + row.overheadCpu;
  const revenue = row.volume * row.asp;
  const cogs = row.volume * unitCogs;
  const grossMargin = revenue - cogs;
  const operatingExpense = row.volume * row.operatingCpu;
  const operatingIncome = grossMargin - operatingExpense;

  return {
    ...row,
    unitCogs,
    revenue,
    cogs,
    grossMargin,
    operatingExpense,
    operatingIncome,
    gmPct: revenue ? grossMargin / revenue : 0,
    omPct: revenue ? operatingIncome / revenue : 0,
    materialTotal: row.materialCpu * row.volume,
    laborTotal: row.laborCpu * row.volume,
    freightTotal: row.freightCpu * row.volume,
    overheadTotal: row.overheadCpu * row.volume,
    operatingTotal: row.operatingCpu * row.volume
  };
}

function aggregate(rows) {
  const totals = rows.reduce((acc, row) => {
    acc.volume += row.volume;
    acc.revenue += row.revenue;
    acc.cogs += row.cogs;
    acc.grossMargin += row.grossMargin;
    acc.operatingExpense += row.operatingExpense;
    acc.operatingIncome += row.operatingIncome;
    acc.material += row.materialTotal;
    acc.labor += row.laborTotal;
    acc.freight += row.freightTotal;
    acc.overhead += row.overheadTotal;
    acc.operating += row.operatingTotal;
    return acc;
  }, {
    volume: 0,
    revenue: 0,
    cogs: 0,
    grossMargin: 0,
    operatingExpense: 0,
    operatingIncome: 0,
    material: 0,
    labor: 0,
    freight: 0,
    overhead: 0,
    operating: 0
  });

  totals.gmPct = totals.revenue ? totals.grossMargin / totals.revenue : 0;
  totals.omPct = totals.revenue ? totals.operatingIncome / totals.revenue : 0;
  return totals;
}

function uniqueValues(records, key) {
  return ["All", ...new Set(records.map((row) => row[key]))];
}

function fillSelect(element, values) {
  element.innerHTML = values.map((value) => `<option value="${value}">${value}</option>`).join("");
}

function applyBaseFilters(records) {
  return records.filter((row) => Object.entries(state.filters).every(([key, value]) => value === "All" || row[key] === value));
}

function getFilteredRows() {
  return applyBaseFilters(state.records)
    .filter((row) => state.drill.value === "All" || row[state.drill.dimension] === state.drill.value)
    .map(computeRow);
}

function updateFilterOptions() {
  Object.entries(els.filters).forEach(([key, element]) => {
    fillSelect(element, uniqueValues(state.records, key));
    element.value = state.filters[key];
  });
}

function bindFilterEvents() {
  Object.entries(els.filters).forEach(([key, element]) => {
    element.addEventListener("change", () => {
      state.filters[key] = element.value;
      updateDrillValueOptions();
      render();
    });
  });
}

function updateDrillValueOptions() {
  const baseFiltered = applyBaseFilters(state.records);
  const values = ["All", ...new Set(baseFiltered.map((row) => row[state.drill.dimension]))];
  fillSelect(els.drillValue, values);

  if (!values.includes(state.drill.value)) {
    state.drill.value = "All";
  }
  els.drillValue.value = state.drill.value;
}

function bindDrillEvents() {
  fillSelect(els.drillDimension, drillOptions.map((option) => option.value));
  els.drillDimension.innerHTML = drillOptions
    .map((option) => `<option value="${option.value}">${option.label}</option>`)
    .join("");
  els.drillDimension.value = state.drill.dimension;

  els.drillDimension.addEventListener("change", () => {
    state.drill.dimension = els.drillDimension.value;
    state.drill.value = "All";
    updateDrillValueOptions();
    render();
  });

  els.drillValue.addEventListener("change", () => {
    state.drill.value = els.drillValue.value;
    render();
  });

  updateDrillValueOptions();
}

function bindReset() {
  els.reset.addEventListener("click", () => {
    Object.keys(state.filters).forEach((key) => {
      state.filters[key] = "All";
      els.filters[key].value = "All";
    });

    state.drill.dimension = "plant";
    state.drill.value = "All";
    els.drillDimension.value = "plant";

    updateDrillValueOptions();
    render();
  });
}

function bindCsvUpload() {
  els.upload.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const normalized = result.data
          .map(normalizeImportedRow)
          .filter((row) => row.sku && row.volume > 0);

        if (!normalized.length) {
          alert("No valid rows found. Include SKU, volume, price, and cost columns.");
          return;
        }

        state.records = normalized;
        Object.keys(state.filters).forEach((key) => {
          state.filters[key] = "All";
        });
        state.drill.dimension = "plant";
        state.drill.value = "All";

        updateFilterOptions();
        els.drillDimension.value = state.drill.dimension;
        updateDrillValueOptions();

        els.dataSourceNote.textContent = `Data source: ${file.name} (${normalized.length} rows imported).`;
        render();
      },
      error: () => {
        alert("Unable to parse CSV. Verify file format and try again.");
      }
    });
  });
}

function renderKpis(totals) {
  const cards = [
    ["Revenue", toMoney(totals.revenue)],
    ["COGS", toMoney(totals.cogs)],
    ["Operating Expense", toMoney(totals.operatingExpense)],
    ["Gross Margin", toMoney(totals.grossMargin)],
    ["Operating Income", toMoney(totals.operatingIncome)],
    ["Gross Margin %", toPct(totals.gmPct)],
    ["Operating Margin %", toPct(totals.omPct)]
  ];

  els.kpis.innerHTML = cards.map(([label, value]) => `
    <div class="kpi">
      <p>${label}</p>
      <h3>${value}</h3>
    </div>
  `).join("");
}

function renderTable(rows) {
  const sorted = [...rows].sort((a, b) => b.revenue - a.revenue);
  els.table.innerHTML = sorted.map((row) => `
    <tr>
      <td>${row.sku}</td>
      <td>${row.family}</td>
      <td>${row.plant}</td>
      <td>${row.packaging}</td>
      <td>${row.volume.toLocaleString()}</td>
      <td>${toMoney(row.revenue)}</td>
      <td>${toMoney(row.cogs)}</td>
      <td>${toMoney(row.operatingExpense)}</td>
      <td>${toPct(row.gmPct)}</td>
      <td>${toPct(row.omPct)}</td>
    </tr>
  `).join("");
}

function renderOverallWaterfall(totals) {
  const components = [
    ["Material", totals.material],
    ["Labor", totals.labor],
    ["Freight", totals.freight],
    ["Overhead", totals.overhead],
    ["Operating", totals.operating]
  ];

  const maxVal = Math.max(...components.map(([, value]) => value), 1);
  els.waterfall.innerHTML = components.map(([name, value]) => `
    <div class="water-row">
      <div>${name}</div>
      <div class="bar"><span style="width:${(value / maxVal) * 100}%"></span></div>
      <div>${toMoney(value)}</div>
    </div>
  `).join("");
}

function renderBreakoutWaterfalls(rows) {
  const grouped = rows.reduce((acc, row) => {
    const key = row[state.drill.dimension];
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});

  const entries = Object.entries(grouped)
    .map(([name, groupRows]) => ({ name, totals: aggregate(groupRows) }))
    .sort((a, b) => b.totals.revenue - a.totals.revenue)
    .slice(0, 6);

  if (!entries.length) {
    els.waterfallBreakout.innerHTML = "<p class=\"small\">No records available for current filters.</p>";
    return;
  }

  els.waterfallBreakout.innerHTML = entries.map((entry) => {
    const components = [
      ["Material", entry.totals.material],
      ["Labor", entry.totals.labor],
      ["Freight", entry.totals.freight],
      ["Overhead", entry.totals.overhead],
      ["Operating", entry.totals.operating]
    ];
    const maxVal = Math.max(...components.map(([, value]) => value), 1);

    return `
      <article class="breakout-item">
        <div class="breakout-head">
          <h3>${entry.name}</h3>
          <div class="breakout-metrics">
            <span>Revenue ${toMoney(entry.totals.revenue)}</span>
            <span>GM ${toPct(entry.totals.gmPct)}</span>
            <span>OM ${toPct(entry.totals.omPct)}</span>
          </div>
        </div>
        ${components.map(([name, value]) => `
          <div class="water-row compact">
            <div>${name}</div>
            <div class="bar"><span style="width:${(value / maxVal) * 100}%"></span></div>
            <div>${toMoney(value)}</div>
          </div>
        `).join("")}
      </article>
    `;
  }).join("");
}

function renderChart(rows) {
  const bySku = rows.reduce((acc, row) => {
    if (!acc[row.sku]) acc[row.sku] = { revenue: 0, gm: 0, operating: 0 };
    acc[row.sku].revenue += row.revenue;
    acc[row.sku].gm += row.grossMargin;
    acc[row.sku].operating += row.operatingIncome;
    return acc;
  }, {});

  const labels = Object.keys(bySku);
  const gmData = labels.map((sku) => bySku[sku].revenue ? (bySku[sku].gm / bySku[sku].revenue) * 100 : 0);
  const omData = labels.map((sku) => bySku[sku].revenue ? (bySku[sku].operating / bySku[sku].revenue) * 100 : 0);

  if (marginChart) marginChart.destroy();
  marginChart = new Chart(document.getElementById("margin-chart"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "GM%", data: gmData, borderRadius: 6, backgroundColor: "rgba(79,159,255,0.8)" },
        { label: "OM%", data: omData, borderRadius: 6, backgroundColor: "rgba(69,208,162,0.78)" }
      ]
    },
    options: {
      plugins: { legend: { labels: { color: "#9fb0d3" } } },
      scales: {
        y: {
          ticks: { callback: (value) => `${value}%`, color: "#9fb0d3" },
          grid: { color: "rgba(159,176,211,.12)" }
        },
        x: {
          ticks: { color: "#9fb0d3" },
          grid: { display: false }
        }
      }
    }
  });
}

function renderInsights(rows, totals) {
  if (!rows.length) {
    els.insights.innerHTML = "<li>No records for current filter combination.</li>";
    return;
  }

  const sortedByGm = [...rows].sort((a, b) => b.gmPct - a.gmPct);
  const sortedByOm = [...rows].sort((a, b) => b.omPct - a.omPct);
  const bestGm = sortedByGm[0];
  const worstOm = sortedByOm[sortedByOm.length - 1];

  const drillLabel = drillOptions.find((option) => option.value === state.drill.dimension)?.label || state.drill.dimension;
  const drillScope = state.drill.value === "All" ? `all ${drillLabel.toLowerCase()} values` : state.drill.value;

  const messages = [
    `Overall slice is ${toPct(totals.gmPct)} GM% and ${toPct(totals.omPct)} OM% on ${toMoney(totals.revenue)} revenue.`,
    `Best gross-margin SKU is ${bestGm.sku} at ${toPct(bestGm.gmPct)}.`,
    `Biggest operating-margin pressure is ${worstOm.sku} at ${toPct(worstOm.omPct)}.`,
    `Waterfall breakout is currently grouped by ${drillLabel}: ${drillScope}.`
  ];

  els.insights.innerHTML = messages.map((message) => `<li>${message}</li>`).join("");
}

function render() {
  const rows = getFilteredRows();
  const totals = aggregate(rows);

  renderKpis(totals);
  renderChart(rows);
  renderOverallWaterfall(totals);
  renderBreakoutWaterfalls(rows);
  renderTable(rows);
  renderInsights(rows, totals);
}

updateFilterOptions();
bindFilterEvents();
bindDrillEvents();
bindReset();
bindCsvUpload();
render();
