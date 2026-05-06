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

const staticStdConversionData = Array.isArray(window.DEMO_STD_CONVERSION_DATA)
  ? window.DEMO_STD_CONVERSION_DATA
  : [];

function normalizeStdConversionRow(row) {
  const plantOsku = cleanCell(getField(row, [
    "Plant + OSKU",
    "plantOsku",
    "plant_osku",
    "Plant+OSKU",
    "Plant_OSKU"
  ], ""), "");

  const clientStdConversionCpu = parseOptionalNum(getField(row, [
    "clientStdConversionCpu",
    "client_std_conversion_cpu",
    "clientStandardConversionCpu",
    "client_standard_conversion_cpu",
    "standardConversionCpu",
    "standard_conversion_cpu",
    "stdConversionCpu",
    "std_conversion_cpu",
    "conversionStandardCpu",
    "conversion_standard_cpu",
    "std conversion cpu",
    "client standard conversion cost",
    "Std Conversion Costs",
    "Total Std Conversion Costs",
    "Total"
  ], null));

  const clientStdBrewMatCpu = parseOptionalNum(getField(row, [
    "clientStdBrewMatCpu",
    "client_std_brew_mat_cpu",
    "stdBrewMatCpu",
    "std_brew_mat_cpu",
    "Brew Mat $/bbl"
  ], null));

  const clientStdPkgMatCpu = parseOptionalNum(getField(row, [
    "clientStdPkgMatCpu",
    "client_std_pkg_mat_cpu",
    "stdPkgMatCpu",
    "std_pkg_mat_cpu",
    "Pkg Mat $/bbl"
  ], null));

  const clientStdFreightCpu = parseOptionalNum(getField(row, [
    "clientStdFreightCpu",
    "client_std_freight_cpu",
    "stdFreightCpu",
    "std_freight_cpu",
    "Freight $/bbl"
  ], null));

  const clientStdMarketingCpu = parseOptionalNum(getField(row, [
    "clientStdMarketingCpu",
    "client_std_marketing_cpu",
    "stdMarketingCpu",
    "std_marketing_cpu",
    "Marketing $/bbl"
  ], null));

  const clientStdSgaCpu = parseOptionalNum(getField(row, [
    "clientStdSgaCpu",
    "client_std_sga_cpu",
    "stdSgaCpu",
    "std_sga_cpu",
    "SG&A",
    "sga"
  ], null));

  return {
    plantOsku,
    orderableSkuDescription: cleanCell(getField(row, [
      "Orderable SKU Description",
      "orderableSkuDescription",
      "orderable_sku_description"
    ], ""), ""),
    clientStdConversionCpu,
    clientStdBrewMatCpu,
    clientStdPkgMatCpu,
    clientStdFreightCpu,
    clientStdMarketingCpu,
    clientStdSgaCpu
  };
}

function buildStdConversionLookup(rows) {
  const map = new Map();
  rows.forEach((row) => {
    if (!row.plantOsku || !Number.isFinite(row.clientStdConversionCpu)) return;
    map.set(normalizeKey(row.plantOsku), row);
  });
  return map;
}

const stdConversionLookup = buildStdConversionLookup(staticStdConversionData.map(normalizeStdConversionRow));

