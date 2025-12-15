# Database Setup Guide

This guide will help you set up MySQL database for the Pharmac application.

## Prerequisites

1. **MySQL Server** installed on your system
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or install via package manager

2. **MySQL Workbench** (recommended for GUI management)
   - Download from: https://dev.mysql.com/downloads/workbench/

## Setup Instructions

### 1. Install MySQL Server

If you haven't installed MySQL yet:

**Windows:**
```bash
# Download MySQL Installer from mysql.com
# Or use Chocolatey:
choco install mysql
```

**macOS:**
```bash
brew install mysql
```

**Linux:**
```bash
sudo apt-get install mysql-server
```

### 2. Start MySQL Service

**Windows:**
```powershell
net start MySQL80
```

**macOS/Linux:**
```bash
sudo service mysql start
# or
sudo systemctl start mysql
```

### 3. Create Database Using MySQL Workbench

1. Open **MySQL Workbench**
2. Click on your local MySQL connection (or create a new connection)
3. Open the `schema.sql` file in Workbench
4. Execute the script (click the lightning bolt icon or press Ctrl+Shift+Enter)
5. (Optional) Execute `seed.sql` for sample data

### 4. Create Database Using Command Line

```bash
# Login to MySQL
mysql -u root -p

# Run the schema script
source /path/to/schema.sql

# Run the seed script (optional)
source /path/to/seed.sql
```

### 5. Configure Application

1. Copy `.env.example` to `.env` in the project root:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your MySQL credentials:
   ```env
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_DATABASE=pharmac_db
   MYSQL_SSL=false
   ```

### 6. Start the Application

```bash
# Install dependencies if needed
npm install

# Start the server
npm start

# Or start both server and client
npm run start:all
```

## Database Schema

The database includes the following tables:

- **users** - User authentication and profiles
- **queries** - User queries and their metadata
- **results** - Query results with confidence scores
- **agent_activities** - Agent monitoring and activity logs
- **reports** - Generated reports
- **visual_insights** - Visual analytics data

## Connecting with MySQL Workbench

1. Open MySQL Workbench
2. Click "+" to create a new connection
3. Enter connection details:
   - Connection Name: `Pharmac Local`
   - Hostname: `localhost`
   - Port: `3306`
   - Username: `root`
   - Password: (click "Store in Keychain" to save)
4. Click "Test Connection"
5. Click "OK" to save

## Useful MySQL Commands

```sql
-- Show all databases
SHOW DATABASES;

-- Use the pharmac database
USE pharmac_db;

-- Show all tables
SHOW TABLES;

-- Describe table structure
DESCRIBE users;

-- View all users
SELECT * FROM users;

-- View recent queries
SELECT * FROM queries ORDER BY created_at DESC LIMIT 10;

-- View agent activities
SELECT * FROM agent_activities ORDER BY started_at DESC;
```

## Backup and Restore

### Backup
```bash
mysqldump -u root -p pharmac_db > pharmac_backup.sql
```

### Restore
```bash
mysql -u root -p pharmac_db < pharmac_backup.sql
```

## Troubleshooting

### Can't connect to MySQL server
- Check if MySQL service is running
- Verify credentials in `.env` file
- Check firewall settings

### Access denied for user
- Reset MySQL root password
- Grant necessary privileges:
  ```sql
  GRANT ALL PRIVILEGES ON pharmac_db.* TO 'root'@'localhost';
  FLUSH PRIVILEGES;
  ```

### Table doesn't exist
- Make sure you ran `schema.sql`
- Check if you're using the correct database: `USE pharmac_db;`

## Additional Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [MySQL Workbench Manual](https://dev.mysql.com/doc/workbench/en/)
- [Node.js MySQL2 Documentation](https://github.com/sidorares/node-mysql2)
