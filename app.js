const baseData = [
  { period: "2026-Q1", plant: "Denver", family: "Core Lager", sku: "LGR-12OZ-6PK", packaging: "Can", volume: 64000, asp: 9.8, materialCpu: 2.1, laborCpu: 0.78, freightCpu: 0.44, overheadCpu: 1.05, operatingCpu: 0.94 },
  { period: "2026-Q1", plant: "Denver", family: "Core Lager", sku: "LGR-16OZ-4PK", packaging: "Can", volume: 52000, asp: 8.9, materialCpu: 1.95, laborCpu: 0.72, freightCpu: 0.41, overheadCpu: 0.97, operatingCpu: 0.88 },
  { period: "2026-Q1", plant: "Denver", family: "IPA", sku: "IPA-12OZ-6PK", packaging: "Can", volume: 48000, asp: 10.6, materialCpu: 2.44, laborCpu: 0.82, freightCpu: 0.43, overheadCpu: 1.02, operatingCpu: 1.03 },
  { period: "2026-Q1", plant: "Denver", family: "Seasonal", sku: "SNS-12OZ-6PK", packaging: "Can", volume: 22000, asp: 11.9, materialCpu: 2.71, laborCpu: 0.91, freightCpu: 0.46, overheadCpu: 1.11, operatingCpu: 1.12 },
  { period: "2026-Q1", plant: "Asheville", family: "Core Lager", sku: "LGR-12OZ-6PK", packaging: "Bottle", volume: 59000, asp: 9.2, materialCpu: 2.34, laborCpu: 0.83, freightCpu: 0.53, overheadCpu: 1.09, operatingCpu: 0.98 },
  { period: "2026-Q1", plant: "Asheville", family: "IPA", sku: "IPA-12OZ-6PK", packaging: "Bottle", volume: 41000, asp: 10.1, materialCpu: 2.66, laborCpu: 0.87, freightCpu: 0.56, overheadCpu: 1.12, operatingCpu: 1.09 },
  { period: "2026-Q2", plant: "Denver", family: "Core Lager", sku: "LGR-12OZ-6PK", packaging: "Can", volume: 67000, asp: 9.85, materialCpu: 2.14, laborCpu: 0.79, freightCpu: 0.45, overheadCpu: 1.04, operatingCpu: 0.93 },
  { period: "2026-Q2", plant: "Denver", family: "IPA", sku: "IPA-12OZ-6PK", packaging: "Can", volume: 50000, asp: 10.55, materialCpu: 2.46, laborCpu: 0.83, freightCpu: 0.44, overheadCpu: 1.01, operatingCpu: 1.04 },
  { period: "2026-Q2", plant: "Denver", family: "Seasonal", sku: "SNS-12OZ-6PK", packaging: "Can", volume: 26000, asp: 12.35, materialCpu: 2.83, laborCpu: 0.95, freightCpu: 0.38, overheadCpu: 1.15, operatingCpu: 1.18 },
  { period: "2026-Q2", plant: "Asheville", family: "Core Lager", sku: "LGR-12OZ-6PK", packaging: "Bottle", volume: 61000, asp: 9.28, materialCpu: 2.37, laborCpu: 0.84, freightCpu: 0.54, overheadCpu: 1.08, operatingCpu: 1.01 },
  { period: "2026-Q2", plant: "Asheville", family: "IPA", sku: "IPA-12OZ-6PK", packaging: "Bottle", volume: 42500, asp: 10.18, materialCpu: 2.68, laborCpu: 0.88, freightCpu: 0.57, overheadCpu: 1.11, operatingCpu: 1.08 },
  { period: "2026-Q2", plant: "Asheville", family: "Seasonal", sku: "SNS-12OZ-6PK", packaging: "Keg", volume: 15000, asp: 138.0, materialCpu: 41.5, laborCpu: 14.4, freightCpu: 8.9, overheadCpu: 15.0, operatingCpu: 13.2 }
];

const staticCostData = Array.isArray(window.DEMO_COST_DATA) && window.DEMO_COST_DATA.length
  ? window.DEMO_COST_DATA
  : baseData;

const staticDescriptorData = Array.isArray(window.DEMO_DESCRIPTOR_DATA)
  ? window.DEMO_DESCRIPTOR_DATA
  : [];

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
    laborCpu: parseNum(getField(row, ["laborCpu", "labor_cpu", "Labor_CPU", "labor_cost_per_unit"])),
    overheadCpu: parseNum(getField(row, ["overheadCpu", "overhead_cpu", "Overhead_CPU", "overhead_cost_per_unit"])),
    conversionCpu: parseNum(getField(row, ["conversionCpu", "conversion_cpu"])),
    salesAdminCpu: parseNum(getField(row, ["salesAdminCpu", "sales_admin_cpu"])),
    marketingAdminCpu: parseNum(getField(row, ["marketingAdminCpu", "marketing_admin_cpu"])),
    tenthAndBlakeCpu: parseNum(getField(row, ["tenthAndBlakeCpu", "tenth_and_blake_cpu"])),
    integratedSupplyChainCpu: parseNum(getField(row, ["integratedSupplyChainCpu", "integrated_supply_chain_cpu"])),
    bisCpu: parseNum(getField(row, ["bisCpu", "bis_cpu"])),
    acgBrewingCpu: parseNum(getField(row, ["acgBrewingCpu", "acg_brewing_cpu"])),
    paCommCpu: parseNum(getField(row, ["paCommCpu", "pa_comm_cpu"])),
    hrCpu: parseNum(getField(row, ["hrCpu", "hr_cpu"])),
    legalCpu: parseNum(getField(row, ["legalCpu", "legal_cpu"])),
    financeCpu: parseNum(getField(row, ["financeCpu", "finance_cpu"])),
    procurementCpu: parseNum(getField(row, ["procurementCpu", "procurement_cpu"])),
    fostersCpu: parseNum(getField(row, ["fostersCpu", "fosters_cpu"])),
    executiveCpu: parseNum(getField(row, ["executiveCpu", "executive_cpu"])),
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
    smallestPack: cleanCell(getField(row, ["Smallest Pack", "smallest_pack", "smallestPack"], "Unknown")),
    alcoholReportingGroup: cleanCell(getField(row, ["Alcohol Rptng Group", "alcohol_rptng_group", "alcoholReportingGroup"], "Unknown")),
    productionBbl: parseNum(getField(row, ["2012 Production BBL by Plant by OSKU", "production_bbl", "productionBbl"]))
  };
}

const drillOptions = [
  { value: "plant", label: "Plant" },
  { value: "plantDesc", label: "Plant Desc" },
  { value: "family", label: "Product Family" },
  { value: "brand", label: "Brand" },
  { value: "brandFamily", label: "Brand Family" },
  { value: "brandSegment", label: "Brand Segment" },
  { value: "priceSegment", label: "Price Segment" },
  { value: "osku", label: "OSKU" },
  { value: "plantOsku", label: "Plant + OSKU" },
  { value: "orderableSkuDescription", label: "Orderable SKU Description" },
  { value: "sku", label: "SKU" },
  { value: "containerType", label: "Container Type" },
  { value: "containerSize", label: "Container Size" },
  { value: "smallestPack", label: "Smallest Pack" },
  { value: "alcoholReportingGroup", label: "Alcohol Reporting Group" },
  { value: "productionBbl", label: "2012 Production BBL by Plant by OSKU" },
  { value: "packaging", label: "Packaging" }
];

