@echo off
title WorkforcePro Frontend Server
cd /d "%~dp0employee-workforce-management\frontend"
echo ===================================================
echo  Starting WorkforcePro Frontend (Vite React)
echo  URL: http://localhost:5173
echo ===================================================
npm run dev
pause

