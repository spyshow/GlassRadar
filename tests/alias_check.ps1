# Test for network aliases in docker-compose.yml
$composePath = "docker-compose.yml"

if (-not (Test-Path $composePath)) {
    Write-Host "FAIL: docker-compose.yml does not exist"
    exit 1
}

$content = Get-Content $composePath -Raw

# Check for network aliases configuration
if ($content -notmatch "aliases:") {
    Write-Host "FAIL: docker-compose.yml missing aliases configuration"
    exit 1
}

Write-Host "PASS: docker-compose.yml has network aliases."
exit 0
