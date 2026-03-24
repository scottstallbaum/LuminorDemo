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
    laborCpu: parseNum(getField(row, ["laborCpu", "labor_cpu", "Labor_CPU", "labor_cost_per_unit"])),
    overheadCpu: parseNum(getField(row, ["overheadCpu", "overhead_cpu", "Overhead_CPU", "overhead_cost_per_unit"])),
    conversionCpu: parseNum(getField(row, ["conversionCpu", "conversion_cpu"])),
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
    period: document.getElementById("filter-period"),
    plant: document.getElementById("filter-plant"),
    plantDesc: document.getElementById("filter-plant-desc"),
    family: document.getElementById("filter-family"),
    brand: document.getElementById("filter-brand"),
    brandFamily: document.getElementById("filter-brand-family"),
    brandSegment: document.getElementById("filter-brand-segment"),
    priceSegment: document.getElementById("filter-price-segment"),
    osku: document.getElementById("filter-osku"),
    plantOsku: document.getElementById("filter-plant-osku"),
    orderableSkuDescription: document.getElementById("filter-orderable-sku-description"),
    sku: document.getElementById("filter-sku"),
    containerType: document.getElementById("filter-container-type"),
    containerSize: document.getElementById("filter-container-size"),
    smallestPack: document.getElementById("filter-smallest-pack"),
    alcoholReportingGroup: document.getElementById("filter-alcohol-reporting-group"),
    productionBbl: document.getElementById("filter-production-bbl"),
    packaging: document.getElementById("filter-packaging")
  },
  drillDimension: document.getElementById("drill-dimension"),
  drillValue: document.getElementById("drill-value"),
  reset: document.getElementById("btn-reset"),
  upload: document.getElementById("upload-data"),
  descriptorUpload: document.getElementById("upload-descriptor-data"),
  dataSourceNote: document.getElementById("data-source-note"),
  descriptorSourceNote: document.getElementById("descriptor-source-note"),
  pasteDataset: document.getElementById("paste-dataset"),
  pasteDescriptors: document.getElementById("paste-descriptors"),
  importPaste: document.getElementById("btn-import-paste"),
  clearPaste: document.getElementById("btn-clear-paste"),
  importDescriptorsPaste: document.getElementById("btn-import-descriptors-paste"),
  clearDescriptorsPaste: document.getElementById("btn-clear-descriptors-paste"),
  kpis: document.getElementById("kpi-cards"),
  table: document.getElementById("sku-table"),
  waterfall: document.getElementById("waterfall"),
  waterfallBreakout: document.getElementById("waterfall-breakout"),
  insights: document.getElementById("insights")
};

const state = {
  records: staticCostData.map(normalizeStaticCostRow).map(withDescriptorDefaults),
  descriptorLookup: {},
  filters: {
    period: "All",
    plant: "All",
    plantDesc: "All",
    family: "All",
    brand: "All",
    brandFamily: "All",
    brandSegment: "All",
    priceSegment: "All",
    osku: "All",
    plantOsku: "All",
    orderableSkuDescription: "All",
    sku: "All",
    containerType: "All",
    containerSize: "All",
    smallestPack: "All",
    alcoholReportingGroup: "All",
    productionBbl: "All",
    packaging: "All"
  },
  drill: {
    dimension: "plant",
    value: "All"
  }
};

if (staticDescriptorData.length) {
  state.descriptorLookup = buildDescriptorLookup(staticDescriptorData.map(normalizeDescriptorRow));
  state.records = applyDescriptorLookup(state.records);
}

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
    laborCpu: parseNum(getField(row, ["labor_cpu", "Labor_CPU", "labor_cost_per_unit"])),
    overheadCpu: parseNum(getField(row, ["overhead_cpu", "Overhead_CPU", "overhead_cost_per_unit"])),
    conversionCpu: parseNum(getField(row, ["conversionCpu", "conversion_cpu"])),
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
    sga: 0
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
  return records.filter((row) => Object.entries(state.filters).every(([key, value]) => value === "All" || String(row[key]) === value));
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

function loadImportedRows(rawRows, fileName) {
  const normalized = rawRows
    .map(normalizeImportedRow)
    .filter((row) => row.sku !== "Unknown" && row.volume > 0);

  if (!normalized.length) {
    if (looksLikeDescriptorOnlyDataset(rawRows)) {
      loadDescriptorRows(rawRows, `${fileName} (auto-detected descriptor reference)`);
      alert("Detected a descriptor-only table. Loaded it into SKU Descriptor Reference automatically.");
      return;
    }

    alert("No valid rows found. Include SKU and volume plus pricing/cost columns.");
    return;
  }

  state.records = applyDescriptorLookup(normalized);
  Object.keys(state.filters).forEach((key) => {
    state.filters[key] = "All";
  });
  state.drill.dimension = "plant";
  state.drill.value = "All";

  updateFilterOptions();
  els.drillDimension.value = state.drill.dimension;
  updateDrillValueOptions();

  els.dataSourceNote.textContent = `Data source: ${fileName} (${normalized.length} rows imported).`;
  render();
}

