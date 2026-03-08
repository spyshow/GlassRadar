# Comprehensive Infrastructure Health Check
# This script verifies the existence and correctness of all infrastructure-related files and configurations.

$errors = 0

function Check-File($path, $name) {
    if (-not (Test-Path $path)) {
        Write-Host "FAIL: $name does not exist at $path" -ForegroundColor Red
        return $false
    }
    Write-Host "PASS: $name exists at $path" -ForegroundColor Green
    return $true
}

# 1. Check Dockerfile
if (-not (powershell.exe -NoProfile -ExecutionPolicy Bypass -File tests/dockerfile_check.ps1)) { $errors++ }

# 2. Check Docker Compose
if (-not (powershell.exe -NoProfile -ExecutionPolicy Bypass -File tests/compose_check.ps1)) { $errors++ }

# 3. Check Network Aliases
if (-not (powershell.exe -NoProfile -ExecutionPolicy Bypass -File tests/alias_check.ps1)) { $errors++ }

# 4. Check Volumes
if (-not (powershell.exe -NoProfile -ExecutionPolicy Bypass -File tests/volume_check.ps1)) { $errors++ }

# 5. Check Frontend Connectivity Config
if (-not (powershell.exe -NoProfile -ExecutionPolicy Bypass -File tests/connectivity_check.ps1)) { $errors++ }

if ($errors -gt 0) {
    Write-Host "`nInfrastructure health check failed with $errors errors." -ForegroundColor Red
    exit 1
} else {
    Write-Host "`nInfrastructure health check passed!" -ForegroundColor Green
    exit 0
}