function normalizeKey(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getField(row, aliases, fallback = "") {
  for (const alias of aliases) {
    const exact = row[alias];
    if (exact !== undefined && exact !== null && String(exact).trim() !== "") {
      return exact;
    }
  }

  const keyMap = Object.keys(row).reduce((acc, key) => {
    acc[normalizeKey(key)] = row[key];
    return acc;
  }, {});

  for (const alias of aliases) {
    const value = keyMap[normalizeKey(alias)];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }

  return fallback;
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

const els = {
  filters: {
    plant: document.getElementById("filter-plant"),
    priceSegment: document.getElementById("filter-price-segment"),
    packaging: document.getElementById("filter-packaging")
  },
  comparisonBaseFilters: {
    plant: document.getElementById("base-plant"),
    priceSegment: document.getElementById("base-price-segment"),
    packaging: document.getElementById("base-packaging")
  },
  comparisonFilters: {
    plant: document.getElementById("compare-plant"),
    priceSegment: document.getElementById("compare-price-segment"),
    packaging: document.getElementById("compare-packaging")
  },
  drillDimension: document.getElementById("drill-dimension"),
  drillValue: document.getElementById("drill-value"),
  axisMode: document.getElementById("axis-mode"),
  comparisonBtn: document.getElementById("btn-comparison"),
  comparisonSetup: document.getElementById("comparison-setup"),
  comparisonStatus: document.getElementById("comparison-status"),
  reset: document.getElementById("btn-reset"),
  singleWaterfallPanel: document.getElementById("single-waterfall-panel"),
  comparisonPanel: document.getElementById("comparison-panel"),
  comparisonCurrentWaterfall: document.getElementById("comparison-current-waterfall"),
  comparisonCompareWaterfall: document.getElementById("comparison-compare-waterfall"),
  comparisonCurrentSummary: document.getElementById("comparison-current-summary"),
  comparisonCompareSummary: document.getElementById("comparison-compare-summary"),
  comparisonCurrentTopList: document.getElementById("comparison-current-top-list"),
  comparisonCurrentBottomList: document.getElementById("comparison-current-bottom-list"),
  comparisonCompareTopList: document.getElementById("comparison-compare-top-list"),
  comparisonCompareBottomList: document.getElementById("comparison-compare-bottom-list"),
  skuRankingMetric: document.getElementById("sku-ranking-metric"),
  skuTopList: document.getElementById("sku-top-list"),
  skuBottomList: document.getElementById("sku-bottom-list"),
  skuDetailPanel: document.getElementById("sku-detail-panel"),
  comparisonCurrentSkuDetail: document.getElementById("comparison-current-sku-detail"),
  comparisonCompareSkuDetail: document.getElementById("comparison-compare-sku-detail"),
  waterfallShell: document.querySelector(".waterfall-shell"),
  waterfall: document.getElementById("waterfall"),
  breakdownTitle: document.getElementById("breakdown-title"),
  breakdownSubtitle: document.getElementById("breakdown-subtitle"),
  breakdownEmpty: document.getElementById("breakdown-empty"),
  breakdownContent: document.getElementById("breakdown-content"),
  breakdownChart: document.getElementById("breakdown-chart"),
  breakdownLegend: document.getElementById("breakdown-legend"),
  breakdownClose: document.getElementById("breakdown-close")
};

const state = {
  records: staticCostData.map(normalizeStaticCostRow).map(withDescriptorDefaults),
  descriptorLookup: {},
  filters: {
    plant: "All",
    priceSegment: "All",
    packaging: "All"
  },
  comparisonBaseFilters: {
    plant: "All",
    priceSegment: "All",
    packaging: "All"
  },
  comparisonFilters: {
    plant: "All",
    priceSegment: "All",
    packaging: "All"
  },
  drill: {
    dimension: "plant",
    value: "All"
  },
  axisMode: "dollar",
  comparisonMode: false,
  skuRankingMetric: "revenue",
  skuDetail: {
    sku: null,
    scope: "single"
  },
  breakdown: {
    stepKey: null,
    totals: null,
    expandOther: false
  }
};

if (staticDescriptorData.length) {
  state.descriptorLookup = buildDescriptorLookup(staticDescriptorData.map(normalizeDescriptorRow));
  state.records = applyDescriptorLookup(state.records);
}

let marginChart;
let breakdownChart;

const BREAKDOWN_CLICKABLE_KEYS = ["conversion", "sga"];
const PIE_COLORS = [
  "#45d0a2",
  "#4f9fff",
  "#ffae57",
  "#ff8c7a",
  "#b28cff",
  "#7cd3ff",
  "#c7e76a",
  "#f77fb8",
  "#ffd966",
  "#8bd3c7",
  "#a7b5ff",
  "#d7a86e",
  "#87c38f"
];

const CONVERSION_BUCKETS = [
  { key: "brewingLabor", label: "Brewing Labor" },
  { key: "packagingLabor", label: "Packaging Labor" },
  { key: "distributionLabor", label: "Distribution Labor" },
  { key: "otherLabor", label: "Other Labor" },
  { key: "salariedLabor", label: "Salaried Labor" },
  { key: "utilities", label: "Utilities" },
  { key: "maintenance", label: "Maintenance" },
  { key: "productionSupplies", label: "Production Supplies" },
  { key: "breweryOverhead", label: "Brewery Overhead" },
  { key: "kegDepreciation", label: "Keg Depreciation" },
  { key: "depAmor", label: "Dep/Amor" },
  { key: "waste", label: "Waste" }
];

const SGA_BUCKETS = [
  { key: "salesAdmin", label: "Sales Admin" },
  { key: "marketingAdmin", label: "Marketing Admin" },
  { key: "tenthAndBlake", label: "10th & Blake" },
  { key: "integratedSupplyChain", label: "Integrated Supply Chain" },
  { key: "bis", label: "BIS" },
  { key: "acgBrewing", label: "ACG Brewing" },
  { key: "paComm", label: "PA & Comm" },
  { key: "hr", label: "HR" },
  { key: "legal", label: "Legal" },
  { key: "finance", label: "Finance" },
  { key: "procurement", label: "Procurement" },
  { key: "fosters", label: "Foster's" },
  { key: "executive", label: "Executive" }
];

const SKU_RANKING_METRICS = {
  revenue: {
    label: "Revenue",
    value: (row) => row.revenue || 0,
    format: (value) => toMoney(value || 0),
    className: (value) => getMetricToneClass(value)
  },
  grossMargin: {
    label: "GM $",
    value: (row) => row.grossMargin || 0,
    format: (value) => toSignedMoney(value || 0),
    className: (value) => getMetricToneClass(value)
  },
  gmPct: {
    label: "GM %",
    value: (row) => row.gmPct || 0,
    format: (value) => toSignedPct(value || 0),
    className: (value) => getMetricToneClass(value)
  },
  operatingIncome: {
    label: "Op Margin $",
    value: (row) => row.operatingIncome || 0,
    format: (value) => toSignedMoney(value || 0),
    className: (value) => getMetricToneClass(value)
  },
  omPct: {
    label: "Op Margin %",
    value: (row) => row.omPct || 0,
    format: (value) => toSignedPct(value || 0),
    className: (value) => getMetricToneClass(value)
  }
};

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

function toSignedPct(value) {
  if ((value || 0) < 0) return `-${toPct(Math.abs(value || 0))}`;
  return toPct(value || 0);
}

function toSignedMoney(value) {
  const abs = toMoney(Math.abs(value || 0));
  return value < 0 ? `-${abs}` : abs;
}

function getMetricToneClass(value) {
  if ((value || 0) > 0) return "is-positive";
  if ((value || 0) < 0) return "is-negative";
  return "";
}

function parseNum(value) {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const raw = String(value).trim();
  if (!raw) return 0;
  const normalized = raw
    .replace(/^\((.*)\)$/, "-$1")
    .replace(/[$,%\s,]/g, "");
  return Number(normalized) || 0;
}

function cleanCell(value, fallback = "Unknown") {
  const cleaned = String(value ?? "").replace(/\s+/g, " ").trim();
  return cleaned || fallback;
}

function normalizeImportedRow(row) {
  const normalized = {
    period: cleanCell(getField(row, ["period", "Period", "year", "Year"], "Unknown")),
    plant: cleanCell(getField(row, ["plant", "Plant", "Plant Desc"], "Unknown")),
    family: cleanCell(getField(row, ["family", "product_family", "ProductFamily", "Product_Family", "Brand Family"], "Unknown")),
    sku: cleanCell(getField(row, ["sku", "SKU", "Sku", "OSKU", "Plant + OSKU"], "Unknown")),
    packaging: cleanCell(getField(row, ["packaging", "Packaging", "Container Type"], "Unknown")),
    volume: parseNum(getField(row, ["volume", "Volume", "Adjusted Production Volume", "Actual Production Vol"])),
    asp: parseNum(getField(row, ["asp", "price_per_unit", "avg_selling_price", "ASP", "OSKU per BBL by Plant"])),
    brewMatCpu: parseNum(getField(row, ["brewMatCpu", "brew_mat_cpu", "Brew Mat $/bbl"])),
    pkgMatCpu: parseNum(getField(row, ["pkgMatCpu", "pkg_mat_cpu", "Pkg Mat $/bbl"])),
    freightCpu: parseNum(getField(row, ["freight_cpu", "Freight_CPU", "freight_cost_per_unit"])),
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
    laborCpu: parseNum(getField(row, ["labor_cpu", "Labor_CPU", "labor_cost_per_unit"])),
    overheadCpu: parseNum(getField(row, ["overhead_cpu", "Overhead_CPU", "overhead_cost_per_unit"])),
    conversionCpu: parseNum(getField(row, ["conversionCpu", "conversion_cpu"])),
    salesAdminCpu: parseNum(getField(row, ["salesAdminCpu", "sales_admin_cpu"])),
    marketingAdminCpu: parseNum(getField(row, ["marketingAdminCpu", "marketing_admin_cpu"])),
    tenthAndBlakeCpu: parseNum(getField(row, ["tenthAndBlakeCpu", "tenth_and_blake_cpu"])),
    integratedSupplyChainCpu: parseNum(getField(row, ["integratedSupplyChainCpu", "integrated_supply_chain_cpu"])),
    bisCpu: parseNum(getField(row, ["bisCpu", "bis_cpu"])),
    acgBrewingCpu: parseNum(getField(row, ["acgBrewingCpu", "acg_brewing_cpu"])),
    paCommCpu: parseNum(getField(row, ["paCommCpu", "pa_comm_cpu"])),
    hrCpu: parseNum(getField(row, ["hrCpu", "hr_cpu"])),
    legalCpu: parseNum(getField(row, ["legalCpu", "legal_cpu"])),
    financeCpu: parseNum(getField(row, ["financeCpu", "finance_cpu"])),
    procurementCpu: parseNum(getField(row, ["procurementCpu", "procurement_cpu"])),
    fostersCpu: parseNum(getField(row, ["fostersCpu", "fosters_cpu"])),
    executiveCpu: parseNum(getField(row, ["executiveCpu", "executive_cpu"])),
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
    smallestPack: cleanCell(getField(row, ["Smallest Pack", "smallest_pack", "smallestPack"], "Unknown")),
    alcoholReportingGroup: cleanCell(getField(row, ["Alcohol Rptng Group", "alcohol_rptng_group", "alcoholReportingGroup"], "Unknown")),
    productionBbl: parseNum(getField(row, ["2012 Production BBL by Plant by OSKU", "production_bbl", "productionBbl"]))
  };

  return withDescriptorDefaults(normalized);
}

function normalizeDescriptorRow(row) {
  const descriptor = withDescriptorDefaults({
    period: "Unknown",
    plant: cleanCell(getField(row, ["plant", "Plant", "Plant Desc"], "Unknown")),
    family: cleanCell(getField(row, ["family", "product_family", "ProductFamily", "Product_Family", "Brand Family"], "Unknown")),
    sku: cleanCell(getField(row, ["sku", "SKU", "Sku", "OSKU", "Plant + OSKU"], "Unknown")),
    packaging: cleanCell(getField(row, ["packaging", "Packaging", "Container Type"], "Unknown")),
    channel: cleanCell(getField(row, ["channel", "Channel"], "Unknown")),
    volume: 0,
    asp: 0,
    materialCpu: 0,
    laborCpu: 0,
    freightCpu: 0,
    overheadCpu: 0,
    operatingCpu: 0,
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
    smallestPack: cleanCell(getField(row, ["Smallest Pack", "smallest_pack", "smallestPack"], "Unknown")),
    alcoholReportingGroup: cleanCell(getField(row, ["Alcohol Rptng Group", "alcohol_rptng_group", "alcoholReportingGroup"], "Unknown")),
    productionBbl: parseNum(getField(row, ["2012 Production BBL by Plant by OSKU", "production_bbl", "productionBbl"]))
  });

  return descriptor;
}

function descriptorLookupKeys(row) {
  const keys = [];
  if (row.plantOsku) keys.push(`plantOsku:${normalizeKey(row.plantOsku)}`);
  if (row.osku && row.osku !== "Unknown") keys.push(`osku:${normalizeKey(row.osku)}`);
  if (row.sku && row.sku !== "Unknown") keys.push(`sku:${normalizeKey(row.sku)}`);
  return keys;
}

function looksLikeDescriptorOnlyDataset(rawRows) {
  const sample = (rawRows || []).slice(0, 25);
  if (!sample.length) return false;

  const hasDescriptorSignal = sample.some((row) => {
    const descriptor = normalizeDescriptorRow(row);
    return Boolean(
      descriptor.plantOsku ||
      (descriptor.osku && descriptor.osku !== "Unknown") ||
      (descriptor.orderableSkuDescription && descriptor.orderableSkuDescription !== "Unknown")
    );
  });

  const hasCostSignal = sample.some((row) => {
    const volume = parseNum(getField(row, ["volume", "Volume", "Adjusted Production Volume", "Actual Production Vol"]));
    const asp = parseNum(getField(row, ["asp", "price_per_unit", "avg_selling_price", "ASP", "OSKU per BBL by Plant"]));
    const material = parseNum(getField(row, ["material_cpu", "Material_CPU", "material_cost_per_unit", "Variable Total"]));
    const operating = parseNum(getField(row, ["operating_cpu", "Operating_CPU", "opex_cpu", "opex_cost_per_unit"]));
    return volume > 0 || asp > 0 || material > 0 || operating > 0;
  });

  return hasDescriptorSignal && !hasCostSignal;
}

function hasCostSignal(rawRows) {
  const sample = (rawRows || []).slice(0, 50);
  return sample.some((row) => {
    const volume = parseNum(getField(row, ["volume", "Volume", "Adjusted Production Volume", "Actual Production Vol"]));
    const asp = parseNum(getField(row, ["asp", "price_per_unit", "avg_selling_price", "ASP", "OSKU per BBL by Plant"]));
    const material = parseNum(getField(row, ["material_cpu", "Material_CPU", "material_cost_per_unit", "Variable Total"]));
    const operating = parseNum(getField(row, ["operating_cpu", "Operating_CPU", "opex_cpu", "opex_cost_per_unit"]));
    return volume > 0 || asp > 0 || material > 0 || operating > 0;
  });
}

function descriptorSignalScore(rawRows) {
  const sample = (rawRows || []).slice(0, 50);
  return sample.reduce((score, row) => {
    const descriptor = normalizeDescriptorRow(row);
    if (descriptor.plantOsku) score += 2;
    if (descriptor.osku && descriptor.osku !== "Unknown") score += 1;
    if (descriptor.orderableSkuDescription && descriptor.orderableSkuDescription !== "Unknown") score += 1;
    return score;
  }, 0);
}

function worksheetToRowsAutoHeader(worksheet) {
  const matrix = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
    raw: false,
    blankrows: false
  });

  if (!matrix.length) return [];

  const maxScan = Math.min(matrix.length, 80);
  let bestHeaderIndex = 0;
  let bestScore = -1;

  for (let i = 0; i < maxScan; i += 1) {
    const row = Array.isArray(matrix[i]) ? matrix[i] : [];
    const values = row.map((cell) => String(cell ?? "").trim());
    const nonEmpty = values.filter(Boolean).length;
    if (!nonEmpty) continue;

    const normalized = values.map((value) => normalizeKey(value));
    const hasCostMarkers = normalized.some((key) => ["volume", "adjustedproductionvolume", "asp", "oskupbblbyplant", "variabletotal"].includes(key));
    const hasDescriptorMarkers = normalized.some((key) => ["plantdesc", "osku", "plantosku", "orderableskudescription"].includes(key));
    const score = nonEmpty + (hasCostMarkers ? 20 : 0) + (hasDescriptorMarkers ? 8 : 0);

    if (score > bestScore) {
      bestScore = score;
      bestHeaderIndex = i;
    }
  }

  const headerRow = Array.isArray(matrix[bestHeaderIndex]) ? matrix[bestHeaderIndex] : [];
  const seen = {};
  const headers = headerRow.map((cell, index) => {
    const base = String(cell ?? "").trim() || `Column ${index + 1}`;
    const count = (seen[base] || 0) + 1;
    seen[base] = count;
    return count === 1 ? base : `${base} (${count})`;
  });

  const rows = [];
  for (let r = bestHeaderIndex + 1; r < matrix.length; r += 1) {
    const values = Array.isArray(matrix[r]) ? matrix[r] : [];
    const obj = {};
    let hasAnyValue = false;

    for (let c = 0; c < headers.length; c += 1) {
      const value = values[c] ?? "";
      if (String(value).trim() !== "") hasAnyValue = true;
      obj[headers[c]] = value;
    }

    if (hasAnyValue) rows.push(obj);
  }

  return rows;
}

