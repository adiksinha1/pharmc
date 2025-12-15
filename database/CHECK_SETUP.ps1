Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PHARMAC DATABASE DIAGNOSTIC TOOL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check 1: MySQL Service Status
Write-Host "1. Checking MySQL Service..." -ForegroundColor Yellow
$service = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue

if ($service) {
    if ($service.Status -eq "Running") {
        Write-Host "   [OK] MySQL service is RUNNING" -ForegroundColor Green
    } else {
        Write-Host "   [FAIL] MySQL service is STOPPED" -ForegroundColor Red
        Write-Host "     -> Run START_MYSQL_ADMIN.bat as Administrator" -ForegroundColor Yellow
        $allGood = $false
    }
} else {
    Write-Host "   [FAIL] MySQL service not found" -ForegroundColor Red
    Write-Host "     -> Install MySQL Server first" -ForegroundColor Yellow
    $allGood = $false
}

Write-Host ""

# Check 2: .env File
Write-Host "2. Checking .env Configuration..." -ForegroundColor Yellow
$envPath = Join-Path (Join-Path $PSScriptRoot "..") ".env"

if (Test-Path $envPath) {
    Write-Host "   [OK] .env file exists" -ForegroundColor Green
    
    $envContent = Get-Content $envPath -Raw
    
    if ($envContent -match "MYSQL_PASSWORD=\s*$" -or $envContent -match "MYSQL_PASSWORD=your") {
        Write-Host "   [FAIL] MySQL password is not set" -ForegroundColor Red
        Write-Host "     -> Edit .env file and set your MySQL root password" -ForegroundColor Yellow
        $allGood = $false
    } else {
        Write-Host "   [OK] MySQL password is configured" -ForegroundColor Green
    }
    
    if ($envContent -match "MYSQL_DATABASE=pharmac_db") {
        Write-Host "   [OK] Database name is correct" -ForegroundColor Green
    } else {
        Write-Host "   [WARN] Database name might be incorrect" -ForegroundColor Yellow
    }
} else {
    Write-Host "   [FAIL] .env file not found" -ForegroundColor Red
    Write-Host "     -> Copy .env.example to .env" -ForegroundColor Yellow
    $allGood = $false
}

Write-Host ""

# Check 3: MySQL Executable
Write-Host "3. Checking MySQL Installation..." -ForegroundColor Yellow
$mysqlPaths = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 9.0\bin\mysql.exe"
)

$mysqlFound = $false
foreach ($path in $mysqlPaths) {
    if (Test-Path $path) {
        Write-Host "   [OK] MySQL installed at: $path" -ForegroundColor Green
        $mysqlFound = $true
        break
    }
}

if (-not $mysqlFound) {
    Write-Host "   [FAIL] MySQL executable not found" -ForegroundColor Red
    Write-Host "     -> Install MySQL Server" -ForegroundColor Yellow
    $allGood = $false
}

Write-Host ""

# Check 4: Node Server Running
Write-Host "4. Checking Node Server..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    $count = @($nodeProcesses).Count
    Write-Host "   [OK] Node server is running ($count process)" -ForegroundColor Green
} else {
    Write-Host "   [WARN] Node server not running" -ForegroundColor Yellow
    Write-Host "     -> Run 'npm run dev' to start" -ForegroundColor Yellow
}

Write-Host ""

# Check 5: SQL Script Files
Write-Host "5. Checking Setup Scripts..." -ForegroundColor Yellow
$scriptsPath = $PSScriptRoot

if (Test-Path (Join-Path $scriptsPath "setup-database-workbench.sql")) {
    Write-Host "   [OK] setup-database-workbench.sql found" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] setup-database-workbench.sql not found" -ForegroundColor Red
    $allGood = $false
}

if (Test-Path (Join-Path $scriptsPath "START_MYSQL_ADMIN.bat")) {
    Write-Host "   [OK] START_MYSQL_ADMIN.bat found" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] START_MYSQL_ADMIN.bat not found" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "[SUCCESS] ALL CHECKS PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Open MySQL Workbench" -ForegroundColor White
    Write-Host "2. Connect to localhost:3306" -ForegroundColor White
    Write-Host "3. Run setup-database-workbench.sql" -ForegroundColor White
    Write-Host "4. Refresh and check for 6 tables" -ForegroundColor White
} else {
    Write-Host "[ISSUES FOUND]" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please fix the issues above before proceeding." -ForegroundColor Yellow
    Write-Host "Refer to DATABASE_QUICK_FIX.txt for detailed instructions." -ForegroundColor Yellow
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
pause
