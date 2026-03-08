# Test for environment variable strategy
$envFile = ".env"
$envProdFile = ".env.prod"

if (-not (Test-Path $envFile)) {
    Write-Host "FAIL: $envFile does not exist"
    exit 1
}

if (-not (Test-Path $envProdFile)) {
    Write-Host "FAIL: $envProdFile does not exist"
    exit 1
}

# Check if docker-compose.yml uses environment variables
$composeContent = Get-Content "docker-compose.yml" -Raw
if ($composeContent -notmatch "\$\{") {
    Write-Host "FAIL: docker-compose.yml does not seem to use environment variables"
    exit 1
}

Write-Host "PASS: Environment variable strategy is implemented."
exit 0