function loadDescriptorRows(rawRows, sourceName) {
  const normalized = rawRows
    .map(normalizeDescriptorRow)
    .filter((row) => row.sku !== "Unknown" || row.osku !== "Unknown" || row.plantOsku);

  if (!normalized.length) {
    alert("No valid descriptor rows found. Include SKU/OSKU or Plant + OSKU columns.");
    return;
  }

  state.descriptorLookup = buildDescriptorLookup(normalized);
  state.records = applyDescriptorLookup(state.records);
  updateFilterOptions();
  updateDrillValueOptions();
  els.descriptorSourceNote.textContent = `SKU descriptors: ${sourceName} (${normalized.length} rows loaded).`;
  render();
}

function parseCsvFile(file) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => String(header || "").trim(),
    complete: (result) => {
      loadImportedRows(result.data || [], file.name);
    },
    error: () => {
      alert("Unable to parse CSV. Verify file format and try again.");
    }
  });
}

function parsePastedData(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) {
    alert("Paste data first, then click Import Pasted Data.");
    return;
  }

  Papa.parse(trimmed, {
    header: true,
    delimiter: "",
    skipEmptyLines: true,
    transformHeader: (header) => String(header || "").trim(),
    complete: (result) => {
      loadImportedRows(result.data || [], "Pasted dataset");
    },
    error: () => {
      alert("Unable to parse pasted data. Paste with a header row and tab/comma delimiters.");
    }
  });
}

function parsePastedDescriptors(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) {
    alert("Paste descriptor data first, then click Import Pasted Descriptors.");
    return;
  }

  Papa.parse(trimmed, {
    header: true,
    delimiter: "",
    skipEmptyLines: true,
    transformHeader: (header) => String(header || "").trim(),
    complete: (result) => {
      loadDescriptorRows(result.data || [], "Pasted descriptors");
    },
    error: () => {
      alert("Unable to parse pasted descriptor data. Paste with a header row and tab/comma delimiters.");
    }
  });
}

function parseExcelFile(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = event.target?.result;
      const workbook = XLSX.read(data, { type: "array" });
      const selected = pickWorksheet(workbook, "cost");
      if (!selected) {
        alert("No worksheet found in this Excel file.");
        return;
      }

      loadImportedRows(selected.rows, `${file.name} [${selected.name}]`);
    } catch {
      alert("Unable to parse Excel file. Try saving it again as .xlsx and re-upload.");
    }
  };

  reader.onerror = () => {
    alert("Unable to read Excel file from disk.");
  };

  reader.readAsArrayBuffer(file);
}

function bindDataUpload() {
  if (!els.upload) return;

  els.upload.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const name = file.name.toLowerCase();
    if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      parseExcelFile(file);
      return;
    }

    if (name.endsWith(".csv")) {
      parseCsvFile(file);
      return;
    }

    alert("Unsupported file type. Upload .xlsx, .xls, or .csv.");
  });
}

function bindDescriptorUpload() {
  if (!els.descriptorUpload) return;

  els.descriptorUpload.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const name = file.name.toLowerCase();
    if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        try {
          const data = loadEvent.target?.result;
          const workbook = XLSX.read(data, { type: "array" });
          const selected = pickWorksheet(workbook, "descriptor");
          if (!selected) {
            alert("No worksheet found in descriptor file.");
            return;
          }
          loadDescriptorRows(selected.rows, `${file.name} [${selected.name}]`);
        } catch {
          alert("Unable to parse descriptor Excel file.");
        }
      };
      reader.onerror = () => alert("Unable to read descriptor Excel file from disk.");
      reader.readAsArrayBuffer(file);
      return;
    }

    if (name.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => String(header || "").trim(),
        complete: (result) => {
          loadDescriptorRows(result.data || [], file.name);
        },
        error: () => {
          alert("Unable to parse descriptor CSV. Verify file format and try again.");
        }
      });
      return;
    }

    alert("Unsupported descriptor file type. Upload .xlsx, .xls, or .csv.");
  });
}

function bindPasteImport() {
  if (!els.importPaste || !els.clearPaste || !els.importDescriptorsPaste || !els.clearDescriptorsPaste || !els.pasteDataset || !els.pasteDescriptors) {
    return;
  }

  els.importPaste.addEventListener("click", () => {
    parsePastedData(els.pasteDataset.value);
  });

  els.clearPaste.addEventListener("click", () => {
    els.pasteDataset.value = "";
  });

  els.importDescriptorsPaste.addEventListener("click", () => {
    parsePastedDescriptors(els.pasteDescriptors.value);
  });

  els.clearDescriptorsPaste.addEventListener("click", () => {
    els.pasteDescriptors.value = "";
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
bindDataUpload();
bindDescriptorUpload();
bindPasteImport();
render();
