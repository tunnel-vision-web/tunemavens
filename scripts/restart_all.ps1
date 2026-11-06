param(
    [switch]$NoWait
)

$targetPorts = @(3000, 3001, 3002, 5000, 8001)
Write-Host "Stopping any existing TuneMavens services on ports: $($targetPorts -join ', ')..." -ForegroundColor Yellow

foreach ($port in $targetPorts) {
    $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conns) {
        $pidsToKill = $conns.OwningProcess | Select-Object -Unique
        foreach ($p in $pidsToKill) {
            if ($p -and $p -ne 0) {
                Write-Host "  Stopping PID $p on port $port" -ForegroundColor DarkYellow
                Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

Start-Sleep -Seconds 2

Write-Host "`nStarting all 5 TuneMavens ecosystem services..." -ForegroundColor Cyan

$procList = @()

# 1. FastAPI Backend (Port 8001)
$pBackend = Start-Process -FilePath "python" -ArgumentList "-m", "uvicorn", "server:app", "--app-dir", "backend", "--port", "8001", "--reload" -WorkingDirectory "c:\BOCM\Apps\tunemavens" -WindowStyle Hidden -PassThru
$procList += $pBackend
Write-Host "  [+] Spawned FastAPI Backend (PID: $($pBackend.Id))" -ForegroundColor Gray

# 2. Portal (Port 3000)
$pPortal = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm.cmd run dev" -WorkingDirectory "c:\BOCM\Apps\tunemavens\apps\portal" -WindowStyle Hidden -PassThru
$procList += $pPortal
Write-Host "  [+] Spawned Portal (PID: $($pPortal.Id))" -ForegroundColor Gray

# 3. TuneStream (Port 3001)
$pTuneStream = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm.cmd run dev" -WorkingDirectory "c:\BOCM\Apps\tunemavens\apps\tunestream" -WindowStyle Hidden -PassThru
$procList += $pTuneStream
Write-Host "  [+] Spawned TuneStream (PID: $($pTuneStream.Id))" -ForegroundColor Gray

# 4. SyncMavens (Port 3002)
$pSyncMavens = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm.cmd run dev" -WorkingDirectory "c:\BOCM\Apps\tunemavens\apps\syncmavens" -WindowStyle Hidden -PassThru
$procList += $pSyncMavens
Write-Host "  [+] Spawned SyncMavens (PID: $($pSyncMavens.Id))" -ForegroundColor Gray

# 5. Express API (Port 5000)
$pApi = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm.cmd run dev" -WorkingDirectory "c:\BOCM\Apps\tunemavens\apps\api" -WindowStyle Hidden -PassThru
$procList += $pApi
Write-Host "  [+] Spawned Express API (PID: $($pApi.Id))" -ForegroundColor Gray

Write-Host "`nWaiting for services to become available..." -ForegroundColor Cyan

$services = @(
    @{ Name = "Portal"; Port = 3000; Url = "http://localhost:3000" },
    @{ Name = "TuneStream"; Port = 3001; Url = "http://localhost:3001" },
    @{ Name = "SyncMavens"; Port = 3002; Url = "http://localhost:3002" },
    @{ Name = "Express API"; Port = 5000; Url = "http://localhost:5000" },
    @{ Name = "FastAPI Backend"; Port = 8001; Url = "http://localhost:8001" }
)

$timeoutSeconds = 20
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

if (-not $NoWait) {
    $trackedPids = $procList | ForEach-Object { $_.Id }
    Wait-Process -Id $trackedPids -ErrorAction SilentlyContinue
}
