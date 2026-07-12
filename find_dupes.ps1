$lines = Get-Content 'C:\Users\wzryq\rorkingdom-guide\utils\pets.js'
$names = @()
foreach ($line in $lines) {
    if ($line -match 'name: "(.+?)"') {
        $names += $Matches[1]
    }
}
$names | Group-Object | Where-Object { $_.Count -gt 1 } | ForEach-Object { "$($_.Name): $($_.Count)" }
Write-Host "Total unique: $($names | Sort-Object -Unique | Measure-Object | Select-Object -ExpandProperty Count)"
Write-Host "Total with dupes: $($names.Count)"
