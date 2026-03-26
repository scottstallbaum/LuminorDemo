// ============================================================
// SHARED UTILITIES (mirrors app.js — keep in sync)
// ============================================================

function normalizeKey(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getField(row, aliases, fallback = "") {
  for (const alias of aliases) {
    const exact = row[alias];
    if (exact !== undefined && exact !== null && String(exact).trim() !== "") return exact;
  }
  const keyMap = Object.keys(row).reduce((acc, key) => {
    acc[normalizeKey(key)] = row[key];
    return acc;
  }, {});
  for (const alias of aliases) {
    const value = keyMap[normalizeKey(alias)];
    if (value !== undefined && value !== null && String(value).trim() !== "") return value;
  }
  return fallback;
}

function parseNum(value) {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const raw = String(value).trim();
  if (!raw) return 0;
  const normalized = raw.replace(/^\((.*)\)$/, "-$1").replace(/[$,%\s,]/g, "");
  return Number(normalized) || 0;
}

function cleanCell(value, fallback = "Unknown") {
  const cleaned = String(value ?? "").replace(/\s+/g, " ").trim();
  return cleaned || fallback;
}

function toMoney(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);
}

function toMoneyDec(value, decimals = 2) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value || 0);
}

function toSignedMoney(value) {
  const abs = toMoney(Math.abs(value || 0));
  return (value || 0) < 0 ? `-${abs}` : abs;
}

function toPct(value) {
  return `${((value || 0) * 100).toFixed(1)}%`;
}

function toSignedPct(value) {
  if ((value || 0) < 0) return `-${toPct(Math.abs(value || 0))}`;
  return toPct(value || 0);
}

function getMetricToneClass(value) {
  if ((value || 0) > 0) return "is-positive";
  if ((value || 0) < 0) return "is-negative";
  return "";
}

function withDescriptorDefaults(row) {
  const plantDesc = String(row.plantDesc || row.plant || "Unknown").trim() || "Unknown";
  const osku = String(row.osku || row.sku || "Unknown").trim() || "Unknown";
  return {
    ...row,
    plantDesc,
    osku,
    plantOsku: String(row.plantOsku || `${plantDesc}${osku}`).trim() || `${plantDesc}${osku}`,
    orderableSkuDescription: String(row.orderableSkuDescription || row.sku || "Unknown").trim() || "Unknown",
    priceSegment: String(row.priceSegment || "Unknown").trim() || "Unknown",
    brand: String(row.brand || "Unknown").trim() || "Unknown",
    brandFamily: String(row.brandFamily || row.family || "Unknown").trim() || "Unknown",
    brandSegment: String(row.brandSegment || "Unknown").trim() || "Unknown",
    containerType: String(row.containerType || row.packaging || "Unknown").trim() || "Unknown",
    containerSize: String(row.containerSize || "Unknown").trim() || "Unknown",
    smallestPack: String(row.smallestPack || "Unknown").trim() || "Unknown",
    alcoholReportingGroup: String(row.alcoholReportingGroup || "Unknown").trim() || "Unknown",
    productionBbl: parseNum(row.productionBbl)
  };
}

