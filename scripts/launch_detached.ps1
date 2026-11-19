# Launch all 5 TuneMavens ecosystem services as detached independent background processes
$targetPorts = @(3000, 3001, 3002, 5000, 8001)
Write-Host "Stopping any existing services on ports: $($targetPorts -join ', ')..." -ForegroundColor Yellow

foreach ($port in $targetPorts) {
    $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conns) {
        $pidsToKill = $conns.OwningProcess | Select-Object -Unique
        foreach ($p in $pidsToKill) {
            if ($p -and $p -ne 0) {
                Write-Host "  Stopping PID $p on port $port" -ForegroundColor DarkYellow
                cmd /c "taskkill /F /T /PID $p >nul 2>&1"
                Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

# Clean up any lingering nodemon processes from prior runs
Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object { 
    $_.CommandLine -like "*tunemavens*nodemon*" -or 
    $_.CommandLine -like "*nodemon src/server.js*" 
} | ForEach-Object {
    cmd /c "taskkill /F /T /PID $($_.ProcessId) >nul 2>&1"
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 2

$root = "c:\BOCM\Apps\tunemavens"
$logDir = "$root\logs"
if (!(Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

$services = @(
    @{ Name = "FastAPI Backend"; Port = 8001; Url = "http://localhost:8001"; Cmd = "cmd.exe /c python -m uvicorn server:app --app-dir backend --port 8001 --host 0.0.0.0 --reload --reload-dir backend > `"$logDir\backend.log`" 2>&1" },
    @{ Name = "Portal";          Port = 3000; Url = "http://localhost:3000"; Cmd = "cmd.exe /c npm run dev --workspace=portal > `"$logDir\portal.log`" 2>&1" },
    @{ Name = "TuneStream";      Port = 3001; Url = "http://localhost:3001"; Cmd = "cmd.exe /c npm run dev --workspace=tunestream > `"$logDir\tunestream.log`" 2>&1" },
    @{ Name = "SyncMavens";      Port = 3002; Url = "http://localhost:3002"; Cmd = "cmd.exe /c npm run dev --workspace=syncmavens > `"$logDir\syncmavens.log`" 2>&1" },
    @{ Name = "Express API";     Port = 5000; Url = "http://localhost:5000"; Cmd = "cmd.exe /c npm run dev --workspace=api > `"$logDir\api.log`" 2>&1" }
)

Write-Host "`nLaunching independent services via WMI Win32_Process..." -ForegroundColor Cyan

foreach ($svc in $services) {
    $res = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{
        CommandLine = $svc.Cmd
        CurrentDirectory = $root
    }
    Write-Host "  Spawned: $($svc.Name) (Port $($svc.Port), PID: $($res.ProcessId), ReturnCode: $($res.ReturnValue))"
}

Write-Host "`nWaiting for services to become available..." -ForegroundColor Cyan

$timeoutSeconds = 25
$elapsed = 0
$allReady = $false

while ($elapsed -lt $timeoutSeconds) {
    Start-Sleep -Seconds 2
    $elapsed += 2
    
    $activeConns = Get-NetTCPConnection -LocalPort $targetPorts -State Listen -ErrorAction SilentlyContinue
    $activePorts = @($activeConns | ForEach-Object { $_.LocalPort })
    
    $readyCount = 0
    foreach ($svc in $services) {
        if ($activePorts -contains $svc.Port) {
            $readyCount++
        }
    }
    
    if ($readyCount -eq $services.Count) {
        $allReady = $true
        break
    }
    Write-Host "  Waiting for ports ($readyCount/$($services.Count) listening)... [$elapsed`s]" -ForegroundColor DarkGray
}

Write-Host "`nService Health Verification:" -ForegroundColor Green
$activeConns = Get-NetTCPConnection -LocalPort $targetPorts -State Listen -ErrorAction SilentlyContinue
foreach ($svc in $services) {
    $match = $activeConns | Where-Object { $_.LocalPort -eq $svc.Port } | Select-Object -First 1
    if ($match) {
        Write-Host "  [ONLINE]  $($svc.Name.PadRight(18)) -> $($svc.Url) (Port $($svc.Port), PID $($match.OwningProcess))" -ForegroundColor Green
    } else {
        Write-Host "  [OFFLINE] $($svc.Name.PadRight(18)) -> $($svc.Url) (Port $($svc.Port))" -ForegroundColor Red
    }
}
