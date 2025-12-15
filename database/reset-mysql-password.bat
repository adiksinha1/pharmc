@echo off
REM Stop MySQL service
echo Stopping MySQL service...
net stop MySQL80
timeout /t 2 /nobreak

REM Start MySQL with skip-grant-tables
echo Starting MySQL with skip-grant-tables...
start "" "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" --skip-grant-tables
timeout /t 5 /nobreak

REM Reset root password
echo Connecting to MySQL and resetting root password...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root < nul <<EOF
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY '';
EXIT;
EOF

REM Kill the MySQL process started with skip-grant-tables
echo Stopping MySQL process...
taskkill /IM mysqld.exe /F
timeout /t 2 /nobreak

REM Start MySQL service normally
echo Starting MySQL service normally...
net start MySQL80
timeout /t 3 /nobreak

echo.
echo MySQL root password has been reset to empty.
echo You can now login with: mysql -u root (no password)
pause
