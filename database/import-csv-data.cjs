// Import CSV data into the database
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Parse CSV file
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index] ? values[index].trim() : null;
    });
    return obj;
  });
}

async function importData() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'yourpassword', // Update with your MySQL password
      database: 'pharmac_db',
      multipleStatements: true
    });

    console.log('Connected to database');

    // Create tables if they don't exist
    console.log('Creating tables if not exist...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS suppliers (
        supplier_id VARCHAR(20) PRIMARY KEY,
        supplier_name VARCHAR(255) NOT NULL,
        contact VARCHAR(20),
        city VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_supplier_name (supplier_name),
        INDEX idx_city (city)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS medicines (
        medicine_id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        price DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        expiry_date DATE,
        supplier VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_name (name),
        INDEX idx_category (category),
        INDEX idx_expiry_date (expiry_date),
        INDEX idx_supplier (supplier),
        INDEX idx_stock (stock)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        customer_id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INT,
        gender VARCHAR(20),
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_name (name),
        INDEX idx_phone (phone)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS sales (
        sale_id VARCHAR(20) PRIMARY KEY,
        date DATE NOT NULL,
        customer_id VARCHAR(20),
        medicine_id VARCHAR(20),
        quantity INT NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        payment_mode VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_date (date),
        INDEX idx_customer_id (customer_id),
        INDEX idx_medicine_id (medicine_id),
        INDEX idx_payment_mode (payment_mode)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✓ Tables created/verified');

    // Read and parse CSV files
    const suppliers = parseCSV(path.join(__dirname, 'suppliers.csv'));
    const medicines = parseCSV(path.join(__dirname, 'medicines.csv'));
    const customers = parseCSV(path.join(__dirname, 'customers.csv'));
    const sales = parseCSV(path.join(__dirname, 'sales.csv'));

    console.log(`Loaded ${suppliers.length} suppliers`);
    console.log(`Loaded ${medicines.length} medicines`);
    console.log(`Loaded ${customers.length} customers`);
    console.log(`Loaded ${sales.length} sales`);

    // Import suppliers
    console.log('\nImporting suppliers...');
    for (const supplier of suppliers) {
      await connection.execute(
        `INSERT INTO suppliers (supplier_id, supplier_name, contact, city) 
         VALUES (?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE 
         supplier_name = VALUES(supplier_name),
         contact = VALUES(contact),
         city = VALUES(city)`,
        [supplier.supplier_id, supplier.supplier_name, supplier.contact, supplier.city]
      );
    }
    console.log('✓ Suppliers imported');

    // Import customers
    console.log('Importing customers...');
    for (const customer of customers) {
      await connection.execute(
        `INSERT INTO customers (customer_id, name, age, gender, phone) 
         VALUES (?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE 
         name = VALUES(name),
         age = VALUES(age),
         gender = VALUES(gender),
         phone = VALUES(phone)`,
        [customer.customer_id, customer.name, customer.age, customer.gender, customer.phone]
      );
    }
    console.log('✓ Customers imported');

    // Import medicines
    console.log('Importing medicines...');
    for (const medicine of medicines) {
      await connection.execute(
        `INSERT INTO medicines (medicine_id, name, category, price, stock, expiry_date, supplier) 
         VALUES (?, ?, ?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE 
         name = VALUES(name),
         category = VALUES(category),
         price = VALUES(price),
         stock = VALUES(stock),
         expiry_date = VALUES(expiry_date),
         supplier = VALUES(supplier)`,
        [
          medicine.medicine_id,
          medicine.name,
          medicine.category,
          parseFloat(medicine.price),
          parseInt(medicine.stock),
          medicine.expiry_date,
          medicine.supplier
        ]
      );
    }
    console.log('✓ Medicines imported');

    // Import sales
    console.log('Importing sales...');
    for (const sale of sales) {
      await connection.execute(
        `INSERT INTO sales (sale_id, date, customer_id, medicine_id, quantity, unit_price, total_amount, payment_mode) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE 
         date = VALUES(date),
         customer_id = VALUES(customer_id),
         medicine_id = VALUES(medicine_id),
         quantity = VALUES(quantity),
         unit_price = VALUES(unit_price),
         total_amount = VALUES(total_amount),
         payment_mode = VALUES(payment_mode)`,
        [
          sale.sale_id,
          sale.date,
          sale.customer_id,
          sale.medicine_id,
          parseInt(sale.quantity),
          parseFloat(sale.unit_price),
          parseFloat(sale.total_amount),
          sale.payment_mode
        ]
      );
    }
    console.log('✓ Sales imported');

    // Verify data
    const [supplierCount] = await connection.execute('SELECT COUNT(*) as count FROM suppliers');
    const [medicineCount] = await connection.execute('SELECT COUNT(*) as count FROM medicines');
    const [customerCount] = await connection.execute('SELECT COUNT(*) as count FROM customers');
    const [salesCount] = await connection.execute('SELECT COUNT(*) as count FROM sales');

    console.log('\n=== Import Summary ===');
    console.log(`Suppliers in DB: ${supplierCount[0].count}`);
    console.log(`Medicines in DB: ${medicineCount[0].count}`);
    console.log(`Customers in DB: ${customerCount[0].count}`);
    console.log(`Sales in DB: ${salesCount[0].count}`);
    console.log('===================\n');
    console.log('✅ All data imported successfully!');

  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the import
if (require.main === module) {
  importData()
    .then(() => {
      console.log('Import completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Import failed:', error);
      process.exit(1);
    });
}

module.exports = { importData, parseCSV };
