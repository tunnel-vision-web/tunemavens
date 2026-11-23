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
                cmd /c "taskkill /F /T /PID $p >nul 2>&1"
                Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

# Clean up any lingering nodemon or preview processes from prior runs
Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object { 
    $_.CommandLine -like "*tunemavens*nodemon*" -or 
    $_.CommandLine -like "*nodemon src/server.js*" -or
    $_.CommandLine -like "*serve_preview.js*"
} | ForEach-Object {
    cmd /c "taskkill /F /T /PID $($_.ProcessId) >nul 2>&1"
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
}
Write-Host "All TuneMavens services stopped." -ForegroundColor Green
