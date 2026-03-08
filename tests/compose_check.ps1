# Test for docker-compose.yml existence and services
$composePath = "docker-compose.yml"

if (-not (Test-Path $composePath)) {
    Write-Host "FAIL: docker-compose.yml does not exist"
    exit 1
}

$content = Get-Content $composePath -Raw

# Check for required services
$requiredServices = @("appwrite", "frontend")
foreach ($service in $requiredServices) {
    # Use ${service} to avoid issues with following colon
    if ($content -notmatch "${service}:") {
        Write-Host "FAIL: docker-compose.yml missing service: $service"
        exit 1
    }
}

Write-Host "PASS: docker-compose.yml exists and has required services."
exit 0