function applyStdConversionLookup(row) {
  if (Number.isFinite(row.clientStdConversionCpu)) return row;
  const key = normalizeKey(row.plantOsku || "");
  if (!key || !stdConversionLookup.has(key)) return row;
  const stdRow = stdConversionLookup.get(key);
  return {
    ...row,
    clientStdConversionCpu: Number.isFinite(row.clientStdConversionCpu)
      ? row.clientStdConversionCpu
      : stdRow.clientStdConversionCpu,
    clientStdBrewMatCpu: Number.isFinite(row.clientStdBrewMatCpu)
      ? row.clientStdBrewMatCpu
      : stdRow.clientStdBrewMatCpu,
    clientStdPkgMatCpu: Number.isFinite(row.clientStdPkgMatCpu)
      ? row.clientStdPkgMatCpu
      : stdRow.clientStdPkgMatCpu,
    clientStdFreightCpu: Number.isFinite(row.clientStdFreightCpu)
      ? row.clientStdFreightCpu
      : stdRow.clientStdFreightCpu,
    clientStdMarketingCpu: Number.isFinite(row.clientStdMarketingCpu)
      ? row.clientStdMarketingCpu
      : stdRow.clientStdMarketingCpu,
    clientStdSgaCpu: Number.isFinite(row.clientStdSgaCpu)
      ? row.clientStdSgaCpu
      : stdRow.clientStdSgaCpu
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
    laborCpu: parseNum(getField(row, ["laborCpu", "labor_cpu", "Labor_CPU", "labor_cost_per_unit"])),
    overheadCpu: parseNum(getField(row, ["overheadCpu", "overhead_cpu", "Overhead_CPU", "overhead_cost_per_unit"])),
    conversionCpu: parseNum(getField(row, ["conversionCpu", "conversion_cpu"])),
    clientStdConversionCpu: parseOptionalNum(getField(row, [
      "clientStdConversionCpu",
      "client_std_conversion_cpu",
      "clientStandardConversionCpu",
      "client_standard_conversion_cpu",
      "standardConversionCpu",
      "standard_conversion_cpu",
      "stdConversionCpu",
      "std_conversion_cpu",
      "conversionStandardCpu",
      "conversion_standard_cpu",
      "std conversion cpu",
      "client standard conversion cost",
      "Std Conversion Costs",
      "Total Std Conversion Costs"
    ], null)),
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
    brand: document.getElementById("filter-brand"),
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
  summaryKpis: document.getElementById("summary-kpis"),
  kpiRevenue: document.getElementById("kpi-revenue"),
  kpiGrossMargin: document.getElementById("kpi-gross-margin"),
  kpiOperatingIncome: document.getElementById("kpi-operating-income"),
  kpiVolume: document.getElementById("kpi-volume"),
  kpiRevenuePerSku: document.getElementById("kpi-revenue-per-sku"),
  kpiGrossMarginPerSku: document.getElementById("kpi-gross-margin-per-sku"),
  kpiOperatingIncomePerSku: document.getElementById("kpi-operating-income-per-sku"),
  kpiVolumePerSku: document.getElementById("kpi-volume-per-sku"),
  singleWaterfallPanel: document.getElementById("single-waterfall-panel"),
  insightStripPanel: document.getElementById("insight-strip-panel"),
  insightStrip: document.getElementById("insight-strip"),
  insightStripSubtitle: document.getElementById("insight-strip-subtitle"),
  segmentRealityPanel: document.getElementById("segment-reality-panel"),
  segmentRealityDimension: document.getElementById("segment-reality-dimension"),
  segmentRealitySort: document.getElementById("segment-reality-sort"),
  segmentRealityTopN: document.getElementById("segment-reality-topn"),
  segmentRealitySubtitle: document.getElementById("segment-reality-subtitle"),
  segmentRealityEmpty: document.getElementById("segment-reality-empty"),
  segmentRealityChart: document.getElementById("segment-reality-chart"),
  segmentRealityFooter: document.getElementById("segment-reality-footer"),
  priceWalkPanel: document.getElementById("price-walk-panel"),
  priceWalkLegend: document.getElementById("price-walk-legend"),
  priceWalkSvg: document.getElementById("price-walk-svg"),
  priceWalkTooltip: document.getElementById("price-walk-tooltip"),
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
  whaleCurveChart: document.getElementById("whale-curve-chart"),
  whaleCurveSubtitle: document.getElementById("whale-curve-subtitle"),
  whaleCurvePanel: document.getElementById("whale-curve-panel"),
  whaleCurveReport: document.getElementById("whale-curve-report"),
  whaleCurveClear: document.getElementById("whale-curve-clear"),
  bubbleChartPanel: document.getElementById("bubble-chart-panel"),
  bubbleChart: document.getElementById("bubble-chart"),
  bubbleChartSubtitle: document.getElementById("bubble-chart-subtitle"),
  bubbleChartBack: document.getElementById("bubble-chart-back"),
  bubbleChartClear: document.getElementById("bubble-chart-clear"),
  bubbleChartCompare: document.getElementById("bubble-chart-compare"),
  omMixPanel: document.getElementById("om-mix-panel"),
  omMixDimension: document.getElementById("om-mix-dimension"),
  omMixSubtitle: document.getElementById("om-mix-subtitle"),
  omMixChart: document.getElementById("om-mix-chart"),
  waterfallShell: document.querySelector(".waterfall-shell"),
  waterfall: document.getElementById("waterfall"),
  breakdownTitle: document.getElementById("breakdown-title"),
  breakdownSubtitle: document.getElementById("breakdown-subtitle"),
  breakdownEmpty: document.getElementById("breakdown-empty"),
  breakdownContent: document.getElementById("breakdown-content"),
  breakdownChart: document.getElementById("breakdown-chart"),
  breakdownLegend: document.getElementById("breakdown-legend"),
  breakdownClose: document.getElementById("breakdown-close"),
  moduleRail: document.getElementById("module-rail"),
  moduleButtons: document.querySelectorAll(".module-thumb")
};

const state = {
  records: staticCostData
    .map(normalizeStaticCostRow)
    .map(applyStdConversionLookup)
    .map(withDescriptorDefaults),
  descriptorLookup: {},
  filters: {
    plant: "All",
    priceSegment: "All",
    brand: "All",
    packaging: "All"
  },
  comparisonBaseFilters: {
    plant: "All",
    priceSegment: "All",
    brand: "All",
    packaging: "All"
  },
  comparisonFilters: {
    plant: "All",
    priceSegment: "All",
    brand: "All",
    packaging: "All"
  },
  drill: {
    dimension: "plant",
    value: "All"
  },
  axisMode: "dollar",
  comparisonMode: false,
  skuRankingMetric: "revenue",
  omMixDimension: "priceSegment",
  segmentReality: {
    dimension: "priceSegment",
    sort: "omOverstatement-desc",
    topN: 999,
    selectedGroup: ""
  },
  whaleCurveSelection: { point1: null, point2: null },
  whaleCurveActiveLine: "adjusted",
  bubbleChartDrill: {
    mode: "family",
    family: "",
    selectedFamilies: [],
    comparisonMode: false
  },
  breakdown: {
    stepKey: null,
    totals: null,
    expandOther: false
  },
  activeModule: "waterfall"
};

window.__LUMINOR_BOOT_OK = false;

if (staticDescriptorData.length) {
  state.descriptorLookup = buildDescriptorLookup(staticDescriptorData.map(normalizeDescriptorRow));
  state.records = applyDescriptorLookup(state.records);
}

let marginChart;
let breakdownChart;
let whaleCurveChart;
let bubbleChart;
let segmentRealityChart;

const PRICE_WALK_SEGMENTS = [
  "Budget",
  "Near Premium",
  "Premium",
  "Above Premium",
  "Non-Alcohol",
  "Contract"
];

const PRICE_WALK_SEGMENT_COLORS = [
  "#79c6d6",
  "#5fa6d6",
  "#6f8fce",
  "#5479bb",
  "#3f63a1",
  "#304f84"
];

const PRICE_WALK_COLUMNS = [
  { key: "skus", label: "#SKUs", totalLabel: "1,704", totalSubLabel: "Plant-OSKUs", totalValue: 1704, unit: "sku" },
  { key: "volume", label: "Volume", totalLabel: "55M", totalSubLabel: "bbl", totalValue: 55_000_000, unit: "volume" },
  { key: "netSales", label: "Net Sales", totalLabel: "$6.4B", totalSubLabel: "", totalValue: 6_400_000_000, unit: "money" },
  { key: "adjGp", label: "Adjusted Gross Profit", totalLabel: "$3.3B", totalSubLabel: "", totalValue: 3_300_000_000, unit: "money" },
  { key: "adjOp", label: "Adjusted Operating Profit", totalLabel: "$1.5B", totalSubLabel: "", totalValue: 1_500_000_000, unit: "money" }
];

const PRICE_WALK_PCT = {
  skus: [16.2, 16.4, 27.9, 11.0, 0.9, 27.7],
  volume: [15.6, 12.2, 57.8, 5.5, -0.2, 8.7],
  netSales: [12.9, 10.4, 68.0, 8.5, 0.2, 0.0],
  adjGp: [9.8, 6.9, 73.6, 9.6, 0.1, 0.0],
  adjOp: [9.4, 4.8, 78.7, 7.3, 0.1, -0.3]
};

function formatPriceWalkAbsolute(unit, value) {
  if (unit === "sku") {
    return `${Math.round(value).toLocaleString()} SKUs`;
  }
  if (unit === "volume") {
    return `${(value / 1_000_000).toFixed(2)}M bbl`;
  }
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  return `${sign}$${abs.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function setPriceWalkTooltipPosition(event) {
  const tip = els.priceWalkTooltip;
  if (!tip || tip.classList.contains("is-hidden")) return;
  const pad = 12;
  const x = event.clientX + 14;
  const y = event.clientY + 12;
  const maxLeft = window.innerWidth - tip.offsetWidth - pad;
  const maxTop = window.innerHeight - tip.offsetHeight - pad;
  tip.style.left = `${Math.max(pad, Math.min(x, maxLeft))}px`;
  tip.style.top = `${Math.max(pad, Math.min(y, maxTop))}px`;
}

function hidePriceWalkTooltip() {
  const tip = els.priceWalkTooltip;
  if (!tip) return;
  tip.classList.add("is-hidden");
}

function renderPriceSegmentWalk() {
  if (!els.priceWalkSvg || !els.priceWalkLegend) return;

  const svg = els.priceWalkSvg;
  const rect = svg.getBoundingClientRect();
  const width = Math.max(880, Math.floor(rect.width || svg.clientWidth || 0));
  const height = 410;
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = "";

  els.priceWalkLegend.innerHTML = PRICE_WALK_SEGMENTS.map((segment, i) => `
    <span class="price-walk-legend-item">
      <span class="price-walk-legend-swatch" style="background:${PRICE_WALK_SEGMENT_COLORS[i]}"></span>
      <span>${segment}</span>
    </span>
  `).join("");

  const NS = "http://www.w3.org/2000/svg";
  const make = (tag, attrs = {}) => {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  };

  const chartLeft = 146;
  const chartTop = 70;
  const chartRight = width - 28;
  const chartBottom = height - 54;
  const chartWidth = chartRight - chartLeft;
  const chartHeight = chartBottom - chartTop;
  const barWidth = Math.max(50, Math.min(78, chartWidth / 11));
  const valueMin = -2;
  const valueMax = 100;
  const usedWidth = chartWidth * 0.82;
  const colStart = chartLeft + ((chartWidth - usedWidth) / 2);
  const colGap = usedWidth / (PRICE_WALK_COLUMNS.length - 1);

  const yOf = (val) => chartTop + ((valueMax - val) / (valueMax - valueMin)) * chartHeight;
  const baselineY = yOf(0);

  svg.appendChild(make("line", {
    x1: chartLeft - 28,
    y1: baselineY,
    x2: chartRight,
    y2: baselineY,
    stroke: "rgba(159,176,211,.32)",
    "stroke-width": 1
  }));

  const columnLayouts = [];

  PRICE_WALK_COLUMNS.forEach((column, colIdx) => {
    const x = colStart + colIdx * colGap;
    const values = PRICE_WALK_PCT[column.key];
    const colGroup = make("g");
    let tinyLabelOffset = 0;
    let pos = 0;
    let neg = 0;
    const segmentLayout = Array(PRICE_WALK_SEGMENTS.length).fill(null);

    for (let segIdx = PRICE_WALK_SEGMENTS.length - 1; segIdx >= 0; segIdx -= 1) {
      const val = values[segIdx] || 0;
      let start = 0;
      let end = 0;
      if (val >= 0) {
        start = pos;
        end = pos + val;
        pos = end;
      } else {
        start = neg;
        end = neg + val;
        neg = end;
      }

      const y1 = yOf(start);
      const y2 = yOf(end);
      const y = Math.min(y1, y2);
      const h = Math.max(0.6, Math.abs(y2 - y1));
      const fill = PRICE_WALK_SEGMENT_COLORS[segIdx];

      const r = make("rect", {
        x: x - barWidth / 2,
        y,
        width: barWidth,
        height: h,
        fill,
        stroke: "rgba(255,255,255,.12)",
        "stroke-width": 0.7,
        "data-segment": PRICE_WALK_SEGMENTS[segIdx],
        "data-column": column.label,
        "data-pct": val.toFixed(1),
        "data-rank": "0",
        "data-abs": formatPriceWalkAbsolute(column.unit, (val / 100) * column.totalValue)
      });

      colGroup.appendChild(r);
      segmentLayout[segIdx] = {
        centerY: (y1 + y2) / 2,
        yTop: y,
        yBottom: y + h,
        value: val,
        rect: r
      };

      if (h >= 16 && Math.abs(val) >= 0.9) {
        const tx = make("text", {
          x,
          y: y + h / 2 + 3.5,
          fill: segIdx >= 4 ? "#edf4ff" : "#0f1b2f",
          "font-size": 11,
          "text-anchor": "middle",
          "font-weight": 500
        });
        tx.textContent = `${val.toFixed(1)}%`;
        colGroup.appendChild(tx);
      } else {
        const baseY = val >= 0 ? y - 7 : y + h + 14;
        const labelY = baseY + tinyLabelOffset;
        tinyLabelOffset += 11;
        const anchorX = x + barWidth / 2;
        const anchorY = (y1 + y2) / 2;
        const labelX = anchorX + 22;

        colGroup.appendChild(make("line", {
          x1: labelX,
          y1: labelY - 2,
          x2: anchorX,
          y2: anchorY,
          stroke: "rgba(159,176,211,.45)",
          "stroke-width": 0.8,
          "stroke-dasharray": "2 2"
        }));

        const dx = labelX - anchorX;
        const dy = (labelY - 2) - anchorY;
        const len = Math.sqrt((dx * dx) + (dy * dy)) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const nx = -uy;
        const ny = ux;
        const ah = 5;
        const aw = 2.5;
        const p1x = anchorX;
        const p1y = anchorY;
        const p2x = anchorX + (ux * ah) + (nx * aw);
        const p2y = anchorY + (uy * ah) + (ny * aw);
        const p3x = anchorX + (ux * ah) - (nx * aw);
        const p3y = anchorY + (uy * ah) - (ny * aw);
        colGroup.appendChild(make("polygon", {
          points: `${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`,
          fill: "rgba(159,176,211,.62)"
        }));

        const tiny = make("text", {
          x: labelX,
          y: labelY,
          fill: "#aebfdd",
          "font-size": 10.5,
          "text-anchor": "start"
        });
        tiny.textContent = `${val.toFixed(1)}%`;
        colGroup.appendChild(tiny);
      }
    }

    const ranked = values
      .map((value, idx) => ({ value, idx }))
      .sort((a, b) => b.value - a.value)
      .reduce((acc, item, rankIndex) => {
        acc[item.idx] = rankIndex + 1;
        return acc;
      }, {});

    segmentLayout.forEach((layout, segIdx) => {
      if (!layout) return;
      layout.rect.setAttribute("data-rank", String(ranked[segIdx] || 0));
    });

    const topValue = make("text", {
      x,
      y: chartTop - 23,
      fill: "#e3edff",
      "font-size": 21,
      "font-weight": 650,
      "text-anchor": "middle"
    });
    topValue.textContent = column.totalLabel;
    svg.appendChild(topValue);

    if (column.totalSubLabel) {
      const topSub = make("text", {
        x,
        y: chartTop - 8,
        fill: "#9fb0d3",
        "font-size": 12,
        "text-anchor": "middle"
      });
      topSub.textContent = column.totalSubLabel;
      svg.appendChild(topSub);
    }

    const bottom = make("text", {
      x,
      y: chartBottom + 30,
      fill: "#cfdcf3",
      "font-size": 13,
      "font-weight": 600,
      "text-anchor": "middle"
    });
    bottom.textContent = column.label;
    svg.appendChild(bottom);

    svg.appendChild(colGroup);
    columnLayouts.push({ x, segments: segmentLayout });
  });

  for (let boundaryIdx = 0; boundaryIdx < PRICE_WALK_SEGMENTS.length - 1; boundaryIdx += 1) {
    for (let colIdx = 0; colIdx < columnLayouts.length - 1; colIdx += 1) {
      const leftUpper = columnLayouts[colIdx].segments[boundaryIdx];
      const leftLower = columnLayouts[colIdx].segments[boundaryIdx + 1];
      const rightUpper = columnLayouts[colIdx + 1].segments[boundaryIdx];
      const rightLower = columnLayouts[colIdx + 1].segments[boundaryIdx + 1];

      if (!leftUpper || !leftLower || !rightUpper || !rightLower) continue;

      // Draw connectors only when the boundary is meaningful in both columns.
      const leftBoundaryWeight = Math.max(Math.abs(leftUpper.value), Math.abs(leftLower.value));
      const rightBoundaryWeight = Math.max(Math.abs(rightUpper.value), Math.abs(rightLower.value));
      if (leftBoundaryWeight < 0.15 || rightBoundaryWeight < 0.15) continue;

      const yLeft = (leftUpper.yBottom + leftLower.yTop) / 2;
      const yRight = (rightUpper.yBottom + rightLower.yTop) / 2;

      svg.insertBefore(make("line", {
        x1: columnLayouts[colIdx].x + barWidth / 2,
        y1: yLeft,
        x2: columnLayouts[colIdx + 1].x - barWidth / 2,
        y2: yRight,
        stroke: "rgba(126,159,208,.52)",
        "stroke-width": 0.9,
        "stroke-dasharray": "3 3"
      }), svg.firstChild);
    }
  }

  const firstCol = columnLayouts[0]?.segments || [];
  firstCol.forEach((layout, segIdx) => {
    if (!layout) return;
    const t = make("text", {
      x: chartLeft - barWidth / 2 - 14,
      y: layout.centerY + 3.5,
      fill: "#cfdcf3",
      "font-size": 12,
      "text-anchor": "end"
    });
    t.textContent = PRICE_WALK_SEGMENTS[segIdx];
    svg.appendChild(t);
  });

  svg.querySelectorAll("rect[data-segment]").forEach((node) => {
    node.addEventListener("mouseenter", (event) => {
      if (!els.priceWalkTooltip) return;
      const segment = node.getAttribute("data-segment") || "";
      const column = node.getAttribute("data-column") || "";
      const pct = node.getAttribute("data-pct") || "0.0";
      const abs = node.getAttribute("data-abs") || "";
      const rank = node.getAttribute("data-rank") || "";
      els.priceWalkTooltip.innerHTML = `
        <div class="tooltip-title">${segment} • ${column}</div>
        <div class="tooltip-row"><span>Mix share</span><strong>${pct}%</strong></div>
        <div class="tooltip-row"><span>Absolute value</span><strong>${abs}</strong></div>
        <div class="tooltip-row"><span>Contribution rank</span><strong>#${rank}</strong></div>
      `;
      els.priceWalkTooltip.classList.remove("is-hidden");
      setPriceWalkTooltipPosition(event);
    });
    node.addEventListener("mousemove", (event) => setPriceWalkTooltipPosition(event));
    node.addEventListener("mouseleave", hidePriceWalkTooltip);
  });
}

function reportRuntimeError(error, source = "runtime") {
  const message = error && error.message ? error.message : String(error || "Unknown error");
  let banner = document.getElementById("runtime-error-banner");
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "runtime-error-banner";
    banner.style.cssText = "position:sticky;top:0;z-index:9999;padding:10px 14px;background:#7a1f1f;color:#ffd9d9;border-bottom:1px solid #b04b4b;font:600 13px/1.35 Inter, sans-serif;";
    document.body.prepend(banner);
  }
  banner.textContent = `Dashboard error (${source}: ${message}).`;
  console.error(source, error);
}

function isIgnorableRuntimeMessage(message) {
  const normalized = String(message || "").trim().toLowerCase();
  return normalized === "script error." || normalized === "script error";
}

window.addEventListener("error", (event) => {
  const message = event?.error?.message || event?.message;
  if (isIgnorableRuntimeMessage(message)) {
    console.warn("Ignored non-actionable runtime error", {
      message,
      filename: event?.filename,
      lineno: event?.lineno,
      colno: event?.colno
    });
    return;
  }
  reportRuntimeError(event.error || message, "window.onerror");
});

window.addEventListener("unhandledrejection", (event) => {
  const reasonMessage = event?.reason?.message || event?.reason;
  if (isIgnorableRuntimeMessage(reasonMessage)) {
    console.warn("Ignored non-actionable promise rejection", { reason: event?.reason });
    return;
  }
  reportRuntimeError(event.reason, "unhandledrejection");
});

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

const OM_MIX_DIMENSIONS = [
  { value: "priceSegment", label: "Price Segment" },
  { value: "plant", label: "Plant" },
  { value: "packaging", label: "Package Type" },
  { value: "brandFamily", label: "Product Family" }
];

const MODULE_IDS = [
  "waterfall",
  "std-adj",
  "whale-curve",
  "profit-walk",
  "margin-mix",
  "sku-map",
  "top-bottom-10"
];

function toMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value || 0);
}

function toMoneyDec(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value || 0);
}

function toMoneyCompact(value) {
  const n = value || 0;
  const abs = Math.abs(n);
  if (abs < 1000000) return toMoney(n);

  const sign = n < 0 ? "-" : "";
  if (abs >= 1000000000) {
    return `${sign}$${(abs / 1000000000).toFixed(1)}B`;
  }
  return `${sign}$${(abs / 1000000).toFixed(1)}M`;
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

function toSignedMoneyDec(value) {
  const abs = toMoneyDec(Math.abs(value || 0));
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

function parseOptionalNum(value) {
  if (value === undefined || value === null) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  return parseNum(value);
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
    clientStdConversionCpu: parseOptionalNum(getField(row, [
      "clientStdConversionCpu",
      "client_std_conversion_cpu",
      "clientStandardConversionCpu",
      "client_standard_conversion_cpu",
      "standardConversionCpu",
      "standard_conversion_cpu",
      "stdConversionCpu",
      "std_conversion_cpu",
      "conversionStandardCpu",
      "conversion_standard_cpu",
      "std conversion cpu",
      "client standard conversion cost",
      "Std Conversion Costs",
      "Total Std Conversion Costs"
    ], null)),
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

  return withDescriptorDefaults(applyStdConversionLookup(normalized));
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
  const hasClientStdConversionCpu = Number.isFinite(row.clientStdConversionCpu);
  const clientStdConversionCpu = hasClientStdConversionCpu ? row.clientStdConversionCpu : conversion;
  const clientStdConversionDeltaCpu = hasClientStdConversionCpu ? (conversion - clientStdConversionCpu) : 0;
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
    clientStdConversionCpu,
    hasClientStdConversionCpu,
    clientStdConversionTotal: clientStdConversionCpu * row.volume,
    clientStdConversionDeltaCpu,
    clientStdConversionDeltaTotal: clientStdConversionDeltaCpu * row.volume,
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
    if (row.hasClientStdConversionCpu) {
      acc.actualConversionCoveredTotal += row.conversionTotal || 0;
      acc.clientStdConversionCoveredTotal += row.clientStdConversionTotal || 0;
      acc.clientStdConversionDeltaTotal += row.clientStdConversionDeltaTotal || 0;
      acc.clientStdConversionCoverageVolume += row.volume || 0;
    }
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
    actualConversionCoveredTotal: 0,
    clientStdConversionCoveredTotal: 0,
    clientStdConversionDeltaTotal: 0,
    clientStdConversionCoverageVolume: 0,
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
  totals.actualConversionCpu = totals.volume ? totals.conversion / totals.volume : 0;
  totals.actualConversionCpuCovered = totals.clientStdConversionCoverageVolume
    ? totals.actualConversionCoveredTotal / totals.clientStdConversionCoverageVolume
    : null;
  totals.clientStdConversionCpu = totals.clientStdConversionCoverageVolume
    ? totals.clientStdConversionCoveredTotal / totals.clientStdConversionCoverageVolume
    : null;
  totals.clientStdConversionDeltaCpu = totals.clientStdConversionCoverageVolume
    ? totals.actualConversionCpuCovered - totals.clientStdConversionCpu
    : null;
  totals.clientStdCoveragePct = totals.volume
    ? totals.clientStdConversionCoverageVolume / totals.volume
    : 0;
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

function renderModuleWorkspace() {
  const modulePanels = Array.from(document.querySelectorAll(".module-panel"));
  modulePanels.forEach((panel) => {
    const moduleId = panel.getAttribute("data-module");
    const isActive = moduleId === state.activeModule;
    panel.classList.toggle("is-hidden", !isActive);
    panel.classList.toggle("module-panel-active", isActive);
  });

  if (els.comparisonPanel) {
    els.comparisonPanel.classList.add("is-hidden");
  }

  if (els.insightStripPanel) {
    els.insightStripPanel.classList.add("is-hidden");
  }

  Array.from(els.moduleButtons || []).forEach((button) => {
    const moduleId = button.getAttribute("data-module");
    const isActive = moduleId === state.activeModule;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
    button.disabled = isActive;
  });
}

function bindModuleRailEvents() {
  Array.from(els.moduleButtons || []).forEach((button) => {
    button.addEventListener("click", () => {
      const nextModule = button.getAttribute("data-module") || "";
      if (!MODULE_IDS.includes(nextModule) || nextModule === state.activeModule) return;
      state.activeModule = nextModule;
      render();
    });
  });
}

function bindOmMixEvents() {
  if (!els.omMixDimension) return;

  els.omMixDimension.innerHTML = OM_MIX_DIMENSIONS
    .map((option) => `<option value="${option.value}">${option.label}</option>`)
    .join("");
  els.omMixDimension.value = state.omMixDimension;

  els.omMixDimension.addEventListener("change", () => {
    state.omMixDimension = els.omMixDimension.value;
    render();
  });
}

function bindSegmentRealityEvents() {
  if (els.segmentRealityDimension) {
    els.segmentRealityDimension.value = state.segmentReality.dimension;
    els.segmentRealityDimension.addEventListener("change", () => {
      state.segmentReality.dimension = els.segmentRealityDimension.value;
      state.segmentReality.selectedGroup = "";
      render();
    });
  }

  if (els.segmentRealitySort) {
    els.segmentRealitySort.value = state.segmentReality.sort;
    els.segmentRealitySort.addEventListener("change", () => {
      state.segmentReality.sort = els.segmentRealitySort.value;
      render();
    });
  }

  if (els.segmentRealityTopN) {
    els.segmentRealityTopN.value = String(state.segmentReality.topN);
    els.segmentRealityTopN.addEventListener("change", () => {
      state.segmentReality.topN = parseInt(els.segmentRealityTopN.value, 10) || 999;
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

function buildOmMixGroups(rows) {
  const dimension = state.omMixDimension;
  let groups = aggregateByDimension(rows, dimension)
    .filter((g) => (g.revenue || 0) > 0)
    .map((g) => ({
      ...g,
      omPct: g.revenue ? (g.operatingIncome / g.revenue) * 100 : 0,
      isOther: false,
      memberLabels: [g.label]
    }));

  if (dimension === "brandFamily") {
    groups.sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
    const top = groups.slice(0, 10);
    const remainder = groups.slice(10);
    if (remainder.length) {
      const other = remainder.reduce((acc, g) => {
        acc.revenue += g.revenue || 0;
        acc.volume += g.volume || 0;
        acc.operatingIncome += g.operatingIncome || 0;
        acc.memberLabels.push(g.label);
        return acc;
      }, {
        label: "Other",
        revenue: 0,
        volume: 0,
        operatingIncome: 0,
        isOther: true,
        memberLabels: []
      });
      other.omPct = other.revenue ? (other.operatingIncome / other.revenue) * 100 : 0;
      groups = [...top, other];
    } else {
      groups = top;
    }
  }

  return groups.sort((a, b) => (b.omPct || 0) - (a.omPct || 0));
}

function renderOmMixChart(rows) {
  if (!els.omMixPanel || !els.omMixChart) return;

  const formatSpreadPct = (value) => `${(value || 0).toFixed(1)} pts`;

  const buildOmMixTooltipHtml = (group) => {
    const omPct = group?.omPct || 0;
    const revenue = group?.revenue || 0;
    const operatingIncome = group?.operatingIncome || 0;
    const spreadDollar = group?.omSpreadDollar || 0;
    const spreadPct = group?.omSpreadPct || 0;
    return `
      <div class="omtt-head">
        <strong>${group?.label || "Unknown"}</strong>
        <span>Spread = highest minus lowest SKU in segment</span>
      </div>
      <div class="omtt-body">
        <div class="omtt-row"><span>SKU count</span><strong>${(group?.skuCount || 0).toLocaleString()}</strong></div>
        <div class="omtt-row"><span>Revenue</span><strong>${toMoney(revenue)}</strong></div>
        <div class="omtt-row"><span>OM $ total</span><strong>${toSignedMoney(operatingIncome)}</strong></div>
        <div class="omtt-row"><span>OM % total</span><strong>${(omPct >= 0 ? "+" : "") + omPct.toFixed(1)}%</strong></div>
        <div class="omtt-row"><span>OM $ spread</span><strong>${toMoney(spreadDollar)}</strong></div>
        <div class="omtt-row"><span>OM % spread</span><strong>${formatSpreadPct(spreadPct)}</strong></div>
      </div>
    `;
  };

  const toTwoLineLabel = (label) => {
    const words = String(label || "").trim().split(/\s+/).filter(Boolean);
    if (!words.length) return ["", ""];
    if (words.length === 1) {
      const single = words[0];
      if (single.length <= 14) return [single, ""];
      return [single.slice(0, 14), single.slice(14, 24)];
    }
    const first = [];
    const second = [];
    words.forEach((word) => {
      const target = first.join(" ").length < 12 ? first : second;
      target.push(word);
    });
    return [first.join(" ").slice(0, 16), second.join(" ").slice(0, 16)];
  };

  const toCompactLabel = (label) => {
    const words = String(label || "").trim().split(/\s+/).filter(Boolean);
    if (!words.length) return "";
    if (words.length === 1) return words[0].slice(0, 8).toUpperCase();
    const parts = words.slice(0, 2).map((w) => w.slice(0, 4).toUpperCase());
    return parts.join(" ");
  };

  const dimension = state.omMixDimension;
  const rowsByGroup = rows.reduce((acc, row) => {
    const groupKey = String(row[dimension] || "Unknown").trim() || "Unknown";
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(row);
    return acc;
  }, {});

  const groups = buildOmMixGroups(rows).map((g) => {
    const memberRows = (g.memberLabels || []).flatMap((label) => rowsByGroup[label] || []);
    const skuMap = memberRows.reduce((acc, row) => {
      const skuKey = String(row.plantOsku || row.sku || row.orderableSkuDescription || "Unknown");
      if (!acc[skuKey]) acc[skuKey] = { revenue: 0, operatingIncome: 0 };
      acc[skuKey].revenue += row.revenue || 0;
      acc[skuKey].operatingIncome += row.operatingIncome || 0;
      return acc;
    }, {});
    const skuStats = Object.values(skuMap).map((s) => ({
      omDollar: s.operatingIncome || 0,
      omPct: s.revenue ? ((s.operatingIncome || 0) / s.revenue) * 100 : 0
    }));
    const omDollarVals = skuStats.map((s) => s.omDollar);
    const omPctVals = skuStats.map((s) => s.omPct);
    const omSpreadDollar = omDollarVals.length ? (Math.max(...omDollarVals) - Math.min(...omDollarVals)) : 0;
    const omSpreadPct = omPctVals.length ? (Math.max(...omPctVals) - Math.min(...omPctVals)) : 0;
    return {
      ...g,
      skuCount: skuStats.length,
      omSpreadDollar,
      omSpreadPct
    };
  });
  const totals = aggregate(rows);
  const totalRevenue = groups.reduce((sum, g) => sum + (g.revenue || 0), 0);
  const portfolioOmPct = totals.revenue ? ((totals.operatingIncome || 0) / totals.revenue) * 100 : 0;
  const dimensionLabel = OM_MIX_DIMENSIONS.find((d) => d.value === state.omMixDimension)?.label || "Segment";

  if (els.omMixSubtitle) {
    els.omMixSubtitle.textContent = `${dimensionLabel} · bar width = revenue · y-axis = operating margin % · click a bar to drill`;
  }

  if (!groups.length || totalRevenue <= 0) {
    els.omMixChart.innerHTML = '<div class="sku-ranking-empty">No data for current filters.</div>';
    return;
  }

  const vals = groups.map((g) => g.omPct || 0).concat([portfolioOmPct, 0]);
  const minVal = Math.min(...vals);
  const maxVal = Math.max(...vals);
  let yMin = Math.floor((minVal - 2) / 5) * 5;
  let yMax = Math.ceil((maxVal + 2) / 5) * 5;
  if (yMax - yMin < 15) {
    yMax += 5;
    yMin -= 5;
  }

  const width = 1060;
  const height = 430;
  const margin = { top: 16, right: 18, bottom: 110, left: 66 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;

  const y = (v) => margin.top + ((yMax - v) / (yMax - yMin)) * plotH;
  const zeroY = y(0);
  const avgY = y(portfolioOmPct);

  const tickStep = 10;
  const yTicks = [];
  for (let tick = Math.ceil(yMin / tickStep) * tickStep; tick <= yMax; tick += tickStep) {
    yTicks.push(tick);
  }

  let cumulative = 0;
  const labelRecords = [];
  const bars = groups.map((g, idx) => {
    const share = (g.revenue || 0) / totalRevenue;
    const barX = margin.left + (cumulative * plotW);
    const barW = Math.max(8, share * plotW);
    cumulative += share;

    const value = g.omPct || 0;
    const yTop = y(Math.max(value, 0));
    const yBottom = y(Math.min(value, 0));
    const barH = Math.max(2, Math.abs(yBottom - yTop));
    const isGood = value >= portfolioOmPct;
    const barClass = isGood ? "om-mix-bar-good" : "om-mix-bar-bad";
    const isClickable = !(state.omMixDimension === "brandFamily" && g.isOther);
    const drillVal = encodeURIComponent(g.label);
    const barLabel = `${Math.round(value)}%`;
    const revLabel = toMoney(g.revenue || 0).replace(".00", "");
    const textX = barX + (barW / 2);
    const shortName = String(g.label || "").length > 16 ? `${String(g.label).slice(0, 15)}...` : String(g.label);
    const [line1] = toTwoLineLabel(g.label);
    const useCompact = barW < 84;
    const labelPrimary = (useCompact ? toCompactLabel(g.label) : (line1 || shortName)).slice(0, 18);
    const isNarrow = barW < 92;
    const barTitle = `${g.label}: ${barLabel} OM, ${revLabel} revenue`;
    labelRecords.push({ x: textX, barW, label: labelPrimary });

    return `
      <g>
        <rect class="om-mix-bar ${barClass} ${isClickable ? "om-mix-bar-click" : ""}" data-idx="${idx}" data-drill="${drillVal}" x="${barX.toFixed(2)}" y="${Math.min(yTop, yBottom).toFixed(2)}" width="${barW.toFixed(2)}" height="${barH.toFixed(2)}"></rect>
      </g>
    `;
  }).join("");

  const truncate = (text, maxChars) => {
    if ((text || "").length <= maxChars) return text;
    return `${String(text).slice(0, Math.max(2, maxChars - 1))}.`;
  };

  const rowRight = [margin.left - 20, margin.left - 20];
  const rowY = [zeroY + 22, zeroY + 36];
  const minGap = 10;
  const xLabels = labelRecords.map((r) => {
    const maxChars = Math.max(8, Math.min(14, Math.floor(r.barW / 6)));
    const label = truncate(r.label, maxChars);
    const w = Math.max(18, label.length * 5.1);

    let row = rowRight[0] <= rowRight[1] ? 0 : 1;
    let x = Math.max(r.x, rowRight[row] + minGap + (w / 2));
    const maxX = width - margin.right - (w / 2);
    x = Math.min(maxX, x);

    if (x - (w / 2) < rowRight[row] + minGap) {
      row = row === 0 ? 1 : 0;
      x = Math.max(r.x, rowRight[row] + minGap + (w / 2));
      x = Math.min(maxX, x);
    }

    rowRight[row] = x + (w / 2);
    const yText = rowY[row];
    const yLead = yText - 8;

    return `
      <g>
        <line class="om-mix-label-leader" x1="${r.x.toFixed(2)}" y1="${(zeroY + 3).toFixed(2)}" x2="${x.toFixed(2)}" y2="${yLead.toFixed(2)}"></line>
        <text class="om-mix-xlabel" x="${x.toFixed(2)}" y="${yText.toFixed(2)}" text-anchor="middle">${label}</text>
      </g>
    `;
  }).join("");

  const grid = yTicks.map((tick) => {
    const yy = y(tick);
    return `
      <line class="om-mix-grid" x1="${margin.left}" y1="${yy.toFixed(2)}" x2="${(width - margin.right).toFixed(2)}" y2="${yy.toFixed(2)}"></line>
      <text class="om-mix-ytick" x="${(margin.left - 6).toFixed(2)}" y="${(yy + 4).toFixed(2)}" text-anchor="end">${tick}%</text>
    `;
  }).join("");

  els.omMixChart.innerHTML = `
    <div class="om-mix-shell">
      <svg class="om-mix-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Operating Margin mix chart">
        ${grid}
        <line class="om-mix-zero" x1="${margin.left}" y1="${zeroY.toFixed(2)}" x2="${(width - margin.right).toFixed(2)}" y2="${zeroY.toFixed(2)}"></line>
        <line class="om-mix-avg" x1="${margin.left}" y1="${avgY.toFixed(2)}" x2="${(width - margin.right).toFixed(2)}" y2="${avgY.toFixed(2)}"></line>
        <text class="om-mix-avg-label" x="${(width - margin.right - 2).toFixed(2)}" y="${(avgY - 8).toFixed(2)}" text-anchor="end">Company OM avg ${portfolioOmPct.toFixed(1)}%</text>
        ${bars}
        ${xLabels}
        <text class="om-mix-ytitle" transform="translate(16, ${(margin.top + (plotH / 2)).toFixed(2)}) rotate(-90)" text-anchor="middle">Operating margin %</text>
      </svg>
      <div class="om-mix-tooltip is-hidden" id="om-mix-tooltip"></div>
      <div class="om-mix-legend">
        <span><i class="swatch good"></i>At/above company OM avg</span>
        <span><i class="swatch bad"></i>Below company OM avg</span>
        <span><i class="swatch avg"></i>Company OM avg</span>
      </div>
    </div>
  `;

  const omTooltip = els.omMixChart.querySelector("#om-mix-tooltip");
  const omBars = els.omMixChart.querySelectorAll(".om-mix-bar");
  const getOmMixDrillDimension = (current) => {
    if (current === "brandFamily") return "plant";
    return "brandFamily";
  };

  const positionOmTooltip = (event) => {
    if (!omTooltip || omTooltip.classList.contains("is-hidden")) return;
    const pad = 12;
    const x = event.clientX + 14;
    const y = event.clientY + 12;
    const maxLeft = window.innerWidth - omTooltip.offsetWidth - pad;
    const maxTop = window.innerHeight - omTooltip.offsetHeight - pad;
    omTooltip.style.left = `${Math.max(pad, Math.min(x, maxLeft))}px`;
    omTooltip.style.top = `${Math.max(pad, Math.min(y, maxTop))}px`;
  };

  omBars.forEach((node) => {
    node.addEventListener("mouseenter", (event) => {
      if (!omTooltip) return;
      const idx = Number(node.getAttribute("data-idx") || -1);
      const group = groups[idx];
      if (!group) return;
      omTooltip.innerHTML = buildOmMixTooltipHtml(group);
      omTooltip.classList.remove("is-hidden");
      positionOmTooltip(event);
    });

    node.addEventListener("mousemove", (event) => {
      positionOmTooltip(event);
    });

    node.addEventListener("mouseleave", () => {
      if (!omTooltip) return;
      omTooltip.classList.add("is-hidden");
    });
  });

  els.omMixChart.querySelectorAll(".om-mix-bar-click").forEach((node) => {
    node.addEventListener("click", () => {
      const drillValue = decodeURIComponent(node.getAttribute("data-drill") || "");
      const clickedDimension = state.omMixDimension;
      const sameSelection = state.drill.dimension === clickedDimension && state.drill.value === drillValue;

      state.drill.dimension = clickedDimension;
      state.drill.value = sameSelection ? "All" : drillValue;

      if (!sameSelection) {
        state.omMixDimension = getOmMixDrillDimension(clickedDimension);
        if (els.omMixDimension) {
          els.omMixDimension.value = state.omMixDimension;
        }
      }

      if (els.drillDimension) {
        els.drillDimension.value = state.drill.dimension;
      }
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
    state.bubbleChartDrill.mode = "family";
    state.bubbleChartDrill.family = "";
    state.bubbleChartDrill.selectedFamilies = [];
    state.bubbleChartDrill.comparisonMode = false;
    if (els.comparisonBtn) els.comparisonBtn.textContent = "Enter Comparison";
    if (els.comparisonSetup) els.comparisonSetup.classList.add("is-hidden");
    if (els.comparisonStatus) els.comparisonStatus.textContent = "Comparison mode is on. Choose a comparison case below.";

    updateDrillValueOptions();
    render();
  });
}

function bindBubbleChartEvents() {
  if (!els.bubbleChartBack) return;

  els.bubbleChartBack.addEventListener("click", () => {
    state.bubbleChartDrill.mode = "family";
    state.bubbleChartDrill.family = "";
    state.bubbleChartDrill.selectedFamilies = [];
    state.bubbleChartDrill.comparisonMode = false;
    render();
  });

  if (els.bubbleChartClear) {
    els.bubbleChartClear.addEventListener("click", () => {
      state.bubbleChartDrill.mode = "family";
      state.bubbleChartDrill.family = "";
      state.bubbleChartDrill.selectedFamilies = [];
      state.bubbleChartDrill.comparisonMode = false;
      render();
    });
  }

  if (!els.bubbleChartCompare) return;

  els.bubbleChartCompare.addEventListener("click", () => {
    if (state.bubbleChartDrill.selectedFamilies.length < 2) return;
    state.bubbleChartDrill.mode = "comparison";
    state.bubbleChartDrill.comparisonMode = true;
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
  // no-op: inline detail replaced by hover tooltip
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
    const axisLabel = percentMode ? toPct(tick) : toMoneyCompact(tick);
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
    brand: "Brand",
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
  els.summaryKpis?.classList.remove("is-hidden");
  els.singleWaterfallPanel?.classList.remove("is-hidden");
  els.comparisonPanel?.classList.add("is-hidden");
  els.insightStripPanel?.classList.add("is-hidden");
  document.getElementById("sku-ranking-panel")?.classList.add("is-hidden");
  renderOverallWaterfall(totals);
}

function renderSummaryKpis(totals, rows = []) {
  if (!els.summaryKpis) return;
  const totalVolume = totals.volume || 0;
  const skuCount = aggregateSkuRows(rows).length;
  const revenuePerSku = skuCount ? (totals.revenue || 0) / skuCount : 0;
  const grossMarginPerSku = skuCount ? (totals.grossMargin || 0) / skuCount : 0;
  const operatingIncomePerSku = skuCount ? (totals.operatingIncome || 0) / skuCount : 0;
  const volumePerSku = skuCount ? totalVolume / skuCount : 0;

  els.kpiRevenue.textContent = toMoney(totals.revenue || 0);
  els.kpiGrossMargin.textContent = toSignedMoney(totals.grossMargin || 0);
  els.kpiOperatingIncome.textContent = toSignedMoney(totals.operatingIncome || 0);
  els.kpiVolume.textContent = `${Math.round(totalVolume).toLocaleString()} bbl`;

  if (els.kpiRevenuePerSku) els.kpiRevenuePerSku.textContent = `${toMoneyDec(revenuePerSku)} / SKU`;
  if (els.kpiGrossMarginPerSku) els.kpiGrossMarginPerSku.textContent = `${toMoneyDec(grossMarginPerSku)} / SKU`;
  if (els.kpiOperatingIncomePerSku) els.kpiOperatingIncomePerSku.textContent = `${toMoneyDec(operatingIncomePerSku)} / SKU`;
  if (els.kpiVolumePerSku) {
    els.kpiVolumePerSku.textContent = `${Math.round(volumePerSku).toLocaleString()} bbl / SKU`;
  }

  els.kpiGrossMargin.className = getMetricToneClass(totals.grossMargin || 0);
  els.kpiOperatingIncome.className = getMetricToneClass(totals.operatingIncome || 0);
}

function aggregateByDimension(rows, key) {
  const map = rows.reduce((acc, row) => {
    const group = String(row[key] || "Unknown").trim() || "Unknown";
    if (!acc[group]) {
      acc[group] = {
        label: group,
        revenue: 0,
        volume: 0,
        operatingIncome: 0,
        conversion: 0
      };
    }
    acc[group].revenue += row.revenue || 0;
    acc[group].volume += row.volume || 0;
    acc[group].operatingIncome += row.operatingIncome || 0;
    acc[group].conversion += row.conversionTotal || 0;
    return acc;
  }, {});

  return Object.values(map);
}

function toWholePct(value) {
  return `${Math.round((value || 0) * 100)}%`;
}

function buildInsightCards(rows) {
  const totals = aggregate(rows);
  if (!rows.length || !totals.revenue) return [];

  const minShare = 0.05;
  const cards = [];
  const usedLabels = new Set();

  // TEMP: Comment out standard conversion cost insight card while investigating data gaps
  // if (totals.clientStdConversionCoverageVolume > 0) {
  //   const tone = (totals.clientStdConversionDeltaCpu || 0) > 0 ? "negative" : "positive";
  //   cards.push({
  //     eyebrow: "Costing Reality Check",
  //     headline: `Actual conversion cost is ${toSignedMoneyDec(totals.clientStdConversionDeltaCpu || 0)} per bbl vs Standard Conversion Cost/bbl.` ,
  //     detail: `Actual ${toMoneyDec(totals.actualConversionCpuCovered || 0)} vs Standard Conversion Cost/bbl ${toMoneyDec(totals.clientStdConversionCpu || 0)} on ${toWholePct(totals.clientStdCoveragePct)} of volume · total variance ${toSignedMoney(totals.clientStdConversionDeltaTotal || 0)}`,
  //     tone
  //   });
  // }

  const segments = aggregateByDimension(rows, "priceSegment").filter((item) => item.revenue / totals.revenue >= minShare);
  let bestMix = null;
  segments.forEach((item) => {
    const revenueShare = item.revenue / totals.revenue;
    const profitShare = totals.operatingIncome ? item.operatingIncome / totals.operatingIncome : 0;
    const gap = Math.abs(profitShare - revenueShare);
    if (!bestMix || gap > bestMix.gap) {
      bestMix = { item, revenueShare, profitShare, gap };
    }
  });

  if (bestMix) {
    usedLabels.add(bestMix.item.label);
    cards.push({
      eyebrow: "Mix Imbalance",
      headline: `${bestMix.item.label} contributes ${toWholePct(bestMix.revenueShare)} of revenue and ${toWholePct(bestMix.profitShare)} of operating income.`,
      detail: `Revenue ${toMoney(bestMix.item.revenue)} · Operating income ${toSignedMoney(bestMix.item.operatingIncome)}`,
      tone: bestMix.profitShare >= bestMix.revenueShare ? "positive" : "negative"
    });
  }

  const driverCandidates = [
    ...aggregateByDimension(rows, "plant").map((item) => ({ ...item, scope: "Plant" })),
    ...aggregateByDimension(rows, "brandFamily").map((item) => ({ ...item, scope: "Brand Family" }))
  ].filter((item) => ((totals.revenue ? item.revenue / totals.revenue : 0) >= minShare || (totals.volume ? item.volume / totals.volume : 0) >= minShare) && !usedLabels.has(item.label));

  let bestDriver = null;
  driverCandidates.forEach((item) => {
    const revenueShare = totals.revenue ? item.revenue / totals.revenue : 0;
    const volumeShare = totals.volume ? item.volume / totals.volume : 0;
    const conversionShare = totals.conversion ? item.conversion / totals.conversion : 0;
    const profitShare = totals.operatingIncome ? item.operatingIncome / totals.operatingIncome : 0;
    const options = [];

    if (totals.conversion && item.conversion > 0) {
      options.push({
        gap: Math.abs(conversionShare - volumeShare),
        weightedGap: Math.abs(conversionShare - volumeShare) * Math.max(volumeShare, 0.08) * 1.15,
        headline: `${item.label} contributes ${toWholePct(volumeShare)} of volume and ${toWholePct(conversionShare)} of conversion cost.`,
        detail: `${item.scope} · Conversion cost ${toMoney(item.conversion)} · Volume ${Math.round(item.volume).toLocaleString()} bbl`,
        tone: conversionShare > volumeShare ? "negative" : "neutral"
      });
    }

    options.push({
      gap: Math.abs(profitShare - revenueShare),
      weightedGap: Math.abs(profitShare - revenueShare) * Math.max(revenueShare, 0.08),
      headline: `${item.label} contributes ${toWholePct(revenueShare)} of revenue and ${toWholePct(profitShare)} of operating income.`,
      detail: `${item.scope} · Revenue ${toMoney(item.revenue)} · Operating income ${toSignedMoney(item.operatingIncome)}`,
      tone: profitShare >= revenueShare ? "positive" : "negative"
    });

    options.forEach((option) => {
      const weightedGap = option.weightedGap ?? (option.gap * Math.max(revenueShare, volumeShare, 0.08));
      if (!bestDriver || weightedGap > bestDriver.weightedGap) {
        bestDriver = { ...option, weightedGap };
      }
    });
  });

  if (bestDriver) {
    cards.push({
      eyebrow: "Material Driver",
      headline: bestDriver.headline,
      detail: bestDriver.detail,
      tone: bestDriver.tone
    });
  }

  const familyMap = rows.reduce((acc, row) => {
    const family = String(row.brandFamily || "Unknown").trim() || "Unknown";
    if (!acc[family]) acc[family] = [];
    acc[family].push(row);
    return acc;
  }, {});

  let bestSpread = null;
  const spreadKeys = [
    { key: "containerType", label: "Container Type" },
    { key: "containerSize", label: "Package Size" },
    { key: "priceSegment", label: "Price Segment" }
  ];

  Object.entries(familyMap).forEach(([family, familyRows]) => {
    const familyTotals = aggregate(familyRows);
    if (!familyTotals.volume || familyTotals.revenue / totals.revenue < minShare) return;

    spreadKeys.forEach(({ key, label }) => {
      const groups = aggregateByDimension(familyRows, key).filter((item) => item.volume > 0);
      if (groups.length < 2) return;

      const ranked = groups
        .map((item) => ({ ...item, oiPerBbl: item.volume ? item.operatingIncome / item.volume : 0 }))
        .sort((a, b) => b.oiPerBbl - a.oiPerBbl);

      const best = ranked[0];
      const worst = ranked[ranked.length - 1];
      const spread = best.oiPerBbl - worst.oiPerBbl;
      const weightedSpread = spread * (familyTotals.volume / totals.volume);

      if (!bestSpread || weightedSpread > bestSpread.weightedSpread) {
        bestSpread = {
          family,
          label,
          best,
          worst,
          spread,
          weightedSpread
        };
      }
    });
  });

  if (bestSpread) {
    cards.push({
      eyebrow: "Within-Family Spread",
      headline: `Within ${bestSpread.family}, ${bestSpread.best.label} outperforms ${bestSpread.worst.label} by ${toMoney(bestSpread.spread)} per bbl.`,
      detail: `${bestSpread.label} comparison · ${toSignedMoney(bestSpread.best.oiPerBbl)} vs ${toSignedMoney(bestSpread.worst.oiPerBbl)} OI per bbl`,
      tone: "neutral"
    });
  }

  return cards.slice(0, 3);
}

function renderInsightStrip(rows) {
  if (!els.insightStrip || !els.insightStripPanel) return;

  if (state.comparisonMode) {
    els.insightStripPanel.classList.add("is-hidden");
    return;
  }

  const cards = buildInsightCards(rows);
  const totals = aggregate(rows);
  if (els.insightStripSubtitle) {
    if (!rows.length) {
      els.insightStripSubtitle.textContent = "No data for current filters.";
    } else {
      const baseSubtitle = `${rows.length.toLocaleString()} records in current view · ${Math.round(totals.volume || 0).toLocaleString()} bbl · ${toSignedMoney(totals.operatingIncome || 0)} operating income`;
      const stdSubtitle = totals.clientStdConversionCoverageVolume > 0
        ? ` · conversion gap ${toSignedMoneyDec(totals.clientStdConversionDeltaCpu || 0)} / bbl vs Standard Conversion Cost/bbl`
        : "";
      els.insightStripSubtitle.textContent = `${baseSubtitle}${stdSubtitle}`;
    }
  }

  if (!cards.length) {
    els.insightStrip.innerHTML = '<div class="insight-empty">No insight cards available for current filters.</div>';
    return;
  }

  els.insightStrip.innerHTML = cards.map((card, index) => `
    <article class="insight-card insight-card-${card.tone}" style="animation-delay:${index * 90}ms">
      <p class="insight-eyebrow">${card.eyebrow}</p>
      <h3>${card.headline}</h3>
      <p class="insight-detail">${card.detail}</p>
    </article>
  `).join("");
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

function buildSkuTooltipHtml(d) {
  const oi = d.operatingIncome;
  const lines = [
    ["Revenue", toMoney(d.revenue), "base"],
    ["Brewing Materials", toSignedMoney(-Math.abs(d.brewMat)), "cost"],
    ["Packaging Materials", toSignedMoney(-Math.abs(d.pkgMat)), "cost"],
    ["Conversion Costs", toSignedMoney(-Math.abs(d.conversion)), "cost"],
    ["Gross Margin", `${toSignedMoney(d.grossMargin)} (${toPct(d.gmPct)})`, "subtotal"],
    ["Distribution / Freight", toSignedMoney(-Math.abs(d.freight)), "cost"],
    ["Marketing", toSignedMoney(-Math.abs(d.marketing)), "cost"],
    ["SG&A", toSignedMoney(-Math.abs(d.sga)), "cost"],
    ["Operating Income", `${toSignedMoney(oi)} (${toPct(d.omPct)})`, oi >= 0 ? "final-pos" : "final-neg"]
  ];
  return `
    <div class="sku-tt-head">
      <strong>${d.sku}</strong>
      <span>${d.description}</span>
    </div>
    <div class="sku-tt-body">
      ${lines.map(([label, value, type]) => `
        <div class="sku-tt-row sku-tt-row-${type}">
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderSkuRankingTable(target, rows, metric, allRows, scope) {
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
          return `
            <tr class="sku-row-hoverable" data-sku="${row.sku}">
              <td class="sku-cell">${row.sku}</td>
              <td class="sku-description">${row.description || row.sku}</td>
              <td class="sku-metric ${toneClass}">${metric.format(metricValue)}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;

  // Attach pre-computed detail to each row element for tooltip use
  target.querySelectorAll("tr[data-sku]").forEach((tr) => {
    tr._skuDetail = getSkuDetailTotals(allRows, tr.dataset.sku);
  });
}

function renderSkuRanking(rows, targets = {}) {
  const { metric, top, bottom } = getRankedSkuRows(rows);
  const scope = targets.scope || "single";
  const topTarget = targets.top || els.skuTopList;
  const bottomTarget = targets.bottom || els.skuBottomList;
  renderSkuRankingTable(topTarget, top, metric, rows, scope);
  renderSkuRankingTable(bottomTarget, bottom, metric, rows, scope);

  const tooltip = document.getElementById("sku-tooltip");
  if (tooltip) {
    [topTarget, bottomTarget].forEach((container) => {
      container?.querySelectorAll("tr[data-sku]").forEach((tr) => {
        tr.addEventListener("mouseenter", () => {
          if (!tr._skuDetail) return;
          tooltip.innerHTML = buildSkuTooltipHtml(tr._skuDetail);
          tooltip.classList.remove("is-hidden");
        });
        tr.addEventListener("mouseleave", () => {
          tooltip.classList.add("is-hidden");
        });
        tr.addEventListener("mousemove", (e) => {
          const x = e.clientX + 18;
          const y = e.clientY - 10;
          tooltip.style.left = Math.min(x, window.innerWidth - tooltip.offsetWidth - 12) + "px";
          tooltip.style.top = Math.max(10, Math.min(y, window.innerHeight - tooltip.offsetHeight - 12)) + "px";
        });
      });
    });
  }
}

function buildWhaleCurveData(rows) {
  const metricKey = "operatingIncome";
  const aggregated = aggregateSkuRows(rows)
    .sort((a, b) => (b[metricKey] || 0) - (a[metricKey] || 0));

  if (!aggregated.length) return { points: [], peakIndex: 0, total: 0 };

  const total = aggregated.reduce((sum, row) => sum + (row[metricKey] || 0), 0);
  let cumulative = 0;
  let peakIndex = 0;
  let peakValue = -Infinity;

  const points = aggregated.map((row, i) => {
    cumulative += row[metricKey] || 0;
    const pct = (i + 1) / aggregated.length;
    if (cumulative > peakValue) {
      peakValue = cumulative;
      peakIndex = i;
    }
    return { x: pct, y: cumulative, sku: row.sku, cumulative, index: i };
  });

  // Prepend origin
  points.unshift({ x: 0, y: 0, sku: null, cumulative: 0, index: -1 });

  return { points, peakIndex: peakIndex + 1, total, peakValue };
}

function buildStdWhaleCurveData(rows) {
  // Aggregate SKU rows, accumulating standard cost fields
  const skuMap = rows.reduce((acc, row) => {
    const key = row.sku || "Unknown";
    if (!acc[key]) {
      acc[key] = { sku: key, revenue: 0, operatingIncome: 0, volume: 0,
        convTotal: 0, stdConvTotal: 0, sgaTotal: 0, stdSgaTotal: 0, hasStd: false };
    }
    const a = acc[key];
    a.revenue += row.revenue || 0;
    a.operatingIncome += row.operatingIncome || 0;
    a.volume += row.volume || 0;
    if (row.hasClientStdConversionCpu) {
      a.convTotal += row.conversionTotal || 0;
      a.stdConvTotal += row.clientStdConversionTotal || 0;
      a.sgaTotal += row.sgaTotal || 0;
      a.stdSgaTotal += Number.isFinite(row.clientStdSgaCpu)
        ? (row.clientStdSgaCpu * (row.volume || 0))
        : (row.sgaTotal || 0);
      a.hasStd = true;
    }
    return acc;
  }, {});

  const aggregated = Object.values(skuMap).map((a) => {
    const convDiff = a.hasStd ? a.convTotal - a.stdConvTotal : 0;
    const sgaDiff = a.hasStd ? a.sgaTotal - a.stdSgaTotal : 0;
    const stdOm = a.operatingIncome + convDiff + sgaDiff;
    return { ...a, stdOm };
  }).sort((a, b) => (b.stdOm || 0) - (a.stdOm || 0));

  if (!aggregated.length) return { points: [], peakIndex: 0, total: 0, peakValue: -Infinity };

  const total = aggregated.reduce((sum, r) => sum + (r.stdOm || 0), 0);
  let cumulative = 0;
  let peakIndex = 0;
  let peakValue = -Infinity;

  const points = aggregated.map((r, i) => {
    cumulative += r.stdOm || 0;
    const pct = (i + 1) / aggregated.length;
    if (cumulative > peakValue) { peakValue = cumulative; peakIndex = i; }
    return { x: pct, y: cumulative, sku: r.sku, cumulative, index: i,
      volume: r.volume, revenue: r.revenue, operatingIncome: r.stdOm };
  });

  points.unshift({ x: 0, y: 0, sku: null, cumulative: 0, index: -1, volume: 0, revenue: 0, operatingIncome: 0 });
  return { points, peakIndex: peakIndex + 1, total, peakValue };
}

function getDimensionLabel(dimensionKey) {
  return drillOptions.find((option) => option.value === dimensionKey)?.label || dimensionKey;
}

function buildSegmentRealityGroups(rows) {
  const dimensionKey = state.segmentReality.dimension;
  const BRAND_FAMILY_GROUP_LIMIT = 12;
  const normalizeSegmentLabel = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const byGroup = rows.reduce((acc, row) => {
    const key = String(row[dimensionKey] || "Unknown").trim() || "Unknown";
    if (!acc[key]) {
      acc[key] = {
        key,
        label: key,
        volume: 0,
        revenue: 0,
        operatingIncome: 0,
        coveredVolume: 0,
        actualConversionCoveredTotal: 0,
        stdConversionCoveredTotal: 0,
        actualSgaCoveredTotal: 0,
        stdSgaCoveredTotal: 0
      };
    }

    const g = acc[key];
    g.volume += row.volume || 0;
    g.revenue += row.revenue || 0;
    g.operatingIncome += row.operatingIncome || 0;

    if (row.hasClientStdConversionCpu) {
      g.coveredVolume += row.volume || 0;
      g.actualConversionCoveredTotal += row.conversionTotal || 0;
      g.stdConversionCoveredTotal += row.clientStdConversionTotal || 0;
      g.actualSgaCoveredTotal += row.sgaTotal || 0;
      g.stdSgaCoveredTotal += Number.isFinite(row.clientStdSgaCpu)
        ? (row.clientStdSgaCpu * (row.volume || 0))
        : 0;
    }

    return acc;
  }, {});

  const toSegmentRealityMetrics = (g) => {
    const conversionOverstatementTotal = g.actualConversionCoveredTotal - g.stdConversionCoveredTotal;
    const sgaOverstatementTotal = g.actualSgaCoveredTotal - g.stdSgaCoveredTotal;
    const omOverstatementTotal = conversionOverstatementTotal + sgaOverstatementTotal;
    const clientReportedOperatingIncome = g.operatingIncome + omOverstatementTotal;
    const alignedOmPct = g.operatingIncome / g.revenue;
    const clientReportedOmPct = clientReportedOperatingIncome / g.revenue;
    return {
      ...g,
      isOtherGroup: Boolean(g.isOtherGroup),
      conversionOverstatementTotal,
      sgaOverstatementTotal,
      omOverstatementTotal,
      clientReportedOperatingIncome,
      alignedOmPct,
      clientReportedOmPct,
      omPctDelta: alignedOmPct - clientReportedOmPct,
      actualConversionCpu: g.actualConversionCoveredTotal / g.coveredVolume,
      stdConversionCpu: g.stdConversionCoveredTotal / g.coveredVolume,
      conversionGapCpu: (g.actualConversionCoveredTotal - g.stdConversionCoveredTotal) / g.coveredVolume,
      actualSgaCpu: g.actualSgaCoveredTotal / g.coveredVolume,
      stdSgaCpu: g.stdSgaCoveredTotal / g.coveredVolume,
      sgaGapCpu: (g.actualSgaCoveredTotal - g.stdSgaCoveredTotal) / g.coveredVolume,
      complexityAdjOpPerBbl: g.coveredVolume ? g.operatingIncome / g.coveredVolume : 0,
      standardOpPerBbl: g.coveredVolume ? clientReportedOperatingIncome / g.coveredVolume : 0,
      coveragePct: g.volume ? g.coveredVolume / g.volume : 0
    };
  };

  let rowsWithMetrics = Object.values(byGroup)
    .filter((g) => String(g.label || "").trim().toLowerCase() !== "unknown")
    .filter((g) => g.coveredVolume > 0 && g.revenue > 0)
    .map(toSegmentRealityMetrics);

  if (dimensionKey === "brandFamily" && rowsWithMetrics.length > BRAND_FAMILY_GROUP_LIMIT) {
    const byRevenue = [...rowsWithMetrics].sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
    const top = byRevenue.slice(0, BRAND_FAMILY_GROUP_LIMIT);
    const remainder = byRevenue.slice(BRAND_FAMILY_GROUP_LIMIT);

    if (remainder.length) {
      const otherBase = remainder.reduce((acc, g) => {
        acc.volume += g.volume || 0;
        acc.revenue += g.revenue || 0;
        acc.operatingIncome += g.operatingIncome || 0;
        acc.coveredVolume += g.coveredVolume || 0;
        acc.actualConversionCoveredTotal += g.actualConversionCoveredTotal || 0;
        acc.stdConversionCoveredTotal += g.stdConversionCoveredTotal || 0;
        acc.actualSgaCoveredTotal += g.actualSgaCoveredTotal || 0;
        acc.stdSgaCoveredTotal += g.stdSgaCoveredTotal || 0;
        return acc;
      }, {
        key: "__other__",
        label: "Other",
        isOtherGroup: true,
        volume: 0,
        revenue: 0,
        operatingIncome: 0,
        coveredVolume: 0,
        actualConversionCoveredTotal: 0,
        stdConversionCoveredTotal: 0,
        actualSgaCoveredTotal: 0,
        stdSgaCoveredTotal: 0
      });

      rowsWithMetrics = [...top, toSegmentRealityMetrics(otherBase)];
    }
  }

  if (dimensionKey === "priceSegment") {
    const rankMap = {
      budget: 1,
      nearpremium: 2,
      premium: 3,
      abovepremium: 4,
      nonalcohol: 5,
      nonalcoholic: 5
    };
    rowsWithMetrics.sort((a, b) => {
      const ra = rankMap[normalizeSegmentLabel(a.label)] || 99;
      const rb = rankMap[normalizeSegmentLabel(b.label)] || 99;
      if (ra !== rb) return ra - rb;
      return String(a.label).localeCompare(String(b.label));
    });
  } else {
    const [sortKey, sortDir] = String(state.segmentReality.sort || "omOverstatement-desc").split("-");
    rowsWithMetrics.sort((a, b) => {
      const diff = (a[sortKey] || 0) - (b[sortKey] || 0);
      return sortDir === "asc" ? diff : -diff;
    });
  }

  const topN = Math.max(1, state.segmentReality.topN || 999);
  return rowsWithMetrics.slice(0, topN);
}

function buildSegmentRealitySystemAverage(rows) {
  const coveredRows = rows.filter((row) => row.hasClientStdConversionCpu && (row.revenue || 0) > 0);
  if (!coveredRows.length) return null;

  const totals = coveredRows.reduce((acc, row) => {
    acc.revenue += row.revenue || 0;
    acc.operatingIncome += row.operatingIncome || 0;
    acc.coveredVolume += row.volume || 0;
    acc.actualConversionCoveredTotal += row.conversionTotal || 0;
    acc.stdConversionCoveredTotal += row.clientStdConversionTotal || 0;
    acc.actualSgaCoveredTotal += row.sgaTotal || 0;
    acc.stdSgaCoveredTotal += Number.isFinite(row.clientStdSgaCpu)
      ? (row.clientStdSgaCpu * (row.volume || 0))
      : 0;
    return acc;
  }, {
    revenue: 0,
    operatingIncome: 0,
    coveredVolume: 0,
    actualConversionCoveredTotal: 0,
    stdConversionCoveredTotal: 0,
    actualSgaCoveredTotal: 0,
    stdSgaCoveredTotal: 0
  });

  if (!totals.revenue || !totals.coveredVolume) return null;

  const conversionOverstatementTotal = totals.actualConversionCoveredTotal - totals.stdConversionCoveredTotal;
  const sgaOverstatementTotal = totals.actualSgaCoveredTotal - totals.stdSgaCoveredTotal;
  const omOverstatementTotal = conversionOverstatementTotal + sgaOverstatementTotal;
  const clientReportedOperatingIncome = totals.operatingIncome + omOverstatementTotal;
  const alignedOmPct = totals.operatingIncome / totals.revenue;
  const clientReportedOmPct = clientReportedOperatingIncome / totals.revenue;

  return {
    key: "__system_average__",
    label: "System Average",
    isSystemAverage: true,
    revenue: totals.revenue,
    operatingIncome: totals.operatingIncome,
    coveredVolume: totals.coveredVolume,
    actualConversionCoveredTotal: totals.actualConversionCoveredTotal,
    stdConversionCoveredTotal: totals.stdConversionCoveredTotal,
    actualSgaCoveredTotal: totals.actualSgaCoveredTotal,
    stdSgaCoveredTotal: totals.stdSgaCoveredTotal,
    conversionOverstatementTotal,
    sgaOverstatementTotal,
    omOverstatementTotal,
    clientReportedOperatingIncome,
    alignedOmPct,
    clientReportedOmPct,
    omPctDelta: alignedOmPct - clientReportedOmPct,
    actualConversionCpu: totals.actualConversionCoveredTotal / totals.coveredVolume,
    stdConversionCpu: totals.stdConversionCoveredTotal / totals.coveredVolume,
    conversionGapCpu: conversionOverstatementTotal / totals.coveredVolume,
    actualSgaCpu: totals.actualSgaCoveredTotal / totals.coveredVolume,
    stdSgaCpu: totals.stdSgaCoveredTotal / totals.coveredVolume,
    sgaGapCpu: sgaOverstatementTotal / totals.coveredVolume,
    complexityAdjOpPerBbl: totals.coveredVolume ? totals.operatingIncome / totals.coveredVolume : 0,
    standardOpPerBbl: totals.coveredVolume ? clientReportedOperatingIncome / totals.coveredVolume : 0,
    coveragePct: 1
  };
}

function renderSegmentRealityFooter(groups) {
  if (!els.segmentRealityFooter) return;

  if (!groups.length) {
    els.segmentRealityFooter.innerHTML = "";
    return;
  }

  els.segmentRealityFooter.innerHTML = `
    <table class="segment-reality-table">
      <tbody>
        <tr>
          <td>Rev/bbl</td>
          ${groups.map((g) => {
            const revPerBbl = g.coveredVolume ? g.revenue / g.coveredVolume : 0;
            return `<td class="${g.isSystemAverage ? "segment-reality-system-col" : ""}">${toMoneyDec(revPerBbl)}</td>`;
          }).join("")}
        </tr>
        <tr>
          <td>Cost/bbl</td>
          ${groups.map((g) => {
            const revPerBbl = g.coveredVolume ? g.revenue / g.coveredVolume : 0;
            const stdCostPerBbl = revPerBbl - (g.standardOpPerBbl || 0);
            const adjCostPerBbl = revPerBbl - (g.complexityAdjOpPerBbl || 0);
            return `<td class="${g.isSystemAverage ? "segment-reality-system-col" : ""}">Std ${toMoneyDec(stdCostPerBbl)}<br>Adj ${toMoneyDec(adjCostPerBbl)}</td>`;
          }).join("")}
        </tr>
        <tr>
          <td>OM/bbl</td>
          ${groups.map((g) => {
            const opGap = g.complexityAdjOpPerBbl - g.standardOpPerBbl;
            const classes = `${g.isSystemAverage ? "segment-reality-system-col " : ""}${getMetricToneClass(opGap)}`;
            return `<td class="${classes}">Std ${toMoneyDec(g.standardOpPerBbl)}<br>Adj ${toMoneyDec(g.complexityAdjOpPerBbl)}</td>`;
          }).join("")}
        </tr>
      </tbody>
    </table>
  `;
}

function renderSegmentRealityCheck(rows) {
  if (!els.segmentRealityPanel) return;

  els.segmentRealityPanel.classList.remove("is-hidden");

  const groups = buildSegmentRealityGroups(rows);
  const averageGroup = buildSegmentRealitySystemAverage(rows);
  const groupsWithAverage = averageGroup ? [...groups, averageGroup] : groups;
  const dimensionLabel = getDimensionLabel(state.segmentReality.dimension);

  if (els.segmentRealitySubtitle) {
    const coverageRows = rows.filter((r) => r.hasClientStdConversionCpu);
    const coveredVolume = coverageRows.reduce((sum, r) => sum + (r.volume || 0), 0);
    const totalVolume = rows.reduce((sum, r) => sum + (r.volume || 0), 0);
    const coveragePct = totalVolume ? coveredVolume / totalVolume : 0;
    const groupedNote = state.segmentReality.dimension === "brandFamily"
      ? " · top 12 by revenue + Other"
      : "";
    els.segmentRealitySubtitle.textContent = `${dimensionLabel} view${groupedNote} · click any bar/column to drill dashboard · standard coverage ${toPct(coveragePct)} of filtered volume`;
  }

  if (!groupsWithAverage.length || !els.segmentRealityChart) {
    if (segmentRealityChart) {
      segmentRealityChart.destroy();
      segmentRealityChart = null;
    }
    if (els.segmentRealityEmpty) els.segmentRealityEmpty.classList.remove("is-hidden");
    renderSegmentRealityFooter([]);
    return;
  }

  if (els.segmentRealityEmpty) els.segmentRealityEmpty.classList.add("is-hidden");

  const labels = groupsWithAverage.map((g) => g.label);
  const reportedOm = groupsWithAverage.map((g) => (g.clientReportedOmPct || 0) * 100);
  const alignedOm = groupsWithAverage.map((g) => (g.alignedOmPct || 0) * 100);
  const averageIndex = groupsWithAverage.findIndex((g) => g.isSystemAverage);

  if (segmentRealityChart) {
    segmentRealityChart.destroy();
    segmentRealityChart = null;
  }

  segmentRealityChart = new Chart(els.segmentRealityChart, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "As-Reported OM%",
          data: reportedOm,
          backgroundColor: "rgba(255, 174, 87, 0.82)",
          borderColor: "rgba(255, 174, 87, 1)",
          borderWidth: 1,
          borderRadius: 5
        },
        {
          label: "Adjusted OM%",
          data: alignedOm,
          backgroundColor: "rgba(69, 208, 162, 0.82)",
          borderColor: "rgba(69, 208, 162, 1)",
          borderWidth: 1,
          borderRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        // Keep chart plot area aligned with table value columns (first table column is row labels).
        padding: { left: 80, right: 10 }
      },
      onClick: (_, elements) => {
        if (!elements.length) return;
        const idx = elements[0].index;
        const clickedGroup = groupsWithAverage[idx];
        if (!clickedGroup || clickedGroup.isSystemAverage || clickedGroup.isOtherGroup) return;
        const groupLabel = labels[idx];
        state.segmentReality.selectedGroup = state.segmentReality.selectedGroup === groupLabel ? "" : groupLabel;
        state.drill.dimension = state.segmentReality.dimension;
        state.drill.value = state.segmentReality.selectedGroup || "All";
        if (els.drillDimension) els.drillDimension.value = state.drill.dimension;
        updateDrillValueOptions();
        render();
      },
      plugins: {
        legend: {
          labels: { color: "#9fb0d3" }
        },
        tooltip: {
          callbacks: {
            afterBody: (items) => {
              const idx = items[0]?.dataIndex ?? 0;
              const g = groupsWithAverage[idx];
              return [
                `Actual Conv: ${toMoneyDec(g.actualConversionCpu)} / bbl`,
                `Standard Conversion Cost/bbl: ${toMoneyDec(g.stdConversionCpu)}`,
                `Conv Gap: ${toSignedMoneyDec(g.conversionGapCpu)} / bbl`,
                `Actual SG&A: ${toMoneyDec(g.actualSgaCpu)} / bbl`,
                `Standard SG&A: ${toMoneyDec(g.stdSgaCpu)} / bbl`,
                `SG&A Gap: ${toSignedMoneyDec(g.sgaGapCpu)} / bbl`,
                `OM Overstatement: ${toSignedMoney(g.omOverstatementTotal)}`
              ];
            }
          }
        },
        segmentAverageDivider: {
          averageIndex
        }
      },
      scales: {
        y: {
          ticks: {
            color: "#9fb0d3",
            callback: (v) => `${v}%`
          },
          grid: { color: "rgba(159,176,211,.12)" }
        },
        x: {
          ticks: { color: "#9fb0d3" },
          grid: { display: false }
        }
      }
    }
  });

  renderSegmentRealityFooter(groupsWithAverage);
}

Chart.register({
  id: "segmentAverageDivider",
  afterDatasetsDraw(chart, _args, pluginOptions) {
    const averageIndex = pluginOptions?.averageIndex;
    if (!Number.isInteger(averageIndex) || averageIndex <= 0) return;
    const xScale = chart.scales?.x;
    const yScale = chart.scales?.y;
    if (!xScale || !yScale) return;

    const prevX = xScale.getPixelForTick(averageIndex - 1);
    const avgX = xScale.getPixelForTick(averageIndex);
    const dividerX = (prevX + avgX) / 2;

    const ctx = chart.ctx;
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "rgba(159,176,211,.65)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(dividerX, yScale.top + 6);
    ctx.lineTo(dividerX, yScale.bottom);
    ctx.stroke();
    ctx.restore();
  }
});

function renderWhaleCurveReport(allPoints, metricLabel) {
  const report = els.whaleCurveReport;
  const clearBtn = els.whaleCurveClear;
  if (!report) return;

  const omLabel = metricLabel || "Op Income";

  const { point1, point2 } = state.whaleCurveSelection;

  if (point1 === null && point2 === null) {
    report.innerHTML = '<p class="whale-report-empty">Click two points on the curve to see a range report.</p>';
    clearBtn?.classList.add("is-hidden");
    return;
  }

  if (point1 !== null && point2 === null) {
    const skuDenominator = Math.max(1, allPoints.length - 2);
    const pct = (point1 / skuDenominator * 100).toFixed(1);
    report.innerHTML = `<p class="whale-report-empty">Point 1 set at ${pct}% — click a second point.</p>`;
    clearBtn?.classList.remove("is-hidden");
    return;
  }

  const lo = Math.min(point1, point2);
  const hi = Math.max(point1, point2);
  // allPoints[0] is origin; actual SKUs start at index 1
  const selectedPoints = allPoints.slice(lo + 1, hi + 2);

  const skuCount = selectedPoints.length;
  const totalVolume = selectedPoints.reduce((s, p) => s + (p.volume || 0), 0);
  const totalRevenue = selectedPoints.reduce((s, p) => s + (p.revenue || 0), 0);
  const totalOpIncome = selectedPoints.reduce((s, p) => s + (p.operatingIncome || 0), 0);
  const avgVolume = skuCount ? totalVolume / skuCount : 0;
  const avgRevenue = skuCount ? totalRevenue / skuCount : 0;
  const avgOpIncome = skuCount ? totalOpIncome / skuCount : 0;

  const skuDenominator = Math.max(1, allPoints.length - 2);
  const loPct = (lo / skuDenominator * 100).toFixed(1);
  const hiPct = (hi / skuDenominator * 100).toFixed(1);

  clearBtn?.classList.remove("is-hidden");

  report.innerHTML = `
    <div class="whale-report-head">
      <h4>Selected Range</h4>
      <p class="whale-report-range">${loPct}% &ndash; ${hiPct}% of SKUs</p>
    </div>
    <div class="whale-report-stats">
      <div class="whale-stat">
        <span class="whale-stat-label">SKUs</span>
        <strong class="whale-stat-value">${skuCount.toLocaleString()}</strong>
      </div>
      <div class="whale-stat">
        <span class="whale-stat-label">Total Volume</span>
        <strong class="whale-stat-value">${Math.round(totalVolume).toLocaleString()} bbl</strong>
      </div>
      <div class="whale-stat">
        <span class="whale-stat-label">Avg Volume</span>
        <strong class="whale-stat-value">${Math.round(avgVolume).toLocaleString()} bbl</strong>
      </div>
      <div class="whale-stat">
        <span class="whale-stat-label">Total Revenue</span>
        <strong class="whale-stat-value">${toMoney(totalRevenue)}</strong>
      </div>
      <div class="whale-stat">
        <span class="whale-stat-label">Avg Revenue</span>
        <strong class="whale-stat-value">${toMoney(avgRevenue)}</strong>
      </div>
      <div class="whale-stat">
        <span class="whale-stat-label">Total ${omLabel}</span>
        <strong class="whale-stat-value ${totalOpIncome >= 0 ? "is-positive" : "is-negative"}">${toSignedMoney(totalOpIncome)}</strong>
      </div>
      <div class="whale-stat">
        <span class="whale-stat-label">Avg ${omLabel}</span>
        <strong class="whale-stat-value ${avgOpIncome >= 0 ? "is-positive" : "is-negative"}">${toSignedMoney(avgOpIncome)}</strong>
      </div>
    </div>
  `;
}

function renderWhaleCurve(rows) {
  if (!els.whaleCurveChart) return;

  const { points, peakIndex, total, peakValue } = buildWhaleCurveData(rows);

  // Build both adjusted and standard cost curve data
  const stdData = buildStdWhaleCurveData(rows);
  const stdPoints = stdData.points;
  const stdPeakIndex = stdData.peakIndex;
  const stdPeakValue = stdData.peakValue;

  // Attach volume/revenue/operatingIncome back onto adjusted points for report use
  const aggregated = aggregateSkuRows(rows).sort((a, b) => (b.operatingIncome || 0) - (a.operatingIncome || 0));
  points.forEach((p, i) => {
    if (i === 0) { p.volume = 0; p.revenue = 0; p.operatingIncome = 0; return; }
    const sku = aggregated[i - 1];
    p.volume = sku?.volume || 0;
    p.revenue = sku?.revenue || 0;
    p.operatingIncome = sku?.operatingIncome || 0;
  });

  const activeLine = state.whaleCurveActiveLine || "adjusted";
  const activePoints = activeLine === "standard" ? stdPoints : points;
  const activeMetricLabel = activeLine === "standard" ? "As-Reported Op Income" : "Adjusted Op Income";
  renderWhaleCurveReport(activePoints, activeMetricLabel);

  const skuCount = points.length - 1;
  const peakPct = skuCount > 0 ? Math.round((peakIndex / skuCount) * 100) : 0;

  if (els.whaleCurveSubtitle) {
    if (!skuCount) {
      els.whaleCurveSubtitle.textContent = "No data for current filters.";
    } else {
      const profitablePct = skuCount > 0 ? Math.round((points.filter((p, i) => i > 0 && (p.y - (points[i - 1]?.y || 0)) > 0).length / skuCount) * 100) : 0;
      const activeLineLabel = activeLine === "standard" ? "As-Reported OM" : "Adjusted OM";
      els.whaleCurveSubtitle.textContent =
        `Peak adjusted OM ${toMoney(peakValue)} at ${peakPct}% of SKUs — ${100 - profitablePct}% of SKUs reduce total profit. Active line: ${activeLineLabel}. Click a curve to switch.`;
    }
  }

  const adjChartData = points.map((p) => ({ x: p.x * 100, y: p.y }));
  const stdChartData = stdPoints.map((p) => ({ x: p.x * 100, y: p.y }));

  const adjPeakX = points[peakIndex]?.x * 100 || 100;
  const stdPeakX = stdPoints[stdPeakIndex]?.x * 100 || 100;

  // Selection markers for the active line
  const selMarkers = [];
  const { point1: sel1, point2: sel2 } = state.whaleCurveSelection;
  const markerPoints = activeLine === "standard" ? stdPoints : points;
  if (sel1 !== null) { const sp1 = markerPoints[sel1 + 1]; if (sp1) selMarkers.push({ x: sp1.x * 100, y: sp1.y }); }
  if (sel2 !== null) { const sp2 = markerPoints[sel2 + 1]; if (sp2) selMarkers.push({ x: sp2.x * 100, y: sp2.y }); }

  if (whaleCurveChart) {
    whaleCurveChart.destroy();
    whaleCurveChart = null;
  }

  whaleCurveChart = new Chart(els.whaleCurveChart, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Adjusted OM",
          data: adjChartData,
          borderColor: activeLine === "adjusted" ? "#45d0a2" : "rgba(69,208,162,0.3)",
          borderWidth: activeLine === "adjusted" ? 3.5 : 1,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#ffffff",
          tension: 0.35,
          backgroundColor: "transparent",
          segment: activeLine === "adjusted" ? {
            borderColor: (ctx) => ctx.p1.parsed.x <= adjPeakX ? "#45d0a2" : "#ff8c7a"
          } : {}
        },
        {
          label: "As-Reported OM",
          data: stdChartData,
          borderColor: activeLine === "standard" ? "#ffae57" : "rgba(255,174,87,0.3)",
          borderWidth: activeLine === "standard" ? 3.5 : 1,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#ffffff",
          tension: 0.35,
          backgroundColor: "transparent",
          borderDash: [5, 3],
          segment: activeLine === "standard" ? {
            borderColor: (ctx) => ctx.p1.parsed.x <= stdPeakX ? "#ffae57" : "#ff6d6d"
          } : {}
        },
        {
          label: "Adjusted Peak",
          data: [{ x: points[peakIndex]?.x * 100, y: peakValue }],
          borderColor: "transparent",
          backgroundColor: "#45d0a2",
          pointRadius: 7,
          pointHoverRadius: 9,
          type: "scatter"
        },
        {
          label: "As-Reported Peak",
          data: [{ x: stdPoints[stdPeakIndex]?.x * 100, y: stdPeakValue }],
          borderColor: "transparent",
          backgroundColor: "#ffae57",
          pointRadius: 7,
          pointHoverRadius: 9,
          type: "scatter"
        },
        {
          label: "Selection",
          data: selMarkers,
          type: "scatter",
          backgroundColor: "#ffffff",
          borderColor: "#0f1a2d",
          borderWidth: 2,
          pointRadius: 8,
          pointHoverRadius: 10,
          pointStyle: "circle",
          order: -1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      onClick: (event, elements, chart) => {
        const xVal = chart.scales.x.getValueForPixel(event.x);
        const yVal = chart.scales.y.getValueForPixel(event.y);
        const pct = Math.max(0, Math.min(100, xVal)) / 100;

        // Determine which curve the click is nearer to by comparing y-distance at the clicked x
        const adjNearest = points.slice(1).reduce((best, p, i) => {
          const dist = Math.abs(p.x - pct);
          return dist < best.dist ? { dist, index: i, y: p.y } : best;
        }, { dist: Infinity, index: 0, y: 0 });
        const stdNearest = stdPoints.slice(1).reduce((best, p, i) => {
          const dist = Math.abs(p.x - pct);
          return dist < best.dist ? { dist, index: i, y: p.y } : best;
        }, { dist: Infinity, index: 0, y: 0 });

        const adjYDist = Math.abs(adjNearest.y - yVal);
        const stdYDist = Math.abs(stdNearest.y - yVal);

        const newActiveLine = stdYDist < adjYDist ? "standard" : "adjusted";
        const clickedIndex = newActiveLine === "standard" ? stdNearest.index : adjNearest.index;

        if (state.whaleCurveActiveLine !== newActiveLine) {
          // Switching curves resets selection
          state.whaleCurveActiveLine = newActiveLine;
          state.whaleCurveSelection = { point1: clickedIndex, point2: null };
        } else {
          const { point1, point2 } = state.whaleCurveSelection;
          if (point1 === null || point2 !== null) {
            state.whaleCurveSelection = { point1: clickedIndex, point2: null };
          } else {
            state.whaleCurveSelection.point2 = clickedIndex;
          }
        }
        render();
      },
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#9fb0d3",
            boxWidth: 24,
            filter: (item) => item.datasetIndex < 2
          }
        },
        tooltip: {
          callbacks: {
            title: (items) => `${items[0].parsed.x.toFixed(1)}% of SKUs`,
            label: (item) => {
              if (item.datasetIndex === 2) return `Adjusted Peak: ${toMoney(item.parsed.y)}`;
              if (item.datasetIndex === 3) return `As-Reported Peak: ${toMoney(item.parsed.y)}`;
              if (item.datasetIndex === 4) return null;
              const lbl = item.datasetIndex === 0 ? "Adjusted OM" : "As-Reported OM";
              return `Cumulative ${lbl}: ${toMoney(item.parsed.y)}`;
            }
          },
          backgroundColor: "rgba(15,26,45,0.95)",
          borderColor: "rgba(159,176,211,.2)",
          borderWidth: 1,
          titleColor: "#9fb0d3",
          bodyColor: "#e2eaf7",
          padding: 10
        }
      },
      scales: {
        x: {
          type: "linear",
          min: 0,
          max: 100,
          title: { display: true, text: "Cumulative % of SKUs (ranked high to low)", color: "#9fb0d3", font: { size: 11 } },
          ticks: { color: "#9fb0d3", callback: (v) => `${v}%` },
          grid: { color: "rgba(159,176,211,.1)" }
        },
        y: {
          title: { display: true, text: "Cumulative Operating Income", color: "#9fb0d3", font: { size: 11 } },
          ticks: { color: "#9fb0d3", callback: (v) => toMoney(v) },
          grid: { color: "rgba(159,176,211,.1)" }
        }
      }
    }
  });
}

