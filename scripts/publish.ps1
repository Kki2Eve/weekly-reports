param([string]$Message = 'docs: Update weekly reports')
$ErrorActionPreference = 'Stop'
Push-Location (Split-Path $PSScriptRoot -Parent)
try {
    & node scripts/reports.mjs build
    if ($LASTEXITCODE -ne 0) { throw 'Build failed.' }
    & node scripts/reports.mjs check
    if ($LASTEXITCODE -ne 0) { throw 'Validation failed.' }
    & git add -- index.html reports.js assets reports scripts templates package.json README.md AGENTS.md .gitignore .nojekyll robots.txt
    if ($LASTEXITCODE -ne 0) { throw 'Git add failed.' }
    & git diff --cached --quiet
    if ($LASTEXITCODE -eq 1) {
        & git commit -m $Message
        if ($LASTEXITCODE -ne 0) { throw 'Git commit failed.' }
    } elseif ($LASTEXITCODE -ne 0) { throw 'Git diff failed.' }
    & git -c 'core.sshCommand=ssh -o BatchMode=yes -o ConnectTimeout=15' push origin main
    if ($LASTEXITCODE -ne 0) { throw 'Git push failed. Local commit has been retained.' }
    Write-Host 'Source pushed. GitHub Pages will update after its build finishes.'
    Write-Host 'https://kki2eve.github.io/quest-weekend-report-20261114/'
} finally { Pop-Location }
