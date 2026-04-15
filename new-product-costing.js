const QUESTION_CONFIG = {
  brewing: [
    { id: "newWort", text: "Is this a new wort stream?", defaultYes: true },
    { id: "brewLessKettle", text: "Is the brewing volume less than the plant's brew kettle size?", defaultYes: true },
    { id: "manualIngredient", text: "Are there manual ingredient additions?", defaultYes: false },
    { id: "highGravity", text: "Is this a high gravity beer (<1.5x expansion)?", defaultYes: true },
    { id: "nonCompatFlush", text: "Does it require a non-compatible flush?", defaultYes: true },
    { id: "longFerment", text: "Is the fermenting time longer than the standard fermenting time?", defaultYes: true },
    { id: "displaceProd", text: "Will this displace current production?", defaultYes: true },
    { id: "brewOt", text: "Will this product require more brewing OT?", defaultYes: false }
  ],
  packaging: [
    { id: "newBottle", text: "Is there a new bottle size, shape, material?", defaultYes: false },
    { id: "highUtilLine", text: "Will it be packaged on a highly-utilized line?", defaultYes: true }
  ],
  distribution: [
    { id: "warehouseSpace", text: "Is more warehouse space required (for ingredients, packaging, finished goods)?", defaultYes: true },
    { id: "distOt", text: "Will this product require more Distribution OT?", defaultYes: true }
  ],
  other: [
    { id: "seasonal", text: "Is production seasonal?", defaultYes: true }
  ]
};

const COLS = [
  "brewVol", "brewSqrt", "pkgVol", "pkgSqrt", "distVol", "distSqrt", "otherVol", "otherSqrt",
  "brewMatVol", "pkgMatVol", "freightVol", "marketingVol", "corpVol", "corpSqrt", "corpFixed"
];

const state = {
  data: null,
  byKey: new Map(),
  plantOptions: [],
  familyOptionsByPlant: new Map(),
  selectedPlant: "",
  selectedFamily: "",
  volume: 40000,
  capex: 100000,
  bufferPct: 0,
  answers: {}
};

const els = {};

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value || 0);
}

function num(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function setSelectOptions(selectEl, values) {
  selectEl.innerHTML = "";
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectEl.appendChild(option);
  });
}

function findRange(volume) {
  if (!state.data) return null;
  const v = num(volume);
  return state.data.volumeAdjust.ranges.find((r) => v >= num(r.min) && v <= num(r.max)) || null;
}

function getVolFactor(plant, volume) {
  const range = findRange(volume);
  if (!range) return { rangeLabel: "Outside Range", factor: 0 };
  return {
    rangeLabel: range.label,
    factor: num(range.factors?.[plant])
  };
}

function getCurrentRow() {
  const key = `${state.selectedPlant}-${state.selectedFamily}`;
  return state.byKey.get(key) || null;
}

function buildQuestionUI() {
  const sections = [
    ["brewing", els.brewing],
    ["packaging", els.packaging],
    ["distribution", els.distribution],
    ["other", els.other]
  ];

  sections.forEach(([sectionKey, container]) => {
    container.innerHTML = "";
    QUESTION_CONFIG[sectionKey].forEach((q) => {
      const row = document.createElement("div");
      row.className = "npc-row";
      const label = document.createElement("label");
      label.textContent = q.text;
      label.setAttribute("for", `npc-${q.id}`);
      const select = document.createElement("select");
      select.id = `npc-${q.id}`;
      ["Yes", "No"].forEach((choice) => {
        const option = document.createElement("option");
        option.value = choice;
        option.textContent = choice;
        if ((q.defaultYes && choice === "Yes") || (!q.defaultYes && choice === "No")) {
          option.selected = true;
        }
        select.appendChild(option);
      });
      state.answers[q.id] = q.defaultYes ? "Yes" : "No";
      select.addEventListener("change", () => {
        state.answers[q.id] = select.value;
        render();
      });

      row.appendChild(label);
      row.appendChild(select);
      container.appendChild(row);
    });
  });
}

function updatePlantFamilySelections() {
  const families = state.familyOptionsByPlant.get(state.selectedPlant) || [];
  setSelectOptions(els.family, families);
  if (!families.includes(state.selectedFamily)) {
    state.selectedFamily = families[0] || "";
  }
  els.family.value = state.selectedFamily;
}

