// ============================================================
// SHARED UTILITIES
// ============================================================

function normalizeKey(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function parseNum(value) {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const raw = String(value).trim();
  if (!raw) return 0;
  const normalized = raw.replace(/^\((.*)\)$/, "-$1").replace(/[$,%\s,]/g, "");
  return Number(normalized) || 0;
}

function toMoney(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);
}

function toMoneyDec(value, decimals = 2) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value || 0);
}

function toSignedMoney(value) {
  const abs = toMoney(Math.abs(value || 0));
  return (value || 0) >= 0 ? `+${abs}` : `-${abs}`;
}

function toPct(value) {
  return `${((value || 0) * 100).toFixed(1)}%`;
}

function getMetricToneClass(value) {
  if ((value || 0) > 0) return "is-positive";
  if ((value || 0) < 0) return "is-negative";
  return "";
}

// ============================================================
// COST BEHAVIOR
// ============================================================

const COST_BEHAVIOR = {
  conversionScaleMinPct: 0.05,
  conversionScaleMaxPct: 0.15,
  marketingVariablePct: 0.60,
  sgaVariablePct: 0.35
};

function getConversionScaleSavePct(absorbedVol, recipientBaseVol) {
  if (absorbedVol <= 0) return 0;
  const safeBase = Math.max(recipientBaseVol || 0, 1);
  const absorptionRatio = Math.max(0, Math.min(1, absorbedVol / safeBase));
  return COST_BEHAVIOR.conversionScaleMinPct +
    (COST_BEHAVIOR.conversionScaleMaxPct - COST_BEHAVIOR.conversionScaleMinPct) * absorptionRatio;
}

function calcOiPerBbl(row) {
  const revenue = parseNum(row.asp);
  const variableCost =
    parseNum(row.brewMatCpu) +
    parseNum(row.pkgMatCpu) +
    parseNum(row.conversionCpu) +
    parseNum(row.freightCpu) +
    parseNum(row.marketingCpu) * COST_BEHAVIOR.marketingVariablePct +
    parseNum(row.sgaCpu) * COST_BEHAVIOR.sgaVariablePct;
  const fixedCost =
    parseNum(row.marketingCpu) * (1 - COST_BEHAVIOR.marketingVariablePct) +
    parseNum(row.sgaCpu) * (1 - COST_BEHAVIOR.sgaVariablePct);
  return revenue - variableCost - fixedCost;
}

// ============================================================
// DATA PREPARATION
// ============================================================

const EXCLUDED_FAMILIES = ["PABST BREWING FAMILY"];

function buildMultiPlantSkus() {
  const allData = window.DEMO_COST_DATA || [];

  // Group rows by sku
  const bySkuMap = {};
  allData.forEach(row => {
    if (EXCLUDED_FAMILIES.includes(row.family)) return;
    const sku = row.sku;
    if (!bySkuMap[sku]) bySkuMap[sku] = [];
    bySkuMap[sku].push(row);
  });

  // Keep only SKUs present at 2+ distinct plants
  const multiPlantGroups = Object.values(bySkuMap).filter(rows => {
    const plants = new Set(rows.map(r => r.plant));
    return plants.size >= 2;
  });

  // Shape into display objects
  return multiPlantGroups.map(rows => {
    const totalVol = rows.reduce((s, r) => s + parseNum(r.volume), 0);
    const convCpus = rows.map(r => parseNum(r.conversionCpu));
    const convSpread = Math.max(...convCpus) - Math.min(...convCpus);
    const plants = rows.map(r => r.plant);
    const sample = rows[0];
    return {
      sku: sample.sku,
      description: sample.orderableSkuDescription || sample.sku,
      brandFamily: sample.family || sample.brandFamily || "Unknown",
      packageType: String(sample.packaging || sample.containerType || "Unknown").trim(),
      plants,
      totalVol,
      convSpread,
      rows // all plant-level rows
    };
  });
}

// ============================================================
// STATE
// ============================================================

const plState = {
  allSkus: [],
  filteredSkus: [],
  search: "",
  filterFamily: "All",
  filterPackage: "All",
  sort: "spread-desc",
  selectedSkuGroup: null,
  sourcePlant: null,
  destPlant: null,
  shiftPct: 100
};

// ============================================================
// FILTER + SORT
// ============================================================

