-- ========================================
-- Pharmac Database Complete Setup Script
-- Run this script in MySQL Workbench
-- ========================================

-- Create database
CREATE DATABASE IF NOT EXISTS pharmac_db;
USE pharmac_db;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS visual_insights;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS agent_activities;
DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS queries;
DROP TABLE IF EXISTS users;

-- Users table for authentication
CREATE TABLE users (
  email VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Queries table for storing user queries
CREATE TABLE queries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  query_text TEXT NOT NULL,
  query_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE,
  INDEX idx_user_email (user_email),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Results table for storing query results
CREATE TABLE results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  query_id INT NOT NULL,
  result_data JSON,
  result_type VARCHAR(50),
  confidence_score DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (query_id) REFERENCES queries(id) ON DELETE CASCADE,
  INDEX idx_query_id (query_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agent monitoring table
CREATE TABLE agent_activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  agent_name VARCHAR(100) NOT NULL,
  activity_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  details JSON,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  INDEX idx_agent_name (agent_name),
  INDEX idx_activity_type (activity_type),
  INDEX idx_status (status),
  INDEX idx_started_at (started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reports table
CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  report_name VARCHAR(255) NOT NULL,
  report_type VARCHAR(50),
  report_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE,
  INDEX idx_user_email (user_email),
  INDEX idx_report_type (report_type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Visual insights table
CREATE TABLE visual_insights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  insight_type VARCHAR(50) NOT NULL,
  insight_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE,
  INDEX idx_user_email (user_email),
  INDEX idx_insight_type (insight_type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data for testing
INSERT INTO users (email, name, password_hash) VALUES
  ('test@pharmac.com', 'Test User', '$2a$10$abcdefghijklmnopqrstuv'),
  ('admin@pharmac.com', 'Admin User', '$2a$10$zyxwvutsrqponmlkjihgfe');

INSERT INTO queries (user_email, query_text, query_type, status) VALUES
  ('test@pharmac.com', 'What is the current stock level?', 'inventory', 'completed'),
  ('test@pharmac.com', 'Generate sales report for Q4', 'report', 'pending'),
  ('admin@pharmac.com', 'Analyze customer trends', 'analysis', 'completed');

INSERT INTO agent_activities (agent_name, activity_type, status, details) VALUES
  ('InventoryAgent', 'stock_check', 'completed', '{"items_checked": 150}'),
  ('ReportAgent', 'report_generation', 'in_progress', '{"report_type": "sales"}'),
  ('AnalyticsAgent', 'trend_analysis', 'completed', '{"insights_generated": 5}');

-- Verify tables were created
SELECT 'Database setup completed successfully!' AS Status;
SELECT TABLE_NAME, TABLE_ROWS 
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'pharmac_db'
ORDER BY TABLE_NAME;
