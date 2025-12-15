-- Pharmac Database Seed Data
-- Run this after schema.sql to populate sample data

USE pharmac_db;

-- Sample queries (you'll need actual users first)
-- INSERT INTO queries (user_email, query_text, query_type, status) VALUES
-- ('demo@example.com', 'Analyze patient data for diabetes trends', 'analysis', 'completed'),
-- ('demo@example.com', 'Generate medication adherence report', 'report', 'pending');

-- Sample agent activities
INSERT INTO agent_activities (agent_name, activity_type, status, details, started_at, completed_at) VALUES
('Data Analyzer', 'analysis', 'completed', '{"records_processed": 1500}', NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 1 HOUR),
('Report Generator', 'report', 'running', '{"progress": 75}', NOW() - INTERVAL 30 MINUTE, NULL),
('Query Processor', 'query', 'completed', '{"queries_processed": 25}', NOW() - INTERVAL 1 HOUR, NOW() - INTERVAL 45 MINUTE);