function normalizeStaticCostRow(row) {
  return {
    period: cleanCell(getField(row, ["period", "Period"], "Unknown")),
    plant: cleanCell(getField(row, ["plant", "Plant", "Plant Desc"], "Unknown")),
    family: cleanCell(getField(row, ["family", "Family", "Brand Family"], "Unknown")),
    sku: cleanCell(getField(row, ["sku", "SKU", "OSKU"], "Unknown")),
    packaging: cleanCell(getField(row, ["packaging", "Packaging", "Container Type"], "Unknown")),
    volume: parseNum(getField(row, ["volume", "Volume"])),
    asp: parseNum(getField(row, ["asp", "ASP", "price_per_unit", "avg_selling_price"])),
    brewMatCpu: parseNum(getField(row, ["brewMatCpu", "brew_mat_cpu", "Brew Mat $/bbl"])),
    pkgMatCpu: parseNum(getField(row, ["pkgMatCpu", "pkg_mat_cpu", "Pkg Mat $/bbl"])),
    freightCpu: parseNum(getField(row, ["freightCpu", "freight_cpu", "Freight_CPU", "freight_cost_per_unit"])),
    marketingCpu: parseNum(getField(row, ["marketingCpu", "marketing_cpu", "Marketing $/bbl"])),
    brewingLaborCpu: parseNum(getField(row, ["brewingLaborCpu", "brewing_labor_cpu"])),
    packagingLaborCpu: parseNum(getField(row, ["packagingLaborCpu", "packaging_labor_cpu"])),
    distributionLaborCpu: parseNum(getField(row, ["distributionLaborCpu", "distribution_labor_cpu"])),
    otherLaborCpu: parseNum(getField(row, ["otherLaborCpu", "other_labor_cpu"])),
    salariedLaborCpu: parseNum(getField(row, ["salariedLaborCpu", "salaried_labor_cpu"])),
    utilitiesCpu: parseNum(getField(row, ["utilitiesCpu", "utilities_cpu"])),
    maintenanceCpu: parseNum(getField(row, ["maintenanceCpu", "maintenance_cpu"])),
    productionSuppliesCpu: parseNum(getField(row, ["productionSuppliesCpu", "production_supplies_cpu"])),
    breweryOverheadCpu: parseNum(getField(row, ["breweryOverheadCpu", "brewery_overhead_cpu"])),
    kegDepreciationCpu: parseNum(getField(row, ["kegDepreciationCpu", "keg_depreciation_cpu"])),
    depAmorCpu: parseNum(getField(row, ["depAmorCpu", "dep_amor_cpu"])),
    wasteCpu: parseNum(getField(row, ["wasteCpu", "waste_cpu"])),
    laborCpu: parseNum(getField(row, ["laborCpu", "labor_cpu", "Labor_CPU"])),
    overheadCpu: parseNum(getField(row, ["overheadCpu", "overhead_cpu", "Overhead_CPU"])),
    conversionCpu: parseNum(getField(row, ["conversionCpu", "conversion_cpu"])),
    salesAdminCpu: parseNum(getField(row, ["salesAdminCpu", "sales_admin_cpu"])),
    marketingAdminCpu: parseNum(getField(row, ["marketingAdminCpu", "marketing_admin_cpu"])),
    sgaCpu: parseNum(getField(row, ["sgaCpu", "sga_cpu"])),
    plantDesc: cleanCell(getField(row, ["Plant Desc", "plant_desc", "plantDesc"], "Unknown")),
    osku: cleanCell(getField(row, ["OSKU", "osku"], "Unknown")),
    plantOsku: cleanCell(getField(row, ["Plant + OSKU", "plant_osku", "plantOsku"], ""), ""),
    orderableSkuDescription: cleanCell(getField(row, ["Orderable SKU Description", "orderable_sku_description", "orderableSkuDescription"], ""), ""),
    priceSegment: cleanCell(getField(row, ["Price Segment", "price_segment", "priceSegment"], "Unknown")),
    brand: cleanCell(getField(row, ["Brand", "brand"], "Unknown")),
    brandFamily: cleanCell(getField(row, ["Brand Family", "brand_family", "brandFamily"], "Unknown")),
    brandSegment: cleanCell(getField(row, ["Brand Segment", "brand_segment", "brandSegment"], "Unknown")),
    containerType: cleanCell(getField(row, ["Container Type", "container_type", "containerType"], ""), ""),
    containerSize: cleanCell(getField(row, ["Container Size", "container_size", "containerSize"], "Unknown")),
    smallestPack: cleanCell(getField(row, ["Smallest Pack", "smallest_pack", "smallestPack"], "Unknown"))
  };
}

function computeRow(row) {
  const brewMat = row.brewMatCpu || 0;
  const pkgMat = row.pkgMatCpu || 0;
  const conversion = row.conversionCpu || 0;
  const unitCogs = brewMat + pkgMat + conversion;
  const revenue = row.volume * (row.asp || 0);
  const cogs = row.volume * unitCogs;
  const grossMargin = revenue - cogs;
  const freight = row.freightCpu || 0;
  const marketing = row.marketingCpu || 0;
  const sga = row.sgaCpu || 0;
  const unitOpex = freight + marketing + sga;
  const operatingExpense = row.volume * unitOpex;
  const operatingIncome = grossMargin - operatingExpense;
  return {
    ...row,
    unitCogs,
    revenue,
    cogs,
    grossMargin,
    unitOpex,
    operatingExpense,
    operatingIncome,
    gmPct: revenue ? grossMargin / revenue : 0,
    omPct: revenue ? operatingIncome / revenue : 0,
    brewMatTotal: brewMat * row.volume,
    pkgMatTotal: pkgMat * row.volume,
    conversionTotal: conversion * row.volume,
    freightTotal: freight * row.volume,
    marketingTotal: marketing * row.volume,
    sgaTotal: sga * row.volume
  };
}

