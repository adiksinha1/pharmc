# Pharmacy Data Integration

This directory contains CSV datasets and scripts for importing pharmacy data into the database.

## Datasets

1. **medicines.csv** - Medicine inventory with pricing and stock information
2. **customers.csv** - Customer information
3. **sales.csv** - Sales transaction records
4. **suppliers.csv** - Supplier information

## Setup Instructions

### Step 1: Create Database Tables

Run the pharmacy data schema:

```bash
mysql -u root -p pharmac_db < pharmacy-data-schema.sql
```

Or in MySQL Workbench:
1. Open `pharmacy-data-schema.sql`
2. Execute the script

### Step 2: Import CSV Data

**Option A: Using Node.js Script (Recommended)**

1. Update the password in `import-csv-data.cjs`:
   ```javascript
   password: 'yourpassword', // Update with your MySQL password
   ```

2. Run the import script:
   ```bash
   node import-csv-data.cjs
   ```

**Option B: Using PowerShell Script**

1. Update the password in `import-pharmacy-data.ps1`
2. Run:
   ```powershell
   .\import-pharmacy-data.ps1
   ```

**Option C: Manual Import in MySQL Workbench**

See instructions in `manual-import-instructions.txt`

## API Endpoints

Once data is imported, these endpoints are available:

### Inventory Management
- `GET /api/medicines` - List all medicines
- `GET /api/medicines/:id` - Get specific medicine
- `GET /api/suppliers` - List all suppliers

### Customer & Sales
- `GET /api/customers` - List all customers
- `GET /api/sales` - List all sales with details

### Analytics
- `GET /api/analytics/low-stock?threshold=100` - Medicines with low stock
- `GET /api/analytics/expiring-soon?days=90` - Medicines expiring soon
- `GET /api/analytics/sales-summary` - Daily sales summary (last 30 days)

## Testing

After import, verify data:

```bash
mysql -u root -p pharmac_db -e "SELECT COUNT(*) FROM medicines; SELECT COUNT(*) FROM customers; SELECT COUNT(*) FROM sales; SELECT COUNT(*) FROM suppliers;"
```

Expected results:
- Medicines: 6+ records
- Customers: 5+ records
- Sales: 6+ records
- Suppliers: 5+ records

## Data Schema

### Medicines Table
- medicine_id (PK)
- name
- category
- price
- stock
- expiry_date
- supplier

### Customers Table
- customer_id (PK)
- name
- age
- gender
- phone

### Sales Table
- sale_id (PK)
- date
- customer_id (FK)
- medicine_id (FK)
- quantity
- unit_price
- total_amount
- payment_mode

### Suppliers Table
- supplier_id (PK)
- supplier_name
- contact
- city

## Troubleshooting

### Import Errors

1. **Connection refused**: Ensure MySQL is running
2. **Access denied**: Check MySQL username/password
3. **Table doesn't exist**: Run `pharmacy-data-schema.sql` first
4. **Duplicate entry**: Data already exists (use ON DUPLICATE KEY UPDATE)

### Verify Import

```sql
USE pharmac_db;
SHOW TABLES;
SELECT * FROM medicines LIMIT 5;
SELECT * FROM sales LIMIT 5;
```
