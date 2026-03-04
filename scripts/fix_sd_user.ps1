$databaseUrl = "https://gaelpa-efba4-default-rtdb.firebaseio.com"
$user = Invoke-RestMethod -Uri "$databaseUrl/gaelpa/users/s/d.json" -Method Get
if ($user) {
    $user.usuario = "s_d"
    $json = $user | ConvertTo-Json -Compress
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    Invoke-RestMethod -Uri "$databaseUrl/gaelpa/users/s_d.json" -Method Put -Body $bytes -ContentType "application/json; charset=utf-8"
    Invoke-RestMethod -Uri "$databaseUrl/gaelpa/users/s.json" -Method Delete
    Write-Host "Fixed s/d user nesting."
}
else {
    Write-Host "Nested s/d user not found or already fixed."
}
