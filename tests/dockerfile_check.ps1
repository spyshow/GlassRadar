# Test for frontend/Dockerfile existence and multi-stage structure
$dockerfilePath = "frontend/Dockerfile"

if (-not (Test-Path $dockerfilePath)) {
    Write-Host "FAIL: Dockerfile does not exist at $dockerfilePath"
    exit 1
}

$content = Get-Content $dockerfilePath -Raw

# Check for multi-stage keywords
$requiredStages = @("base", "build", "production")
foreach ($stage in $requiredStages) {
    if ($content -notmatch "AS $stage") {
        Write-Host "FAIL: Dockerfile missing stage: $stage"
        exit 1
    }
}

Write-Host "PASS: Dockerfile exists and has required stages."
exit 0
