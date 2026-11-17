$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting WorkforcePro Spring Boot Backend Server (v1.0) " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Ensure JAVA_HOME
if (-not $env:JAVA_HOME -or -not (Test-Path $env:JAVA_HOME)) {
    if (Test-Path "C:\Program Files\Java\jdk-17") {
        $env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
        Write-Host "Configured JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Green
    }
}

# Locate Maven
$mvnCmd = "mvn"
$localMaven = Join-Path $PSScriptRoot ".tools\maven\bin\mvn.cmd"
$userMaven = "C:\Users\welcome\apache-maven-3.9.16\bin\mvn.cmd"

if (Test-Path $localMaven) {
    $mvnCmd = $localMaven
} elseif (Test-Path $userMaven) {
    $mvnCmd = $userMaven
} elseif (Get-Command "mvn" -ErrorAction SilentlyContinue) {
    $mvnCmd = "mvn"
}

Write-Host "Using Maven: $mvnCmd" -ForegroundColor Gray
Write-Host "Compiling and launching Spring Boot on port 8080..." -ForegroundColor Yellow

Set-Location -Path $PSScriptRoot
& $mvnCmd spring-boot:run
