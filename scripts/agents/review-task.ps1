<#
.SYNOPSIS
  Independent, read-only review of a task branch by a DIFFERENT agent than the implementer. Max 2 rounds.
.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts\agents\review-task.ps1 -Task T001 -Reviewer claude
#>
param(
    [Parameter(Mandatory = $true)][ValidatePattern('^T\d{3}$')][string]$Task,
    [Parameter(Mandatory = $true)][ValidateSet('codex', 'claude', 'agy')][string]$Reviewer,
    [string]$Base = 'pilot-simple-login',
    [switch]$AllowSameVendor   # only when you have a single agent CLI: review in a fresh session (weaker)
)
. (Join-Path $PSScriptRoot '_common.ps1')

$worktrees = Get-TaskWorktree $Task
if ($worktrees.Count -ne 1) { throw "Expected exactly one worktree ll-$Task-* next to the repo, found $($worktrees.Count)." }
$worktree = $worktrees[0].FullName
$implementer = $worktrees[0].Name.Substring("ll-$Task-".Length)
$sameVendor = ($implementer -eq $Reviewer)
if ($sameVendor -and -not $AllowSameVendor) { throw "$Reviewer wrote $Task, so it cannot review it. Pick another agent (rule: implementer != reviewer), or use -AllowSameVendor if you only have one CLI." }
if ($sameVendor) { Write-Warn 'Same-vendor review in a fresh session: weaker than cross-vendor review; this is noted in the review file.' }

Set-Location $worktree
$reviewDir = Join-Path $worktree '.agent-system/reviews'
$round1 = Join-Path $reviewDir "$Task-$Reviewer.md"
$round2 = Join-Path $reviewDir "$Task-$Reviewer-r2.md"
if (Test-Path $round2) { throw "Two review rounds already done for $Task by $Reviewer. Stop and let the project owner decide." }
$outFile = $round1
$round = 1
if (Test-Path $round1) { $outFile = $round2; $round = 2 }

$changed = @(git diff --name-only "$Base...HEAD")
if ($changed.Count -eq 0) { throw "Branch has no commits beyond $Base yet. Did the agent commit its work?" }

$prompt = "You are an independent, READ-ONLY reviewer (round $round of max 2). Do not modify, create or delete any file. " +
    "Read AGENTS.md, .agent-system/tasks/$Task.yaml, .agent-system/handoffs/$Task.json (if present) and " +
    ".agents/skills/review-checklist/SKILL.md. Review the output of git diff $Base...HEAD " +
    "(changed files: $($changed -join ', ')). Flag any file outside allowed_paths. " +
    "Answer in Markdown with sections Critical / Should fix / Suggestions; each item: file:line, problem, proposal. " +
    "The very last line must be exactly APPROVED or CHANGES_REQUESTED."

Write-Step "Review $Task (implementer: $implementer, reviewer: $Reviewer, round $round)"
$output = Invoke-Native {
    switch ($Reviewer) {
        'codex'  { codex exec --sandbox read-only $prompt 2>&1 | Out-String }
        'claude' { claude -p $prompt --allowedTools 'Read,Grep,Glob,Bash(git diff:*),Bash(git log:*),Bash(git show:*)' 2>&1 | Out-String }
        'agy'    { agy -p $prompt 2>&1 | Out-String }
    }
}
if ($LASTEXITCODE -ne 0) { Write-Warn "$Reviewer exited with code $LASTEXITCODE; the output is saved anyway." }

$header = "<!-- reviewer: $Reviewer, implementer: $implementer, round: $round, base: $Base, same-vendor: $sameVendor, $(Get-Date -Format s) -->`n"
Write-Utf8File $outFile ($header + $output.Trim() + "`n")
$lastLine = ($output.Trim() -split "`r?`n")[-1].Trim()
Write-Ok "Saved $outFile"
if ($lastLine -eq 'APPROVED') { Write-Ok 'Verdict: APPROVED. The owner can merge (see docs/agent-setup.md).' }
elseif ($lastLine -eq 'CHANGES_REQUESTED') { Write-Warn 'Verdict: CHANGES_REQUESTED. Send the review file back to the implementer, then review again.' }
else { Write-Warn 'No verdict on the last line. Read the review file yourself.' }
$relative = ".agent-system/reviews/" + (Split-Path $outFile -Leaf)
Invoke-Checked 'git add review' { git add -- $relative }
Invoke-Checked 'git commit review' { git commit -q -m "review($Task): $Reviewer round $round" -- $relative }
Write-Ok "Committed $relative on branch $(git branch --show-current)"
if ($lastLine -eq 'CHANGES_REQUESTED') {
    Write-Info "Prompt for $implementer`: Read $relative, fix every Critical and Should-fix item within allowed_paths, re-run the acceptance checks, commit, and update the handoff."
}
