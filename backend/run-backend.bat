@echo off
echo ========================================================
echo   TripNest Backend Launcher
echo ========================================================
echo.

:: Check if mvn is installed system-wide
where mvn >nul 2>nul
if %errorlevel% equ 0 (
    echo [INFO] Found system Maven. Starting Spring Boot...
    mvn spring-boot:run
    goto end
)

:: Check if portable maven exists
set PORTABLE_MAVEN=%~dp0.maven_portable\apache-maven-3.9.6\bin\mvn.cmd
if exist "%PORTABLE_MAVEN%" (
    echo [INFO] Found portable Maven. Starting Spring Boot...
    call "%PORTABLE_MAVEN%" spring-boot:run
    goto end
)

echo [INFO] Maven is not installed on your PC.
echo [INFO] Downloading portable Maven automatically (one-time setup, please wait)...
echo.

powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $url = 'https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip'; $zip = '%~dp0maven.zip'; Invoke-WebRequest -Uri $url -OutFile $zip; Expand-Archive -Path $zip -DestinationPath '%~dp0.maven_portable' -Force; Remove-Item $zip -Force"

if exist "%PORTABLE_MAVEN%" (
    echo.
    echo [SUCCESS] Maven setup completed! Starting Spring Boot backend now...
    call "%PORTABLE_MAVEN%" spring-boot:run
) else (
    echo [ERROR] Automatic Maven download failed. Please ensure you have internet access.
    pause
)

:end