// ============================================================
// DATA LOADING
// ============================================================

const _fallbackData = [
  { period: "2026-Q1", plant: "Denver", family: "Core Lager", sku: "LGR-12OZ-6PK", packaging: "Can", volume: 64000, asp: 9.8, brewMatCpu: 1.1, pkgMatCpu: 1.0, conversionCpu: 1.05, freightCpu: 0.44, marketingCpu: 0.3, sgaCpu: 0.64 },
  { period: "2026-Q1", plant: "Denver", family: "IPA", sku: "IPA-12OZ-6PK", packaging: "Can", volume: 48000, asp: 10.6, brewMatCpu: 1.34, pkgMatCpu: 1.1, conversionCpu: 1.02, freightCpu: 0.43, marketingCpu: 0.35, sgaCpu: 0.68 },
  { period: "2026-Q1", plant: "Denver", family: "Seasonal", sku: "SNS-12OZ-6PK", packaging: "Can", volume: 22000, asp: 11.9, brewMatCpu: 1.51, pkgMatCpu: 1.2, conversionCpu: 1.41, freightCpu: 0.46, marketingCpu: 0.4, sgaCpu: 0.72 },
  { period: "2026-Q1", plant: "Asheville", family: "Core Lager", sku: "LGR-12OZ-6PK", packaging: "Bottle", volume: 59000, asp: 9.2, brewMatCpu: 1.24, pkgMatCpu: 1.1, conversionCpu: 1.09, freightCpu: 0.53, marketingCpu: 0.32, sgaCpu: 0.66 },
  { period: "2026-Q1", plant: "Asheville", family: "IPA", sku: "IPA-12OZ-6PK", packaging: "Bottle", volume: 41000, asp: 10.1, brewMatCpu: 1.46, pkgMatCpu: 1.2, conversionCpu: 1.12, freightCpu: 0.56, marketingCpu: 0.37, sgaCpu: 0.72 }
];

const _rawRecords = (Array.isArray(window.DEMO_COST_DATA) && window.DEMO_COST_DATA.length)
  ? window.DEMO_COST_DATA
  : _fallbackData;

const _allRecords = _rawRecords.map(normalizeStaticCostRow).map(withDescriptorDefaults).map(computeRow);

// ============================================================
// SKU AGGREGATION
// Collapse all plants + periods into one row per unique SKU
// ============================================================

function aggregateSkus(records) {
  const map = new Map();

  for (const r of records) {
    // Use osku as the canonical product key; fall back to sku
    const key = (r.osku && r.osku !== "Unknown") ? r.osku : r.sku;
    if (!key || key === "Unknown") continue;

    if (!map.has(key)) {
      map.set(key, {
        sku: key,
        description: (r.orderableSkuDescription && r.orderableSkuDescription !== "Unknown")
          ? r.orderableSkuDescription
          : r.sku,
        priceSegment: r.priceSegment,
        brandFamily: r.brandFamily,
        containerSize: r.containerSize,
        containerType: r.containerType,
        // accumulators
        volume: 0, revenue: 0, cogs: 0, grossMargin: 0,
        operatingExpense: 0, operatingIncome: 0,
        conversionTotal: 0, brewMatTotal: 0, pkgMatTotal: 0,
        freightTotal: 0, marketingTotal: 0, sgaTotal: 0,
        // raw rows preserved so chunk 2 can access per-plant detail
        _rows: []
      });
    }

    const e = map.get(key);
    e.volume            += r.volume;
    e.revenue           += r.revenue;
    e.cogs              += r.cogs;
    e.grossMargin       += r.grossMargin;
    e.operatingExpense  += r.operatingExpense;
    e.operatingIncome   += r.operatingIncome;
    e.conversionTotal   += r.conversionTotal || 0;
    e.brewMatTotal      += r.brewMatTotal    || 0;
    e.pkgMatTotal       += r.pkgMatTotal     || 0;
    e.freightTotal      += r.freightTotal    || 0;
    e.marketingTotal    += r.marketingTotal  || 0;
    e.sgaTotal          += r.sgaTotal        || 0;
    e._rows.push(r);
  }

  return [...map.values()].map(e => ({
    ...e,
    // blended $/bbl rates (volume-weighted average across plants/periods)
    conversionCpu:  e.volume ? e.conversionTotal / e.volume : 0,
    brewMatCpu:     e.volume ? e.brewMatTotal    / e.volume : 0,
    pkgMatCpu:      e.volume ? e.pkgMatTotal     / e.volume : 0,
    freightCpu:     e.volume ? e.freightTotal    / e.volume : 0,
    marketingCpu:   e.volume ? e.marketingTotal  / e.volume : 0,
    sgaCpu:         e.volume ? e.sgaTotal        / e.volume : 0,
    oiPerBbl:       e.volume ? e.operatingIncome / e.volume : 0,
    aspPerBbl:      e.volume ? e.revenue         / e.volume : 0,
    omPct:          e.revenue ? e.operatingIncome / e.revenue : 0,
    gmPct:          e.revenue ? e.grossMargin    / e.revenue : 0
  }));
}

