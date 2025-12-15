# Quick Setup Guide - Pharmacy Data Integration

## What's Been Added

✅ **CSV Datasets** (in `/database` folder):
- medicines.csv - 6+ medicine records
- customers.csv - 5+ customer records  
- sales.csv - 6+ sales transactions
- suppliers.csv - 5+ supplier records

✅ **Database Schema**:
- `pharmacy-data-schema.sql` - Creates 4 new tables

✅ **Import Scripts**:
- `import-csv-data.cjs` - Node.js import script
- `import-pharmacy-data.ps1` - PowerShell setup script

✅ **API Endpoints** (in `server/index.cjs`):
- GET /api/medicines
- GET /api/customers
- GET /api/sales
- GET /api/suppliers
- GET /api/analytics/low-stock
- GET /api/analytics/expiring-soon
- GET /api/analytics/sales-summary

✅ **Dashboard Page**:
- New page at `/dashboard/pharmacy-data`
- Complete UI with tables, analytics, and alerts

## Setup Steps

### 1. Import Data into Database

**Option A - Using PowerShell (Easiest):**
```powershell
cd database
.\import-pharmacy-data.ps1
```

**Option B - Using Node.js:**
```bash
cd database
# Edit import-csv-data.cjs and set your MySQL password
node import-csv-data.cjs
```

**Option C - Manual Setup:**
```bash
# 1. Create tables
mysql -u root -p pharmac_db < database/pharmacy-data-schema.sql

# 2. Then run the Node.js import
cd database
node import-csv-data.cjs
```

### 2. Start the Application

```bash
npm run dev
```

### 3. Access Pharmacy Data

1. Login/Signup at http://localhost:8081
2. Navigate to Dashboard
3. Go to: http://localhost:8081/dashboard/pharmacy-data

## Testing the Integration

### Test API Endpoints:

```bash
# Get all medicines
curl http://localhost:4000/api/medicines

# Get low stock items
curl http://localhost:4000/api/analytics/low-stock?threshold=200

# Get expiring medicines
curl http://localhost:4000/api/analytics/expiring-soon?days=180

# Get sales data
curl http://localhost:4000/api/sales
```

### Verify Database:

```sql
USE pharmac_db;
SELECT COUNT(*) FROM medicines;
SELECT COUNT(*) FROM customers;
SELECT COUNT(*) FROM sales;
SELECT COUNT(*) FROM suppliers;

-- View sample data
SELECT * FROM medicines LIMIT 5;
SELECT * FROM sales LIMIT 5;
```

## Features Available

### Dashboard Features:
- 📊 Summary cards with counts
- 📦 Medicine inventory table
- 👥 Customer database
- 🛒 Sales records with details
- 🏢 Supplier directory
- ⚠️ Low stock alerts
- 📅 Expiring medicines alerts
- 📈 Analytics tab

### API Features:
- Full CRUD operations ready
- Analytics endpoints
- Filtering and sorting
- Joined queries for sales data

## Troubleshooting

### "Database not configured" error:
- Ensure MySQL is running
- Check database connection in `.env` or `server/db.cjs`

### "Table doesn't exist" error:
- Run `pharmacy-data-schema.sql` first
- Then run the import script

### API returns empty arrays:
- Data not imported yet - run import script
- Check MySQL is running: `mysql -u root -p`

### Can't access dashboard page:
- Login first at `/login`
- Clear browser storage if needed

## Next Steps

1. ✅ Data imported successfully
2. ✅ API endpoints working
3. ✅ Dashboard page accessible
4. 🎯 Ready for testing and development!

## Files Modified/Created

**New Files:**
- `/database/medicines.csv`
- `/database/customers.csv`
- `/database/sales.csv`
- `/database/suppliers.csv`
- `/database/pharmacy-data-schema.sql`
- `/database/import-csv-data.cjs`
- `/database/import-pharmacy-data.ps1`
- `/database/PHARMACY_DATA_README.md`
- `/src/pages/dashboard/PharmacyData.tsx`

**Modified Files:**
- `/server/index.cjs` - Added 7 new API endpoints
- `/src/App.tsx` - Added pharmacy data route

Happy Testing! 🎉
