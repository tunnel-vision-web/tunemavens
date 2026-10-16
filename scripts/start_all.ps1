# Start all 5 TuneMavens ecosystem services
Write-Host "Starting TuneMavens Ecosystem Services..." -ForegroundColor Cyan

# 1. FastAPI Backend (Port 8001)
Start-Process -FilePath "python" -ArgumentList "-m", "uvicorn", "server:app", "--port", "8001", "--reload" -WorkingDirectory "c:\BOCM\Apps\tunemavens\backend" -WindowStyle Hidden

# 2. Portal (Port 3000)
Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm run dev" -WorkingDirectory "c:\BOCM\Apps\tunemavens\apps\portal" -WindowStyle Hidden

# 3. TuneStream (Port 3001)
Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm run dev" -WorkingDirectory "c:\BOCM\Apps\tunemavens\apps\tunestream" -WindowStyle Hidden

# 4. SyncMavens (Port 3002)
Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm run dev" -WorkingDirectory "c:\BOCM\Apps\tunemavens\apps\syncmavens" -WindowStyle Hidden

# 5. Express API (Port 5000)
Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm run dev" -WorkingDirectory "c:\BOCM\Apps\tunemavens\apps\api" -WindowStyle Hidden

Start-Sleep -Seconds 4
Write-Host "Services launched. Verifying ports..." -ForegroundColor Green
Get-NetTCPConnection -LocalPort 3000,3001,3002,5000,8001 -ErrorAction SilentlyContinue | Select-Object LocalPort, State, OwningProcess