function bindWhaleCurveEvents() {
  function buildOmMixGroups(rows) {
    const dimension = state.omMixDimension;
    let groups = aggregateByDimension(rows, dimension)
      .filter((g) => (g.revenue || 0) > 0)
      .map((g) => ({
        ...g,
        omPct: g.revenue ? (g.operatingIncome / g.revenue) * 100 : 0,
        isOther: false
      }));

    if (dimension === "brandFamily") {
      groups.sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
      const top = groups.slice(0, 10);
      const remainder = groups.slice(10);
      if (remainder.length) {
        const other = remainder.reduce((acc, g) => {
          acc.revenue += g.revenue || 0;
          acc.volume += g.volume || 0;
          acc.operatingIncome += g.operatingIncome || 0;
          return acc;
        }, {
          label: "Other",
          revenue: 0,
          volume: 0,
          operatingIncome: 0,
          isOther: true
        });
        other.omPct = other.revenue ? (other.operatingIncome / other.revenue) * 100 : 0;
        groups = [...top, other];
      } else {
        groups = top;
      }
    }

    return groups.sort((a, b) => (b.omPct || 0) - (a.omPct || 0));
  }

  function renderOmMixChart(rows) {
    if (!els.omMixPanel || !els.omMixChart) return;

    const groups = buildOmMixGroups(rows);
    const totals = aggregate(rows);
    const totalRevenue = groups.reduce((sum, g) => sum + (g.revenue || 0), 0);
    const portfolioOmPct = totals.revenue ? ((totals.operatingIncome || 0) / totals.revenue) * 100 : 0;
    const dimensionLabel = OM_MIX_DIMENSIONS.find((d) => d.value === state.omMixDimension)?.label || "Segment";

    if (els.omMixSubtitle) {
      els.omMixSubtitle.textContent = `${dimensionLabel} · bar width = revenue · y-axis = operating margin % · click a bar to drill`;
    }

    if (!groups.length || totalRevenue <= 0) {
      els.omMixChart.innerHTML = '<div class="sku-ranking-empty">No data for current filters.</div>';
      return;
    }

    const vals = groups.map((g) => g.omPct || 0).concat([portfolioOmPct, 0]);
    const minVal = Math.min(...vals);
    const maxVal = Math.max(...vals);
    let yMin = Math.floor((minVal - 2) / 5) * 5;
    let yMax = Math.ceil((maxVal + 2) / 5) * 5;
    if (yMax - yMin < 15) {
      yMax += 5;
      yMin -= 5;
    }

    const width = 1060;
    const height = 430;
    const margin = { top: 16, right: 18, bottom: 110, left: 66 };
    const plotW = width - margin.left - margin.right;
    const plotH = height - margin.top - margin.bottom;

    const y = (v) => margin.top + ((yMax - v) / (yMax - yMin)) * plotH;
    const zeroY = y(0);
    const avgY = y(portfolioOmPct);

    const tickStep = 10;
    const yTicks = [];
    for (let tick = Math.ceil(yMin / tickStep) * tickStep; tick <= yMax; tick += tickStep) {
      yTicks.push(tick);
    }

    let cumulative = 0;
    const bars = groups.map((g, idx) => {
      const share = (g.revenue || 0) / totalRevenue;
      const barX = margin.left + (cumulative * plotW);
      const barW = Math.max(8, share * plotW);
      cumulative += share;

      const value = g.omPct || 0;
      const yTop = y(Math.max(value, 0));
      const yBottom = y(Math.min(value, 0));
      const barH = Math.max(2, Math.abs(yBottom - yTop));
      const isGood = value >= portfolioOmPct;
      const barClass = isGood ? "om-mix-bar-good" : "om-mix-bar-bad";
      const isClickable = !(state.omMixDimension === "brandFamily" && g.isOther);
      const drillVal = encodeURIComponent(g.label);
      const barLabel = `${Math.round(value)}%`;
      const revLabel = toMoney(g.revenue || 0).replace(".00", "");
      const textX = barX + (barW / 2);
      const showNameInside = barW > 94;
      const shortName = String(g.label || "").length > 16 ? `${String(g.label).slice(0, 15)}…` : String(g.label);

      return `
        <g>
          <rect class="om-mix-bar ${barClass} ${isClickable ? "om-mix-bar-click" : ""}" data-idx="${idx}" data-drill="${drillVal}" x="${barX.toFixed(2)}" y="${Math.min(yTop, yBottom).toFixed(2)}" width="${barW.toFixed(2)}" height="${barH.toFixed(2)}"></rect>
          ${showNameInside ? `<text class="om-mix-text-main" x="${textX.toFixed(2)}" y="${(Math.min(yTop, yBottom) + 26).toFixed(2)}" text-anchor="middle">${barLabel}</text>` : ""}
          ${showNameInside ? `<text class="om-mix-text-sub" x="${textX.toFixed(2)}" y="${(Math.min(yTop, yBottom) + 48).toFixed(2)}" text-anchor="middle">${shortName}</text>` : ""}
          <text class="om-mix-rev" x="${textX.toFixed(2)}" y="${(zeroY - 10).toFixed(2)}" text-anchor="middle">${revLabel}</text>
          <text class="om-mix-xlabel" transform="translate(${(barX + 4).toFixed(2)}, ${(zeroY + 22).toFixed(2)}) rotate(-38)">${g.label}</text>
        </g>
      `;
    }).join("");

    const grid = yTicks.map((tick) => {
      const yy = y(tick);
      return `
        <line class="om-mix-grid" x1="${margin.left}" y1="${yy.toFixed(2)}" x2="${(width - margin.right).toFixed(2)}" y2="${yy.toFixed(2)}"></line>
        <text class="om-mix-ytick" x="${(margin.left - 6).toFixed(2)}" y="${(yy + 4).toFixed(2)}" text-anchor="end">${tick}%</text>
      `;
    }).join("");

    els.omMixChart.innerHTML = `
      <div class="om-mix-shell">
        <svg class="om-mix-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Operating Margin mix chart">
          ${grid}
          <line class="om-mix-zero" x1="${margin.left}" y1="${zeroY.toFixed(2)}" x2="${(width - margin.right).toFixed(2)}" y2="${zeroY.toFixed(2)}"></line>
          <line class="om-mix-avg" x1="${margin.left}" y1="${avgY.toFixed(2)}" x2="${(width - margin.right).toFixed(2)}" y2="${avgY.toFixed(2)}"></line>
          <text class="om-mix-avg-label" x="${(width - margin.right - 2).toFixed(2)}" y="${(avgY - 8).toFixed(2)}" text-anchor="end">Company OM avg ${portfolioOmPct.toFixed(1)}%</text>
          ${bars}
          <text class="om-mix-ytitle" transform="translate(16, ${(margin.top + (plotH / 2)).toFixed(2)}) rotate(-90)" text-anchor="middle">Operating margin %</text>
        </svg>
        <div class="om-mix-legend">
          <span><i class="swatch good"></i>At/above company OM avg</span>
          <span><i class="swatch bad"></i>Below company OM avg</span>
          <span><i class="swatch avg"></i>Company OM avg</span>
        </div>
      </div>
    `;

    els.omMixChart.querySelectorAll(".om-mix-bar-click").forEach((node) => {
      node.addEventListener("click", () => {
        const drillValue = decodeURIComponent(node.getAttribute("data-drill") || "");
        const sameSelection = state.drill.dimension === state.omMixDimension && state.drill.value === drillValue;
        state.drill.dimension = state.omMixDimension;
        state.drill.value = sameSelection ? "All" : drillValue;
        if (els.drillDimension) {
          els.drillDimension.value = state.drill.dimension;
        }
        updateDrillValueOptions();
        render();
      });
    });
  }
  els.whaleCurveClear?.addEventListener("click", () => {
    state.whaleCurveSelection = { point1: null, point2: null };
    state.whaleCurveActiveLine = "adjusted";
    render();
  });
}

