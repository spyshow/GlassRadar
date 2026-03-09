# Test for Appwrite internal alias usage in frontend configuration
$appwriteUtilPath = "frontend/src/utility/appwriteClient.ts"

if (-not (Test-Path $appwriteUtilPath)) {
    Write-Host "FAIL: frontend configuration file does not exist at $appwriteUtilPath"
    exit 1
}

$content = Get-Content $appwriteUtilPath -Raw

# Check for localhost usage (needed for browser access)
if ($content -notmatch "http://localhost/v1") {
    Write-Host "FAIL: frontend not configured to use 'http://localhost/v1'"
    exit 1
}

Write-Host "PASS: frontend is correctly configured to use http://localhost/v1."
exit 0