function portfolioTotals(skus) {
  const totVol = skus.reduce((s, x) => s + x.volume, 0);
  const totConv = skus.reduce((s, x) => s + x.conversionTotal, 0);
  const totOI = skus.reduce((s, x) => s + x.operatingIncome, 0);
  const totRev = skus.reduce((s, x) => s + x.revenue, 0);
  return {
    volume: totVol,
    avgConversionCpu: totVol ? totConv / totVol : 0,
    operatingIncome: totOI,
    revenue: totRev
  };
}

// ============================================================
// STATE
// ============================================================

const simState = {
  allSkus: [],     // full aggregated SKU list
  portfolio: {},   // portfolio-level totals
  filteredSkus: [],
  selectedSku: null,
  search: "",
  segmentFilter: "All",
  familyFilter: "All",
  packageTypeFilter: "All",
  sortOrder: "operatingIncome-asc",
  // chunk 2
  subRows: [],             // { sku, type: 'suggested'|'custom'|'lost_sales', pct: null }
  subFullListVisible: false,
  subFullListSort: "volume-desc"
};

// ============================================================
// FILTER + SORT
// ============================================================

function applySimFilters(skus) {
  const terms = simState.search
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return skus.filter(s => {
    if (simState.segmentFilter !== "All" && s.priceSegment !== simState.segmentFilter) return false;
    if (simState.familyFilter !== "All" && s.brandFamily !== simState.familyFilter) return false;
    if (simState.packageTypeFilter !== "All" && s.containerType !== simState.packageTypeFilter) return false;

    if (terms.length) {
      const searchableText = [
        s.sku,
        s.description,
        s.brand,
        s.brandFamily,
        s.priceSegment,
        s.containerType,
        s.containerSize,
        s.packaging
      ]
        .map((value) => String(value || "").toLowerCase())
        .join(" ");

      const allTermsMatch = terms.every((term) => searchableText.includes(term));
      if (!allTermsMatch) return false;
    }

    return true;
  });
}

function sortSkus(skus) {
  const [sortKey, sortDir] = simState.sortOrder.split("-");
  return [...skus].sort((a, b) => {
    const av = a[sortKey] ?? 0;
    const bv = b[sortKey] ?? 0;
    const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv;
    return sortDir === "asc" ? cmp : -cmp;
  });
}

// ============================================================
// RENDER — SKU TABLE
// ============================================================

function getConvToneClass(convCpu, avgConvCpu) {
  if (!avgConvCpu) return "";
  const ratio = convCpu / avgConvCpu;
  if (ratio >= 1.5) return "conv-very-high";
  if (ratio >= 1.15) return "conv-high";
  if (ratio <= 0.85) return "conv-low";
  return "";
}

