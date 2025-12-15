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
