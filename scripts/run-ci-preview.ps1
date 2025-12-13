<#
Run CI-like flow locally:
- npm ci
- build frontend
- install Playwright browsers
- start backend server in a new window
- start Vite preview on port 8081 in a new window
- wait for preview to be ready
- run Playwright tests

Usage (PowerShell):
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; .\scripts\run-ci-preview.ps1
#>

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $root

Write-Host "Installing dependencies (npm ci)..."
npm ci

Write-Host "Building frontend..."
npm run build

Write-Host "Installing Playwright browsers..."
npx playwright install --with-deps

Write-Host "Starting backend server in new PowerShell window..."
Start-Process -FilePath 'powershell' -ArgumentList "-NoExit","-Command","cd '$root'; npm run start:server" -WindowStyle Normal
Start-Sleep -Seconds 2

Write-Host "Starting Vite preview on port 8081 in new PowerShell window..."
Start-Process -FilePath 'powershell' -ArgumentList "-NoExit","-Command","cd '$root'; npm run preview -- --port 8081" -WindowStyle Normal
Start-Sleep -Seconds 4

Write-Host "Waiting for http://localhost:8081 to become available..."
npx wait-on http://localhost:8081

Write-Host "Running Playwright tests..."
npm run test:e2e

Write-Host "Playwright tests finished. If an HTML report was generated, open 'playwright-report/index.html' to view it." 
