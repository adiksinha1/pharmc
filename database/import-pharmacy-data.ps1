# Pharmacy Data Import Script
# Run this script to set up pharmacy data tables and import CSV data

Write-Host "=== Pharmac Database Setup ===" -ForegroundColor Cyan
Write-Host ""

$dbName = "pharmac_db"
$mysqlUser = "root"

# Prompt for MySQL password
$mysqlPassword = Read-Host -Prompt "Enter MySQL root password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($mysqlPassword)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

Write-Host ""
Write-Host "Step 1: Creating pharmacy data tables..." -ForegroundColor Yellow

# Create tables
$createTablesSQL = Get-Content -Path ".\pharmacy-data-schema.sql" -Raw
$createTablesSQL | mysql -u $mysqlUser -p"$plainPassword" $dbName 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Tables created successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Error creating tables" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Importing CSV data..." -ForegroundColor Yellow

# Update the import script with the password
$importScript = Get-Content -Path ".\import-csv-data.cjs" -Raw
$importScript = $importScript -replace "password: 'yourpassword'", "password: '$plainPassword'"
Set-Content -Path ".\import-csv-data-temp.cjs" -Value $importScript

# Run the import
node .\import-csv-data-temp.cjs

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Data imported successfully" -ForegroundColor Green
    Remove-Item -Path ".\import-csv-data-temp.cjs" -Force
} else {
    Write-Host "✗ Error importing data" -ForegroundColor Red
    Remove-Item -Path ".\import-csv-data-temp.cjs" -Force -ErrorAction SilentlyContinue
    exit 1
}

Write-Host ""
Write-Host "Step 3: Verifying data..." -ForegroundColor Yellow

$verifySQL = @"
USE $dbName;
SELECT 'Medicines' as TableName, COUNT(*) as Count FROM medicines
UNION ALL
SELECT 'Customers', COUNT(*) FROM customers
UNION ALL
SELECT 'Sales', COUNT(*) FROM sales
UNION ALL
SELECT 'Suppliers', COUNT(*) FROM suppliers;
"@

$verifySQL | mysql -u $mysqlUser -p"$plainPassword" -t

Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your pharmacy data has been imported successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Available API endpoints:" -ForegroundColor Yellow
Write-Host "  GET /api/medicines" -ForegroundColor White
Write-Host "  GET /api/customers" -ForegroundColor White
Write-Host "  GET /api/sales" -ForegroundColor White
Write-Host "  GET /api/suppliers" -ForegroundColor White
Write-Host "  GET /api/analytics/low-stock" -ForegroundColor White
Write-Host "  GET /api/analytics/expiring-soon" -ForegroundColor White
Write-Host "  GET /api/analytics/sales-summary" -ForegroundColor White
Write-Host ""
Write-Host "Start the server with: npm run dev" -ForegroundColor Cyan
