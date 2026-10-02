<#
.SYNOPSIS
  One-time setup of the LinguaLens multi-agent workflow on Windows.
.DESCRIPTION
  Checks Git/Node, detects (and optionally installs) Claude Code, Codex CLI and Antigravity CLI,
  installs project dependencies with npm 10.9.2, installs the Playwright browser, syncs shared
  skills, creates a local test database and runs `npm run check`.
.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts\agents\setup.ps1 -Install
#>
param(
    [switch]$Install,   # offer to install missing agent CLIs
    [switch]$Yes,       # answer yes to every install question
    [switch]$SkipDeps   # skip npm ci, Playwright, database and checks
)
. (Join-Path $PSScriptRoot '_common.ps1')
Set-Location $script:RepoRoot
# Windows PowerShell 5.1 may default to old TLS versions; installers need TLS 1.2.
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

function Confirm-Install([string]$Question) {
    if ($Yes) { return $true }
    $answer = Read-Host "$Question [y/N]"
    return ($answer -match '^(y|yes)$')
}
function Update-SessionPath {
    $env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' +
        [Environment]::GetEnvironmentVariable('Path', 'User') + ';' + (Join-Path $env:USERPROFILE '.local/bin')
}
function Get-ToolVersion([string]$Name) {
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) { return $null }
    $out = Invoke-Native { & $Name --version 2>$null | Select-Object -First 1 }
    if ($out) { return "$out".Trim() }
    return 'installed'
}

Write-Step 'Prerequisites'
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Git for Windows is required: https://git-scm.com/download/win' }
Write-Ok (git --version)
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Node.js 22 LTS (22.13+) is required: https://nodejs.org' }
$nodeVersion = (node --version).Trim().TrimStart('v')
if ([version]$nodeVersion -lt [version]'22.13.0') { throw "Node $nodeVersion is too old. Install Node 22.13 or newer." }
Write-Ok "node $nodeVersion"
$npmVersion = "$(npm --version)".Trim()
if ($npmVersion.StartsWith('10.')) { Write-Ok "npm $npmVersion" }
else { Write-Warn "npm $npmVersion. The repo pins npm 10.9.2; this script runs 'npx npm@10.9.2 ci' so your global npm stays unchanged." }

Write-Step 'Coding agent CLIs'
$tools = @(
    @{ Name = 'claude'; Label = 'Claude Code';     Install = { Invoke-RestMethod https://claude.ai/install.ps1 | Invoke-Expression } },
    @{ Name = 'codex';  Label = 'Codex CLI';       Install = { npm install -g @openai/codex } },
    @{ Name = 'agy';    Label = 'Antigravity CLI'; Install = { Invoke-RestMethod https://antigravity.google/cli/install.ps1 | Invoke-Expression } }
)
$versions = [ordered]@{}
foreach ($tool in $tools) {
    $version = Get-ToolVersion $tool.Name
    if (-not $version -and $Install -and (Confirm-Install "Install $($tool.Label)?")) {
        & $tool.Install
        Update-SessionPath
        $version = Get-ToolVersion $tool.Name
    }
    if ($version) { Write-Ok "$($tool.Label): $version" }
    else { Write-Warn "$($tool.Label) not found. Re-run with -Install, or skip it (any two tools are enough)." }
    $versions[$tool.Name] = $version
}
$available = @($versions.Values | Where-Object { $_ }).Count
if ($available -lt 2) {
    Write-Warn 'Fewer than two agent CLIs: reviews must use review-task.ps1 -AllowSameVendor (weaker).'
}

if (-not $SkipDeps) {
    Write-Step 'Project dependencies (stop any running dev server first)'
    Invoke-Checked 'npm ci' { npx --yes npm@10.9.2 ci }
    Invoke-Checked 'Playwright browser install' { npx playwright install chromium }

    Write-Step 'Shared skills, local test database, quick check'
    Invoke-Checked 'skill sync' { node scripts/sync-agent-skills.mjs }
    $previousDb = $env:TURSO_DATABASE_URL
    $env:TURSO_DATABASE_URL = 'file:local-test.db'
    try { Invoke-Checked 'db:migrate (local-test.db)' { npm run db:migrate } }
    finally { $env:TURSO_DATABASE_URL = $previousDb }
    Invoke-Checked 'npm run check' { npm run check }
}

$record = [ordered]@{
    checkedAt = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ss')
    node      = $nodeVersion
    npm       = $npmVersion
    tools     = $versions
}
Write-Utf8File (Join-Path $script:RepoRoot '.agent-system/tool-versions.json') (($record | ConvertTo-Json -Depth 4) + "`n")
Write-Ok 'Saved .agent-system\tool-versions.json'

Write-Step 'Next: sign in once (interactive)'
Write-Info '1. claude        -> sign in, then run these inside Claude Code:'
Write-Info '                    /plugin marketplace add openai/codex-plugin-cc'
Write-Info '                    /plugin install codex@openai-codex'
Write-Info '                    /reload-plugins'
Write-Info '                    /codex:setup        (do NOT enable the review gate)'
Write-Info '2. codex login'
Write-Info '3. agy           -> choose Google OAuth'
Write-Info '4. First task:   powershell -ExecutionPolicy Bypass -File scripts\agents\new-task.ps1 -Task T001 -Agent codex'
