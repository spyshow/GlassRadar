# Test for actual persistence (volume existence) with project prefix
$requiredVolumes = @("appwrite-mariadb-dev", "appwrite-uploads-dev", "appwrite-config-dev")

foreach ($vol in $requiredVolumes) {
    # Check for both exact match and project-prefixed match
    $exists = docker volume ls -q --filter "name=$vol"
    if (-not $exists) {
        $exists = docker volume ls -q --filter "name=glassradar_$vol"
    }
    
    if (-not $exists) {
        Write-Host "FAIL: Docker volume $vol (or glassradar_$vol) does not exist. Run 'docker compose up' first."
        exit 1
    }
}

Write-Host "PASS: All required dev volumes exist in Docker."
exit 0
