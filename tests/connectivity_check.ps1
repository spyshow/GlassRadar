# Test for Appwrite internal alias usage in frontend configuration
$appwriteUtilPath = "frontend/src/utility/appwrite.ts"

if (-not (Test-Path $appwriteUtilPath)) {
    Write-Host "FAIL: frontend configuration file does not exist at $appwriteUtilPath"
    exit 1
}

$content = Get-Content $appwriteUtilPath -Raw

# Check for internal alias usage
if ($content -notmatch "http://appwrite.local/v1") {
    Write-Host "FAIL: frontend not configured to use internal alias 'http://appwrite.local/v1'"
    exit 1
}

Write-Host "PASS: frontend is correctly configured to use the internal Appwrite alias."
exit 0
