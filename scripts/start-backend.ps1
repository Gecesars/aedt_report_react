param(
    [string[]]$RequiredServices = @("Redis"),
    [string]$AedtProcessName = "ansysedt",
    [string]$BackendDir = "backend",
    [string]$VenvName = ".venv",
    [string]$Host = "127.0.0.1",
    [int]$Port = 8000,
    [switch]$StartMissingServices,
    [switch]$SkipHealthCheck
)

function Write-Info($message) {
    Write-Host "[INFO ] $message" -ForegroundColor Cyan
}

function Write-Warn($message) {
    Write-Host "[WARN ] $message" -ForegroundColor Yellow
}

function Write-ErrorLine($message) {
    Write-Host "[ERROR] $message" -ForegroundColor Red
}

function Test-ServiceStatus {
    param([string]$ServiceName)

    try {
        $svc = Get-Service -Name $ServiceName -ErrorAction Stop
        if ($svc.Status -ne "Running") {
            Write-Warn "Servico '$ServiceName' encontrado, mas esta '$($svc.Status)'."
            if ($StartMissingServices) {
                Write-Info "Iniciando servico '$ServiceName'..."
                Start-Service -Name $ServiceName
            } else {
                Write-Warn "Use -StartMissingServices para tentar inicia-lo automaticamente."
            }
        } else {
            Write-Info "Servico '$ServiceName' esta em execucao."
        }
    } catch {
        Write-Warn "Servico '$ServiceName' nao encontrado no sistema."
    }
}

function Test-AedtProcess {
    param([string]$ProcessName)
    $process = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue
    if ($process) {
        Write-Info "Processo '$ProcessName' esta ativo (PID: $($process.Id))."
    } else {
        Write-Warn "Processo '$ProcessName' nao encontrado. Verifique se o AEDT esta aberto com GUI."
    }
}

function Ensure-Venv {
    param(
        [string]$ProjectPath,
        [string]$VenvDir
    )

    $venvPath = Join-Path $ProjectPath $VenvDir
    $activateScript = Join-Path $venvPath "Scripts\\Activate.ps1"

    if (!(Test-Path $activateScript)) {
        Write-Info "Criando ambiente virtual em '$venvPath'..."
        Push-Location $ProjectPath
        python -m venv $VenvDir
        Pop-Location
    } else {
        Write-Info "Ambiente virtual encontrado em '$venvPath'."
    }

    Write-Info "Ativando ambiente virtual..."
    . $activateScript

    Write-Info "Garantindo dependencias instaladas..."
    Push-Location $ProjectPath
    python -m pip install --upgrade pip | Out-Null
    python -m pip install -e . | Out-Null
    Pop-Location

    return $activateScript
}

function Start-Backend {
    param(
        [string]$ProjectPath,
        [string]$ActivateScript,
        [string]$Host,
        [int]$Port
    )

    $command = @"
cd `"$ProjectPath`"
. `"$ActivateScript`"
uvicorn app.main:app --host $Host --port $Port --reload
"@

    Write-Info "Iniciando backend FastAPI em nova janela (http://$Host:$Port)..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $command | Out-Null
}

function Test-BackendHealth {
    param(
        [string]$Host,
        [int]$Port
    )

    $uri = "http://$Host`:$Port/health"
    try {
        Write-Info "Verificando health endpoint em $uri ..."
        $response = Invoke-RestMethod -Uri $uri -TimeoutSec 5
        Write-Info "Backend respondeu: $($response | ConvertTo-Json -Compress)"
    } catch {
        Write-Warn "Falha ao verificar backend em $uri. Tente novamente apos alguns segundos."
    }
}

try {
    $repoRoot = Split-Path -Parent $PSScriptRoot
    $backendPath = Join-Path $repoRoot $BackendDir
    if (!(Test-Path $backendPath)) {
        throw "Diretorio do backend nao encontrado: $backendPath"
    }

    Write-Info "Verificando servicos obrigatorios..."
    foreach ($svc in $RequiredServices) {
        if (![string]::IsNullOrWhiteSpace($svc)) {
            Test-ServiceStatus -ServiceName $svc
        }
    }

    if ($AedtProcessName) {
        Test-AedtProcess -ProcessName $AedtProcessName
    }

    $activateScript = Ensure-Venv -ProjectPath $backendPath -VenvDir $VenvName
    Start-Backend -ProjectPath $backendPath -ActivateScript $activateScript -Host $Host -Port $Port

    if (-not $SkipHealthCheck) {
        Start-Sleep -Seconds 3
        Test-BackendHealth -Host $Host -Port $Port
    }

    Write-Info "Script finalizado. Verifique a janela do backend para logs do FastAPI."
} catch {
    Write-ErrorLine $_
    exit 1
}
