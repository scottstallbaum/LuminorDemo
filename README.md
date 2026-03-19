# Luminor BrewCo Demo

Interactive web app demo representing what prospects would get from Luminor cost/profit intelligence for a brewing company.

This version is optimized around your current positioning:
- Primary metrics: **Gross Margin** and **Operating Margin**
- Data source: one detailed tab exported from external cost analyses

## What this demo includes
- Drillable filters: period, plant, family, SKU, packaging, channel
- Overall KPI view: revenue, COGS, operating expense, gross margin, operating income, GM%, OM%
- Margin-by-SKU chart and SKU-level detail table
- Overall cost waterfall for current selection
- Drill waterfalls by plant, product family, SKU, packaging, or channel
- CSV upload for one-tab exports (`period` to `operating_cpu`)

## How to run
Open `index.html` directly in a browser.

For best local workflow in VS Code, use a static server extension and open the project folder:
- `luminor-brew-demo`

To test import, use:
- `one-tab-template.csv`

## One-tab input schema (CSV)
Required columns (lowercase preferred):
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

Notes:
- Each row should represent a single SKU-period slice.
- CPU fields are cost-per-unit values.
- `operating_cpu` is used to calculate operating margin.

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
