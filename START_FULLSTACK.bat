@echo off
echo ====================================================
echo  Safety E-Stop System - Full Stack Startup
echo ====================================================
echo.

echo Starting Backend API...
start "Backend API" cmd /k "cd SafetyEStopSystem.API && dotnet run"
timeout /t 3 /nobreak >nul

echo Starting Frontend React App...
start "Frontend React" cmd /k "cd frontend && npm run dev"

echo.
echo ====================================================
echo  Both servers are starting!
echo  Backend:  http://localhost:5260
echo  Frontend: http://localhost:3000
echo ====================================================
echo.
echo Press any key to stop both servers...
pause >nul

echo Stopping servers...
taskkill /FI "WindowTitle eq Backend API*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq Frontend React*" /T /F >nul 2>&1
echo Done!
