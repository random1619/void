@echo off
title VOID Fashion - Startup CLI
echo ========================================================
echo                 VOID FASHION - STARTUP
echo ========================================================
echo.
echo [1/2] Verifying Node.js environment...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo [2/2] Launching client and server in development mode...
echo.
echo App will be accessible at:
echo   Client: http://localhost:3000/ (or http://localhost:3001/ if 3000 is in use)
echo   Server: http://localhost:5000/
echo.
echo Press Ctrl+C in this terminal to terminate both servers.
echo.

:: Start concurrently dev script
npm run dev
