@echo off
title AlgoVault - 1-Click Docker Launch
echo ===================================================
echo   🚀 Starting AlgoVault Docker Infrastructure...
echo ===================================================
echo.

docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed or not running.
    echo Please install Docker Desktop for Windows and make sure it is open.
    pause
    exit /b 1
)

echo [1/2] Building and launching PostgreSQL, Redis, and Spring Boot Backend...
docker compose up -d --build

if %errorlevel% neq 0 (
    echo [ERROR] Failed to start Docker containers.
    pause
    exit /b 1
)

echo.
echo ===================================================
echo   ✅ SUCCESS! AlgoVault is live on http://localhost:8080
echo ===================================================
echo.
echo Next steps:
echo 1. Open Google Chrome and go to chrome://extensions
echo 2. Enable "Developer mode" (top-right corner switch)
echo 3. Click "Load unpacked" and select:
echo    %~dp0extension\build\chrome-mv3-prod
echo.
pause
