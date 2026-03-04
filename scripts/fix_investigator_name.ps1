$databaseUrl = "https://gaelpa-efba4-default-rtdb.firebaseio.com"
$patientsUrl = $databaseUrl + "/gaelpa/patients.json"

Write-Host "Fetching all patients for name cleanup..."
$patients = Invoke-RestMethod -Uri $patientsUrl -Method Get

if (-not $patients) {
    Write-Host "No patients found."
    exit
}

$count = 0
$total = ($patients.PSObject.Properties | Measure-Object).Count
Write-Host ("Checking " + $total + " records...")

foreach ($pProperty in $patients.PSObject.Properties) {
    $patientKey = $pProperty.Name
    $pData = $pProperty.Value
    
    $needsUpdate = $false
    $updateData = @{}
    
    if ($pData.investigador_principal -eq "Pablo Corral") {
        $updateData.investigador_principal = "Corral Pablo"
        $needsUpdate = $true
    }
    
    if ($pData.original_investigador -eq "Pablo Corral") {
        $updateData.original_investigador = "Corral Pablo"
        $needsUpdate = $true
    }
    
    if ($needsUpdate) {
        Write-Host ("Updating record " + $patientKey + "...")
        
        $json = $updateData | ConvertTo-Json -Compress
        $updateUrl = $databaseUrl + "/gaelpa/patients/" + $patientKey + ".json"
        
        try {
            Invoke-RestMethod -Uri $updateUrl -Method Patch -Body ([System.Text.Encoding]::UTF8.GetBytes($json)) -ContentType "application/json; charset=utf-8"
            $count++
        }
        catch {
            Write-Host ("Failed to update " + $patientKey + ": " + $_.Exception.Message)
        }
    }
}

Write-Host ("Successfully updated " + $count + " records where investigator was 'Pablo Corral'.")
