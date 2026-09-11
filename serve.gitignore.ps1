param(
    [int]$Port = 8080,
    [switch]$NoBrowser
)

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $baseDir) { $baseDir = Get-Location }

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Host "Failed to bind to $prefix. Trying port $($Port + 1)..." -ForegroundColor Yellow
    $Port++
    $prefix = "http://localhost:$Port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    $listener.Start()
}

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  E-Bhumi Land Acquisition & GIS Portal Server" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Local URL: $prefix" -ForegroundColor Yellow
Write-Host "  Serving:   $baseDir" -ForegroundColor White
Write-Host "  Stitch MCP: Configured & Proxy Enabled at /api/stitch/mcp" -ForegroundColor White
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host "========================================================" -ForegroundColor Cyan

if (-not $NoBrowser) {
    Start-Process $prefix
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".json" = "application/json; charset=utf-8"
}

# Fetch the key dynamically from the system environment variables
$GCP_API_Key = [System.Environment]::GetEnvironmentVariable("GCP_API_KEY", "User")

# If it's not found in the user variables, check the current process session
if (-not $GCP_API_Key) {
    $GCP_API_Key = $env:GCP_API_KEY
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.AbsolutePath
        Write-Host "[$([DateTime]::Now.ToString('HH:mm:ss'))] $($request.HttpMethod) $urlPath" -ForegroundColor DarkGray

        # Add CORS Headers
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, X-Goog-Api-Key")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 204
            $response.Close()
            continue
        }

        # Stitch MCP Proxy Route
        if ($urlPath -eq "/api/stitch/mcp") {
            try {
                $reader = New-Object System.IO.StreamReader($request.InputStream)
                $body = $reader.ReadToEnd()
                
                $headers = @{
                    "Content-Type" = "application/json"
                    "X-Goog-Api-Key" = $GCP_API_Key
                }
                
                $proxyRes = Invoke-RestMethod -Uri "https://stitch.googleapis.com/mcp" -Method Post -Headers $headers -Body $body
                $jsonBytes = [System.Text.Encoding]::UTF8.GetBytes(($proxyRes | ConvertTo-Json -Depth 10))
                
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $jsonBytes.Length
                $response.OutputStream.Write($jsonBytes, 0, $jsonBytes.Length)
                $response.StatusCode = 200
            } catch {
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes("{""error"":""$($_.Exception.Message)""}")
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $errBytes.Length
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
                $response.StatusCode = 500
            }
            $response.Close()
            continue
        }

        # Static File Serving
        if ($urlPath -eq "/" -or $urlPath -eq "") {
            $filePath = Join-Path $baseDir "index.html"
        } else {
            $relPath = $urlPath.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $filePath = Join-Path $baseDir $relPath
        }

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.StatusCode = 200
        } else {
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
            $response.ContentType = "text/plain"
            $response.ContentLength64 = $notFound.Length
            $response.StatusCode = 404
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
        }

        $response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
.env
*.env
secrets.json
