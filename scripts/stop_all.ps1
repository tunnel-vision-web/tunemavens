# Stop all 5 TuneMavens ecosystem services and the supervisor
Stop-ScheduledTask -TaskName "TuneMavensServers" -ErrorAction SilentlyContinue

$targetPorts = @(3000, 3001, 3002, 5000, 8001)
Write-Host "Stopping all TuneMavens services on ports: $($targetPorts -join ', ')..." -ForegroundColor Yellow

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
Write-Host "All TuneMavens services stopped." -ForegroundColor Green