function pickWorksheet(workbook, mode) {
  const candidates = workbook.SheetNames.map((name) => {
    const worksheet = workbook.Sheets[name];
    const rows = worksheetToRowsAutoHeader(worksheet);
    return {
      name,
      rows,
      costSignal: hasCostSignal(rows),
      descriptorOnly: looksLikeDescriptorOnlyDataset(rows),
      descriptorScore: descriptorSignalScore(rows)
    };
  });

  if (!candidates.length) return null;

  if (mode === "cost") {
    const bestCost = candidates.find((sheet) => sheet.costSignal && !sheet.descriptorOnly)
      || candidates.find((sheet) => sheet.costSignal)
      || candidates.find((sheet) => !sheet.descriptorOnly)
      || candidates[0];
    return bestCost;
  }

  const bestDescriptor = candidates
    .filter((sheet) => sheet.descriptorOnly || sheet.descriptorScore > 0)
    .sort((a, b) => b.descriptorScore - a.descriptorScore)[0]
    || candidates[0];

  return bestDescriptor;
}

function buildDescriptorLookup(descriptorRows) {
  return descriptorRows.reduce((acc, descriptor) => {
    descriptorLookupKeys(descriptor).forEach((key) => {
      acc[key] = descriptor;
    });
    return acc;
  }, {});
}

