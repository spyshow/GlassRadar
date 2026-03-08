# Test for actual persistence (volume existence)
$requiredVolumes = @("appwrite-mariadb-dev", "appwrite-uploads-dev", "appwrite-config-dev")

foreach ($vol in $requiredVolumes) {
    $exists = docker volume ls -q --filter "name=$vol"
    if (-not $exists) {
        Write-Host "FAIL: Docker volume $vol does not exist. Run 'docker compose up' first."
        exit 1
    }
}

Write-Host "PASS: All required dev volumes exist in Docker."
exit 0
