# MySQL Database Setup Guide for Pharmac

## Step 1: Install MySQL Server

### Option A: Using MySQL Installer (Recommended)
1. Download MySQL Installer from: https://dev.mysql.com/downloads/installer/
2. Choose "mysql-installer-web-community" for Windows
3. Run the installer and select:
   - MySQL Server (required)
   - MySQL Workbench (required)
   - MySQL Shell (optional)
4. During installation:
   - Choose "Development Computer" for configuration type
   - Set a root password (remember this!)
   - Keep default port: 3306
   - Configure MySQL as Windows Service (auto-start)

### Option B: Using Chocolatey
```powershell
choco install mysql
choco install mysql.workbench
```

## Step 2: Verify MySQL Installation

Open PowerShell and run:
```powershell
# Check if MySQL service is running
Get-Service MySQL*

# Start MySQL service if not running
Start-Service MySQL80  # or MySQL (depending on version)
```

## Step 3: Setup Database Using MySQL Workbench

### Method 1: Using MySQL Workbench GUI

1. **Open MySQL Workbench**
   - Launch MySQL Workbench from Start Menu

2. **Create Connection**
   - Click the "+" button next to "MySQL Connections"
   - Connection Name: `Pharmac Local`
   - Hostname: `localhost` or `127.0.0.1`
   - Port: `3306`
   - Username: `root`
   - Click "Test Connection" and enter your root password
   - Click "OK" to save

3. **Execute Schema Script**
   - Double-click the connection to open
   - Go to File → Open SQL Script
   - Navigate to: `Pharmac\database\schema.sql`
   - Click the lightning bolt ⚡ icon to execute
   - You should see "pharmac_db" database created

4. **Execute Seed Data (Optional)**
   - File → Open SQL Script
   - Navigate to: `Pharmac\database\seed.sql`
   - Click the lightning bolt ⚡ icon to execute

5. **Verify Database**
   - In the left sidebar, click "Schemas" tab
   - You should see "pharmac_db" with tables:
     - users
     - queries
     - results
     - agent_activities
     - reports
     - visual_insights

### Method 2: Using Command Line

```powershell
# Navigate to database folder
cd "c:\Users\ADITYA\Downloads\dream-weaver-main (1)\Pharmac\database"

# Login to MySQL (you'll be prompted for password)
mysql -u root -p

# In MySQL prompt, run:
SOURCE schema.sql;
SOURCE seed.sql;

# Verify
SHOW DATABASES;
USE pharmac_db;
SHOW TABLES;
```

## Step 4: Create Application Database User (Recommended)

For security, create a dedicated user instead of using root:

```sql
-- In MySQL Workbench or MySQL CLI:
CREATE USER 'pharmac_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON pharmac_db.* TO 'pharmac_user'@'localhost';
FLUSH PRIVILEGES;
```

## Step 5: Configure Application

Update your application's database configuration:

1. Create a `.env` file in the Pharmac root directory:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=pharmac_db
DB_USER=pharmac_user
DB_PASSWORD=your_secure_password
```

2. If using the server configuration, update the database connection settings accordingly.

## Troubleshooting

### MySQL Service Won't Start
```powershell
# Check service status
Get-Service MySQL*

# Try starting with full name
Start-Service MySQL80

# Check Windows Event Viewer for errors
```

### Connection Refused
- Verify MySQL service is running
- Check firewall settings allow port 3306
- Ensure MySQL is bound to localhost (check my.ini file)

### Authentication Failed
- Reset root password using MySQL installer
- Or use mysqld --skip-grant-tables option

### Port 3306 Already in Use
```powershell
# Check what's using port 3306
netstat -ano | Select-String ":3306"

# Kill the process if needed (use PID from above)
Stop-Process -Id <PID>
```

## Database Schema Overview

The Pharmac database includes:

- **users**: User authentication and profiles
- **queries**: User queries and their metadata
- **results**: Query execution results
- **agent_activities**: AI agent monitoring and logging
- **reports**: Generated reports storage
- **visual_insights**: Visual analytics data

## Next Steps

1. After setting up the database, test the connection from your application
2. Create test users through your application's signup flow
3. Verify data is being stored correctly by checking MySQL Workbench

## Useful MySQL Workbench Tips

- **View table data**: Right-click table → "Select Rows - Limit 1000"
- **Edit data**: Use the grid editor (pencil icon)
- **Export data**: Right-click database → Data Export
- **Backup**: Server → Data Export
- **Monitor**: Performance → Dashboard

## Need Help?

- MySQL Documentation: https://dev.mysql.com/doc/
- MySQL Workbench Manual: https://dev.mysql.com/doc/workbench/en/
- Community Forums: https://forums.mysql.com/
