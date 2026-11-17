# TuneMavens Ecosystem Background Supervisor
$targetPorts = @(3000, 3001, 3002, 5000, 8001)

foreach ($port in $targetPorts) {
    $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conns) {
        $pidsToKill = $conns.OwningProcess | Select-Object -Unique
        foreach ($p in $pidsToKill) {
            if ($p -and $p -ne 0) {
                Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

Start-Sleep -Seconds 2

$logDir = "c:\BOCM\Apps\tunemavens\logs"
if (!(Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

# 1. FastAPI Backend (Port 8001)
Start-Process -FilePath "python" -ArgumentList "-m", "uvicorn", "server:app", "--app-dir", "backend", "--port", "8001", "--host", "0.0.0.0", "--reload" -WorkingDirectory "c:\BOCM\Apps\tunemavens" -WindowStyle Hidden

# 2. Portal (Port 3000)
Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm.cmd run dev" -WorkingDirectory "c:\BOCM\Apps\tunemavens\apps\portal" -WindowStyle Hidden

# 3. TuneStream (Port 3001)
Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm.cmd run dev" -WorkingDirectory "c:\BOCM\Apps\tunemavens\apps\tunestream" -WindowStyle Hidden

# 4. SyncMavens (Port 3002)
Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm.cmd run dev" -WorkingDirectory "c:\BOCM\Apps\tunemavens\apps\syncmavens" -WindowStyle Hidden

# 5. Express API (Port 5000)
Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm.cmd run dev" -WorkingDirectory "c:\BOCM\Apps\tunemavens\apps\api" -WindowStyle Hidden

# Supervisor persistent heartbeat loop
while ($true) {
    Start-Sleep -Seconds 30
}
