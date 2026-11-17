@echo off
setlocal

rem Ensure JAVA_HOME is set
if "%JAVA_HOME%"=="" (
    if exist "C:\Program Files\Java\jdk-17" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-17"
    )
)

rem Locate Maven binary
set "MVN_EXEC="
if exist "%~dp0.tools\maven\bin\mvn.cmd" (
    set "MVN_EXEC=%~dp0.tools\maven\bin\mvn.cmd"
) else if exist "C:\Users\welcome\apache-maven-3.9.16\bin\mvn.cmd" (
    set "MVN_EXEC=C:\Users\welcome\apache-maven-3.9.16\bin\mvn.cmd"
) else (
    set "MVN_EXEC=mvn"
)

"%MVN_EXEC%" %*
exit /b %ERRORLEVEL%
