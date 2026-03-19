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

const els = {
  filters: {
    period: document.getElementById("filter-period"),
    plant: document.getElementById("filter-plant"),
    family: document.getElementById("filter-family"),
    sku: document.getElementById("filter-sku"),
    packaging: document.getElementById("filter-packaging"),
    channel: document.getElementById("filter-channel")
  },
  sliders: {
    material: document.getElementById("adj-material"),
    labor: document.getElementById("adj-labor"),
    freight: document.getElementById("adj-freight"),
    price: document.getElementById("adj-price"),
    opex: document.getElementById("adj-opex")
  },
  sliderValues: {
    material: document.getElementById("adj-material-value"),
    labor: document.getElementById("adj-labor-value"),
    freight: document.getElementById("adj-freight-value"),
    price: document.getElementById("adj-price-value"),
    opex: document.getElementById("adj-opex-value")
  },
  upload: document.getElementById("csv-upload"),
  dataSourceNote: document.getElementById("data-source-note"),
  reset: document.getElementById("btn-reset"),
  kpis: document.getElementById("kpi-cards"),
  table: document.getElementById("sku-table"),
  waterfall: document.getElementById("waterfall"),
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
  adjustments: { material: 0, labor: 0, freight: 0, price: 0, opex: 0 }
};

let marginChart;

function toMoney(v) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
}

function toPct(v) {
  return `${(v * 100).toFixed(1)}%`;
}

function computeRow(row) {
  return computeRowWithAdjustments(row, state.adjustments);
}

function computeRowWithAdjustments(row, adjustments) {
  const matFactor = 1 + adjustments.material / 100;
  const laborFactor = 1 + adjustments.labor / 100;
  const freightFactor = 1 + adjustments.freight / 100;
  const priceFactor = 1 + adjustments.price / 100;
  const opexFactor = 1 + adjustments.opex / 100;

  const price = row.asp * priceFactor;
  const material = row.materialCpu * matFactor;
  const labor = row.laborCpu * laborFactor;
  const freight = row.freightCpu * freightFactor;
  const overhead = row.overheadCpu;
  const operating = row.operatingCpu * opexFactor;

  const unitCogs = material + labor + freight + overhead;
  const revenue = row.volume * price;
  const cogs = row.volume * unitCogs;
  const grossMargin = revenue - cogs;
  const operatingExpense = row.volume * operating;
  const operatingIncome = grossMargin - operatingExpense;

  return {
    ...row,
    revenue,
    cogs,
    grossMargin,
    operatingExpense,
    operatingIncome,
    gmPct: revenue ? grossMargin / revenue : 0,
    omPct: revenue ? operatingIncome / revenue : 0,
    material,
    labor,
    freight,
    overhead,
    operating,
    unitPrice: price,
    unitCogs
  };
}

function getFilteredRows() {
  return state.records
    .filter((row) => Object.entries(state.filters).every(([k, v]) => v === "All" || row[k] === v))
    .map(computeRow);
}

function uniqueValues(key) {
  return ["All", ...new Set(state.records.map((row) => row[key]))];
}

function fillSelect(el, values) {
  el.innerHTML = values.map((v) => `<option value="${v}">${v}</option>`).join("");
}

function updateFilterOptions() {
  fillSelect(els.filters.period, uniqueValues("period"));
  fillSelect(els.filters.plant, uniqueValues("plant"));
  fillSelect(els.filters.family, uniqueValues("family"));
  fillSelect(els.filters.sku, uniqueValues("sku"));
  fillSelect(els.filters.packaging, uniqueValues("packaging"));
  fillSelect(els.filters.channel, uniqueValues("channel"));

  Object.entries(els.filters).forEach(([k, el]) => {
    el.value = state.filters[k];
    el.addEventListener("change", () => {
      state.filters[k] = el.value;
      render();
    });
  });
}

function parseNum(v) {
  if (typeof v === "number") return v;
  if (!v) return 0;
  return Number(String(v).replace(/[$,%\s,]/g, "")) || 0;
}

function normalizeImportedRow(row) {
  return {
    period: (row.period || row.Period || "Unknown").trim(),
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

function bindCsvUpload() {
  els.upload.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const normalized = result.data.map(normalizeImportedRow).filter((row) => row.sku && row.volume > 0);
        if (!normalized.length) {
          alert("No valid rows found. Please include SKU, volume, and per-unit cost fields.");
          return;
        }
        state.records = normalized;
        Object.keys(state.filters).forEach((key) => {
          state.filters[key] = "All";
        });
        updateFilterOptions();
        els.dataSourceNote.textContent = `Data source: ${file.name} (${normalized.length} rows imported).`;
        render();
      },
      error: () => {
        alert("Unable to parse CSV. Please verify file format and try again.");
      }
    });
  });
}

function bindScenarioSliders() {
  Object.entries(els.sliders).forEach(([k, el]) => {
    const out = els.sliderValues[k];
    out.textContent = `${el.value}%`;
    el.addEventListener("input", () => {
      state.adjustments[k] = Number(el.value);
      out.textContent = `${el.value}%`;
      render();
    });
  });

  els.reset.addEventListener("click", () => {
    Object.keys(state.filters).forEach((key) => {
      state.filters[key] = "All";
      els.filters[key].value = "All";
    });

    Object.keys(state.adjustments).forEach((key) => {
      state.adjustments[key] = 0;
      els.sliders[key].value = 0;
      els.sliderValues[key].textContent = "0%";
    });

    render();
  });
}

