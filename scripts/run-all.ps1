<#
Run this script from the project root (or double-click) to:
- install npm dependencies
- install Playwright browser binaries
- start backend server and frontend dev server in separate PowerShell windows
- run Playwright e2e tests

Usage (PowerShell):
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; .\scripts\run-all.ps1
#>

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $root

Write-Host "Installing npm dependencies..."
npm install

Write-Host "Installing Playwright browsers... (may require admin on some systems)"
npx playwright install --with-deps

Write-Host "Starting backend server in a new PowerShell window..."
Start-Process -FilePath 'powershell' -ArgumentList "-NoExit","-Command","cd '$root'; npm run start:server" -WindowStyle Normal
Start-Sleep -Seconds 2

Write-Host "Starting frontend dev server in a new PowerShell window..."
Start-Process -FilePath 'powershell' -ArgumentList "-NoExit","-Command","cd '$root'; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 4

# wait for dev server and open in browser before running tests
Write-Host "Waiting for http://localhost:8081 to become available..."
npx wait-on http://localhost:8081 || (Start-Sleep -Seconds 2; npx wait-on http://localhost:8081)
try {
  Start-Process "http://localhost:8081"
} catch {
  Write-Host "Could not automatically open browser. Please open http://localhost:8081 manually."
}

Write-Host "Running Playwright e2e tests (will run against http://localhost:8081)..."
npm run test:e2e

Write-Host "Done. If tests generate an HTML report, open 'playwright-report/index.html' to view results." 
