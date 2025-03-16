@echo off
echo 369 Manifestation App Packaging Tool
echo ===================================
echo.

echo Installing ts-node if not already installed...
call npm install -g ts-node

echo.
echo Choose a platform to package for:
echo 1. Initialize packaging (first time setup)
echo 2. Package for Android
echo 3. Package for iOS
echo 4. Package for both platforms
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
  call npm run package:init
) else if "%choice%"=="2" (
  call npm run package:android
) else if "%choice%"=="3" (
  call npm run package:ios
) else if "%choice%"=="4" (
  call npm run package:init
  echo.
  echo Opening Android Studio...
  call npm run cap:open:android
  echo.
  echo Opening Xcode...
  call npm run cap:open:ios
) else (
  echo Invalid choice. Please run the script again and select a valid option.
  exit /b 1
)

echo.
echo Packaging process completed!