$usersCsvPath = ".\Usuarios.csv"
$databaseUrl = "https://gaelpa-efba4-default-rtdb.firebaseio.com"

Write-Host "Reading Users CSV (UTF8)..."
$usersData = Import-Csv -Path $usersCsvPath -Encoding UTF8

Write-Host "Migrating $($usersData.Count) users..."
foreach ($u in $usersData) {
    if (-not $u.Usuario) { continue }
    
    # Identify the password field even if mangled
    $passField = ($u.PSObject.Properties | Where-Object { $_.Name -match 'Contra' }).Name
    $password = $u.$passField
    if (-not $password) { $password = "medico" } # Default if empty

    $userRecord = @{
        nombre   = $u."Nombre completo"
        usuario  = $u.Usuario
        password = $password
        rol      = $u.Rol
    }

    $json = $userRecord | ConvertTo-Json -Compress
    $url = "$databaseUrl/gaelpa/users/$($u.Usuario).json"
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    Invoke-RestMethod -Uri $url -Method Put -Body $bytes -ContentType "application/json; charset=utf-8" > $null
}
Write-Host "Users re-migrated successfully."