function calculate() {
  const row = getCurrentRow();
  if (!row) {
    return {
      material: 0,
      conversion: 0,
      other: 0,
      total: 0,
      selectedKey: "No matching Plant + Brand Family",
      volAdjPct: 0,
      baseRangeLabel: "n/a",
      newRangeLabel: "n/a"
    };
  }

  const baseVolume = num(row.baseProduction);
  const newVolume = num(state.volume);
  const baseVf = getVolFactor(state.selectedPlant, baseVolume);
  const newVf = getVolFactor(state.selectedPlant, newVolume);
  const volAdjFactor = baseVf.factor !== 0 ? ((newVf.factor - baseVf.factor) / baseVf.factor) : 0;

  const byCol = {};
  COLS.forEach((col) => {
    const base = num(row.coeff[col]);
    const volAdj = base * volAdjFactor;
    byCol[col] = {
      base,
      volAdj,
      qAdj: 0,
      bufferAdj: 0,
      total: 0
    };
  });

  const yes = (id) => state.answers[id] === "Yes";

  // Brewing questions — flat $/bbl impacts sized for visible demo swings
  if (yes("newWort"))          byCol.brewSqrt.qAdj  += 14.83;  // major: new wort stream complexity
  if (yes("brewLessKettle"))   byCol.brewVol.qAdj   +=  6.41;  // minor: sub-kettle batch inefficiency
  if (yes("manualIngredient")) byCol.brewVol.qAdj   +=  5.78;  // minor: manual addition labor
  if (yes("highGravity")) {
    byCol.brewVol.qAdj  +=  7.62;  // major: high-gravity process cost
    byCol.brewSqrt.qAdj +=  5.19;  // major: fixed overhead spread
  }
  if (yes("nonCompatFlush")) {
    byCol.otherSqrt.qAdj  +=  6.34;  // major: flush changeover overhead
    byCol.brewMatVol.qAdj +=  5.87;  // major: lost/wasted brew materials
  }
  if (yes("longFerment"))   byCol.otherVol.qAdj   +=  8.23;  // minor: extended tank tie-up
  if (yes("displaceProd"))  byCol.freightVol.qAdj  += 11.76;  // major: rerouting displaced volume
  if (yes("brewOt"))        byCol.brewVol.qAdj     +=  6.55;  // minor: brewing overtime premium

  // Packaging questions
  if (yes("newBottle")) {
    byCol.pkgVol.qAdj    +=  9.48;  // major: new line setup / slower speeds
    byCol.pkgMatVol.qAdj +=  5.31;  // major: new packaging materials premium
    byCol.otherVol.qAdj  +=  3.92;  // major: tooling / qualification costs
  }
  if (yes("highUtilLine")) byCol.pkgVol.qAdj += 12.17;  // major: high-utilization scheduling premium

  // Distribution questions
  if (yes("warehouseSpace")) byCol.otherVol.qAdj +=  5.64;  // minor: incremental warehouse cost
  if (yes("distOt"))         byCol.distVol.qAdj  +=  7.88;  // minor: distribution overtime

  byCol.otherVol.qAdj += newVolume > 0 ? (num(state.capex) / 10 / newVolume) : 0;

  // Other questions
  if (yes("seasonal")) {
    byCol.brewVol.qAdj  += 3.47;  // minor: seasonal ramp labor
    byCol.pkgVol.qAdj   += 2.13;  // minor: seasonal packaging premium
    byCol.distVol.qAdj  += 1.96;  // minor: seasonal distribution premium
  }

  const bufferRate = num(state.bufferPct) / 100;
  COLS.forEach((col) => {
    const adjustable = byCol[col].volAdj + byCol[col].qAdj;
    byCol[col].bufferAdj = bufferRate * adjustable;
    byCol[col].total = byCol[col].base + adjustable + byCol[col].bufferAdj;
  });

  const material = byCol.brewMatVol.total + byCol.pkgMatVol.total;
  const conversion = byCol.brewVol.total + byCol.brewSqrt.total + byCol.pkgVol.total + byCol.pkgSqrt.total + byCol.distVol.total + byCol.distSqrt.total + byCol.otherVol.total + byCol.otherSqrt.total;
  const other = byCol.freightVol.total + byCol.marketingVol.total + byCol.corpVol.total + byCol.corpSqrt.total + byCol.corpFixed.total;
  const total = material + conversion + other;

  return {
    material,
    conversion,
    other,
    total,
    selectedKey: row.key,
    volAdjPct: volAdjFactor * 100,
    baseRangeLabel: baseVf.rangeLabel,
    newRangeLabel: newVf.rangeLabel
  };
}