function aggregate(rows) {
  const totals = rows.reduce((acc, row) => {
    acc.volume += row.volume;
    acc.revenue += row.revenue;
    acc.cogs += row.cogs;
    acc.grossMargin += row.grossMargin;
    acc.operatingExpense += row.operatingExpense;
    acc.operatingIncome += row.operatingIncome;
    acc.material += row.material * row.volume;
    acc.labor += row.labor * row.volume;
    acc.freight += row.freight * row.volume;
    acc.overhead += row.overhead * row.volume;
    acc.operating += row.operating * row.volume;
    return acc;
  }, { volume: 0, revenue: 0, cogs: 0, grossMargin: 0, operatingExpense: 0, operatingIncome: 0, material: 0, labor: 0, freight: 0, overhead: 0, operating: 0 });

  totals.gmPct = totals.revenue ? totals.grossMargin / totals.revenue : 0;
  totals.omPct = totals.revenue ? totals.operatingIncome / totals.revenue : 0;
  return totals;
}

function renderKpis(totals, baselineTotals) {
  const gmDelta = totals.gmPct - baselineTotals.gmPct;
  const omDelta = totals.omPct - baselineTotals.omPct;

  const cards = [
    ["Revenue", toMoney(totals.revenue)],
    ["Gross Margin", toMoney(totals.grossMargin)],
    ["Operating Income", toMoney(totals.operatingIncome)],
    ["Gross Margin %", toPct(totals.gmPct)],
    ["Operating Margin %", toPct(totals.omPct)]
  ];

  els.kpis.innerHTML = cards.map(([label, value], i) => `
    <div class="kpi">
      <p>${label}</p>
      <h3>${value}</h3>
      ${i === 3 ? `<div class="delta ${gmDelta >= 0 ? "up" : "down"}">${gmDelta >= 0 ? "▲" : "▼"} ${Math.abs(gmDelta * 100).toFixed(2)} pts vs base</div>` : ""}
      ${i === 4 ? `<div class="delta ${omDelta >= 0 ? "up" : "down"}">${omDelta >= 0 ? "▲" : "▼"} ${Math.abs(omDelta * 100).toFixed(2)} pts vs base</div>` : ""}
    </div>
  `).join("");
}

function renderTable(rows) {
  rows.sort((a, b) => b.revenue - a.revenue);
  els.table.innerHTML = rows.map((row) => `
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

function renderWaterfall(totals) {
  const components = [
    ["Material", totals.material],
    ["Labor", totals.labor],
    ["Freight", totals.freight],
    ["Overhead", totals.overhead],
    ["Operating", totals.operating]
  ];

  const maxVal = Math.max(...components.map(([, v]) => v), 1);
  els.waterfall.innerHTML = components.map(([name, value]) => `
    <div class="water-row">
      <div>${name}</div>
      <div class="bar"><span style="width:${(value / maxVal) * 100}%"></span></div>
      <div>${toMoney(value)}</div>
    </div>
  `).join("");
}

function renderChart(rows) {
  const bySku = rows.reduce((acc, row) => {
    if (!acc[row.sku]) acc[row.sku] = { revenue: 0, gm: 0, op: 0 };
    acc[row.sku].revenue += row.revenue;
    acc[row.sku].gm += row.grossMargin;
    acc[row.sku].op += row.operatingIncome;
    return acc;
  }, {});

  const labels = Object.keys(bySku);
  const gmData = labels.map((sku) => bySku[sku].revenue ? (bySku[sku].gm / bySku[sku].revenue) * 100 : 0);
  const omData = labels.map((sku) => bySku[sku].revenue ? (bySku[sku].op / bySku[sku].revenue) * 100 : 0);

  if (marginChart) marginChart.destroy();
  marginChart = new Chart(document.getElementById("margin-chart"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "GM%",
          data: gmData,
          borderRadius: 6,
          backgroundColor: "rgba(79,159,255,0.8)"
        },
        {
          label: "OM%",
          data: omData,
          borderRadius: 6,
          backgroundColor: "rgba(69,208,162,0.78)"
        }
      ]
    },
    options: {
      plugins: { legend: { labels: { color: "#9fb0d3" } } },
      scales: {
        y: {
          ticks: { callback: (v) => `${v}%`, color: "#9fb0d3" },
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

  const sortedByGrossMargin = [...rows].sort((a, b) => b.gmPct - a.gmPct);
  const sortedByOperatingMargin = [...rows].sort((a, b) => b.omPct - a.omPct);
  const best = sortedByGrossMargin[0];
  const worst = sortedByOperatingMargin[sortedByOperatingMargin.length - 1];

  const messages = [
    `Highest gross-margin SKU in this slice is ${best.sku} at ${toPct(best.gmPct)} GM%.`,
    `Lowest operating-margin SKU is ${worst.sku} at ${toPct(worst.omPct)} OM%, useful for action planning.`,
    `Portfolio is running at ${toPct(totals.gmPct)} GM% and ${toPct(totals.omPct)} OM% on ${toMoney(totals.revenue)} revenue.`,
    `Scenario shifts: price ${state.adjustments.price}%, material ${state.adjustments.material}%, labor ${state.adjustments.labor}%, freight ${state.adjustments.freight}%, operating expense ${state.adjustments.opex}%.`
  ];

  els.insights.innerHTML = messages.map((m) => `<li>${m}</li>`).join("");
}

function render() {
  const rows = getFilteredRows();
  const totals = aggregate(rows);
  const baselineRows = state.records
    .filter((row) => Object.entries(state.filters).every(([k, v]) => v === "All" || row[k] === v))
    .map((row) => computeRowWithAdjustments(row, { material: 0, labor: 0, freight: 0, price: 0, opex: 0 }));
  const baselineTotals = aggregate(baselineRows);
  renderKpis(totals, baselineTotals);
  renderTable(rows);
  renderWaterfall(totals);
  renderChart(rows);
  renderInsights(rows, totals);
}

updateFilterOptions();
bindScenarioSliders();
bindCsvUpload();
render();