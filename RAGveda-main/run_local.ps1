Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  Starting IP-SAKTI Sahayak (Smart India Hackathon)" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Cyan

$rootDir = Get-Location

# 1. Start FastAPI Backend in background job
Write-Host "`n[1/2] Launching FastAPI Backend on http://127.0.0.1:8000 ..." -ForegroundColor Yellow
$apiJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\apps\api'; .\.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000" -PassThru

Start-Sleep -Seconds 2

# 2. Start Vite Frontend
Write-Host "[2/2] Launching Vite Frontend on http://localhost:5173 ..." -ForegroundColor Yellow
Set-Location "$rootDir\apps\web"
npm run dev
