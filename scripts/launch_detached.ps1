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
                Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

Start-Sleep -Seconds 2

$root = "c:\BOCM\Apps\tunemavens"

$commands = @(
    "cmd.exe /c python -m uvicorn server:app --app-dir backend --port 8001 --host 0.0.0.0 --reload",
    "cmd.exe /c npm run dev --workspace=portal",
    "cmd.exe /c npm run dev --workspace=tunestream",
    "cmd.exe /c npm run dev --workspace=syncmavens",
    "cmd.exe /c npm run dev --workspace=api"
)

Write-Host "`nLaunching independent services via WMI Win32_Process..." -ForegroundColor Cyan

foreach ($cmd in $commands) {
    $res = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{
        CommandLine = $cmd
        CurrentDirectory = $root
    }
    Write-Host "  Spawned: $cmd (PID: $($res.ProcessId), ReturnCode: $($res.ReturnValue))"
}

Write-Host "`nWaiting for listening ports..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

$activeConns = Get-NetTCPConnection -LocalPort $targetPorts -State Listen -ErrorAction SilentlyContinue
$activePorts = @($activeConns | ForEach-Object { $_.LocalPort })

Write-Host "`nStatus of Ports:" -ForegroundColor Green
foreach ($p in $targetPorts) {
    $match = $activeConns | Where-Object { $_.LocalPort -eq $p } | Select-Object -First 1
    if ($match) {
        Write-Host "  [LISTENING] Port $p -> PID $($match.OwningProcess)" -ForegroundColor Green
    } else {
        Write-Host "  [PENDING]   Port $p" -ForegroundColor Yellow
    }
}
