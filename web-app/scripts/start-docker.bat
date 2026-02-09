@echo off
setlocal enabledelayedexpansion

cd /d "%~dp0../docker"

docker compose -f docker-compose.local.yml up --build

endlocal