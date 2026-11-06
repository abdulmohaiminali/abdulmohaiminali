$ErrorActionPreference = 'Stop'
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
$nodeExecutable = if ($nodeCommand) { $nodeCommand.Source } else { Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' }
if (-not (Test-Path -LiteralPath $nodeExecutable)) { throw 'Node.js is required. Install it from nodejs.org, then run this launcher again.' }

function Test-PreviewResponse([string]$Url) {
  try {
    $baseUrl = $Url.TrimEnd('/')
    $page = Invoke-WebRequest -Uri $baseUrl -UseBasicParsing -TimeoutSec 2
    if ($page.StatusCode -ne 200 -or $page.Content -cne [IO.File]::ReadAllText((Join-Path $PSScriptRoot 'dist/index.html'))) { return $false }
    $bundle = Invoke-WebRequest -Uri "$baseUrl/js/folder-app.js" -UseBasicParsing -TimeoutSec 2
    $styles = Invoke-WebRequest -Uri "$baseUrl/js/folder-app.css" -UseBasicParsing -TimeoutSec 2
    return ($bundle.StatusCode -eq 200 -and $bundle.Content -ceq [IO.File]::ReadAllText((Join-Path $PSScriptRoot 'dist/js/folder-app.js')) -and $styles.StatusCode -eq 200 -and $styles.Content -ceq [IO.File]::ReadAllText((Join-Path $PSScriptRoot 'dist/js/folder-app.css')))
  } catch {
    return $false
  }
}

$previewPort = 4173
$previewUrl = "http://127.0.0.1:$previewPort/"
if (-not (Test-PreviewResponse $previewUrl)) {
  $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
  $listener.Start()
  $previewPort = $listener.LocalEndpoint.Port
  $listener.Stop()
  $previewUrl = "http://127.0.0.1:$previewPort/"

  $previousPort = $env:PORT
  try {
    $env:PORT = [string]$previewPort
    Start-Process -FilePath $nodeExecutable -ArgumentList 'server.mjs' -WorkingDirectory $PSScriptRoot -WindowStyle Hidden
  } finally {
    $env:PORT = $previousPort
  }

  $ready = $false
  for ($attempt = 0; $attempt -lt 30; $attempt++) {
    Start-Sleep -Milliseconds 300
    if (Test-PreviewResponse $previewUrl) { $ready = $true; break }
  }
  if (-not $ready) { throw "Preview server did not respond at $previewUrl. Close a stuck preview process and run this launcher again." }
}

Write-Host "Portfolio is ready at $previewUrl"
Start-Process ($previewUrl + '#work')