function renderSkuTable() {
  const tbody = document.getElementById("sim-sku-tbody");
  const countEl = document.getElementById("sim-table-count");
  if (!tbody) return;

  const visible = sortSkus(applySimFilters(simState.allSkus));
  simState.filteredSkus = visible;

  countEl.textContent = `(${visible.length} of ${simState.allSkus.length})`;

  if (!visible.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="sim-empty">No SKUs match the current filters.</td></tr>`;
    return;
  }

  const avg = simState.portfolio.avgConversionCpu || 0;

  tbody.innerHTML = visible.map(s => {
    const isSelected = simState.selectedSku && simState.selectedSku.sku === s.sku;
    const convTone = getConvToneClass(s.conversionCpu, avg);
    const oiTone = getMetricToneClass(s.oiPerBbl);
    return `<tr class="sim-sku-row${isSelected ? " sim-sku-row-selected" : ""}" data-sku="${encodeURIComponent(s.sku)}">
      <td class="sim-td-sku">${s.sku}</td>
      <td class="sim-td-desc">${s.description !== s.sku ? s.description : "—"}</td>
      <td>${s.priceSegment}</td>
      <td>${s.containerType}</td>
      <td class="sim-td-num">${Math.round(s.volume).toLocaleString()}</td>
      <td class="sim-td-num">${toMoney(s.revenue)}</td>
      <td class="sim-td-num ${getMetricToneClass(s.grossMargin)}">${toSignedMoney(s.grossMargin)}</td>
      <td class="sim-td-num ${oiTone}">${toSignedMoney(s.operatingIncome)}</td>
    </tr>`;
  }).join("");

  // re-attach row click listeners
  tbody.querySelectorAll(".sim-sku-row").forEach(tr => {
    tr.addEventListener("click", () => {
      const key = decodeURIComponent(tr.dataset.sku);
      const found = simState.allSkus.find(s => s.sku === key);
      if (found) selectSku(found);
    });
  });
}

// ============================================================
// RENDER — SELECTED SKU CARD
// ============================================================

function renderSelectedCard() {
  const noSel = document.getElementById("sim-no-selection");
  const card = document.getElementById("sim-selection-card");
  const step2 = document.getElementById("step2-panel");
  if (!noSel || !card) return;

  const s = simState.selectedSku;
  if (!s) {
    noSel.classList.remove("is-hidden");
    card.classList.add("is-hidden");
    if (step2) step2.classList.add("sim-step-locked");
    return;
  }

  noSel.classList.add("is-hidden");
  card.classList.remove("is-hidden");
  if (step2) step2.classList.remove("sim-step-locked");

  const avg = simState.portfolio.avgConversionCpu || 0;
  const volShare = simState.portfolio.volume ? s.volume / simState.portfolio.volume : 0;
  const convRatio = avg ? s.conversionCpu / avg : 1;

  // Populate text fields
  document.getElementById("sel-sku-name").textContent = s.sku;
  document.getElementById("sel-sku-desc").textContent =
    s.description !== s.sku ? s.description : "";

  // Tags: segment, family, size
  document.getElementById("sel-sku-tags").innerHTML =
    [s.priceSegment, s.brandFamily, s.containerSize]
      .filter(v => v && v !== "Unknown")
      .map(v => `<span class="sim-tag">${v}</span>`)
      .join("");

  // Metrics
  document.getElementById("sel-volume").textContent =
    `${Math.round(s.volume).toLocaleString()} bbl`;
  document.getElementById("sel-volume-share").textContent =
    `${toPct(volShare)} of portfolio`;

  document.getElementById("sel-conv-cpu").textContent = toMoneyDec(s.conversionCpu);
  const vsAvg = avg
    ? ` (${convRatio >= 1 ? "+" : ""}${((convRatio - 1) * 100).toFixed(0)}% vs avg $${avg.toFixed(2)})`
    : "";
  const convSubEl = document.getElementById("sel-conv-vs-avg");
  convSubEl.textContent = vsAvg;
  convSubEl.className = `sim-sel-sub ${convRatio >= 1.15 ? "is-negative" : convRatio <= 0.85 ? "is-positive" : ""}`;

  const oiBblEl = document.getElementById("sel-oi-bbl");
  oiBblEl.textContent = toMoneyDec(s.oiPerBbl);
  oiBblEl.className = getMetricToneClass(s.oiPerBbl);

  const oiTotEl = document.getElementById("sel-oi-total");
  oiTotEl.textContent = toSignedMoney(s.operatingIncome);
  oiTotEl.className = getMetricToneClass(s.operatingIncome);

  document.getElementById("sel-revenue").textContent = toMoney(s.revenue);

  const omPctEl = document.getElementById("sel-om-pct");
  omPctEl.textContent = toSignedPct(s.omPct);
  omPctEl.className = getMetricToneClass(s.omPct);

  // Conversion rate comparison bar
  // Scale: bar represents fraction of (max possible conv cpu * 1.2)
  const maxConv = Math.max(avg * 2.5, s.conversionCpu * 1.1, 1);
  const avgWidth  = Math.min(100, (avg / maxConv) * 100).toFixed(1);
  const skuWidth  = Math.min(100, (s.conversionCpu / maxConv) * 100).toFixed(1);
  const avgBar = document.getElementById("sel-conv-bar-portfolio");
  const skuBar = document.getElementById("sel-conv-bar-sku");
  if (avgBar) avgBar.style.width = `${avgWidth}%`;
  if (skuBar) {
    skuBar.style.width = `${skuWidth}%`;
    skuBar.className = `sim-conv-bar-sku ${convRatio >= 1.15 ? "sim-conv-bar-high" : ""}`;
  }
}

// ============================================================
// CHUNK 2 — SUBSTITUTION MAPPING
// ============================================================

function buildSuggestedSubs(targetSku) {
  return simState.allSkus
    .filter(s =>
      s.sku !== targetSku.sku &&
      s.containerType === targetSku.containerType &&
      s.priceSegment === targetSku.priceSegment &&
      s.brandFamily !== targetSku.brandFamily
    )
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5);
}

function initStep2(selectedSku) {
  const suggestions = buildSuggestedSubs(selectedSku);
  simState.subRows = [
    ...suggestions.map(s => ({ sku: s.sku, type: "suggested", pct: null })),
    { sku: "__lost_sales__", type: "lost_sales", pct: null }
  ];
  simState.subFullListVisible = false;
  renderStep2();
}

function renderStep2() {
  const panel = document.getElementById("step2-panel");
  const lockedMsg = document.getElementById("step2-locked-msg");
  const content = document.getElementById("step2-content");
  const s = simState.selectedSku;

  if (!s) {
    if (panel) panel.classList.add("sim-step-locked");
    if (lockedMsg) lockedMsg.classList.remove("is-hidden");
    if (content) content.classList.add("is-hidden");
    return;
  }

  if (panel) panel.classList.remove("sim-step-locked");
  if (lockedMsg) lockedMsg.classList.add("is-hidden");
  if (content) content.classList.remove("is-hidden");

  const subtitleEl = document.getElementById("step2-subtitle");
  if (subtitleEl) {
    subtitleEl.innerHTML = `Where will demand go when <strong>${s.sku}</strong> (${Math.round(s.volume).toLocaleString()} bbl · ${toMoney(s.revenue)} revenue) is removed?`;
  }

  renderAllocTable();
  renderFullList();
}

function renderAllocTable() {
  const tbody = document.getElementById("sub-alloc-tbody");
  if (!tbody) return;

  tbody.innerHTML = simState.subRows.map((row, i) => {
    const val = row.pct !== null ? row.pct : "";

    if (row.type === "lost_sales") {
      return `<tr class="sub-alloc-row sub-alloc-lost">
        <td class="sub-td-sku sub-lost-label">Lost Sales</td>
        <td class="sub-td-desc" colspan="2">No substitution — demand is not recovered</td>
        <td class="sub-th-num">—</td>
        <td class="sub-th-num">—</td>
        <td class="sub-td-pct">
          <input type="number" class="sub-pct-input" min="0" max="100" step="1"
            data-row="${i}" value="${val}" placeholder="0" />
        </td>
        <td class="sub-th-rm"></td>
      </tr>`;
    }

    const skuObj = simState.allSkus.find(x => x.sku === row.sku);
    if (!skuObj) return "";
    const oiTone = getMetricToneClass(skuObj.oiPerBbl);
    const isCustom = row.type === "custom";

    return `<tr class="sub-alloc-row${isCustom ? " sub-alloc-custom" : ""}">
      <td class="sub-td-sku">${skuObj.sku}</td>
      <td class="sub-td-desc">${skuObj.description !== skuObj.sku ? skuObj.description : "—"}</td>
      <td>${skuObj.priceSegment}</td>
      <td class="sub-th-num">${Math.round(skuObj.volume).toLocaleString()}</td>
      <td class="sub-th-num ${oiTone}">${toMoneyDec(skuObj.oiPerBbl)}</td>
      <td class="sub-td-pct">
        <input type="number" class="sub-pct-input" min="0" max="100" step="1"
          data-row="${i}" value="${val}" placeholder="0" />
      </td>
      <td class="sub-th-rm">${isCustom ? `<button class="sub-row-remove ghost" data-row="${i}" type="button">✕</button>` : ""}</td>
    </tr>`;
  }).join("");

  tbody.querySelectorAll(".sub-pct-input").forEach(input => {
    input.addEventListener("input", () => {
      const idx = parseInt(input.dataset.row);
      const raw = parseFloat(input.value);
      simState.subRows[idx].pct = isNaN(raw) ? null : Math.max(0, Math.min(100, raw));
      updateAllocTotal();
    });
  });

  tbody.querySelectorAll(".sub-row-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.row);
      simState.subRows.splice(idx, 1);
      renderAllocTable();
      renderFullList();
    });
  });

  updateAllocTotal();
}

function updateAllocTotal() {
  const total = simState.subRows.reduce((sum, r) => sum + (r.pct || 0), 0);
  const rounded = Math.round(total * 10) / 10;

  const totalEl = document.getElementById("sub-alloc-total");
  const msgEl = document.getElementById("sub-alloc-msg");
  const runBtn = document.getElementById("btn-run-simulation");

  if (totalEl) {
    totalEl.textContent = `${rounded}%`;
    totalEl.className = rounded === 100 ? "sub-total-exact" : rounded > 100 ? "sub-total-over" : "";
  }

  if (msgEl) {
    if (rounded === 100) {
      msgEl.textContent = "✓ Ready to run simulation";
      msgEl.className = "sub-alloc-msg sub-alloc-msg-ok";
    } else if (rounded > 100) {
      msgEl.textContent = `Over by ${(rounded - 100).toFixed(1)}% — reduce allocations`;
      msgEl.className = "sub-alloc-msg sub-alloc-msg-error";
    } else {
      msgEl.textContent = `${(100 - rounded).toFixed(1)}% remaining to allocate`;
      msgEl.className = "sub-alloc-msg";
    }
  }

  if (runBtn) runBtn.disabled = (rounded !== 100);
}

function renderFullList() {
  const wrap = document.getElementById("sub-full-list-wrap");
  const toggleBtn = document.getElementById("btn-toggle-full-list");
  if (!wrap) return;

  if (!simState.subFullListVisible) {
    wrap.classList.add("is-hidden");
    if (toggleBtn) toggleBtn.textContent = "Show Full List ↓";
    return;
  }

  wrap.classList.remove("is-hidden");
  if (toggleBtn) toggleBtn.textContent = "Hide Full List ↑";

  const [sortKey, sortDir] = simState.subFullListSort.split("-");
  const alreadyAdded = new Set(simState.subRows.map(r => r.sku));

  const sorted = [...simState.allSkus]
    .filter(s => s.sku !== simState.selectedSku.sku)
    .sort((a, b) => {
      const diff = (a[sortKey] ?? 0) - (b[sortKey] ?? 0);
      return sortDir === "desc" ? -diff : diff;
    });

  const tbody = document.getElementById("sub-full-tbody");
  if (!tbody) return;

  tbody.innerHTML = sorted.map(s => {
    const added = alreadyAdded.has(s.sku);
    const oiTone = getMetricToneClass(s.oiPerBbl);
    return `<tr class="sub-full-row${added ? " sub-full-row-added" : ""}">
      <td class="sub-td-sku">${s.sku}</td>
      <td class="sub-td-desc">${s.description !== s.sku ? s.description : "—"}</td>
      <td>${s.priceSegment}</td>
      <td class="sub-th-num">${Math.round(s.volume).toLocaleString()}</td>
      <td class="sub-th-num ${oiTone}">${toMoneyDec(s.oiPerBbl)}</td>
      <td class="sub-th-num">${added
        ? "<span class=\"sub-full-added\">Added ✓</span>"
        : `<button class="sub-full-add ghost" data-sku="${encodeURIComponent(s.sku)}" type="button">+ Add</button>`
      }</td>
    </tr>`;
  }).join("");

  tbody.querySelectorAll(".sub-full-add").forEach(btn => {
    btn.addEventListener("click", () => {
      const skuKey = decodeURIComponent(btn.dataset.sku);
      const lostIdx = simState.subRows.findIndex(r => r.type === "lost_sales");
      const insertAt = lostIdx >= 0 ? lostIdx : simState.subRows.length;
      simState.subRows.splice(insertAt, 0, { sku: skuKey, type: "custom", pct: null });
      renderAllocTable();
      renderFullList();
    });
  });
}

function bindStep2Controls() {
  const clearBtn = document.getElementById("btn-clear-alloc");
  if (clearBtn) clearBtn.addEventListener("click", () => {
    simState.subRows.forEach(r => { r.pct = null; });
    renderAllocTable();
  });

  const toggleBtn = document.getElementById("btn-toggle-full-list");
  if (toggleBtn) toggleBtn.addEventListener("click", () => {
    simState.subFullListVisible = !simState.subFullListVisible;
    renderFullList();
  });

  const fullSortEl = document.getElementById("sub-full-sort");
  if (fullSortEl) fullSortEl.addEventListener("change", () => {
    simState.subFullListSort = fullSortEl.value;
    renderFullList();
  });

  const runBtn = document.getElementById("btn-run-simulation");
  if (runBtn) runBtn.addEventListener("click", () => {
    // Chunk 3 — placeholder
    const step3 = document.getElementById("step3-panel");
    if (step3) step3.scrollIntoView({ behavior: "smooth" });
  });
}

// ============================================================
// SELECT SKU
// ============================================================

function selectSku(skuObj) {
  simState.selectedSku = skuObj;

  // Update URL param without page reload
  const url = new URL(window.location.href);
  url.searchParams.set("sku", skuObj.sku);
  window.history.replaceState({}, "", url.toString());

  renderSkuTable();
  renderSelectedCard();
  initStep2(skuObj);
}

// ============================================================
// FILTER DROPDOWNS + SEARCH
// ============================================================

function fillSelect(el, values) {
  el.innerHTML = values.map(v => `<option value="${v}">${v}</option>`).join("");
}

function populateFilterDropdowns(skus) {
  const unique = (key) => ["All", ...new Set(skus.map(s => s[key]).filter(v => v && v !== "Unknown"))].sort((a, b) => a === "All" ? -1 : a.localeCompare(b));

  const segEl = document.getElementById("sim-filter-segment");
  const famEl = document.getElementById("sim-filter-family");
  const packageTypeEl = document.getElementById("sim-filter-package-type");
  if (segEl) fillSelect(segEl, unique("priceSegment"));
  if (famEl) fillSelect(famEl, unique("brandFamily"));
  if (packageTypeEl) fillSelect(packageTypeEl, unique("containerType"));
}

function bindFilterControls() {
  const searchEl = document.getElementById("sim-search");
  const segEl = document.getElementById("sim-filter-segment");
  const famEl = document.getElementById("sim-filter-family");
  const packageTypeEl = document.getElementById("sim-filter-package-type");
  const sortEl = document.getElementById("sim-sort-order");
  const resetEl = document.getElementById("sim-reset-filters");

  if (searchEl) searchEl.addEventListener("input", () => {
    simState.search = searchEl.value;
    renderSkuTable();
  });
  if (segEl) segEl.addEventListener("change", () => {
    simState.segmentFilter = segEl.value;
    renderSkuTable();
  });
  if (famEl) famEl.addEventListener("change", () => {
    simState.familyFilter = famEl.value;
    renderSkuTable();
  });
  if (packageTypeEl) packageTypeEl.addEventListener("change", () => {
    simState.packageTypeFilter = packageTypeEl.value;
    renderSkuTable();
  });
  if (sortEl) sortEl.addEventListener("change", () => {
    simState.sortOrder = sortEl.value;
    renderSkuTable();
  });
  if (resetEl) resetEl.addEventListener("click", () => {
    simState.search = "";
    simState.segmentFilter = "All";
    simState.familyFilter = "All";
    simState.packageTypeFilter = "All";
    simState.sortOrder = "operatingIncome-asc";
    if (searchEl) searchEl.value = "";
    if (segEl) segEl.value = "All";
    if (famEl) famEl.value = "All";
    if (packageTypeEl) packageTypeEl.value = "All";
    if (sortEl) sortEl.value = "volume-asc";
    renderSkuTable();
  });

  const continueBtn = document.getElementById("btn-continue-step2");
  if (continueBtn) continueBtn.addEventListener("click", () => {
    // placeholder for chunk 2 — will scroll to / reveal step 2 panel
    const step2 = document.getElementById("step2-panel");
    if (step2) step2.scrollIntoView({ behavior: "smooth" });
  });
}

// ============================================================
// INIT
// ============================================================

function init() {
  // Build SKU aggregates
  simState.allSkus = aggregateSkus(_allRecords);
  simState.portfolio = portfolioTotals(simState.allSkus);

  // Check URL param for pre-selected SKU
  const params = new URLSearchParams(window.location.search);
  const preselectKey = params.get("sku");
  if (preselectKey) {
    const match = simState.allSkus.find(s => s.sku === preselectKey);
    if (match) simState.selectedSku = match;
  }

  // Populate filter dropdowns
  populateFilterDropdowns(simState.allSkus);

  const sortEl = document.getElementById("sim-sort-order");
  if (sortEl) sortEl.value = simState.sortOrder;

  // Bind interactions
  bindFilterControls();
  bindStep2Controls();

  // Initial render
  renderSkuTable();
  renderSelectedCard();
  renderStep2();

  // If pre-selected, scroll selection into view in table
  if (simState.selectedSku) {
    initStep2(simState.selectedSku);
    setTimeout(() => {
      const row = document.querySelector(".sim-sku-row-selected");
      if (row) row.scrollIntoView({ block: "center" });
    }, 80);
  }
}

document.addEventListener("DOMContentLoaded", init);