function render() {
  const result = calculate();
  els.outMaterial.textContent = money(result.material);
  els.outConversion.textContent = money(result.conversion);
  els.outOther.textContent = money(result.other);
  els.outTotal.textContent = money(result.total);
  els.selectedKey.textContent = `Selected baseline: ${result.selectedKey}`;
  els.volAdjust.textContent = `Volume adjust factor: ${result.volAdjPct.toFixed(2)}%`;
  els.volRanges.textContent = `Ranges: base ${result.baseRangeLabel} → new ${result.newRangeLabel}`;
}

function initControls() {
  const plants = Array.from(new Set(state.data.baseCostRows.map((r) => r.plant))).sort((a, b) => a.localeCompare(b));
  state.plantOptions = plants;

  plants.forEach((plant) => {
    const families = Array.from(new Set(state.data.baseCostRows.filter((r) => r.plant === plant).map((r) => r.family))).sort((a, b) => a.localeCompare(b));
    state.familyOptionsByPlant.set(plant, families);
  });

  setSelectOptions(els.plant, plants);
  state.selectedPlant = plants.includes("Golden") ? "Golden" : (plants[0] || "");
  els.plant.value = state.selectedPlant;

  const preferredFamily = "BLUE MOON FAMILY";
  const available = state.familyOptionsByPlant.get(state.selectedPlant) || [];
  state.selectedFamily = available.includes(preferredFamily) ? preferredFamily : (available[0] || "");

  updatePlantFamilySelections();

  els.plant.addEventListener("change", () => {
    state.selectedPlant = els.plant.value;
    updatePlantFamilySelections();
    render();
  });

  els.family.addEventListener("change", () => {
    state.selectedFamily = els.family.value;
    render();
  });

  els.volume.addEventListener("input", () => {
    state.volume = num(els.volume.value);
    render();
  });

  els.capex.addEventListener("input", () => {
    state.capex = num(els.capex.value);
    render();
  });

  els.buffer.addEventListener("input", () => {
    state.bufferPct = num(els.buffer.value);
    render();
  });
}

async function bootstrap() {
  els.plant = document.getElementById("npc-plant");
  els.family = document.getElementById("npc-family");
  els.volume = document.getElementById("npc-volume");
  els.capex = document.getElementById("npc-capex");
  els.buffer = document.getElementById("npc-buffer");

  els.brewing = document.getElementById("npc-brewing");
  els.packaging = document.getElementById("npc-packaging");
  els.distribution = document.getElementById("npc-distribution");
  els.other = document.getElementById("npc-other");

  els.outMaterial = document.getElementById("npc-out-material");
  els.outConversion = document.getElementById("npc-out-conversion");
  els.outOther = document.getElementById("npc-out-other");
  els.outTotal = document.getElementById("npc-out-total");
  els.selectedKey = document.getElementById("npc-selected-key");
  els.volAdjust = document.getElementById("npc-vol-adjust");
  els.volRanges = document.getElementById("npc-vol-ranges");

  const response = await fetch("incoming/new-product-costing-data.json", { cache: "no-store" });
  state.data = await response.json();
  state.data.baseCostRows.forEach((row) => {
    state.byKey.set(row.key, row);
  });

  buildQuestionUI();
  initControls();
  render();
}

bootstrap().catch((err) => {
  // Surface initialization failures in-page for easier debugging.
  const target = document.querySelector(".panel-wide");
  if (target) {
    const pre = document.createElement("pre");
    pre.className = "small";
    pre.textContent = `Failed to initialize model: ${err?.message || err}`;
    target.appendChild(pre);
  }
});