function renderBubbleChart(rows) {
  if (!els.bubbleChart) return;

  const MAX_COMPARE_FAMILIES = 4;
  const SEG_COLORS = ["#45d0a2", "#4f9fff", "#ffae57", "#b28cff", "#ff8c7a", "#ffd966", "#7cd3ff", "#f77fb8"];
  const mode = state.bubbleChartDrill?.mode || "family";
  const selectedFamily = state.bubbleChartDrill?.family || "";

  const familyMap = {};
  rows.forEach((row) => {
    const familyKey = String(row.brandFamily || "Unknown").trim() || "Unknown";
    const skuKey = String(row.orderableSkuDescription || row.sku || "Unknown").trim() || "Unknown";
    const seg = String(row.priceSegment || "Unknown").trim() || "Unknown";

    if (!familyMap[familyKey]) {
      familyMap[familyKey] = {
        brandFamily: familyKey,
        revenue: 0,
        operatingIncome: 0,
        volume: 0,
        segCounts: {},
        skuMap: {}
      };
    }

    const family = familyMap[familyKey];
    family.revenue += row.revenue || 0;
    family.operatingIncome += row.operatingIncome || 0;
    family.volume += row.volume || 0;
    family.segCounts[seg] = (family.segCounts[seg] || 0) + 1;

    if (!family.skuMap[skuKey]) {
      family.skuMap[skuKey] = {
        label: skuKey,
        brandFamily: familyKey,
        revenue: 0,
        operatingIncome: 0,
        volume: 0,
        segCounts: {}
      };
    }

    const sku = family.skuMap[skuKey];
    sku.revenue += row.revenue || 0;
    sku.operatingIncome += row.operatingIncome || 0;
    sku.volume += row.volume || 0;
    sku.segCounts[seg] = (sku.segCounts[seg] || 0) + 1;
  });

  const families = Object.values(familyMap)
    .map((f) => ({
      ...f,
      priceSegment: Object.entries(f.segCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown"
    }))
    .filter((f) => f.revenue > 0);

  if (!families.length) {
    if (bubbleChart) { bubbleChart.destroy(); bubbleChart = null; }
    if (els.bubbleChartBack) els.bubbleChartBack.classList.add("is-hidden");
    if (els.bubbleChartCompare) els.bubbleChartCompare.classList.add("is-hidden");
    if (els.bubbleChartClear) els.bubbleChartClear.classList.add("is-hidden");
    return;
  }

  let entities = families;
  let subtitle = `${families.length} brand families — bubble size = volume · select up to ${MAX_COMPARE_FAMILIES}, then Compare`;
  const selectedFamilies = state.bubbleChartDrill?.selectedFamilies || [];

  if (mode === "sku" && selectedFamily) {
    const family = families.find((f) => f.brandFamily === selectedFamily);
    if (family) {
      entities = Object.values(family.skuMap)
        .map((sku) => ({
          ...sku,
          priceSegment: Object.entries(sku.segCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown"
        }))
        .filter((sku) => sku.revenue > 0);
      subtitle = `${selectedFamily} — ${entities.length} SKUs · bubble size = volume · click Back to Brand Family View`;
    } else {
      state.bubbleChartDrill.mode = "family";
      state.bubbleChartDrill.family = "";
      entities = families;
    }
  }

  if (mode === "comparison" && selectedFamilies.length >= 2) {
    const selectedSet = new Set(selectedFamilies);
    const comparisonSkus = [];
    selectedFamilies.forEach((familyName) => {
      const family = families.find((f) => f.brandFamily === familyName);
      if (family) {
        const skus = Object.values(family.skuMap)
          .map((sku) => ({
            ...sku,
            priceSegment: Object.entries(sku.segCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown"
          }))
          .filter((sku) => sku.revenue > 0);
        comparisonSkus.push(...skus);
      }
    });
    entities = comparisonSkus;
    subtitle = `${selectedFamilies.join(", ")} — ${entities.length} combined SKUs · bubble size = volume · click Back to Brand Family View`;
  }

  if (!entities.length) {
    if (bubbleChart) { bubbleChart.destroy(); bubbleChart = null; }
    if (els.bubbleChartBack) els.bubbleChartBack.classList.add("is-hidden");
    if (els.bubbleChartCompare) els.bubbleChartCompare.classList.add("is-hidden");
    if (els.bubbleChartClear) els.bubbleChartClear.classList.add("is-hidden");
    return;
  }

  if (els.bubbleChartSubtitle) {
    els.bubbleChartSubtitle.textContent = subtitle;
  }

  if (els.bubbleChartBack) {
    els.bubbleChartBack.classList.toggle("is-hidden", !(mode === "sku" && selectedFamily) && !(mode === "comparison" && selectedFamilies.length >= 2));
  }

  if (els.bubbleChartCompare) {
    els.bubbleChartCompare.classList.toggle("is-hidden", mode !== "family" || selectedFamilies.length < 2);
  }

  if (els.bubbleChartClear) {
    els.bubbleChartClear.classList.toggle("is-hidden", mode !== "family" || selectedFamilies.length === 0);
  }

  const sortedRevs = entities.map((f) => f.revenue).sort((a, b) => a - b);
  const medianRevenue = sortedRevs[Math.floor(sortedRevs.length / 2)];

  const margins = entities.map((f) => f.revenue ? (f.operatingIncome / f.revenue) * 100 : 0).sort((a, b) => a - b);
  const p05 = margins[Math.floor(margins.length * 0.05)] ?? margins[0];
  const p95 = margins[Math.ceil(margins.length * 0.95 - 1)] ?? margins[margins.length - 1];
  const yPad = Math.max(5, (p95 - p05) * 0.1);
  const yMin = Math.floor(p05 - yPad);
  const yMax = Math.ceil(p95 + yPad);

  const maxVol = Math.max(...entities.map((f) => f.volume), 1);
  const toRadius = (vol) => Math.max(5, Math.round(Math.sqrt(vol / maxVol) * 32));

  const legendByFamily = mode === "comparison";
  const groupMap = {};
  entities.forEach((f) => {
    const key = legendByFamily
      ? (f.brandFamily || "Unknown")
      : (f.priceSegment || "Unknown");
    if (!groupMap[key]) groupMap[key] = [];
    groupMap[key].push(f);
  });

  const groups = Object.keys(groupMap).sort();
  const selectedFamiliesSet = new Set(selectedFamilies);
  const highlightSelections = mode === "family";

  const datasets = groups.map((group, i) => ({
    label: group,
    backgroundColor: SEG_COLORS[i % SEG_COLORS.length] + "99",
    borderColor: SEG_COLORS[i % SEG_COLORS.length],
    borderWidth: 1.5,
    pointBorderWidth: (ctx) => {
      const point = ctx.raw || {};
      return highlightSelections && selectedFamiliesSet.has(point._family) ? 4 : 1.5;
    },
    pointBorderColor: (ctx) => {
      const point = ctx.raw || {};
      const baseColor = SEG_COLORS[i % SEG_COLORS.length];
      return highlightSelections && selectedFamiliesSet.has(point._family) ? "#ffd700" : baseColor;
    },
    data: groupMap[group].map((f) => ({
      x: f.revenue,
      y: f.revenue ? (f.operatingIncome / f.revenue) * 100 : 0,
      r: toRadius(f.volume),
      _label: mode === "sku" ? f.label : f.brandFamily,
      _volume: f.volume,
      _rev: f.revenue,
      _oi: f.operatingIncome,
      _family: mode === "sku" ? f.brandFamily : f.brandFamily,
      _isSkuView: mode === "sku"
    }))
  }));

  const quadrantPlugin = {
    id: "bubbleQuadrants",
    beforeDraw(chart) {
      const { ctx, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;
      const xMed = x.getPixelForValue(medianRevenue);
      const y0 = y.getPixelForValue(0);
      ctx.save();
      ctx.strokeStyle = "rgba(159,176,211,0.3)";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(xMed, top); ctx.lineTo(xMed, bottom); ctx.stroke();
      if (y0 >= top && y0 <= bottom) {
        ctx.beginPath(); ctx.moveTo(left, y0); ctx.lineTo(right, y0); ctx.stroke();
      }
      ctx.restore();
    }
  };

  if (bubbleChart) { bubbleChart.destroy(); bubbleChart = null; }

  bubbleChart = new Chart(els.bubbleChart, {
    type: "bubble",
    plugins: [quadrantPlugin],
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      onClick: (_event, elements) => {
        if (!elements.length) return;
        if (state.bubbleChartDrill.mode === "sku") return;
        if (state.bubbleChartDrill.mode === "comparison") return;

        const hit = elements[0];
        const point = datasets[hit.datasetIndex]?.data?.[hit.index];
        const family = point?._family;
        if (!family) return;

        // Toggle family selection in family mode
        const selected = state.bubbleChartDrill.selectedFamilies || [];
        const idx = selected.indexOf(family);
        if (idx >= 0) {
          selected.splice(idx, 1);
        } else {
          if (selected.length >= MAX_COMPARE_FAMILIES) return;
          selected.push(family);
        }
        state.bubbleChartDrill.selectedFamilies = selected;
        render();
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: { color: "#9fb0d3", boxWidth: 12, padding: 16, font: { size: 12 } }
        },
        tooltip: {
          callbacks: {
            title: () => "",
            label(item) {
              const d = item.raw;
              const margin = d.y.toFixed(1);
              return [
                d._label,
                `Brand Family: ${d._family}`,
                `Revenue: ${toMoney(d._rev)}`,
                `OI Margin: ${(d.y >= 0 ? "+" : "") + margin}%`,
                `Volume: ${Math.round(d._volume).toLocaleString()} bbl`
              ];
            }
          },
          backgroundColor: "rgba(15,26,45,0.95)",
          borderColor: "rgba(159,176,211,.2)",
          borderWidth: 1,
          titleColor: "#9fb0d3",
          bodyColor: "#e2eaf7",
          padding: 10,
          displayColors: false
        }
      },
      scales: {
        x: {
          type: "linear",
          title: { display: true, text: "Revenue", color: "#9fb0d3", font: { size: 11 } },
          ticks: {
            color: "#9fb0d3",
            callback: (v) => v >= 1e6 ? "$" + (v / 1e6).toFixed(1) + "M" : v >= 1e3 ? "$" + (v / 1e3).toFixed(0) + "K" : "$" + v
          },
          grid: { color: "rgba(159,176,211,0.08)" },
          border: { color: "rgba(159,176,211,0.15)" }
        },
        y: {
          min: yMin,
          max: yMax,
          title: { display: true, text: "Op Income Margin %", color: "#9fb0d3", font: { size: 11 } },
          ticks: { color: "#9fb0d3", callback: (v) => v + "%" },
          grid: { color: "rgba(159,176,211,0.08)" },
          border: { color: "rgba(159,176,211,0.15)" }
        }
      }
    }
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
  const safeRenderSection = (name, fn) => {
    try {
      fn();
    } catch (error) {
      reportRuntimeError(error, `render-${name}`);
    }
  };

  const baseFilterState = state.comparisonMode ? state.comparisonBaseFilters : state.filters;
  const baseRows = applyFilters(state.records, baseFilterState).map(computeRow);
  const focusedRows = getFocusedRows(baseRows);
  const totals = aggregate(focusedRows);
  state.breakdown.totals = totals;

  if (state.comparisonMode) {
    const comparisonRows = applyFilters(state.records, state.comparisonFilters).map(computeRow);
    const comparisonTotals = aggregate(comparisonRows);
    els.summaryKpis?.classList.add("is-hidden");
    safeRenderSection("comparisonMode", () => renderComparisonMode(totals, comparisonTotals));
    safeRenderSection("comparisonBaseSkuRanking", () => renderSkuRanking(focusedRows, {
      top: els.comparisonCurrentTopList,
      bottom: els.comparisonCurrentBottomList,
      scope: "comparison-base"
    }));
    safeRenderSection("omMix", () => renderOmMixChart(focusedRows));
    safeRenderSection("comparisonCaseSkuRanking", () => renderSkuRanking(comparisonRows, {
      top: els.comparisonCompareTopList,
      bottom: els.comparisonCompareBottomList,
      scope: "comparison-case"
    }));
    els.insightStripPanel?.classList.add("is-hidden");
    safeRenderSection("segmentReality", () => renderSegmentRealityCheck(focusedRows));
    safeRenderSection("priceSegmentWalk", () => renderPriceSegmentWalk());
    safeRenderSection("breakdown", () => renderBreakdownPanel(totals));
    return;
  }

  safeRenderSection("singleMode", () => renderSingleMode(totals));
  safeRenderSection("summaryKpis", () => renderSummaryKpis(totals, focusedRows));
  safeRenderSection("insightStrip", () => renderInsightStrip(focusedRows));
  safeRenderSection("segmentReality", () => renderSegmentRealityCheck(focusedRows));
  safeRenderSection("priceSegmentWalk", () => renderPriceSegmentWalk());
  safeRenderSection("skuRanking", () => renderSkuRanking(focusedRows, {
    scope: "single"
  }));
  safeRenderSection("whaleCurve", () => renderWhaleCurve(focusedRows));
  safeRenderSection("omMix", () => renderOmMixChart(focusedRows));
  safeRenderSection("bubbleChart", () => renderBubbleChart(focusedRows));
  safeRenderSection("breakdown", () => renderBreakdownPanel(totals));
  safeRenderSection("moduleWorkspace", () => renderModuleWorkspace());
}

let initFailed = false;

function runInitStep(name, fn) {
  try {
    fn();
  } catch (error) {
    initFailed = true;
    reportRuntimeError(error, `init-${name}`);
  }
}

runInitStep("updateFilterOptions", updateFilterOptions);
runInitStep("updateComparisonFilterOptions", updateComparisonFilterOptions);
runInitStep("bindFilterEvents", bindFilterEvents);
runInitStep("bindSegmentRealityEvents", bindSegmentRealityEvents);
runInitStep("bindOmMixEvents", bindOmMixEvents);
runInitStep("bindComparisonFilterEvents", bindComparisonFilterEvents);
runInitStep("bindDrillEvents", bindDrillEvents);
runInitStep("bindReset", bindReset);
runInitStep("bindComparisonButton", bindComparisonButton);
runInitStep("bindBreakdownEvents", bindBreakdownEvents);
runInitStep("bindSkuDetailDismiss", bindSkuDetailDismiss);
runInitStep("bindWhaleCurveEvents", bindWhaleCurveEvents);
runInitStep("bindBubbleChartEvents", bindBubbleChartEvents);
runInitStep("bindModuleRailEvents", bindModuleRailEvents);
runInitStep("render", render);
window.__LUMINOR_BOOT_OK = !initFailed;
