$u = Import-Csv -Path "g:\Mi unidad\Investigación OSEP\Antigravity proyectos\Gaelpa\Usuarios.csv" -Encoding UTF8
$u[0].PSObject.Properties | ForEach-Object { "$($_.Name)" }
