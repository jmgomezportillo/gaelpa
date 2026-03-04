$databaseUrl = "https://gaelpa-efba4-default-rtdb.firebaseio.com"

Write-Host "Fetching users..."
$users = Invoke-RestMethod -Uri "$databaseUrl/gaelpa/users.json" -Method Get
$userNames = @()
if ($users) {
    $userNames = $users.PSObject.Properties | ForEach-Object { $_.Value.nombre } | Select-Object -Unique | Where-Object { $_ -ne $null }
}

Write-Host "Fetching patients (this may take a moment)..."
$patients = Invoke-RestMethod -Uri "$databaseUrl/gaelpa/patients.json" -Method Get
$investigatorNames = @()
if ($patients) {
    $investigatorNames = $patients.PSObject.Properties | ForEach-Object { $_.Value.investigador_principal } | Select-Object -Unique | Where-Object { $_ -ne $null }
}

Write-Host "`n--- Analysis Results ---"
Write-Host "Total unique Users: $($userNames.Count)"
Write-Host "Total unique Investigators found in Patients: $($investigatorNames.Count)"

$investigatorsMissingInUsers = @()
if ($investigatorNames) {
    $investigatorsMissingInUsers = $investigatorNames | Where-Object { $userNames -notcontains $_ }
}

$usersWithoutPatients = @()
if ($userNames) {
    $usersWithoutPatients = $userNames | Where-Object { $investigatorNames -notcontains $_ }
}

Write-Host "`nInvestigators in Patients but NOT in Users ($($investigatorsMissingInUsers.Count)):"
if ($investigatorsMissingInUsers.Count -gt 0) {
    $investigatorsMissingInUsers | ForEach-Object { Write-Host " - $_" }
}
else {
    Write-Host " None"
}

Write-Host "`nUsers in Database but NOT in Patients ($($usersWithoutPatients.Count)):"
if ($usersWithoutPatients.Count -gt 0) {
    $usersWithoutPatients | ForEach-Object { Write-Host " - $_" }
}
else {
    Write-Host " None"
}
