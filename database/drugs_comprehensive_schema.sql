-- Drugs and medicines comprehensive database schema

-- Main drugs table from drugs_for_common_treatments.csv
CREATE TABLE IF NOT EXISTS drugs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  drug_name VARCHAR(255) NOT NULL,
  medical_condition VARCHAR(255),
  medical_condition_description LONGTEXT,
  activity VARCHAR(100),
  rx_otc VARCHAR(50),
  pregnancy_category VARCHAR(50),
  csa VARCHAR(50),
  alcohol VARCHAR(50),
  rating DECIMAL(3,1),
  no_of_reviews INT,
  medical_condition_url VARCHAR(500),
  drug_link VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_drug_name (drug_name),
  INDEX idx_condition (medical_condition),
  FULLTEXT INDEX ft_drug_description (medical_condition_description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Medicine dataset table from archive2
CREATE TABLE IF NOT EXISTS medicines (
  id INT PRIMARY KEY AUTO_INCREMENT,
  medicine_name VARCHAR(255) NOT NULL,
  generic_name VARCHAR(255),
  side_effects LONGTEXT,
  usage_info TEXT,
  warnings TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_medicine_name (medicine_name),
  FULLTEXT INDEX ft_medicine_search (medicine_name, generic_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- India medicine dataset from archive3
CREATE TABLE IF NOT EXISTS medicines_india (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2),
  is_discontinued BOOLEAN DEFAULT FALSE,
  manufacturer_name VARCHAR(255),
  type VARCHAR(100),
  pack_size_label VARCHAR(100),
  composition VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_medicine_name (name),
  INDEX idx_manufacturer (manufacturer_name),
  INDEX idx_type (type),
  FULLTEXT INDEX ft_india_medicine (name, manufacturer_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pharma company table from archive5
CREATE TABLE IF NOT EXISTS pharma_companies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company_name VARCHAR(255) NOT NULL,
  ipc_subclass VARCHAR(50),
  patents_count INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_company_name (company_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Drug sentiment and reviews table from archive4
CREATE TABLE IF NOT EXISTS drug_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  drug_name VARCHAR(255) NOT NULL,
  rating DECIMAL(3,1),
  review_text LONGTEXT,
  medical_condition VARCHAR(255),
  sentiment_score DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_drug_name (drug_name),
  FULLTEXT INDEX ft_review_text (review_text)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Search history table
CREATE TABLE IF NOT EXISTS search_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  search_query VARCHAR(255),
  result_count INT,
  searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_search_query (search_query)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
