-- IVTMS Database Schema
-- Generated for MySQL 8.0+

CREATE DATABASE IF NOT EXISTS ivtms_db;
USE ivtms_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    aadhaar_number VARCHAR(20) UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'CITIZEN',
    status VARCHAR(20) NOT NULL DEFAULT 'Active'
);

-- 2. Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    manufacturer VARCHAR(50),
    model VARCHAR(50),
    manufacturing_year INT,
    engine_number VARCHAR(50),
    chassis_number VARCHAR(50),
    fuel_type VARCHAR(20),
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Insurance Policies Table
CREATE TABLE IF NOT EXISTS insurance_policies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    policy_number VARCHAR(50) UNIQUE NOT NULL,
    provider VARCHAR(100),
    policy_type VARCHAR(50),
    issue_date DATE,
    expiry_date DATE,
    status VARCHAR(20),
    vehicle_id BIGINT,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- 4. PUC Certificates Table
CREATE TABLE IF NOT EXISTS puc_certificates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    test_date DATE,
    expiry_date DATE,
    carbon_monoxide_level DOUBLE,
    hydrocarbon_level DOUBLE,
    status VARCHAR(20),
    vehicle_id BIGINT,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- 5. Tax Records Table
CREATE TABLE IF NOT EXISTS tax_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(50) UNIQUE NOT NULL,
    amount DOUBLE,
    payment_date DATE,
    expiry_date DATE,
    tax_type VARCHAR(50),
    status VARCHAR(20),
    vehicle_id BIGINT,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- 6. Permits Table
CREATE TABLE IF NOT EXISTS permits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    permit_number VARCHAR(50) UNIQUE NOT NULL,
    permit_type VARCHAR(50),
    issue_date DATE,
    expiry_date DATE,
    status VARCHAR(20),
    vehicle_id BIGINT,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- 7. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_email VARCHAR(100),
    details TEXT
);
