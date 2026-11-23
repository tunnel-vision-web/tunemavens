# Launch all 5 TuneMavens ecosystem services via background supervisor
$targetPorts = @(3000, 3001, 3002, 5000, 8001)
$root = "c:\BOCM\Apps\tunemavens"
$logDir = "$root\logs"

if (!(Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

Write-Host "Stopping and resetting any existing services on ports: $($targetPorts -join ', ')..." -ForegroundColor Yellow

# Stop running scheduled task
Stop-ScheduledTask -TaskName "TuneMavensServers" -ErrorAction SilentlyContinue

# Stop processes holding ports
foreach ($port in $targetPorts) {
    $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conns) {
        $pidsToKill = $conns.OwningProcess | Select-Object -Unique
        foreach ($p in $pidsToKill) {
            if ($p -and $p -ne 0) {
                cmd /c "taskkill /F /T /PID $p >nul 2>&1"
                Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

# Clean up any lingering supervisor or preview processes from prior runs
Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object { 
    $_.CommandLine -like "*supervisor.ps1*" -or 
    $_.CommandLine -like "*tunemavens*nodemon*" -or 
    $_.CommandLine -like "*nodemon src/server.js*" -or
    $_.CommandLine -like "*serve_preview.js*"
} | ForEach-Object {
    cmd /c "taskkill /F /T /PID $($_.ProcessId) >nul 2>&1"
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 2

Write-Host "`nLaunching TuneMavens Supervisor daemon..." -ForegroundColor Cyan

# Prefer Windows Scheduled Task for true independent persistence across shell exits
$scheduledTask = Get-ScheduledTask -TaskName "TuneMavensServers" -ErrorAction SilentlyContinue
if ($scheduledTask) {
    Start-ScheduledTask -TaskName "TuneMavensServers"
    Write-Host "  Started via Windows Scheduled Task: TuneMavensServers" -ForegroundColor Green
} else {
    Start-Process -FilePath "powershell.exe" -ArgumentList "-ExecutionPolicy", "Bypass", "-WindowStyle", "Hidden", "-File", "$root\scripts\supervisor.ps1" -WorkingDirectory $root -WindowStyle Hidden
    Write-Host "  Started via detached supervisor process" -ForegroundColor Green
}

Write-Host "`nWaiting for services to become available..." -ForegroundColor Cyan

$services = @(
    @{ Name = "FastAPI Backend"; Port = 8001; Url = "http://localhost:8001" },
    @{ Name = "Portal";          Port = 3000; Url = "http://localhost:3000" },
    @{ Name = "TuneStream";      Port = 3001; Url = "http://localhost:3001" },
    @{ Name = "SyncMavens";      Port = 3002; Url = "http://localhost:3002" },
    @{ Name = "Express API";     Port = 5000; Url = "http://localhost:5000" }
)

$timeoutSeconds = 25
$elapsed = 0

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
