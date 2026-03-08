# Test for multiple named volumes in docker-compose.yml
$composePath = "docker-compose.yml"

if (-not (Test-Path $composePath)) {
    Write-Host "FAIL: docker-compose.yml does not exist"
    exit 1
}

$content = Get-Content $composePath -Raw

# Check for specific Appwrite volumes
$requiredVolumes = @("appwrite-mariadb", "appwrite-uploads", "appwrite-config")
foreach ($volume in $requiredVolumes) {
    if ($content -notmatch "${volume}:") {
        Write-Host "FAIL: docker-compose.yml missing named volume: $volume"
        exit 1
    }
}

Write-Host "PASS: docker-compose.yml has required named volumes."
exit 0
