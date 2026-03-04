$databaseUrl = "https://gaelpa-efba4-default-rtdb.firebaseio.com"
$data = Invoke-RestMethod -Uri "$databaseUrl/gaelpa/users.json" -Method Get
$uList = $data.PSObject.Properties | ForEach-Object { 
    [PSCustomObject]@{
        Usuario  = $_.Value.usuario
        Password = $_.Value.password
        Nombre   = $_.Value.nombre
        Rol      = $_.Value.rol
    }
}
$uList | Sort-Object Usuario | Export-Csv -Path "g:\Mi unidad\Investigación OSEP\Antigravity proyectos\Gaelpa\scripts\output_users.csv" -NoTypeInformation -Encoding UTF8
$uList | Sort-Object Usuario | Format-Table -AutoSize
