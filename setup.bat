@echo off
REM HPCL Lead Intelligence - Windows Setup Script
REM Run as Administrator for best results

echo.
echo ========================================
echo  HPCL Lead Intelligence - Auto Setup
echo ========================================
echo.

REM Check if Ollama is installed
where ollama >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Ollama is installed
) else (
    echo [!] Ollama not found.
    echo.
    echo Please install Ollama from: https://ollama.ai/download
    echo After installing, run this script again.
    echo.
    pause
    exit /b 1
)

REM Check if Ollama server is running
curl -s http://localhost:11434/api/tags >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Starting Ollama server...
    start /B ollama serve
    timeout /t 3 /nobreak >nul
)
echo [OK] Ollama server running

REM Pull the model
echo.
echo Checking for qwen2.5:1.5b model...
ollama list | findstr /C:"qwen2.5:1.5b" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Downloading model (~1GB). This may take a few minutes...
    ollama pull qwen2.5:1.5b
)
echo [OK] Model ready

REM Install backend dependencies
echo.
echo Setting up backend...
cd /d "%~dp0backend"

if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
        echo [!] Created .env - please add your API keys
    )
)

call npm install --silent

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Starting server...
echo Dashboard: http://localhost:3001
echo.

node server.js
