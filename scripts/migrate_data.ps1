$csvPath = ".\Datos.csv"
$usersCsvPath = ".\Usuarios.csv"
$databaseUrl = "https://gaelpa-efba4-default-rtdb.firebaseio.com"

# 1. MIGRATE USERS FIRST (to ensure accents match)
Write-Host "Reading Users CSV (UTF8)..."
# PowerShell 5.1 Import-Csv -Encoding UTF8 handles files without BOM correctly
$usersData = Import-Csv -Path $usersCsvPath -Encoding UTF8

Write-Host "Migrating $($usersData.Count) users..."
foreach ($u in $usersData) {
    if (-not $u.Usuario) { continue }
    $userRecord = @{
        nombre   = $u."Nombre completo"
        usuario  = $u.Usuario
        password = $u."Contrasea" # Careful here, if CSV header has mangled char too
        rol      = $u.Rol
    }
    # Check if header read was mangled
    if ($u.PSObject.Properties["Contrasea"]) { 
        $userRecord.password = $u."Contrasea"
    }
    elseif ($u.PSObject.Properties["Contraseña"]) {
        $userRecord.password = $u."Contraseña"
    }

    $json = $userRecord | ConvertTo-Json -Compress
    $url = "$databaseUrl/gaelpa/users/$($u.Usuario).json"
    Invoke-RestMethod -Uri $url -Method Put -Body ([System.Text.Encoding]::UTF8.GetBytes($json)) -ContentType "application/json; charset=utf-8" > $null
}
Write-Host "Users migrated.`n"

# 2. MIGRATE PATIENTS
$REQUIRED_FIELDS = @(
    "investigador_principal", "region", "paciente_id", "cod_postal", "telefono",
    "edad", "genero", "raza_etnia", "peso", "altura", "tas", "tad",
    "tabaquismo", "diabetes", "hipertension", "menopausia", "hipotiroidismo",
    "medicado_hipotiroidismo", "enf_autoinmunes", "hf", "af_ecv_precoz",
    "antec_isquemia", "enf_art_periferica", "acv_previo", "ateromatosis",
    "score_calcio", "ateromatosis_carotidea", "ateromatosis_femoral",
    "estenosis_aortica", "lpa", "lpa_unit", "col_total", "hdl", "ldl",
    "trigliceridos", "creatinina", "tsh", "antiagregacion", "toma_estatina",
    "estatina_tipo", "estatina_dosis", "niacina", "ezetimibe", "acid_bempedoico",
    "icosapento", "ipcsk9", "inclisiran"
)

$headers = @(
    "marca_temporal", "investigador_principal", "region", "paciente_id", "dni",
    "cod_postal", "telefono", "email", "edad", "genero", "peso", "altura",
    "tas", "tad", "raza_etnia", "tabaquismo", "diabetes", "hipertension",
    "menopausia", "hipotiroidismo", "medicado_hipotiroidismo", "enf_autoinmunes",
    "hf", "af_ecv_precoz", "antec_isquemia", "enf_art_periferica", "acv_previo",
    "ateromatosis", "score_calcio", "score_calcio_valor", "ateromatosis_carotidea",
    "ateromatosis_femoral", "estenosis_aortica", "hba1c", "lpa", "lpa_unit",
    "apob", "apob_unit", "col_total", "hdl", "ldl", "trigliceridos", "creatinina",
    "tsh", "antiagregacion", "toma_estatina", "estatina_tipo", "estatina_dosis",
    "niacina", "ezetimibe", "acid_bempedoico", "icosapento", "ipcsk9", "inclisiran"
)

Write-Host "Reading Patients CSV (UTF8)..."
$data = Import-Csv -Path $csvPath -Header $headers -Encoding UTF8 | Select-Object -Skip 1

$migratedCount = 0
$sanitizedCount = 0
$batchSize = 200
$batch = @{}

Write-Host "Starting batch migration of $($data.Count) records..."

for ($i = 0; $i -lt $data.Count; $i++) {
    $row = $data[$i]
    if (-not $row.marca_temporal) { continue }

    $record = @{}
    foreach ($prop in $row.PSObject.Properties) {
        $val = $prop.Value
        if ($val -eq $null) { $val = "" }
        $val = $val.Trim()
        
        if ($REQUIRED_FIELDS -contains $prop.Name) {
            if ($val -eq "" -or $val -eq ".") {
                $val = "S/D"
                $sanitizedCount++
            }
        }
        $record[$prop.Name] = $val
    }

    if ($record["investigador_principal"] -eq "" -or $record["investigador_principal"] -eq "S/D") {
        $record["investigador_principal"] = "S/D"
    }

    $id = $record["marca_temporal"] -replace '[\.\#\$\/\[\]]', '_'
    $batch[$id] = $record
    $migratedCount++

    if ($batch.Count -eq $batchSize -or $i -eq ($data.Count - 1)) {
        Write-Host "Uploading batch of $($batch.Count) patients ($migratedCount total)..."
        try {
            $json = $batch | ConvertTo-Json -Depth 5 -Compress
            # Explicitly use UTF-8 bytes for the body to ensure correct encoding in the request
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            Invoke-RestMethod -Uri "$databaseUrl/gaelpa/patients.json" -Method Patch -Body $bytes -ContentType "application/json; charset=utf-8" > $null
            $batch = @{}
        }
        catch {
            Write-Error "Error uploading batch: $($_.Exception.Message)"
        }
    }
}

Write-Host "Migration finished!"
Write-Host "Patients migrated: $migratedCount"
Write-Host "Fields sanitized: $sanitizedCount"
