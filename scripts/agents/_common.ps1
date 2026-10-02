# Shared helpers for the LinguaLens agent scripts. Windows PowerShell 5.1 compatible.
$ErrorActionPreference = 'Stop'
$script:RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '../..') -ErrorAction Stop).Path
$script:Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Write-Step([string]$Text) { Write-Host "`n== $Text" -ForegroundColor Cyan }
function Write-Ok([string]$Text) { Write-Host "  OK    $Text" -ForegroundColor Green }
function Write-Warn([string]$Text) { Write-Host "  WARN  $Text" -ForegroundColor Yellow }
function Write-Info([string]$Text) { Write-Host "        $Text" }

function Invoke-Checked([string]$What, [scriptblock]$Command) {
    & $Command
    if ($LASTEXITCODE -ne 0) { throw "$What failed (exit code $LASTEXITCODE)." }
}

function Write-Utf8File([string]$Path, [string]$Content) {
    [System.IO.File]::WriteAllText($Path, $Content, $script:Utf8NoBom)
}

# Run a native command whose stderr is redirected. Windows PowerShell 5.1 turns redirected stderr into
# terminating errors when $ErrorActionPreference is 'Stop', so relax it just for this call.
function Invoke-Native([scriptblock]$Command) {
    $saved = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try { & $Command } finally { $ErrorActionPreference = $saved }
}

function Get-TaskWorktree([string]$Task) {
    $parent = Split-Path $script:RepoRoot -Parent
    return @(Get-ChildItem -Path $parent -Directory -Filter "ll-$Task-*" -ErrorAction SilentlyContinue)
}
