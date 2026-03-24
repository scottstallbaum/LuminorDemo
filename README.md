# Luminor BrewCo Demo

Interactive web app demo representing what prospects would get from Luminor cost/profit intelligence for a brewing company.

This version is optimized around your current positioning:
- Primary metrics: **Gross Margin** and **Operating Margin**
- Data source: **static demo files only** (no in-app upload/import UI)

## What this demo includes
- Drillable filters: period, plant, descriptor fields, SKU, packaging, channel
- Overall KPI view: revenue, COGS, operating expense, gross margin, operating income, GM%, OM%
- Margin-by-SKU chart and SKU-level detail table
- Overall cost waterfall for current selection
- Drill waterfalls by plant, product family, SKU, packaging, or channel
- Descriptor enrichment support using `Plant + OSKU`, then `OSKU`, then `SKU`

## How to run
Open `index.html` directly in a browser.

## How to add your final data
This demo now reads only these two files:
- `data/demo-cost-data.js`
- `data/demo-descriptor-data.js`

### Option A (easiest): give me the Excel/CSV files and I will wire them for you
1. Put your source files anywhere in this repo (for example, `incoming/`).
2. Tell me the filenames.
3. I will convert them into `data/demo-cost-data.js` and `data/demo-descriptor-data.js` and validate the app.

### Option B (manual): edit static files directly
1. Open `data/demo-cost-data.js` and replace `window.DEMO_COST_DATA = [...]` with your full cost row array.
2. Open `data/demo-descriptor-data.js` and replace `window.DEMO_DESCRIPTOR_DATA = [...]` with your full descriptor row array.
3. Save and refresh `index.html`.

## Cost data schema (`data/demo-cost-data.js`)
Required fields per row:
- `period`
- `plant`
- `family`
- `sku`
- `packaging`
- `channel`
- `volume`
- `asp`
- `material_cpu`
- `labor_cpu`
- `freight_cpu`
- `overhead_cpu`
- `operating_cpu`

Supported alias style in JS object rows:
- You can use camelCase (`materialCpu`) or snake_case (`material_cpu`) for cost CPU fields.

Optional descriptor fields in cost rows:
- `plant desc`
- `osku`
- `plant + osku`
- `orderable sku description`
- `price segment`
- `brand`
- `brand family`
- `brand segment`
- `container type`
- `container size`
- `smallest pack`
- `alcohol rptng group`
- `2012 production bbl by plant by osku`

Notes:
- Each row should represent a single SKU-period slice.
- CPU fields are cost-per-unit values.
- `operating_cpu` is used to calculate operating margin.

## Descriptor schema (`data/demo-descriptor-data.js`)
Recommended fields:
- `Plant Desc`
- `OSKU`
- `Plant + OSKU`
- `Orderable SKU Description`
- `Price Segment`
- `Brand`
- `Brand Family`
- `Brand Segment`
- `Container Type`
- `Container Size`
- `Smallest Pack`
- `Alcohol Rptng Group`
- `2012 Production BBL by Plant by OSKU`

## Demo storyline for prospects
1. Start at all-company view to show enterprise margin health.
2. Filter to a specific plant and family to highlight bottlenecks.
3. Drill into a weak-margin SKU and show cost mix composition.
4. Move scenario sliders to show how pricing or input inflation shifts margin quickly.
5. Close by positioning Luminor as the source of ongoing, decision-ready insight.

## Next enhancements (if desired)
- Load data from CSV exports generated from your Excel model outputs
- Add saved views ("CFO", "Plant Ops", "Commercial")
- Add trend charts by month for variance storytelling
- Add export buttons for PDF/CSV summary views
