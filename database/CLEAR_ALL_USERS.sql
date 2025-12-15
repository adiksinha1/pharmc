-- CLEAR ALL USERS FROM MYSQL DATABASE
-- Run this in MySQL Workbench

USE pharmac_db;

-- Delete ALL users
DELETE FROM users;

-- Verify it's empty
SELECT * FROM users;

-- Should show: 0 rows returned

-- Reset the auto-increment
ALTER TABLE users AUTO_INCREMENT = 1;

COMMIT;

-- Done! Now all user data is cleared from MySQL
