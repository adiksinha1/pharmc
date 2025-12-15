-- Pharmac Database Setup
-- Execute in MySQL after startup

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS pharmac_db;
USE pharmac_db;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  email VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Queries table for storing user queries
CREATE TABLE IF NOT EXISTS queries (
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
CREATE TABLE IF NOT EXISTS results (
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
CREATE TABLE IF NOT EXISTS agent_activities (
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
CREATE TABLE IF NOT EXISTS reports (
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
CREATE TABLE IF NOT EXISTS visual_insights (
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

-- Sample agent activities
INSERT INTO agent_activities (agent_name, activity_type, status, details, started_at, completed_at) VALUES
('Data Analyzer', 'analysis', 'completed', '{"records_processed": 1500}', NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 1 HOUR),
('Report Generator', 'report', 'running', '{"progress": 75}', NOW() - INTERVAL 30 MINUTE, NULL),
('Query Processor', 'query', 'completed', '{"queries_processed": 25}', NOW() - INTERVAL 1 HOUR, NOW() - INTERVAL 45 MINUTE);

SELECT 'Database setup complete!' AS status;
SELECT 'Tables created:' AS table_list;
SHOW TABLES;
