@echo off
setlocal enabledelayedexpansion

rem It's very important when using this script to verify that the JSON and Formatted results are correct each time
rem to validate that the results are what we expect.

rem Check if the directory parameter is provided
if "%~1"=="" (
    echo Please provide a directory as the first parameter.
    exit /b 1
)

rem Set the input directory
set "inputDir=%~1"

rem Loop through each .sf-formula file in the provided directory
for %%f in ("%inputDir%\*.sf-formula") do (
    rem Get the name of the original file without the extension
    set "fileName=%%~nf"

    rem Check if the file name does not contain ".formatted"
    echo !fileName! | findstr /i ".formatted" >nul
    if errorlevel 1 (
        rem Get the path to the folder of the current file
        set "fileFolder=%%~dpf"

        rem Run the commands with the relevant values replaced
        node dist/index.js -i "%%f" -o "!fileFolder!!fileName!.json" -p -f json
        node dist/index.js -i "%%f" -o "!fileFolder!!fileName!.formatted.sf-formula" -f formula
    )
)

endlocal