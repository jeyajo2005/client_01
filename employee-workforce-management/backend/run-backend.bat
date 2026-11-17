@echo off
title WorkforcePro Spring Boot Backend Server
cls

echo ==========================================================
echo  Starting WorkforcePro Spring Boot Backend Server (v1.0) 
echo ==========================================================

if "%JAVA_HOME%"=="" (
    if exist "C:\Program Files\Java\jdk-17" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-17"
    )
)

set "MVN_EXEC="
if exist "%~dp0.tools\maven\bin\mvn.cmd" (
    set "MVN_EXEC=%~dp0.tools\maven\bin\mvn.cmd"
) else if exist "C:\Users\welcome\apache-maven-3.9.16\bin\mvn.cmd" (
    set "MVN_EXEC=C:\Users\welcome\apache-maven-3.9.16\bin\mvn.cmd"
) else (
    set "MVN_EXEC=mvn"
)

cd /d "%~dp0"
echo Launching Spring Boot on port 8080...
"%MVN_EXEC%" spring-boot:run
pause
