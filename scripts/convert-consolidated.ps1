param(
  [string]$InputPath = "incoming/MLC Consolidated Data.xlsx",
  [string]$SheetName = "Sheet1",
  [string]$CostOutput = "data/demo-cost-data.js",
  [string]$DescriptorOutput = "data/demo-descriptor-data.js"
)

$ErrorActionPreference = "Stop"

function Clean-Text($v) {
  if ($null -eq $v) { return "" }
  return ([string]$v).Trim()
}

function Normalize-Header([string]$h) {
  return ((Clean-Text $h).ToLower() -replace "[^a-z0-9]+","")
}

function Parse-Num($v) {
  if ($null -eq $v) { return 0.0 }
  if ($v -is [double] -or $v -is [int] -or $v -is [decimal]) { return [double]$v }

  $s = ([string]$v).Trim()
  if (-not $s) { return 0.0 }
  if ($s -match "^\((.*)\)$") { $s = "-" + $Matches[1] }
  $s = $s -replace "[\$,\s,]", ""
  if (-not $s) { return 0.0 }

  $n = 0.0
  if ([double]::TryParse($s, [ref]$n)) { return $n }
  return 0.0
}

$resolvedInput = Resolve-Path $InputPath
$tempInputPath = Join-Path $env:TEMP ("mlc-consolidated-" + [guid]::NewGuid().ToString() + ".xlsx")
Copy-Item -Path $resolvedInput -Destination $tempInputPath -Force

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

$wb = $null
$ws = $null
$used = $null

