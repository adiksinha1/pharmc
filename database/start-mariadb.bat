@echo off
REM MariaDB Startup Script for Pharmac
REM This script starts the MariaDB server for development

echo Starting MariaDB Database Server...
start "" "C:\Program Files\MariaDB 12.1\bin\mysqld.exe" --datadir="C:\Program Files\MariaDB 12.1\data" --console

timeout /t 3 /nobreak

echo.
echo MariaDB Server started on localhost:3306
echo Database: pharmac_db
echo User: root
echo.
echo You can now connect using:
echo  - MySQL Workbench on localhost:3306
echo  - Command line: mysql -u root -p
echo.