function applyDescriptorLookup(records) {
  const hasLookup = Object.keys(state.descriptorLookup).length > 0;
  if (!hasLookup) {
    return records.map(withDescriptorDefaults);
  }

  return records.map((rawRow) => {
    const row = withDescriptorDefaults(rawRow);
    const keys = descriptorLookupKeys(row);
    const match = keys.map((key) => state.descriptorLookup[key]).find(Boolean);
    if (!match) return row;

    return withDescriptorDefaults({
      ...row,
      plantDesc: match.plantDesc || row.plantDesc,
      osku: match.osku || row.osku,
      plantOsku: match.plantOsku || row.plantOsku,
      orderableSkuDescription: match.orderableSkuDescription || row.orderableSkuDescription,
      priceSegment: match.priceSegment || row.priceSegment,
      brand: match.brand || row.brand,
      brandFamily: match.brandFamily || row.brandFamily,
      brandSegment: match.brandSegment || row.brandSegment,
      containerType: match.containerType || row.containerType,
      containerSize: match.containerSize || row.containerSize,
      smallestPack: match.smallestPack || row.smallestPack,
      alcoholReportingGroup: match.alcoholReportingGroup || row.alcoholReportingGroup,
      productionBbl: match.productionBbl || row.productionBbl
    });
  });
}

