# This script requires Admin privileges
# Right-click PowerShell and select "Run as administrator"
# Then run: Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
# Then: .\FIX_ALL.ps1

Write-Host "`n" -NoNewline
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  COMPLETE SYSTEM FIX - STARTING" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Get the project root
$projectRoot = "c:\Users\ADITYA\Downloads\dream-weaver-main (1)\Pharmac"
Set-Location $projectRoot

Write-Host "📁 Working directory: $projectRoot" -ForegroundColor Yellow
Write-Host ""

# Step 1: Kill Node processes
Write-Host "STEP 1: Killing old Node processes..." -ForegroundColor Cyan
try {
    Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "✅ Node processes killed" -ForegroundColor Green
} catch {
    Write-Host "⚠️  No node processes found (OK)" -ForegroundColor Yellow
}

Start-Sleep -Seconds 2

# Step 2: Clear users.json
Write-Host ""
Write-Host "STEP 2: Clearing server storage..." -ForegroundColor Cyan
try {
    $usersFile = Join-Path $projectRoot "server\users.json"
    Set-Content -Path $usersFile -Value "[]" -Encoding UTF8
    Write-Host "✅ users.json cleared" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not clear users.json: $_" -ForegroundColor Yellow
}

# Step 3: Start MySQL
Write-Host ""
Write-Host "STEP 3: Starting MySQL80 service..." -ForegroundColor Cyan

$service = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue

if ($service) {
    if ($service.Status -eq "Stopped") {
        Write-Host "  Service found, starting..." -ForegroundColor White
        try {
            Start-Service -Name "MySQL80" -ErrorAction Stop
            Start-Sleep -Seconds 3
            
            $service.Refresh()
            if ($service.Status -eq "Running") {
                Write-Host "✅ MySQL80 started successfully" -ForegroundColor Green
            } else {
                Write-Host "⚠️  MySQL80 may not have started (still shows: $($service.Status))" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "❌ Error starting MySQL80: $_" -ForegroundColor Red
            Write-Host "   You may need to run PowerShell as Administrator" -ForegroundColor Red
        }
    } else {
        Write-Host "✅ MySQL80 is already running" -ForegroundColor Green
    }
} else {
    Write-Host "❌ MySQL80 service not found" -ForegroundColor Red
    Write-Host "   Please install MySQL Server first" -ForegroundColor Red
}

# Step 4: Verify MySQL status
Write-Host ""
Write-Host "STEP 4: Verifying MySQL connection..." -ForegroundColor Cyan

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
if (Test-Path $mysqlPath) {
    try {
        $testResult = & $mysqlPath -u root -e "SELECT 1;" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ MySQL is responding (default password)" -ForegroundColor Green
        } else {
            Write-Host "⚠️  MySQL running but needs password check" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "⚠️  Could not verify MySQL: $_" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  MySQL executable not found at: $mysqlPath" -ForegroundColor Yellow
}

# Step 5: Summary
Write-Host ""
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  NEXT STEPS" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open VS Code Terminal (or new PowerShell)" -ForegroundColor White
Write-Host "2. Run: npm run dev" -ForegroundColor White
Write-Host "3. Look for: 'Using MySQL storage (mysql2)'" -ForegroundColor White
Write-Host "4. Open: http://localhost:5173/signup" -ForegroundColor White
Write-Host "5. Clear browser storage (F12 → Console):" -ForegroundColor White
Write-Host "   localStorage.clear(); sessionStorage.clear(); location.reload();" -ForegroundColor Cyan
Write-Host "6. Try signup with fresh email" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Enter to close..." -ForegroundColor Green
Read-Host
