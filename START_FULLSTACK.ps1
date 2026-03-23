# Safety E-Stop System - Full Stack Startup Script
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " Safety E-Stop System - Full Stack Startup" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend API
Write-Host "🚀 Starting Backend API..." -ForegroundColor Yellow
$backendPath = Join-Path $scriptPath "SafetyEStopSystem.API"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend API Starting...' -ForegroundColor Green; dotnet run" -WindowStyle Normal

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "🎨 Starting Frontend React App..." -ForegroundColor Yellow
$frontendPath = Join-Path $scriptPath "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Frontend Starting...' -ForegroundColor Green; npm run dev" -WindowStyle Normal

# Wait for servers to start
Start-Sleep -Seconds 5

# Open browser to frontend
Write-Host "🌐 Opening browser..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "✅ Both servers are running!" -ForegroundColor Green
Write-Host "   Backend:  http://localhost:5260" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Swagger:  http://localhost:5260/swagger" -ForegroundColor Gray
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Tip: Close the PowerShell windows to stop the servers" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
