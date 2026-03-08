# Test for docker-compose.prod.yml existence and services
$composePath = "docker-compose.prod.yml"

if (-not (Test-Path $composePath)) {
    Write-Host "FAIL: docker-compose.prod.yml does not exist"
    exit 1
}

$content = Get-Content $composePath -Raw

# Check for required services
$requiredServices = @("appwrite", "frontend")
foreach ($service in $requiredServices) {
    if ($content -notmatch "${service}:") {
        Write-Host "FAIL: docker-compose.prod.yml missing service: $service"
        exit 1
    }
}

# Check for restart policy (should be 'always' or 'unless-stopped' for prod)
if ($content -notmatch "restart: always" -and $content -notmatch "restart: unless-stopped") {
    Write-Host "FAIL: docker-compose.prod.yml missing restart policy"
    exit 1
}

Write-Host "PASS: docker-compose.prod.yml exists and has required services."
exit 0