try {
  $wb = $excel.Workbooks.Open($tempInputPath, 0, $true)
  $ws = $wb.Worksheets.Item($SheetName)
  $used = $ws.UsedRange

  $rows = $used.Rows.Count
  $cols = $used.Columns.Count
  $vals = $used.Value2

  if ($rows -lt 2) {
    throw "No data rows found in $InputPath ($SheetName)."
  }

  $headers = @()
  for ($c = 1; $c -le $cols; $c++) {
    $headers += Clean-Text $vals[1, $c]
  }

  $headerMap = @{}
  for ($c = 1; $c -le $cols; $c++) {
    $norm = Normalize-Header $headers[$c - 1]
    if (-not $headerMap.ContainsKey($norm)) {
      $headerMap[$norm] = New-Object System.Collections.ArrayList
    }
    [void]$headerMap[$norm].Add($c)
  }

  function Get-CellText([int]$r, [string[]]$names) {
    foreach ($name in $names) {
      $norm = Normalize-Header $name
      if ($headerMap.ContainsKey($norm) -and $headerMap[$norm].Count -gt 0) {
        $idx = [int]$headerMap[$norm][0]
        return Clean-Text $vals[$r, $idx]
      }
    }
    return ""
  }

  function Get-CellNum([int]$r, [string[]]$names) {
    foreach ($name in $names) {
      $norm = Normalize-Header $name
      if ($headerMap.ContainsKey($norm) -and $headerMap[$norm].Count -gt 0) {
        $idx = [int]$headerMap[$norm][0]
        return Parse-Num $vals[$r, $idx]
      }
    }
    return 0.0
  }

  function Sum-Columns([int]$r, [string[]]$names) {
    $sum = 0.0
    foreach ($name in $names) {
      $norm = Normalize-Header $name
      if ($headerMap.ContainsKey($norm)) {
        foreach ($idx in $headerMap[$norm]) {
          $sum += Parse-Num $vals[$r, [int]$idx]
        }
      }
    }
    return $sum
  }

  $laborTotalHeaders = @(
    "Brewing Labor - TOTAL",
    "Packaging Labor - TOTAL",
    "Distribution Labor - TOTAL",
    "Other Labor - TOTAL",
    "Salaried Labor - TOTAL"
  )

  $overheadHeaders = @(
    "Utilities - TOTAL",
    "Maintenance - TOTAL",
    "Production Supplies - TOTAL",
    "Brewery Overhead - TOTAL",
    "Keg Depreciation - TOTAL",
    "Dep/Amor - TOTAL",
    "Waste"
  )

  $operatingHeaders = @(
    "Marketing $/bbl",
    "Sales Admin - TOTAL",
    "Marketing Admin - TOTAL",
    "10th & Blake - TOTAL",
    "Integrated Supply Chain - TOTAL",
    "BIS - TOTAL",
    "ACG Brewing - TOTAL",
    "PA & Comm - TOTAL",
    "HR - TOTAL",
    "Legal - TOTAL",
    "Finance - TOTAL",
    "Procurement - TOTAL",
    "Foster's - TOTAL",
    "Executive - TOTAL"
  )

  $costRows = New-Object System.Collections.Generic.List[object]
  $descriptorRows = New-Object System.Collections.Generic.List[object]
  $descriptorSeen = @{}

  for ($r = 2; $r -le $rows; $r++) {
    $osku = Get-CellText $r @("OSKU")
    $plantOsku = Get-CellText $r @("Plant + OSKU")
    if (-not $osku -and -not $plantOsku) { continue }

    $plantDesc = Get-CellText $r @("Plant Desc")
    $orderable = Get-CellText $r @("Orderable SKU Description")
    $priceSegment = Get-CellText $r @("Price Segment")
    $brand = Get-CellText $r @("Brand")
    $brandFamily = Get-CellText $r @("Brand Family")
    $brandSegment = Get-CellText $r @("Brand Segment")
    $containerType = Get-CellText $r @("Container Type")
    $containerSize = Get-CellText $r @("Container Size")
    $smallestPack = Get-CellText $r @("Smallest Pack")
    $alcoholGroup = Get-CellText $r @("Alcohol Rptng Group")

    $volume = Get-CellNum $r @("Production Volume")
    $asp = Get-CellNum $r @("Rev $/bbl")
    $brewMatCpu = -1 * (Get-CellNum $r @("Brew Mat $/bbl"))
    $pkgMatCpu = -1 * (Get-CellNum $r @("Pkg Mat $/bbl"))
    $freightCpu = -1 * (Get-CellNum $r @("Freight $/bbl"))
    $marketingCpu = -1 * (Get-CellNum $r @("Marketing $/bbl"))
    $laborCpu = Sum-Columns $r $laborTotalHeaders
    $overheadCpu = Sum-Columns $r $overheadHeaders
    $conversionCpu = $laborCpu + $overheadCpu
    $sgaCpu = Sum-Columns $r @("Sales Admin - TOTAL", "Marketing Admin - TOTAL", "10th & Blake - TOTAL", "Integrated Supply Chain - TOTAL", "BIS - TOTAL", "ACG Brewing - TOTAL", "PA & Comm - TOTAL", "HR - TOTAL", "Legal - TOTAL", "Finance - TOTAL", "Procurement - TOTAL", "Foster's - TOTAL", "Executive - TOTAL")

    $costRows.Add([pscustomobject]@{
      period = "Full Year"
      plant = if ($plantDesc) { $plantDesc } else { "Unknown" }
      family = if ($brandFamily) { $brandFamily } else { "Unknown" }
      sku = if ($osku) { $osku } else { "Unknown" }
      packaging = if ($containerType) { $containerType } else { "Unknown" }
      volume = $volume
      asp = $asp
      brewMatCpu = $brewMatCpu
      pkgMatCpu = $pkgMatCpu
      freightCpu = $freightCpu
      marketingCpu = $marketingCpu
      laborCpu = $laborCpu
      overheadCpu = $overheadCpu
      conversionCpu = $conversionCpu
      sgaCpu = $sgaCpu
      plantDesc = if ($plantDesc) { $plantDesc } else { "Unknown" }
      osku = if ($osku) { $osku } else { "Unknown" }
      plantOsku = if ($plantOsku) { $plantOsku } else { "" }
      orderableSkuDescription = if ($orderable) { $orderable } else { "" }
      priceSegment = if ($priceSegment) { $priceSegment } else { "Unknown" }
      brand = if ($brand) { $brand } else { "Unknown" }
      brandFamily = if ($brandFamily) { $brandFamily } else { "Unknown" }
      brandSegment = if ($brandSegment) { $brandSegment } else { "Unknown" }
      containerType = if ($containerType) { $containerType } else { "" }
      containerSize = if ($containerSize) { $containerSize } else { "Unknown" }
      smallestPack = if ($smallestPack) { $smallestPack } else { "Unknown" }
      alcoholReportingGroup = if ($alcoholGroup) { $alcoholGroup } else { "Unknown" }
      productionBbl = $volume
    })

    # OSKU-first lookup key, with Plant+OSKU as secondary detail key.
    $oskuKey = if ($osku) { $osku } else { "" }
    $plantOskuKey = if ($plantOsku) { $plantOsku } else { "" }
    $dedupeKey = ($oskuKey + "|" + $plantOskuKey).ToLower()
    if (-not $descriptorSeen.ContainsKey($dedupeKey)) {
      $descriptorSeen[$dedupeKey] = $true
      $descriptorRows.Add([pscustomobject]@{
        "Plant Desc" = if ($plantDesc) { $plantDesc } else { "Unknown" }
        "OSKU" = if ($osku) { $osku } else { "Unknown" }
        "Plant + OSKU" = if ($plantOsku) { $plantOsku } else { "" }
        "Orderable SKU Description" = if ($orderable) { $orderable } else { "" }
        "Price Segment" = if ($priceSegment) { $priceSegment } else { "Unknown" }
        "Brand" = if ($brand) { $brand } else { "Unknown" }
        "Brand Family" = if ($brandFamily) { $brandFamily } else { "Unknown" }
        "Brand Segment" = if ($brandSegment) { $brandSegment } else { "Unknown" }
        "Container Type" = if ($containerType) { $containerType } else { "" }
        "Container Size" = if ($containerSize) { $containerSize } else { "Unknown" }
        "Smallest Pack" = if ($smallestPack) { $smallestPack } else { "Unknown" }
        "Alcohol Rptng Group" = if ($alcoholGroup) { $alcoholGroup } else { "Unknown" }
        "2012 Production BBL by Plant by OSKU" = $volume
      })
    }
  }

  if (-not (Test-Path "data")) {
    New-Item -ItemType Directory -Path "data" | Out-Null
  }

  $costArr = @($costRows.ToArray())
  $descArr = @($descriptorRows.ToArray())

  $costJson = ConvertTo-Json -InputObject $costArr -Depth 8 -Compress
  $descJson = ConvertTo-Json -InputObject $descArr -Depth 8 -Compress

  Set-Content -Path $CostOutput -Value ("window.DEMO_COST_DATA = " + $costJson + ";") -Encoding UTF8
  Set-Content -Path $DescriptorOutput -Value ("window.DEMO_DESCRIPTOR_DATA = " + $descJson + ";") -Encoding UTF8

  Write-Output ("COST_ROWS=" + $costArr.Count)
  Write-Output ("DESCRIPTOR_ROWS=" + $descArr.Count)
}
finally {
  if ($used) { [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($used) }
  if ($ws) { [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($ws) }
  if ($wb) { $wb.Close($false); [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($wb) }
  if ($excel) { $excel.Quit(); [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) }
  if (Test-Path $tempInputPath) { Remove-Item $tempInputPath -Force }
  [GC]::Collect()
  [GC]::WaitForPendingFinalizers()
}
