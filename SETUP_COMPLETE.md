# Pharmac Application - Quick Start Guide

## ✅ Setup Complete!

Your Pharmac application is now fully configured with MariaDB database.

## What's Running

- **Frontend (Vite + React):** http://localhost:8081
- **Backend API Server:** http://localhost:4000
- **Database (MariaDB):** localhost:3306
  - Database: `pharmac_db`
  - Username: `root`
  - Password: (no password)

## Database Tables Created

The following tables are available in `pharmac_db`:
1. **users** - User authentication and profiles
2. **queries** - User queries and metadata
3. **results** - Query execution results
4. **agent_activities** - AI agent monitoring
5. **reports** - Generated reports
6. **visual_insights** - Visual analytics data

## Starting the Application

### Start Database (if not running)
```batch
cd database
start-mariadb.bat
```

Or manually:
```powershell
Start-Process -FilePath "C:\Program Files\MariaDB 12.1\bin\mysqld.exe" -NoNewWindow -ArgumentList '--datadir="C:\Program Files\MariaDB 12.1\data"'
```

### Start Development Servers

**Terminal 1 - Frontend:**
```powershell
cd "c:\Users\ADITYA\Downloads\dream-weaver-main (1)\Pharmac"
npm run dev
```

**Terminal 2 - Backend:**
```powershell
cd "c:\Users\ADITYA\Downloads\dream-weaver-main (1)\Pharmac"
node server/index.cjs
```

## Access the Application

- Open browser: http://localhost:8081
- Create an account via Signup
- Login and explore the dashboard

## MySQL Workbench Connection

- Host: `localhost`
- Port: `3306`
- Username: `root`
- Password: (leave empty)
- Database: `pharmac_db`

## Project Structure

```
Pharmac/
├── database/          # Database scripts and setup
│   ├── schema.sql     # Database schema
│   ├── seed.sql       # Sample data
│   └── start-mariadb.bat  # Start database server
├── server/            # Backend API
│   ├── index.cjs      # Express server
│   └── db.cjs         # Database connection
├── src/               # Frontend React app
│   ├── pages/         # Application pages
│   ├── components/    # Reusable components
│   └── hooks/         # Custom React hooks
└── .env               # Environment configuration
```

## Environment Variables (.env)

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=pharmac_db
MYSQL_SSL=false
```

## Troubleshooting

### Database Not Connecting
- Check if MariaDB is running: `netstat -ano | findstr ":3306"`
- Start it: Run `database/start-mariadb.bat`

### Backend Server Error
- Ensure `.env` file exists in project root
- Verify database credentials match

### Frontend Not Loading
- Check if Vite is running on port 8081
- Try: `npm run dev`

## Features

- 🔐 User authentication (signup/login)
- 📊 Dashboard with agent monitoring
- 🔍 Query builder interface
- 📈 Reports and analytics
- 👁️ Visual insights
- 🤖 AI agent framework integration

## Next Steps

1. ✅ Database configured
2. ✅ Servers running
3. ✅ Application accessible
4. 📝 Create a user account
5. 🚀 Start using the application!

---
**Last Updated:** December 15, 2025
**Database:** MariaDB 12.1 (MySQL-compatible)
**Status:** ✅ Fully Operational
