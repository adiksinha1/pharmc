-- Pharmacy Data Schema and Import
-- Creates tables for medicines, customers, suppliers, and sales
-- Run this after schema.sql

USE pharmac_db;

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  supplier_id VARCHAR(20) PRIMARY KEY,
  supplier_name VARCHAR(255) NOT NULL,
  contact VARCHAR(20),
  city VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_supplier_name (supplier_name),
  INDEX idx_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Medicines table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customers table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sales table
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
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE SET NULL,
  FOREIGN KEY (medicine_id) REFERENCES medicines(medicine_id) ON DELETE SET NULL,
  INDEX idx_date (date),
  INDEX idx_customer_id (customer_id),
  INDEX idx_medicine_id (medicine_id),
  INDEX idx_payment_mode (payment_mode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Enable local_infile for CSV import
SET GLOBAL local_infile = 1;