function applyFilters() {
  const terms = plState.search.toLowerCase().trim().split(/\s+/).filter(Boolean);

  plState.filteredSkus = plState.allSkus.filter(sg => {
    if (plState.filterFamily !== "All" && sg.brandFamily !== plState.filterFamily) return false;
    if (plState.filterPackage !== "All" && sg.packageType !== plState.filterPackage) return false;
    if (terms.length) {
      const haystack = `${sg.sku} ${sg.description} ${sg.brandFamily}`.toLowerCase();
      if (!terms.every(t => haystack.includes(t))) return false;
    }
    return true;
  });

  const isDesc = plState.sort.endsWith("-desc");
  const field = plState.sort.startsWith("spread") ? "convSpread" : "totalVol";
  plState.filteredSkus.sort((a, b) => {
    const delta = (a[field] || 0) - (b[field] || 0);
    return isDesc ? -delta : delta;
  });
}

// ============================================================
// STEP 1 — SKU TABLE
// ============================================================

function populateFamilyFilter() {
  const families = ["All", ...new Set(plState.allSkus.map(s => s.brandFamily).filter(Boolean).sort())];
  const sel = document.getElementById("pl-filter-family");
  sel.innerHTML = families.map(f => `<option value="${f}">${f}</option>`).join("");
}

function populatePackageFilter() {
  const types = ["All", ...new Set(plState.allSkus.map(s => s.packageType).filter(Boolean).sort())];
  const sel = document.getElementById("pl-filter-package");
  sel.innerHTML = types.map(t => `<option value="${t}">${t}</option>`).join("");
}

function renderSkuTable() {
  applyFilters();
  const tbody = document.getElementById("pl-sku-tbody");
  const noResults = document.getElementById("pl-no-results");

  if (!plState.filteredSkus.length) {
    tbody.innerHTML = "";
    noResults.classList.remove("is-hidden");
    return;
  }
  noResults.classList.add("is-hidden");

  tbody.innerHTML = plState.filteredSkus.map(sg => {
    const plantTags = sg.plants.map(p => `<span class="pl-plant-tag">${p}</span>`).join("");
    const spreadClass = sg.convSpread >= 5 ? "is-negative" : sg.convSpread >= 2 ? "" : "is-positive";
    return `<tr class="pl-sku-row" data-sku="${sg.sku}">
      <td class="pl-desc-cell">
        <span class="pl-sku-num">${sg.sku}</span>
        <span class="pl-sku-desc">${sg.description}</span>
      </td>
      <td>${sg.brandFamily}</td>
      <td>${plantTags}</td>
      <td class="num">${Math.round(sg.totalVol).toLocaleString()}</td>
      <td class="num ${spreadClass}">${toMoneyDec(sg.convSpread)}</td>
      <td><button class="ghost pl-select-btn" data-sku="${sg.sku}" type="button">Select →</button></td>
    </tr>`;
  }).join("");

  // Bind row clicks
  tbody.querySelectorAll(".pl-select-btn").forEach(btn => {
    btn.addEventListener("click", () => selectSkuGroup(btn.dataset.sku));
  });
  tbody.querySelectorAll(".pl-sku-row").forEach(row => {
    row.addEventListener("click", e => {
      if (e.target.tagName !== "BUTTON") selectSkuGroup(row.dataset.sku);
    });
  });
}

// ============================================================
// STEP 2 — PLANT SELECTION
// ============================================================

