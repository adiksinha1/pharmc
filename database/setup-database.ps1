# Pharmac Database Setup Script
# Run this script AFTER installing MySQL Server and MySQL Workbench

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Pharmac Database Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if MySQL is installed
$mysqlPath = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 9.0\bin\mysql.exe",
    "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe"
)

$mysql = $null
foreach ($path in $mysqlPath) {
    if (Test-Path $path) {
        $mysql = $path
        break
    }
}

if (-not $mysql) {
    Write-Host "ERROR: MySQL is not installed or not found in default locations." -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install MySQL first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://dev.mysql.com/downloads/installer/" -ForegroundColor Yellow
    Write-Host "2. Install both MySQL Server and MySQL Workbench" -ForegroundColor Yellow
    Write-Host "3. Set a root password during installation" -ForegroundColor Yellow
    Write-Host "4. Run this script again" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to open MySQL download page"
    Start-Process "https://dev.mysql.com/downloads/installer/"
    exit 1
}

Write-Host "Found MySQL at: $mysql" -ForegroundColor Green
Write-Host ""

# Check if MySQL service is running
$service = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue | Select-Object -First 1

if ($service) {
    if ($service.Status -ne "Running") {
        Write-Host "Starting MySQL service..." -ForegroundColor Yellow
        Start-Service $service.Name
        Start-Sleep -Seconds 3
    }
    Write-Host "MySQL service is running: $($service.Name)" -ForegroundColor Green
} else {
    Write-Host "WARNING: MySQL service not found. MySQL might not be configured correctly." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get MySQL credentials
$rootPassword = Read-Host "Enter MySQL root password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($rootPassword)
$password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Test connection
Write-Host ""
Write-Host "Testing MySQL connection..." -ForegroundColor Yellow
$testCmd = "SELECT 1;"
$testResult = & $mysql -u root -p$password -e $testCmd 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Cannot connect to MySQL. Please check your password." -ForegroundColor Red
    exit 1
}

Write-Host "Connection successful!" -ForegroundColor Green
Write-Host ""

# Execute schema.sql
Write-Host "Creating database schema..." -ForegroundColor Yellow
$schemaPath = Join-Path $PSScriptRoot "schema.sql"

if (Test-Path $schemaPath) {
    $schemaContent = Get-Content -Path $schemaPath -Raw
    $schemaContent | & $mysql -u root -p$password
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[+] Database schema created successfully!" -ForegroundColor Green
    } else {
        Write-Host "[-] Error creating schema" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "ERROR: schema.sql not found at $schemaPath" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Execute seed.sql
Write-Host "Inserting seed data..." -ForegroundColor Yellow
$seedPath = Join-Path $PSScriptRoot "seed.sql"

if (Test-Path $seedPath) {
    $seedContent = Get-Content -Path $seedPath -Raw
    $seedContent | & $mysql -u root -p$password
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[+] Seed data inserted successfully!" -ForegroundColor Green
    } else {
        Write-Host "[-] Error inserting seed data" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "ERROR: seed.sql not found at $seedPath" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verify database
Write-Host "Verifying database setup..." -ForegroundColor Yellow
$verifyCmd = "USE pharmac_db; SHOW TABLES;"
$tables = & $mysql -u root -p$password -e $verifyCmd 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[+] Database verified successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Tables created:" -ForegroundColor Cyan
    Write-Host $tables
} else {
    Write-Host "[-] Error verifying database" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Optional: Create Application User" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$createUser = Read-Host "Do you want to create a dedicated database user for the application? (Y/N)"

if ($createUser -eq "Y" -or $createUser -eq "y") {
    Write-Host ""
    $appUser = Read-Host "Enter username (default: pharmac_user)"
    if ([string]::IsNullOrWhiteSpace($appUser)) {
        $appUser = "pharmac_user"
    }
    
    $appPassword = Read-Host "Enter password for $appUser" -AsSecureString
    $BSTR2 = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($appPassword)
    $appPass = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR2)
    
    $createUserSQL = "CREATE USER IF NOT EXISTS '$appUser'`@'localhost' IDENTIFIED BY '$appPass'; GRANT ALL PRIVILEGES ON pharmac_db.* TO '$appUser'`@'localhost'; FLUSH PRIVILEGES;"
    
    $createUserSQL | & $mysql -u root -p$password
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[+] User '$appUser' created successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Database connection details:" -ForegroundColor Cyan
        Write-Host "  Host: localhost" -ForegroundColor White
        Write-Host "  Port: 3306" -ForegroundColor White
        Write-Host "  Database: pharmac_db" -ForegroundColor White
        Write-Host "  Username: $appUser" -ForegroundColor White
        Write-Host "  Password: $appPass" -ForegroundColor White
        Write-Host ""
        Write-Host "Add these to your .env file or application configuration" -ForegroundColor Yellow
    } else {
        Write-Host "[-] Error creating user" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Open MySQL Workbench and create a connection to localhost:3306" -ForegroundColor White
Write-Host "2. Connect using root or the user you just created" -ForegroundColor White
Write-Host "3. Browse the 'pharmac_db' database to see your tables" -ForegroundColor White
Write-Host "4. Update your application's database configuration" -ForegroundColor White
Write-Host ""
Write-Host "Press Enter to exit..."
Read-Host
