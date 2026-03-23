Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Safety E-Stop System - Diagnostics" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Backend
Write-Host "🔍 Checking Backend API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5260/swagger/index.html" -UseBasicParsing -TimeoutSec 3
    Write-Host "✅ Backend API is RUNNING on http://localhost:5260" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend API is NOT running!" -ForegroundColor Red
    Write-Host "   Please start it with: dotnet run (in SafetyEStopSystem.API folder)" -ForegroundColor Yellow
}

Write-Host ""

# Check Frontend
Write-Host "🔍 Checking Frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 3
    Write-Host "✅ Frontend is RUNNING on http://localhost:3000" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend is NOT running!" -ForegroundColor Red
    Write-Host "   Please start it with: npm run dev (in frontend folder)" -ForegroundColor Yellow
}

Write-Host ""

# Check Node.js
Write-Host "🔍 Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found!" -ForegroundColor Red
}

Write-Host ""

# Check .NET
Write-Host "🔍 Checking .NET SDK..." -ForegroundColor Yellow
try {
    $dotnetVersion = dotnet --version
    Write-Host "✅ .NET SDK installed: $dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ .NET SDK not found!" -ForegroundColor Red
}

Write-Host ""

# Check Database Connection
Write-Host "🔍 Checking Database..." -ForegroundColor Yellow
$connectionString = "Server=LTIN462968\\SQLEXPRESS;Database=SafetyDB;Trusted_Connection=True;TrustServerCertificate=True;"
try {
    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $connection.Open()
    Write-Host "✅ Database connection successful!" -ForegroundColor Green
    $connection.Close()
} catch {
    Write-Host "❌ Database connection failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Diagnostics Complete" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
