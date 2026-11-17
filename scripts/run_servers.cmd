@echo off
cd /d "c:\BOCM\Apps\tunemavens"

rem 1. FastAPI Backend (8001)
start "FastAPI_Backend" /min python -m uvicorn server:app --app-dir backend --port 8001 --host 0.0.0.0 --reload

rem 2. Portal (3000)
start "Portal_3000" /min cmd.exe /c "npm.cmd run dev --workspace=portal"

rem 3. TuneStream (3001)
start "TuneStream_3001" /min cmd.exe /c "npm.cmd run dev --workspace=tunestream"

rem 4. SyncMavens (3002)
start "SyncMavens_3002" /min cmd.exe /c "npm.cmd run dev --workspace=syncmavens"

rem 5. Express API (5000)
start "Express_API_5000" /min cmd.exe /c "npm.cmd run dev --workspace=api"
