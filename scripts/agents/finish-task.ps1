<#
.SYNOPSIS
  Clean up after the owner merged a task: remove its worktree and delete the merged branch.
.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts\agents\finish-task.ps1 -Task T001
#>
param(
    [Parameter(Mandatory = $true)][ValidatePattern('^T\d{3}$')][string]$Task,
    [string]$Base = 'pilot-simple-login',
    [switch]$Abandon   # remove even if NOT merged (work on the branch is kept, only the folder goes)
)
. (Join-Path $PSScriptRoot '_common.ps1')
Set-Location $script:RepoRoot

$worktrees = Get-TaskWorktree $Task
if ($worktrees.Count -eq 0) { throw "No worktree found for $Task." }
foreach ($wt in $worktrees) {
    $agent = $wt.Name.Substring("ll-$Task-".Length)
    $branch = "agent/$Task-$agent"
    $merged = @(git branch --merged $Base --format '%(refname:short)') -contains $branch
    if (-not $merged -and -not $Abandon) { throw "$branch is not merged into $Base yet. Merge it first, or use -Abandon." }
    $dirty = @(git -C $wt.FullName status --porcelain --untracked-files=no)
    if ($dirty.Count -gt 0) { throw "$($wt.FullName) has uncommitted changes to tracked files:`n$($dirty -join "`n")`nCommit or discard them first." }
    Write-Step "Remove $($wt.FullName)"
    # Only untracked leftovers remain (node_modules, test database, synced skills), so --force is safe here.
    Invoke-Checked 'git worktree remove' { git worktree remove --force $wt.FullName }
    if ($merged) { Invoke-Checked 'git branch -d' { git branch -d $branch }; Write-Ok "Deleted merged branch $branch" }
    else { Write-Warn "Kept unmerged branch $branch (delete later with: git branch -D $branch)" }
}
git worktree prune
