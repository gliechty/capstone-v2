# Explicit one-time migration. Reads immutable evidence; writes only app/config/capstone-v1.
$ErrorActionPreference = 'Stop'
$appRoot = Split-Path $PSScriptRoot -Parent
$sourceRoot = Join-Path (Split-Path $appRoot -Parent) 'BUILD_PACK/04_CONFIG/clean'
$outputRoot = Join-Path $appRoot 'config/capstone-v1'
$mapping = Get-Content (Join-Path $appRoot 'config/document-identity-map.json') -Raw | ConvertFrom-Json
$entities = 'QuestionBank','AnswerScales','MetricBenchmarks','MultiplierRules','CategoryWeights','DocumentIndex','DocumentChunks'
$data = @{}
foreach ($entity in $entities) { $data[$entity] = @(Import-Csv (Join-Path $sourceRoot "$entity.csv")) }
$indexTitles = @($data.DocumentIndex.doc_title)
$chunkTitles = @($data.DocumentChunks.doc_title | Sort-Object -Unique -CaseSensitive)
$unmatchedChunks = @($chunkTitles | Where-Object { $_ -cnotin $indexTitles })
$unmatchedIndex = @($data.DocumentIndex | Where-Object { $_.doc_title -cnotin $chunkTitles })
if ($unmatchedChunks.Count -ne 9 -or $unmatchedIndex.Count -ne 9) { throw 'Unexpected mismatch set; inspect before migrating.' }
if (@($mapping.legacy_title | Sort-Object -Unique -CaseSensitive).Count -ne 9 -or @($mapping.legacy_doc_id | Sort-Object -Unique).Count -ne 9) { throw 'Identity mapping must be one-to-one.' }
foreach ($entry in $mapping) {
  $indexed = $data.DocumentIndex | Where-Object { $_.doc_id -eq $entry.legacy_doc_id }
  if ($entry.canonical_title -cne $indexed.doc_title -or $entry.canonical_doc_id -cne ('capstone-doc-' + $indexed.doc_id.PadLeft(3,'0'))) { throw 'Mapping identity differs from source index.' }
  if ($entry.legacy_title -cnotin $unmatchedChunks -or $entry.legacy_doc_id -notin $unmatchedIndex.doc_id) { throw 'Mapping is not reciprocal.' }
}
$docs = [System.Collections.Generic.Dictionary[string,object]]::new([StringComparer]::Ordinal)
foreach ($doc in $data.DocumentIndex) {
  $legacy = $doc.doc_id
  $doc.doc_id = 'capstone-doc-' + $legacy.PadLeft(3,'0')
  $doc | Add-Member legacy_doc_id $legacy
  $docs[$doc.doc_title] = $doc
}
$chunkIds = [System.Collections.Generic.HashSet[string]]::new()
foreach ($chunk in $data.DocumentChunks) {
  $originalTitle = $chunk.doc_title
  $doc = $docs[$originalTitle]
  if (-not $doc) {
    $entry = @($mapping | Where-Object { $_.legacy_title -ceq $originalTitle })
    if ($entry.Count -ne 1) { throw "No explicit identity mapping for $originalTitle" }
    $doc = $data.DocumentIndex | Where-Object { $_.legacy_doc_id -eq $entry[0].legacy_doc_id }
  }
  $recordId = $doc.doc_id + ':' + $chunk.chunk_id
  if (-not $chunkIds.Add($recordId)) { throw "Duplicate chunk record $recordId" }
  $chunk | Add-Member chunk_record_id $recordId
  $chunk | Add-Member legacy_chunk_id $chunk.chunk_id
  $chunk.PSObject.Properties.Remove('chunk_id')
  $chunk | Add-Member doc_id $doc.doc_id
  $chunk | Add-Member legacy_doc_title $originalTitle
  $chunk.doc_title = $doc.doc_title
}
$optionsSource = Join-Path (Split-Path $sourceRoot -Parent) 'raw/QuestionBank_Config_Validation_Lists.csv'
$regions = @(Import-Csv $optionsSource | ForEach-Object { $_.market_triggers } | Where-Object { $_ })
$files = [ordered]@{}
foreach ($entity in $entities) {
  $out = Join-Path $outputRoot "$entity.json"
  $json = (ConvertTo-Json -InputObject $data[$entity] -Depth 10).Replace("`r`n", "`n") + "`n"
  [System.IO.File]::WriteAllText($out, $json, [System.Text.UTF8Encoding]::new($false))
  $files[$entity] = [ordered]@{ file="$entity.json"; sha256=(Get-FileHash $out -Algorithm SHA256).Hash.ToLower(); source="BUILD_PACK/04_CONFIG/clean/$entity.csv"; source_sha256=(Get-FileHash (Join-Path $sourceRoot "$entity.csv") -Algorithm SHA256).Hash.ToLower(); records=$data[$entity].Count }
}
[ordered]@{ version='capstone-v1-migrated-1'; schema_version=1; profile_options=[ordered]@{ regions=$regions; source='BUILD_PACK/04_CONFIG/raw/QuestionBank_Config_Validation_Lists.csv'; source_sha256=(Get-FileHash $optionsSource -Algorithm SHA256).Hash.ToLower() }; files=$files } | ConvertTo-Json -Depth 10 | Set-Content (Join-Path $outputRoot 'manifest.json') -Encoding utf8