function selectSkuGroup(sku) {
  const group = plState.allSkus.find(sg => sg.sku === sku);
  if (!group) return;
  plState.selectedSkuGroup = group;
  plState.sourcePlant = group.plants[0];
  plState.destPlant = group.plants.length > 1 ? group.plants[1] : group.plants[0];
  plState.shiftPct = 100;

  renderStep2();
  document.getElementById("pl-step2").style.display = "";
  document.getElementById("pl-step3").style.display = "none";
  document.getElementById("pl-step2").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderStep2() {
  const group = plState.selectedSkuGroup;
  if (!group) return;

  // Header
  document.getElementById("pl-step2-title").textContent =
    `Configure the Production Shift — ${group.sku}`;

  // Selected card
  document.getElementById("pl-sel-desc").textContent = group.description;
  document.getElementById("pl-sel-tags").innerHTML =
    `<span class="sim-tag">${group.brandFamily}</span>` +
    `<span class="sim-tag">${group.plants.length} plants</span>` +
    `<span class="sim-tag">${Math.round(group.totalVol).toLocaleString()} bbl total</span>`;

  // Plant comparison table
  renderPlantTable(group.rows);

  // Source/dest dropdowns
  const srcSel = document.getElementById("pl-source-plant");
  const dstSel = document.getElementById("pl-dest-plant");
  srcSel.innerHTML = group.plants.map(p => `<option value="${p}">${p}</option>`).join("");
  srcSel.value = plState.sourcePlant;
  updateDestOptions();
  updateShiftHint();
}

function updateDestOptions() {
  const group = plState.selectedSkuGroup;
  const dstSel = document.getElementById("pl-dest-plant");
  const srcVal = document.getElementById("pl-source-plant").value;
  plState.sourcePlant = srcVal;
  dstSel.innerHTML = group.plants
    .filter(p => p !== srcVal)
    .map(p => `<option value="${p}">${p}</option>`)
    .join("");
  plState.destPlant = dstSel.value;
  updateShiftHint();
}

function updateShiftHint() {
  const group = plState.selectedSkuGroup;
  if (!group) return;
  const srcRow = group.rows.find(r => r.plant === plState.sourcePlant);
  if (!srcRow) return;
  const vol = parseNum(srcRow.volume);
  const shifted = vol * (plState.shiftPct / 100);
  document.getElementById("pl-shift-bbl-hint").textContent =
    ` — ${Math.round(shifted).toLocaleString()} bbl`;
  document.getElementById("pl-shift-vol-display").textContent = `${plState.shiftPct}%`;
}

function renderPlantTable(rows) {
  const tbody = document.getElementById("pl-plant-tbody");
  const convCpus = rows.map(r => parseNum(r.conversionCpu));
  const minConv = Math.min(...convCpus);

  tbody.innerHTML = rows.map(row => {
    const vol = parseNum(row.volume);
    const convCpu = parseNum(row.conversionCpu);
    const freightCpu = parseNum(row.freightCpu);
    const oiBbl = calcOiPerBbl(row);
    const totalOi = oiBbl * vol;
    const isLowest = convCpu === minConv;
    return `<tr class="${isLowest ? "pl-plant-row-best" : ""}">
      <td><strong>${row.plant}</strong>${isLowest ? ' <span class="pl-lowest-tag">Lowest Cost</span>' : ""}</td>
      <td class="num">${Math.round(vol).toLocaleString()}</td>
      <td class="num ${convCpu > minConv ? "is-negative" : "is-positive"}">${toMoneyDec(convCpu)}</td>
      <td class="num">${toMoneyDec(freightCpu)}</td>
      <td class="num ${getMetricToneClass(oiBbl)}">${toMoneyDec(oiBbl)}</td>
      <td class="num ${getMetricToneClass(totalOi)}">${toMoney(totalOi)}</td>
    </tr>`;
  }).join("");
}

// ============================================================
// STEP 3 — RESULTS
// ============================================================

function runAnalysis() {
  const group = plState.selectedSkuGroup;
  if (!group) return;

  plState.destPlant = document.getElementById("pl-dest-plant").value;
  const srcRow = group.rows.find(r => r.plant === plState.sourcePlant);
  const dstRow = group.rows.find(r => r.plant === plState.destPlant);
  if (!srcRow || !dstRow) return;

  const sourceVol = parseNum(srcRow.volume);
  const volumeShifted = sourceVol * (plState.shiftPct / 100);

  // ---- Math ----
  const srcConv = parseNum(srcRow.conversionCpu);
  const dstConv = parseNum(dstRow.conversionCpu);
  const srcFreight = parseNum(srcRow.freightCpu);
  const dstFreight = parseNum(dstRow.freightCpu);
  const dstBaseVol = parseNum(dstRow.volume);

  const conversionSavings = (srcConv - dstConv) * volumeShifted;
  const scaleSavePct = getConversionScaleSavePct(volumeShifted, dstBaseVol);
  const scaleBenefit = dstConv * scaleSavePct * volumeShifted;
  const freightDelta = (dstFreight - srcFreight) * volumeShifted; // positive = headwind
  const netOI = conversionSavings + scaleBenefit - freightDelta;

  renderResults({ srcRow, dstRow, volumeShifted, conversionSavings, scaleBenefit, scaleSavePct, freightDelta, netOI, sourceVol });

  document.getElementById("pl-step3").style.display = "";
  document.getElementById("pl-step3").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderResults({ srcRow, dstRow, volumeShifted, conversionSavings, scaleBenefit, scaleSavePct, freightDelta, netOI, sourceVol }) {
  // Scenario banner
  const pctLabel = plState.shiftPct === 100 ? "100% (full consolidation)" : `${plState.shiftPct}%`;
  document.getElementById("pl-scenario-banner").innerHTML =
    `<span class="pl-banner-label">Scenario:</span>
     Shift <strong>${Math.round(volumeShifted).toLocaleString()} bbl</strong> (${pctLabel} of ${srcRow.plant} volume)
     from <strong>${srcRow.plant}</strong> → <strong>${dstRow.plant}</strong>`;

  // Net OI headline
  const netToneClass = netOI >= 0 ? "is-positive" : "is-negative";
  document.getElementById("pl-net-oi-strip").innerHTML =
    `<div class="pl-net-oi-card ${netToneClass}">
       <p class="pl-net-label">Net OI Impact</p>
       <p class="pl-net-value">${toSignedMoney(netOI)}</p>
       <p class="pl-net-sub">${netOI >= 0 ? "Annual benefit from consolidation" : "Net OI headwind — review freight delta"}</p>
     </div>`;

  // Bridge cards
  const freightSign = freightDelta >= 0 ? "−" : "+"; // headwind = subtracted, tailwind = added
  const freightDisplay = freightDelta >= 0
    ? `<span class="is-negative">−${toMoney(Math.abs(freightDelta))}</span>`
    : `<span class="is-positive">+${toMoney(Math.abs(freightDelta))}</span>`;
  const convClass = conversionSavings >= 0 ? "is-positive" : "is-negative";
  const scaleClass = "is-positive";

  // Breakeven freight (how much freight headwind before net goes to zero)
  const totalBenefit = conversionSavings + scaleBenefit;
  const breakevenFreightPerBbl = volumeShifted > 0 ? totalBenefit / volumeShifted : 0;

  document.getElementById("pl-bridge-cards").innerHTML =
    `<div class="pl-bridge-grid">
       <div class="pl-bridge-card">
         <p class="pl-bridge-label">Conversion Savings</p>
         <p class="pl-bridge-value ${convClass}">${toSignedMoney(conversionSavings)}</p>
         <p class="pl-bridge-sub">${toMoneyDec(parseNum(srcRow.conversionCpu))} → ${toMoneyDec(parseNum(dstRow.conversionCpu))} per bbl</p>
       </div>
       <div class="pl-bridge-card">
         <p class="pl-bridge-label">Scale Benefit at ${dstRow.plant}</p>
         <p class="pl-bridge-value is-positive">+${toMoney(scaleBenefit)}</p>
         <p class="pl-bridge-sub">${(scaleSavePct * 100).toFixed(1)}% conversion cost reduction on absorbed volume</p>
       </div>
       <div class="pl-bridge-card">
         <p class="pl-bridge-label">Freight Adjustment</p>
         <p class="pl-bridge-value">${freightDisplay}</p>
         <p class="pl-bridge-sub">${toMoneyDec(parseNum(srcRow.freightCpu))} → ${toMoneyDec(parseNum(dstRow.freightCpu))} per bbl</p>
       </div>
       <div class="pl-bridge-card pl-bridge-card-breakeven">
         <p class="pl-bridge-label">Freight Breakeven</p>
         <p class="pl-bridge-value">${toMoneyDec(breakevenFreightPerBbl)} / bbl</p>
         <p class="pl-bridge-sub">Max freight increase before move becomes unprofitable</p>
       </div>
     </div>`;

  // Before / After plant cards
  const srcOiBefore = calcOiPerBbl(srcRow) * parseNum(srcRow.volume);
  const dstOiBefore = calcOiPerBbl(dstRow) * parseNum(dstRow.volume);

  const srcVolAfter = parseNum(srcRow.volume) - volumeShifted;
  const dstVolAfter = parseNum(dstRow.volume) + volumeShifted;
  const dstConv = parseNum(dstRow.conversionCpu);
  const scaleSavePctAfter = getConversionScaleSavePct(volumeShifted, parseNum(dstRow.volume));
  const dstConvAfter = dstConv * (1 - scaleSavePctAfter);

  // Recalc OI/bbl for dest post-shift with improved conversion
  const dstOiBblAfter = calcOiPerBbl({ ...dstRow, conversionCpu: dstConvAfter, volume: dstVolAfter });
  const srcOiBblAfter = srcVolAfter > 0 ? calcOiPerBbl(srcRow) : 0;
  const dstOiAfter = dstOiBblAfter * dstVolAfter;
  const srcOiAfter = srcOiBblAfter * srcVolAfter;

  document.getElementById("pl-before-after").innerHTML =
    `<h3 class="pl-section-label">Plant-Level Before / After</h3>
     <div class="pl-ba-grid">
       ${renderPlantBACard(srcRow.plant, parseNum(srcRow.volume), srcOiBefore, srcVolAfter, srcOiAfter, "source")}
       ${renderPlantBACard(dstRow.plant, parseNum(dstRow.volume), dstOiBefore, dstVolAfter, dstOiAfter, "dest")}
     </div>`;
}

function renderPlantBACard(plant, volBefore, oiBefore, volAfter, oiAfter, type) {
  const volDelta = volAfter - volBefore;
  const oiDelta = oiAfter - oiBefore;
  const isSource = type === "source";
  return `<div class="pl-ba-card ${isSource ? "pl-ba-source" : "pl-ba-dest"}">
    <p class="pl-ba-plant">${plant} <span class="pl-ba-badge">${isSource ? "Source" : "Destination"}</span></p>
    <div class="pl-ba-row">
      <span class="pl-ba-metric">Volume</span>
      <span class="pl-ba-before">${Math.round(volBefore).toLocaleString()} bbl</span>
      <span class="pl-ba-arrow">→</span>
      <span class="pl-ba-after">${Math.round(Math.max(0, volAfter)).toLocaleString()} bbl</span>
      <span class="pl-ba-delta ${getMetricToneClass(volDelta)}">${volDelta >= 0 ? "+" : ""}${Math.round(volDelta).toLocaleString()}</span>
    </div>
    <div class="pl-ba-row">
      <span class="pl-ba-metric">Total OI</span>
      <span class="pl-ba-before">${toMoney(oiBefore)}</span>
      <span class="pl-ba-arrow">→</span>
      <span class="pl-ba-after">${toMoney(oiAfter)}</span>
      <span class="pl-ba-delta ${getMetricToneClass(oiDelta)}">${toSignedMoney(oiDelta)}</span>
    </div>
  </div>`;
}

// ============================================================
// BINDINGS
// ============================================================

function bindControls() {
  document.getElementById("pl-search").addEventListener("input", e => {
    plState.search = e.target.value;
    renderSkuTable();
  });

  document.getElementById("pl-filter-family").addEventListener("change", e => {
    plState.filterFamily = e.target.value;
    renderSkuTable();
  });

  document.getElementById("pl-filter-package").addEventListener("change", e => {
    plState.filterPackage = e.target.value;
    renderSkuTable();
  });

  document.getElementById("pl-sort").addEventListener("change", e => {
    plState.sort = e.target.value;
    renderSkuTable();
  });

  document.getElementById("pl-reset-filters").addEventListener("click", () => {
    plState.search = "";
    plState.filterFamily = "All";
    plState.filterPackage = "All";
    plState.sort = "spread-desc";
    document.getElementById("pl-search").value = "";
    document.getElementById("pl-filter-family").value = "All";
    document.getElementById("pl-filter-package").value = "All";
    document.getElementById("pl-sort").value = "spread-desc";
    renderSkuTable();
  });

  document.getElementById("pl-back-btn").addEventListener("click", () => {
    document.getElementById("pl-step2").style.display = "none";
    document.getElementById("pl-step3").style.display = "none";
    plState.selectedSkuGroup = null;
  });

  document.getElementById("pl-source-plant").addEventListener("change", () => {
    updateDestOptions();
  });

  document.getElementById("pl-dest-plant").addEventListener("change", e => {
    plState.destPlant = e.target.value;
    updateShiftHint();
  });

  document.getElementById("pl-shift-pct").addEventListener("input", e => {
    plState.shiftPct = parseInt(e.target.value, 10);
    updateShiftHint();
  });

  document.getElementById("pl-run-btn").addEventListener("click", () => {
    runAnalysis();
  });

  document.getElementById("pl-rerun-btn").addEventListener("click", () => {
    document.getElementById("pl-step3").style.display = "none";
    document.getElementById("pl-step2").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// ============================================================
// INIT
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  plState.allSkus = buildMultiPlantSkus();
  populateFamilyFilter();
  populatePackageFilter();
  renderSkuTable();
  bindControls();
});
