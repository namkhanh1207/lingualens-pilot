<#
.SYNOPSIS
  Start a task: create an isolated git worktree + branch for one agent, with its own test database and dev port.
.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts\agents\new-task.ps1 -Task T001 -Agent codex
  powershell -ExecutionPolicy Bypass -File scripts\agents\new-task.ps1 -Task T005 -Agent agy -Start
#>
param(
    [Parameter(Mandatory = $true)][ValidatePattern('^T\d{3}$')][string]$Task,
    [Parameter(Mandatory = $true)][ValidateSet('codex', 'claude', 'agy')][string]$Agent,
    [string]$Base = 'pilot-simple-login',
    [int]$Port = 0,
    [switch]$SkipInstall, # skip npm ci in the new worktree (only if you know deps are unchanged)
    [switch]$Start        # open the agent in the new worktree with the task prompt
)
. (Join-Path $PSScriptRoot '_common.ps1')
Set-Location $script:RepoRoot

$taskPath = ".agent-system/tasks/$Task.yaml"
Invoke-Native { git cat-file -e "${Base}:$taskPath" 2>$null }
if ($LASTEXITCODE -ne 0) {
    throw "Branch '$Base' has no $taskPath. Commit the task file on '$Base' first, or pass -Base <branch>."
}
$existing = Get-TaskWorktree $Task
if ($existing.Count -gt 0) { throw "Task $Task already has a worktree: $($existing[0].FullName). One task = one worktree." }

$branch = "agent/$Task-$Agent"
$worktree = Join-Path (Split-Path $script:RepoRoot -Parent) "ll-$Task-$Agent"
if ($Port -eq 0) { $Port = 8787 + @(git worktree list).Count }

Write-Step "Create worktree $worktree on branch $branch (from $Base)"
Invoke-Checked 'git worktree add' { git worktree add -b $branch $worktree $Base }
Set-Location $worktree

# Claim the task. From now on only this branch edits the task file (single writer).
$taskFile = Join-Path $worktree $taskPath
$yaml = [System.IO.File]::ReadAllText($taskFile)
$yaml = $yaml -replace '(?m)^status:[^\r\n]*', 'status: claimed'
$yaml = $yaml -replace '(?m)^branch:[^\r\n]*', "branch: $branch"
Write-Utf8File $taskFile $yaml

# Local, gitignored settings: test identities and a throwaway database. Never real Turso credentials.
Write-Utf8File (Join-Path $worktree '.env.local') (@(
    '# Worktree-only settings (gitignored). Test identities work only in `next dev` on localhost.',
    "TURSO_DATABASE_URL=file:$Task.db",
    'AUTH_MODE=local-test',
    'ADMIN_EMAILS=test-admin@sites.test',
    ''
) -join "`n")

if (-not $SkipInstall) {
    Write-Step 'Install dependencies in the worktree'
    Invoke-Checked 'npm ci' { npx --yes npm@10.9.2 ci }
}
Invoke-Checked 'skill sync' { node scripts/sync-agent-skills.mjs }
Invoke-Checked 'db:migrate' { npm run db:migrate }

$prompt = "Read AGENTS.md and .agent-system/tasks/$Task.yaml. Do this task and only touch files in allowed_paths. " +
    "Run every acceptance check (dev server: npm run dev -- --hostname 127.0.0.1 --port $Port; " +
    "for UI tasks take before/after screenshots: npm run ui:snapshot -- --base http://127.0.0.1:$Port --label before-$Task). " +
    "Commit your work on branch $branch, set status: verifying in the task file, then write " +
    ".agent-system/handoffs/$Task.json from _template.json with the real command results. Do not push."

Write-Step "Ready: $Task -> $Agent"
Write-Info "Folder:      $worktree"
Write-Info "Branch:      $branch"
Write-Info "Dev server:  npm run dev -- --hostname 127.0.0.1 --port $Port"
Write-Info "Prompt for the agent:"
Write-Host "  $prompt" -ForegroundColor Gray
Write-Info "After the agent finishes: powershell -ExecutionPolicy Bypass -File scripts\agents\review-task.ps1 -Task $Task -Reviewer <another agent>"

if ($Start) {
    switch ($Agent) {
        'codex'  { codex $prompt }
        'claude' { claude $prompt }
        'agy'    { Write-Warn 'Start agy yourself in this folder and paste the prompt above.'; agy }
    }
}
