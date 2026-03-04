$databaseUrl = "https://gaelpa-efba4-default-rtdb.firebaseio.com"
$s_d = @{
    nombre   = "S/D"
    password = "medico"
    rol      = "Investigador"
    usuario  = "s_d"
}
$json = $s_d | ConvertTo-Json -Compress
$bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
Invoke-RestMethod -Uri "$databaseUrl/gaelpa/users/s_d.json" -Method Put -Body $bytes -ContentType "application/json; charset=utf-8"
Write-Host "Re-created s_d user as object."
