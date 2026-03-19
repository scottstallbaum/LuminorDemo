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
- Excel/CSV upload for one-tab exports (`period` to `operating_cpu`)
- Tolerant import cleanup for messy headers/cells (extra spaces, case differences, and currency-style number formatting)

## How to run
Open `index.html` directly in a browser.

For best local workflow in VS Code, use a static server extension and open the project folder:
- `luminor-brew-demo`

To test import, use:
- `one-tab-template.csv`

Accepted import types:
- `.xlsx`
- `.xls`
- `.csv`

You can also paste data directly from Excel:
- Copy the full table including header row
- Paste into `Paste Table Data (Excel copy/paste)`
- Click `Import Pasted Data`

SKU descriptor reference is loaded separately (optional):
- Use `Import SKU Descriptor Table (Excel or CSV)` for a dedicated descriptor master table
- Or paste descriptor rows into `Paste SKU Descriptor Table`
- Descriptor matching priority is `Plant + OSKU`, then `OSKU`, then `SKU`
- Loaded descriptors enrich current and future cost imports automatically

Notes for large pasted datasets:
- 1,700+ rows are supported in-browser
- Tab-delimited Excel paste is auto-detected
- Keep the first row as headers for best mapping

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

Optional descriptor columns (supported and recommended for richer drilldowns):
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
