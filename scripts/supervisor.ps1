# TuneMavens Ecosystem Background Supervisor
$targetPorts = @(3000, 3001, 3002, 5000, 8001)
$root = "c:\BOCM\Apps\tunemavens"
$logDir = "$root\logs"

if (!(Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

foreach ($port in $targetPorts) {
    $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conns) {
        $pidsToKill = $conns.OwningProcess | Select-Object -Unique
        foreach ($p in $pidsToKill) {
            cmd /c "taskkill /F /T /PID $p >nul 2>&1"
            Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
        }
    }
}

# Clean up any lingering node/preview/nodemon processes from prior runs
Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object { 
    $_.CommandLine -like "*tunemavens*nodemon*" -or 
    $_.CommandLine -like "*nodemon src/server.js*" -or
    $_.CommandLine -like "*serve_preview.js*"
} | ForEach-Object {
    cmd /c "taskkill /F /T /PID $($_.ProcessId) >nul 2>&1"
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 2

function Start-FastApiBackend {
    $existing = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {
        $_.Name -eq 'python.exe' -and $_.CommandLine -like '*uvicorn*server:app*'
    }
    if (-not $existing) {
        Start-Process -FilePath "python" -ArgumentList "-m", "uvicorn", "server:app", "--app-dir", "backend", "--port", "8001", "--host", "0.0.0.0" -WorkingDirectory $root -RedirectStandardOutput "$logDir\backend.log" -RedirectStandardError "$logDir\backend_err.log" -WindowStyle Hidden
    }
}

function Start-ExpressApi {
    Start-Process -FilePath "node" -ArgumentList "src/server.js" -WorkingDirectory "$root\apps\api" -RedirectStandardOutput "$logDir\api.log" -RedirectStandardError "$logDir\api_err.log" -WindowStyle Hidden
}

function Start-Frontends {
    Start-Process -FilePath "node" -ArgumentList "scripts/serve_preview.js" -WorkingDirectory $root -RedirectStandardOutput "$logDir\frontends.log" -RedirectStandardError "$logDir\frontends_err.log" -WindowStyle Hidden
}

# Initial Startup
Start-FastApiBackend
Start-ExpressApi
Start-Frontends

# Supervisor persistent heartbeat & auto-heal loop
while ($true) {
    Start-Sleep -Seconds 15
    $activeConns = Get-NetTCPConnection -LocalPort $targetPorts -State Listen -ErrorAction SilentlyContinue
    $activePorts = @($activeConns | ForEach-Object { $_.LocalPort })

    if ($activePorts -notcontains 8001) {
        Start-FastApiBackend
    }
    if ($activePorts -notcontains 5000) {
        Start-ExpressApi
    }
    if (($activePorts -notcontains 3000) -or ($activePorts -notcontains 3001) -or ($activePorts -notcontains 3002)) {
        Start-Frontends
    }
}
