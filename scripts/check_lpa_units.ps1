$p = Invoke-RestMethod -Uri 'https://gaelpa-efba4-default-rtdb.firebaseio.com/gaelpa/patients.json' -Method Get
$units = $p.PSObject.Properties | Group-Object { $_.Value.lpa_unit } | Select-Object Name, Count
$units | Format-Table -AutoSize