function computeRow(row) {
  const brewMat = row.brewMatCpu || 0;
  const pkgMat = row.pkgMatCpu || 0;
  const conversion = row.conversionCpu || 0;
  const unitCogs = brewMat + pkgMat + conversion;
  
  const revenue = row.volume * row.asp;
  const cogs = row.volume * unitCogs;
  const grossMargin = revenue - cogs;
  
  const freight = row.freightCpu || 0;
  const marketing = row.marketingCpu || 0;
  const sga = row.sgaCpu || 0;

  const conversionBuckets = {
    brewingLabor: (row.brewingLaborCpu || 0) * row.volume,
    packagingLabor: (row.packagingLaborCpu || 0) * row.volume,
    distributionLabor: (row.distributionLaborCpu || 0) * row.volume,
    otherLabor: (row.otherLaborCpu || 0) * row.volume,
    salariedLabor: (row.salariedLaborCpu || 0) * row.volume,
    utilities: (row.utilitiesCpu || 0) * row.volume,
    maintenance: (row.maintenanceCpu || 0) * row.volume,
    productionSupplies: (row.productionSuppliesCpu || 0) * row.volume,
    breweryOverhead: (row.breweryOverheadCpu || 0) * row.volume,
    kegDepreciation: (row.kegDepreciationCpu || 0) * row.volume,
    depAmor: (row.depAmorCpu || 0) * row.volume,
    waste: (row.wasteCpu || 0) * row.volume
  };

  const sgaBuckets = {
    salesAdmin: (row.salesAdminCpu || 0) * row.volume,
    marketingAdmin: (row.marketingAdminCpu || 0) * row.volume,
    tenthAndBlake: (row.tenthAndBlakeCpu || 0) * row.volume,
    integratedSupplyChain: (row.integratedSupplyChainCpu || 0) * row.volume,
    bis: (row.bisCpu || 0) * row.volume,
    acgBrewing: (row.acgBrewingCpu || 0) * row.volume,
    paComm: (row.paCommCpu || 0) * row.volume,
    hr: (row.hrCpu || 0) * row.volume,
    legal: (row.legalCpu || 0) * row.volume,
    finance: (row.financeCpu || 0) * row.volume,
    procurement: (row.procurementCpu || 0) * row.volume,
    fosters: (row.fostersCpu || 0) * row.volume,
    executive: (row.executiveCpu || 0) * row.volume
  };

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
    sgaTotal: sga * row.volume,
    conversionBuckets,
    sgaBuckets
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
    acc.brewMat += row.brewMatTotal || 0;
    acc.pkgMat += row.pkgMatTotal || 0;
    acc.conversion += row.conversionTotal || 0;
    acc.freight += row.freightTotal || 0;
    acc.marketing += row.marketingTotal || 0;
    acc.sga += row.sgaTotal || 0;
    return acc;
  }, {
    volume: 0,
    revenue: 0,
    cogs: 0,
    grossMargin: 0,
    operatingExpense: 0,
    operatingIncome: 0,
    brewMat: 0,
    pkgMat: 0,
    conversion: 0,
    freight: 0,
    marketing: 0,
    sga: 0,
    conversionBuckets: {},
    sgaBuckets: {}
  });

  rows.forEach((row) => {
    Object.entries(row.conversionBuckets || {}).forEach(([key, value]) => {
      totals.conversionBuckets[key] = (totals.conversionBuckets[key] || 0) + (value || 0);
    });

    Object.entries(row.sgaBuckets || {}).forEach(([key, value]) => {
      totals.sgaBuckets[key] = (totals.sgaBuckets[key] || 0) + (value || 0);
    });
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

function applyFilters(records, filters) {
  return records.filter((row) => Object.entries(filters).every(([key, value]) => value === "All" || String(row[key]) === value));
}

function applyBaseFilters(records) {
  return applyFilters(records, state.filters);
}

function getBaseFilteredRows() {
  return applyBaseFilters(state.records).map(computeRow);
}

function getFocusedRows(rows) {
  if (state.drill.value === "All") return rows;
  return rows.filter((row) => row[state.drill.dimension] === state.drill.value);
}

function updateFilterOptions() {
  Object.entries(els.filters).forEach(([key, element]) => {
    fillSelect(element, uniqueValues(state.records, key));
    element.value = state.filters[key];
  });
}

function updateComparisonFilterOptions() {
  Object.entries(els.comparisonBaseFilters).forEach(([key, element]) => {
    if (!element) return;
    fillSelect(element, uniqueValues(state.records, key));
    element.value = state.comparisonBaseFilters[key];
  });

  Object.entries(els.comparisonFilters).forEach(([key, element]) => {
    if (!element) return;
    fillSelect(element, uniqueValues(state.records, key));
    element.value = state.comparisonFilters[key];
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

  if (els.axisMode) {
    els.axisMode.value = state.axisMode;
    els.axisMode.addEventListener("change", () => {
      state.axisMode = els.axisMode.value;
      render();
    });
  }

  if (els.skuRankingMetric) {
    els.skuRankingMetric.value = state.skuRankingMetric;
    els.skuRankingMetric.addEventListener("change", () => {
      state.skuRankingMetric = els.skuRankingMetric.value;
      render();
    });
  }
}

function bindComparisonFilterEvents() {
  Object.entries(els.comparisonBaseFilters).forEach(([key, element]) => {
    if (!element) return;
    element.addEventListener("change", () => {
      state.comparisonBaseFilters[key] = element.value;
      render();
    });
  });

  Object.entries(els.comparisonFilters).forEach(([key, element]) => {
    if (!element) return;
    element.addEventListener("change", () => {
      state.comparisonFilters[key] = element.value;
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

    Object.keys(state.comparisonFilters).forEach((key) => {
      state.comparisonFilters[key] = "All";
      if (els.comparisonFilters[key]) els.comparisonFilters[key].value = "All";
    });

    Object.keys(state.comparisonBaseFilters).forEach((key) => {
      state.comparisonBaseFilters[key] = "All";
      if (els.comparisonBaseFilters[key]) els.comparisonBaseFilters[key].value = "All";
    });

    state.drill.dimension = "plant";
    state.drill.value = "All";
    els.drillDimension.value = "plant";
    state.axisMode = "dollar";
    if (els.axisMode) els.axisMode.value = "dollar";
    state.comparisonMode = false;
    state.breakdown.stepKey = null;
    state.breakdown.expandOther = false;
    if (els.comparisonBtn) els.comparisonBtn.textContent = "Enter Comparison";
    if (els.comparisonSetup) els.comparisonSetup.classList.add("is-hidden");
    if (els.comparisonStatus) els.comparisonStatus.textContent = "Comparison mode is on. Choose a comparison case below.";

    updateDrillValueOptions();
    render();
  });
}

function bindComparisonButton() {
  if (!els.comparisonBtn) return;

  els.comparisonBtn.addEventListener("click", () => {
    state.comparisonMode = !state.comparisonMode;
    state.breakdown.stepKey = null;
    state.breakdown.expandOther = false;
    if (state.comparisonMode) {
      state.comparisonBaseFilters = { ...state.filters };
      Object.entries(els.comparisonBaseFilters).forEach(([key, element]) => {
        if (element) element.value = state.comparisonBaseFilters[key];
      });
    }
    els.comparisonBtn.textContent = state.comparisonMode ? "Exit Comparison" : "Enter Comparison";
    if (els.comparisonSetup) {
      els.comparisonSetup.classList.toggle("is-hidden", !state.comparisonMode);
    }

    if (els.comparisonStatus) {
      els.comparisonStatus.textContent = state.comparisonMode
        ? "Comparison mode is on. Choose a comparison case below."
        : "";
    }

    render();
  });
}

function bindBreakdownEvents() {
  if (!els.breakdownClose) return;
  els.breakdownClose.addEventListener("click", () => {
    state.breakdown.stepKey = null;
    state.breakdown.expandOther = false;
    render();
  });
}

function bindSkuDetailDismiss() {
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !state.skuDetail.sku) return;
    state.skuDetail.sku = null;
    render();
  });
}

function getBreakdownEntries(stepKey, totals) {
  if (stepKey === "conversion") {
    const entries = CONVERSION_BUCKETS
      .map((bucket) => ({ label: bucket.label, value: totals.conversionBuckets?.[bucket.key] || 0 }))
      .filter((entry) => Math.abs(entry.value) > 0.0001);

    if (entries.length) return entries;

    return [
      { label: "Labor", value: (totals.conversion || 0) * 0.5 },
      { label: "Overhead", value: (totals.conversion || 0) * 0.5 }
    ];
  }

  if (stepKey === "sga") {
    const entries = SGA_BUCKETS
      .map((bucket) => ({ label: bucket.label, value: totals.sgaBuckets?.[bucket.key] || 0 }))
      .filter((entry) => Math.abs(entry.value) > 0.0001);

    if (entries.length) return entries;

    return [{ label: "SG&A", value: totals.sga || 0 }];
  }

  return [];
}

function renderBreakdownPanel(totals) {
  if (!els.breakdownTitle || !els.breakdownSubtitle || !els.breakdownEmpty || !els.breakdownContent || !els.breakdownLegend || !els.breakdownChart) {
    return;
  }

  const stepKey = state.breakdown.stepKey;
  if (!stepKey) {
    els.waterfallShell?.classList.remove("has-breakdown");
    els.breakdownTitle.textContent = "Breakdown";
    els.breakdownSubtitle.textContent = "Click Conversion Costs or SG&A in the waterfall to see breakdown details.";
    els.breakdownEmpty.classList.remove("is-hidden");
    els.breakdownContent.classList.add("is-hidden");
    if (breakdownChart) {
      breakdownChart.destroy();
      breakdownChart = null;
    }
    return;
  }

  const clickedLabel = stepKey === "conversion" ? "Conversion Costs" : "SG&A";
  const clickedTotal = stepKey === "conversion" ? (totals.conversion || 0) : (totals.sga || 0);
  const allEntries = getBreakdownEntries(stepKey, totals)
    .filter((entry) => entry.value > 0)
    .sort((a, b) => b.value - a.value);

  let entries = [...allEntries];
  let hasOther = false;
  let hiddenEntries = [];
  let otherTotal = 0;

  const maxLegendItems = 8;
  if (allEntries.length > maxLegendItems) {
    const visible = allEntries.slice(0, maxLegendItems - 1);
    hiddenEntries = allEntries.slice(maxLegendItems - 1);
    otherTotal = hiddenEntries.reduce((sum, entry) => sum + entry.value, 0);
    hasOther = hiddenEntries.length > 0;

    if (state.breakdown.expandOther && hasOther) {
      entries = [
        ...visible,
        { label: "Other (click to collapse)", value: otherTotal, isOtherToggle: true },
        ...hiddenEntries.map((entry) => ({ ...entry, fromOther: true }))
      ];
    } else {
      entries = [...visible, { label: "Other (click to expand)", value: otherTotal, isOtherToggle: true }];
    }
  } else {
    state.breakdown.expandOther = false;
  }

  els.waterfallShell?.classList.add("has-breakdown");
  els.breakdownTitle.textContent = `${clickedLabel} Breakdown`;
  els.breakdownSubtitle.textContent = `${toMoney(clickedTotal)} total`;
  els.breakdownEmpty.classList.add("is-hidden");
  els.breakdownContent.classList.remove("is-hidden");

  const labels = entries.map((entry) => entry.label);
  const data = entries.map((entry) => entry.value);
  const colors = entries.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]);

  if (breakdownChart) breakdownChart.destroy();
  breakdownChart = new Chart(els.breakdownChart, {
    type: "pie",
    data: {
      labels,
      datasets: [{ data, backgroundColor: colors, borderColor: "#0f1a2d", borderWidth: 1 }]
    },
    options: {
      plugins: { legend: { display: false } }
    }
  });

  els.breakdownLegend.innerHTML = entries.map((entry, index) => {
    const pctOfClicked = clickedTotal ? entry.value / clickedTotal : 0;
    const isOtherToggle = Boolean(entry.isOtherToggle && hasOther);
    return `
      <div class="breakdown-item${entry.fromOther ? " breakdown-item-other" : ""}${isOtherToggle ? " breakdown-item-toggle" : ""}" ${isOtherToggle ? "data-other-toggle=\"true\"" : ""}>
        <span class="breakdown-dot" style="background:${colors[index]}"></span>
        <div class="breakdown-text">
          <div class="breakdown-name">${entry.label}</div>
          <div class="breakdown-metrics">${toMoney(entry.value)} (${toPct(pctOfClicked)})</div>
        </div>
      </div>
    `;
  }).join("");

  if (hasOther) {
    els.breakdownLegend.querySelectorAll("[data-other-toggle='true']").forEach((node) => {
      node.addEventListener("click", () => {
        state.breakdown.expandOther = !state.breakdown.expandOther;
        render();
      });
    });
  }
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
      <td>${row.orderableSkuDescription}</td>
      <td>${row.brand}</td>
      <td>${row.family}</td>
      <td>${row.priceSegment}</td>
      <td>${row.plant}</td>
      <td>${row.packaging}</td>
      <td>${row.containerSize}</td>
      <td>${row.smallestPack}</td>
      <td>${row.volume.toLocaleString()}</td>
      <td>${toMoney(row.revenue)}</td>
      <td>${toMoney(row.cogs)}</td>
      <td>${toMoney(row.operatingExpense)}</td>
      <td>${toPct(row.gmPct)}</td>
      <td>${toPct(row.omPct)}</td>
    </tr>
  `).join("");
}

function getWaterfallPlotSteps(totals) {
  const steps = buildWaterfallSteps(totals);
  const revenue = totals.revenue || 0;
  const percentMode = state.axisMode === "percent";
  const asMetric = (value) => {
    if (!percentMode) return value || 0;
    if (!revenue) return 0;
    return (value || 0) / revenue;
  };

  const plotSteps = [];
  let cumulative = 0;

  steps.forEach((step) => {
    if (step.kind === "base") {
      cumulative = step.value || 0;
      plotSteps.push({
        ...step,
        before: 0,
        after: cumulative,
        beforeMetric: asMetric(0),
        afterMetric: asMetric(cumulative),
        delta: cumulative,
        displayValue: cumulative,
        pct: revenue ? cumulative / revenue : 0
      });
      return;
    }

    if (step.kind === "cost") {
      const delta = -Math.abs(step.value || 0);
      const before = cumulative;
      const after = before + delta;
      cumulative = after;
      plotSteps.push({
        ...step,
        before,
        after,
        beforeMetric: asMetric(before),
        afterMetric: asMetric(after),
        delta,
        displayValue: delta,
        pct: revenue ? delta / revenue : 0
      });
      return;
    }

    plotSteps.push({
      ...step,
      before: cumulative,
      after: cumulative,
      beforeMetric: asMetric(cumulative),
      afterMetric: asMetric(cumulative),
      delta: 0,
      displayValue: cumulative,
      pct: revenue ? cumulative / revenue : 0
    });
  });

  return { plotSteps, revenue, percentMode };
}

function getWaterfallScaleBounds(groups) {
  const values = groups.flatMap((group) => group.plotSteps.flatMap((step) => [step.beforeMetric, step.afterMetric, 0]));
  return {
    maxVal: Math.max(...values, 1),
    minVal: Math.min(...values, 0)
  };
}

function renderWaterfall(target, totals, options = {}) {
  if (!target) return;

  const { plotSteps, percentMode } = getWaterfallPlotSteps(totals);
  const scaleBounds = options.scaleBounds || getWaterfallScaleBounds([{ plotSteps }]);
  const interactive = Boolean(options.interactive);
  const activeStepKey = options.activeStepKey || null;

  const { maxVal, minVal } = scaleBounds;

  const width = 1100;
  const height = 360;
  const margin = { top: 42, right: 18, bottom: 76, left: 88 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const count = Math.max(plotSteps.length, 1);
  const slot = plotW / count;
  const barW = Math.min(68, slot * 0.62);

  const y = (value) => {
    if (maxVal === minVal) return margin.top + plotH / 2;
    return margin.top + ((maxVal - value) / (maxVal - minVal)) * plotH;
  };

  const zeroY = y(0);

  const tickValues = [maxVal, (maxVal + minVal) / 2, 0].filter((v, i, arr) => arr.findIndex((x) => Math.abs(x - v) < 0.0001) === i);
  const grid = tickValues.map((tick) => {
    const yTick = y(tick);
    const axisLabel = percentMode ? toPct(tick) : toMoney(tick);
    return `
      <line class="wf-grid" x1="${margin.left}" y1="${yTick.toFixed(2)}" x2="${(width - margin.right).toFixed(2)}" y2="${yTick.toFixed(2)}" />
      <text class="wf-axis" x="${(margin.left - 10).toFixed(2)}" y="${(yTick + 4).toFixed(2)}" text-anchor="end">${axisLabel}</text>
    `;
  }).join("");

  const bars = plotSteps.map((step, index) => {
    const cx = margin.left + (index + 0.5) * slot;
    const x = cx - barW / 2;

    const barFrom = step.kind === "cost" ? step.beforeMetric : 0;
    const barTo = step.afterMetric;
    const y1 = y(barFrom);
    const y2 = y(barTo);
    const rectY = Math.min(y1, y2);
    const rectH = Math.max(2, Math.abs(y2 - y1));
    const cls = `wf-bar wf-${step.kind}`;

    const displayMetric = percentMode ? step.pct : step.displayValue;
    const valueLabel = percentMode ? toSignedPct(displayMetric) : toSignedMoney(displayMetric);

    const labelLines = splitWaterfallLabel(step.label);
    const valueY = margin.top - 16;
    const pctY = margin.top - 2;
    const labelBaseY = margin.top + plotH + 14;

    const isClickable = interactive && BREAKDOWN_CLICKABLE_KEYS.includes(step.key);
    const isActive = interactive && activeStepKey === step.key;

    const detailLine1Y = Math.min(height - 20, rectY + rectH + 10);
    const detailLine2Y = Math.min(height - 8, detailLine1Y + 11);

    return `
      <g>
        <rect class="${cls}${isClickable ? " wf-clickable" : ""}${isActive ? " wf-active" : ""}" data-step-key="${step.key || ""}" x="${x.toFixed(2)}" y="${rectY.toFixed(2)}" width="${barW.toFixed(2)}" height="${rectH.toFixed(2)}" rx="5" ${isClickable ? 'title="Click for breakdown"' : ""} />
        <text class="wf-value" x="${cx.toFixed(2)}" y="${valueY.toFixed(2)}" text-anchor="middle">${valueLabel}</text>
        <text class="wf-pct" x="${cx.toFixed(2)}" y="${pctY.toFixed(2)}" text-anchor="middle">(${toPct(step.pct)})</text>
        ${labelLines.map((line, i) => `<text class="wf-label" x="${cx.toFixed(2)}" y="${(labelBaseY + (i * 13)).toFixed(2)}" text-anchor="middle">${line}</text>`).join("")}
        ${isClickable ? `<g class="wf-clickable-label" data-step-key="${step.key}"><text class="wf-detail-tag" x="${cx.toFixed(2)}" y="${detailLine1Y.toFixed(2)}" text-anchor="middle">click for detailed</text><text class="wf-detail-tag" x="${cx.toFixed(2)}" y="${detailLine2Y.toFixed(2)}" text-anchor="middle">breakdown</text></g>` : ""}
      </g>
    `;
  }).join("");

  const connectors = plotSteps.slice(0, -1).map((step, index) => {
    const next = plotSteps[index + 1];
    if (!next || next.kind !== "cost") return "";

    const x1 = margin.left + (index + 0.5) * slot + barW / 2;
    const x2 = margin.left + (index + 1.5) * slot - barW / 2;
    const yLine = y(step.afterMetric);
    return `<line class="wf-connector" x1="${x1.toFixed(2)}" y1="${yLine.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${yLine.toFixed(2)}" />`;
  }).join("");

  target.innerHTML = `
    <svg class="wf-chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Revenue to Operating Income waterfall chart">
      ${grid}
      <line class="wf-zero" x1="${margin.left}" y1="${zeroY.toFixed(2)}" x2="${(width - margin.right).toFixed(2)}" y2="${zeroY.toFixed(2)}" />
      ${connectors}
      ${bars}
    </svg>
  `;

  if (!interactive) return;

  target.querySelectorAll("[data-step-key]").forEach((node) => {
    node.addEventListener("click", () => {
      const stepKey = node.getAttribute("data-step-key");
      if (!BREAKDOWN_CLICKABLE_KEYS.includes(stepKey)) return;
      const changedStep = state.breakdown.stepKey !== stepKey;
      state.breakdown.stepKey = stepKey;
      if (changedStep) state.breakdown.expandOther = false;
      render();
    });
  });
}

function renderOverallWaterfall(totals) {
  renderWaterfall(els.waterfall, totals, {
    interactive: true,
    activeStepKey: state.breakdown.stepKey
  });
}

function summarizeFilters(filters) {
  const labels = {
    plant: "Plant",
    priceSegment: "Price Segment",
    packaging: "Packaging"
  };

  const parts = Object.entries(filters)
    .filter(([, value]) => value !== "All")
    .map(([key, value]) => `${labels[key]}: ${value}`);

  return parts.length ? parts.join(" | ") : "All products";
}

function renderComparisonMode(primaryTotals, comparisonTotals) {
  els.singleWaterfallPanel?.classList.add("is-hidden");
  els.comparisonPanel?.classList.remove("is-hidden");
  document.getElementById("sku-ranking-panel")?.classList.add("is-hidden");

  if (els.comparisonCurrentSummary) {
    const drillPart = state.drill.value !== "All"
      ? ` | ${state.drill.dimension}: ${state.drill.value}`
      : "";
    els.comparisonCurrentSummary.textContent = `${summarizeFilters(state.comparisonBaseFilters)}${drillPart}`;
  }

  if (els.comparisonCompareSummary) {
    els.comparisonCompareSummary.textContent = summarizeFilters(state.comparisonFilters);
  }

  const primaryGroup = getWaterfallPlotSteps(primaryTotals);
  const comparisonGroup = getWaterfallPlotSteps(comparisonTotals);
  const scaleBounds = getWaterfallScaleBounds([primaryGroup, comparisonGroup]);

  renderWaterfall(els.comparisonCurrentWaterfall, primaryTotals, { scaleBounds });
  renderWaterfall(els.comparisonCompareWaterfall, comparisonTotals, { scaleBounds });
}

function renderSingleMode(totals) {
  els.singleWaterfallPanel?.classList.remove("is-hidden");
  els.comparisonPanel?.classList.add("is-hidden");
  document.getElementById("sku-ranking-panel")?.classList.remove("is-hidden");
  renderOverallWaterfall(totals);
}

function aggregateSkuRows(rows) {
  const skuMap = rows.reduce((acc, row) => {
    const key = row.sku || "Unknown";
    if (!acc[key]) {
      acc[key] = {
        sku: key,
        description: row.orderableSkuDescription || key,
        revenue: 0,
        grossMargin: 0,
        operatingIncome: 0,
        volume: 0
      };
    }

    acc[key].revenue += row.revenue || 0;
    acc[key].grossMargin += row.grossMargin || 0;
    acc[key].operatingIncome += row.operatingIncome || 0;
    acc[key].volume += row.volume || 0;

    if ((!acc[key].description || acc[key].description === key) && row.orderableSkuDescription) {
      acc[key].description = row.orderableSkuDescription;
    }

    return acc;
  }, {});

  return Object.values(skuMap).map((row) => ({
    ...row,
    gmPct: row.revenue ? row.grossMargin / row.revenue : 0,
    omPct: row.revenue ? row.operatingIncome / row.revenue : 0
  }));
}

function getSkuDetailTotals(rows, sku) {
  const matchedRows = rows.filter((row) => row.sku === sku);
  if (!matchedRows.length) return null;

  const totals = aggregate(matchedRows);
  const description = matchedRows.find((row) => row.orderableSkuDescription)?.orderableSkuDescription || sku;

  return {
    sku,
    description,
    revenue: totals.revenue || 0,
    brewMat: totals.brewMat || 0,
    pkgMat: totals.pkgMat || 0,
    conversion: totals.conversion || 0,
    grossMargin: totals.grossMargin || 0,
    freight: totals.freight || 0,
    marketing: totals.marketing || 0,
    sga: totals.sga || 0,
    operatingIncome: totals.operatingIncome || 0,
    gmPct: totals.gmPct || 0,
    omPct: totals.omPct || 0
  };
}

function renderSkuDetailPanel(target, rows, scope) {
  if (!target) return;

  const activeSku = state.skuDetail.scope === scope ? state.skuDetail.sku : null;
  if (!activeSku) {
    target.innerHTML = "";
    return;
  }

  const detail = getSkuDetailTotals(rows, activeSku);
  if (!detail) {
    target.innerHTML = "";
    return;
  }

  const lines = [
    ["Revenue", toMoney(detail.revenue), "base"],
    ["Brewing Materials", toSignedMoney(-Math.abs(detail.brewMat)), "cost"],
    ["Packaging Materials", toSignedMoney(-Math.abs(detail.pkgMat)), "cost"],
    ["Conversion Costs", toSignedMoney(-Math.abs(detail.conversion)), "cost"],
    ["Gross Margin", `${toSignedMoney(detail.grossMargin)} (${toPct(detail.gmPct)})`, "subtotal"],
    ["Distribution / Freight", toSignedMoney(-Math.abs(detail.freight)), "cost"],
    ["Marketing", toSignedMoney(-Math.abs(detail.marketing)), "cost"],
    ["SG&A", toSignedMoney(-Math.abs(detail.sga)), "cost"],
    ["Operating Income", `${toSignedMoney(detail.operatingIncome)} (${toPct(detail.omPct)})`, "final"]
  ];

  target.innerHTML = `
    <div class="sku-detail-shell">
      <div class="sku-detail-head">
        <div>
          <h4>${detail.sku}</h4>
          <p>${detail.description}</p>
        </div>
        <button class="ghost sku-detail-close" type="button" data-sku-detail-close="${scope}">Close</button>
      </div>
      <div class="sku-detail-list">
        ${lines.map(([label, value, type]) => `
          <div class="sku-detail-row sku-detail-row-${type}">
            <span>${label}</span>
            <strong>${value}</strong>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  target.querySelectorAll("[data-sku-detail-close]").forEach((closeNode) => {
    closeNode.addEventListener("click", () => {
      state.skuDetail.sku = null;
      state.skuDetail.scope = scope;
      render();
    });
  });
}

function getRankedSkuRows(rows) {
  const metric = SKU_RANKING_METRICS[state.skuRankingMetric] || SKU_RANKING_METRICS.revenue;
  const aggregatedRows = aggregateSkuRows(rows)
    .filter((row) => Number.isFinite(metric.value(row)))
    .sort((a, b) => {
      const metricDiff = metric.value(b) - metric.value(a);
      if (Math.abs(metricDiff) > 0.0001) return metricDiff;
      const revenueDiff = (b.revenue || 0) - (a.revenue || 0);
      if (Math.abs(revenueDiff) > 0.0001) return revenueDiff;
      return String(a.sku).localeCompare(String(b.sku));
    });

  return {
    metric,
    top: aggregatedRows.slice(0, 10),
    bottom: [...aggregatedRows].reverse().slice(0, 10)
  };
}

function renderSkuRankingTable(target, rows, metric) {
  if (!target) return;

  if (!rows.length) {
    target.innerHTML = '<div class="sku-ranking-empty">No SKUs available for current filters.</div>';
    return;
  }

  target.innerHTML = `
    <table class="sku-ranking-table">
      <thead>
        <tr>
          <th>SKU</th>
          <th>Description</th>
          <th>${metric.label}</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map((row) => {
          const metricValue = metric.value(row);
          const toneClass = metric.className(metricValue);
          const isActive = state.skuDetail.sku === row.sku;
          return `
            <tr class="${isActive ? "sku-row-active" : ""}">
              <td class="sku-cell"><button class="sku-link" type="button" data-sku="${row.sku}">${row.sku}</button></td>
              <td class="sku-description">${row.description || row.sku}</td>
              <td class="sku-metric ${toneClass}">${metric.format(metricValue)}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
}

function renderSkuRanking(rows, targets = {}) {
  const { metric, top, bottom } = getRankedSkuRows(rows);
  const topTarget = targets.top || els.skuTopList;
  const bottomTarget = targets.bottom || els.skuBottomList;
  renderSkuRankingTable(topTarget, top, metric);
  renderSkuRankingTable(bottomTarget, bottom, metric);

  const scope = targets.scope || "single";
  renderSkuDetailPanel(targets.detail || null, rows, scope);

  [topTarget, bottomTarget].forEach((listTarget) => {
    listTarget?.querySelectorAll("[data-sku]").forEach((node) => {
      node.addEventListener("click", () => {
        const nextSku = node.getAttribute("data-sku");
        const isSameSelection = state.skuDetail.scope === scope && state.skuDetail.sku === nextSku;
        state.skuDetail.sku = isSameSelection ? null : nextSku;
        state.skuDetail.scope = scope;
        render();
      });
    });
  });
}

function splitWaterfallLabel(label) {
  const text = String(label || "").trim();
  if (text.length <= 16) return [text];

  const parts = text.split(" ");
  const line1 = [];
  const line2 = [];
  parts.forEach((part) => {
    if ((line1.join(" ") + " " + part).trim().length <= 16) {
      line1.push(part);
    } else {
      line2.push(part);
    }
  });

  return [line1.join(" "), line2.join(" ")].filter(Boolean);
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
    const steps = buildWaterfallSteps(entry.totals);
    const maxVal = Math.max(...steps.map((step) => Math.abs(step.value)), 1);

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
        ${steps.map((step) => {
          const width = (Math.abs(step.value) / maxVal) * 100;
          const pct = entry.totals.revenue ? (step.value / entry.totals.revenue) : 0;
          const displayValue = step.kind === "cost" ? -Math.abs(step.value) : step.value;
          const pctLabel = step.kind === "cost" ? `-${toPct(Math.abs(pct))}` : toPct(pct);

          return `
            <div class="water-row compact ${step.kind}">
              <div>${step.label}</div>
              <div class="bar"><span style="width:${width}%"></span></div>
              <div>${toMoney(displayValue)} <span class="water-pct">(${pctLabel})</span></div>
            </div>
          `;
        }).join("")}
      </article>
    `;
  }).join("");
}

function buildWaterfallSteps(totals) {
  return [
    { key: "revenue", label: "Revenue", value: totals.revenue || 0, kind: "base" },
    { key: "brewMat", label: "Brewing Materials", value: totals.brewMat || 0, kind: "cost" },
    { key: "pkgMat", label: "Packaging Materials", value: totals.pkgMat || 0, kind: "cost" },
    { key: "conversion", label: "Conversion Costs", value: totals.conversion || 0, kind: "cost" },
    { key: "grossMargin", label: "Gross Margin", value: totals.grossMargin || 0, kind: "subtotal" },
    { key: "freight", label: "Distribution / Freight", value: totals.freight || 0, kind: "cost" },
    { key: "marketing", label: "Marketing", value: totals.marketing || 0, kind: "cost" },
    { key: "sga", label: "SG&A", value: totals.sga || 0, kind: "cost" },
    { key: "operatingIncome", label: "Operating Income", value: totals.operatingIncome || 0, kind: "final" }
  ];
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
    `Overall view is ${toPct(totals.gmPct)} GM% and ${toPct(totals.omPct)} OM% on ${toMoney(totals.revenue)} revenue.`,
    `Best gross-margin SKU is ${bestGm.sku} at ${toPct(bestGm.gmPct)}.`,
    `Biggest operating-margin pressure is ${worstOm.sku} at ${toPct(worstOm.omPct)}.`,
    `Waterfall breakout is currently grouped by ${drillLabel}: ${drillScope}.`
  ];

  els.insights.innerHTML = messages.map((message) => `<li>${message}</li>`).join("");
}

function render() {
  const baseFilterState = state.comparisonMode ? state.comparisonBaseFilters : state.filters;
  const baseRows = applyFilters(state.records, baseFilterState).map(computeRow);
  const focusedRows = getFocusedRows(baseRows);
  const totals = aggregate(focusedRows);
  state.breakdown.totals = totals;

  if (state.comparisonMode) {
    const comparisonRows = applyFilters(state.records, state.comparisonFilters).map(computeRow);
    const comparisonTotals = aggregate(comparisonRows);
    renderComparisonMode(totals, comparisonTotals);
    renderSkuRanking(focusedRows, {
      top: els.comparisonCurrentTopList,
      bottom: els.comparisonCurrentBottomList,
      scope: "comparison-base",
      detail: els.comparisonCurrentSkuDetail
    });
    renderSkuRanking(comparisonRows, {
      top: els.comparisonCompareTopList,
      bottom: els.comparisonCompareBottomList,
      scope: "comparison-case",
      detail: els.comparisonCompareSkuDetail
    });
    renderBreakdownPanel(totals);
    return;
  }

  renderSingleMode(totals);
  renderSkuRanking(focusedRows, {
    scope: "single",
    detail: els.skuDetailPanel
  });
  renderBreakdownPanel(totals);
}

updateFilterOptions();
updateComparisonFilterOptions();
bindFilterEvents();
bindComparisonFilterEvents();
bindDrillEvents();
bindReset();
bindComparisonButton();
bindBreakdownEvents();
bindSkuDetailDismiss();
render();
