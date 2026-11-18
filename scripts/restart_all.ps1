param(
    [switch]$NoWait
)

$scriptPath = Join-Path $PSScriptRoot "launch_detached.ps1"
& $scriptPath

if (-not $NoWait) {
    Write-Host "`nServices are running in background. Monitoring active connections. (Press Ctrl+C to stop monitoring)" -ForegroundColor Cyan
}
