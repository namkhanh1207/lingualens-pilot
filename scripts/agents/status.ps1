<#
.SYNOPSIS
  Show every task, its status and which worktree/agent holds it.
.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts\agents\status.ps1
#>
. (Join-Path $PSScriptRoot '_common.ps1')
Set-Location $script:RepoRoot
$taskFiles = [System.IO.Directory]::GetFiles((Join-Path $script:RepoRoot '.agent-system/tasks'), 'T*.yaml') | Sort-Object
$rows = foreach ($file in $taskFiles) {
    $task = [System.IO.Path]::GetFileNameWithoutExtension($file)
    $text = [System.IO.File]::ReadAllText($file)
    $status = if ($text -match '(?m)^status:\s*(\S+)') { $Matches[1] } else { '?' }
    $title = if ($text -match '(?m)^title:\s*(.+)$') { $Matches[1].Trim() } else { '' }
    $wt = Get-TaskWorktree $task | Select-Object -First 1
    if ($wt) {
        # The worktree copy is the live status once a task is claimed.
        $live = [System.IO.File]::ReadAllText((Join-Path $wt.FullName ".agent-system/tasks/$task.yaml"))
        if ($live -match '(?m)^status:\s*(\S+)') { $status = $Matches[1] }
    }
    [pscustomobject]@{
        Task   = $task
        Status = $status
        Agent  = if ($wt) { $wt.Name.Substring("ll-$task-".Length) } else { '' }
        Title  = if ($title.Length -gt 60) { $title.Substring(0, 57) + '...' } else { $title }
    }
}
$rows | Format-Table -AutoSize | Out-String -Width 200 | Write-Host
Write-Host 'Worktrees:'
git worktree list
