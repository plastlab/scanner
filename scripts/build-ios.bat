@echo off
setlocal enabledelayedexpansion

REM Build iOS .ipa file without Mac
REM This script automates the entire iOS build process using EAS Build

echo 🚀 iOS Build Automation Script
echo ==============================
echo.

REM Parse command line arguments
set PROFILE=preview
:parse_args
if "%~1"=="" goto :main
if "%~1"=="--profile" (
    set PROFILE=%~2
    shift
    shift
    goto :parse_args
)
if "%~1"=="--help" (
    echo Usage: %0 [--profile development^|preview^|production]
    echo.
    echo Options:
    echo   --profile    Build profile ^(default: preview^)
    echo   --help       Show this help message
    exit /b 0
)
shift
goto :parse_args

:main
REM Check prerequisites
call :check_prerequisites
if errorlevel 1 exit /b 1

REM Check Expo login
call :check_expo_login
if errorlevel 1 exit /b 1

REM Install dependencies
call :install_dependencies
if errorlevel 1 exit /b 1

REM Configure build
call :configure_build
if errorlevel 1 exit /b 1

REM Start build
call :start_build
if errorlevel 1 exit /b 1

REM Monitor build
call :monitor_build
if errorlevel 1 exit /b 1

REM Download .ipa
call :download_ipa
if errorlevel 1 exit /b 1

REM Show build info
call :show_build_info

echo.
echo ✅ iOS build process completed successfully!
exit /b 0

:check_prerequisites
echo [INFO] Checking prerequisites...
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js v16 or higher.
    exit /b 1
)

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed. Please install npm.
    exit /b 1
)

REM Check Expo CLI
expo --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Expo CLI not found. Installing...
    npm install -g @expo/cli
)

REM Check EAS CLI
eas --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] EAS CLI not found. Installing...
    npm install -g eas-cli
)

echo [SUCCESS] All prerequisites are satisfied
echo.
exit /b 0

:check_expo_login
echo [INFO] Checking Expo login status...
echo.

eas whoami >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Not logged in to Expo. Please run: eas login
    echo [INFO] You can create a free account at https://expo.dev
    exit /b 1
)

echo [SUCCESS] Logged in to Expo
echo.
exit /b 0

:install_dependencies
echo [INFO] Installing project dependencies...
echo.

if exist package-lock.json (
    npm ci
) else (
    npm install
)

if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)

echo [SUCCESS] Dependencies installed
echo.
exit /b 0

:configure_build
echo [INFO] Configuring build...
echo.

REM Check if eas.json exists
if not exist eas.json (
    echo [WARNING] eas.json not found. Running EAS configure...
    eas build:configure --non-interactive
)

REM Check if app.json has proper iOS configuration
findstr /C:"bundleIdentifier" app.json >nul 2>&1
if errorlevel 1 (
    echo [WARNING] iOS bundle identifier not configured in app.json
    echo [INFO] Please update app.json with your bundle identifier
)

echo [SUCCESS] Build configuration ready
echo.
exit /b 0

:start_build
echo [INFO] Starting iOS build with profile: %PROFILE%
echo.

REM Start the build
eas build --platform ios --profile %PROFILE% --non-interactive

if errorlevel 1 (
    echo [ERROR] Failed to start build
    exit /b 1
)

echo [SUCCESS] Build started successfully
echo.
exit /b 0

:monitor_build
echo [INFO] Monitoring build progress...
echo.

REM Get the latest build ID
for /f "tokens=*" %%i in ('eas build:list --platform ios --limit 1 --json ^| jq -r ".[0].id"') do set BUILD_ID=%%i

if "%BUILD_ID%"=="null" (
    echo [ERROR] Could not find build ID
    exit /b 1
)

echo [INFO] Build ID: %BUILD_ID%
echo.

REM Monitor build status
:monitor_loop
for /f "tokens=*" %%i in ('eas build:view %BUILD_ID% --json ^| jq -r ".status"') do set STATUS=%%i

if "%STATUS%"=="finished" (
    echo [SUCCESS] Build completed successfully!
    for /f "tokens=*" %%i in ('eas build:view %BUILD_ID% --json ^| jq -r ".artifacts.buildUrl"') do set DOWNLOAD_URL=%%i
    if not "%DOWNLOAD_URL%"=="null" (
        echo [SUCCESS] Download URL: %DOWNLOAD_URL%
        echo %DOWNLOAD_URL% > build-download-url.txt
    )
    goto :monitor_end
) else if "%STATUS%"=="errored" (
    echo [ERROR] Build failed!
    echo [INFO] Check build logs for details:
    eas build:view %BUILD_ID%
    exit /b 1
) else if "%STATUS%"=="canceled" (
    echo [WARNING] Build was canceled
    exit /b 1
) else (
    echo [INFO] Build status: %STATUS% ^(waiting 30 seconds...^)
    timeout /t 30 /nobreak >nul
    goto :monitor_loop
)

:monitor_end
exit /b 0

:download_ipa
if exist build-download-url.txt (
    for /f "tokens=*" %%i in (build-download-url.txt) do set DOWNLOAD_URL=%%i
    echo [INFO] Downloading .ipa file...
    echo.
    
    REM Create builds directory if it doesn't exist
    if not exist builds mkdir builds
    
    REM Download the .ipa file
    curl -L "%DOWNLOAD_URL%" -o "builds\plastic-tracker.ipa"
    
    if errorlevel 1 (
        echo [ERROR] Failed to download .ipa file
        exit /b 1
    )
    
    echo [SUCCESS] Downloaded: builds\plastic-tracker.ipa
    for %%A in (builds\plastic-tracker.ipa) do echo [INFO] File size: %%~zA bytes
) else (
    echo [WARNING] No download URL found. Build may still be processing.
)
echo.
exit /b 0

:show_build_info
echo [INFO] Build Information:
echo ====================
echo.

if exist builds\plastic-tracker.ipa (
    echo ✅ .ipa file: builds\plastic-tracker.ipa
    for %%A in (builds\plastic-tracker.ipa) do echo 📱 File size: %%~zA bytes
    echo 📅 Created: %date% %time%
) else (
    echo ❌ .ipa file not found
)

echo.
echo [INFO] Next steps:
echo 1. Install on device using TestFlight or direct installation
echo 2. Test the app thoroughly
echo 3. Submit to App Store if ready for production
echo.
echo [INFO] For TestFlight distribution, run: eas submit --platform ios
echo.
exit /b 0 