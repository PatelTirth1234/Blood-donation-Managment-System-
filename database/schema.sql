-- ============================================================================
-- HemaCare OS — Enterprise Blood Bank Management System
-- Relational Database Schema (PostgreSQL DDL)
-- ============================================================================

-- 1. Donor Entity
CREATE TABLE IF NOT EXISTS donor (
    donor_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(200),
    city VARCHAR(50) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    age INT,
    blood_group VARCHAR(5) NOT NULL,
    disease VARCHAR(100) DEFAULT 'None',
    email VARCHAR(100),
    gender VARCHAR(10),
    donor_type VARCHAR(30) DEFAULT 'One-Time Donor',
    eligibility_status VARCHAR(30) DEFAULT 'Eligible',
    deferral_reason TEXT DEFAULT '',
    deferral_until DATE,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    last_donation_date DATE,
    donation_frequency VARCHAR(50) DEFAULT 'Occasional',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE donor ADD COLUMN IF NOT EXISTS donor_type VARCHAR(30) DEFAULT 'One-Time Donor';
ALTER TABLE donor ADD COLUMN IF NOT EXISTS eligibility_status VARCHAR(30) DEFAULT 'Eligible';
ALTER TABLE donor ADD COLUMN IF NOT EXISTS deferral_reason TEXT DEFAULT '';
ALTER TABLE donor ADD COLUMN IF NOT EXISTS deferral_until DATE;
ALTER TABLE donor ADD COLUMN IF NOT EXISTS latitude NUMERIC(9,6);
ALTER TABLE donor ADD COLUMN IF NOT EXISTS longitude NUMERIC(9,6);
ALTER TABLE donor ADD COLUMN IF NOT EXISTS last_donation_date DATE;
ALTER TABLE donor ADD COLUMN IF NOT EXISTS donation_frequency VARCHAR(50) DEFAULT 'Occasional';
ALTER TABLE donor ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 2. Recipients Entity
CREATE TABLE IF NOT EXISTS recipients (
    recipient_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(200),
    email VARCHAR(100),
    age INT,
    blood_group VARCHAR(5) NOT NULL,
    disease VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE recipients ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 3. Blood Bank Entity
CREATE TABLE IF NOT EXISTS blood_bank (
    bank_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    address VARCHAR(200) NOT NULL,
    mobile_number VARCHAR(15),
    email VARCHAR(100),
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE blood_bank ADD COLUMN IF NOT EXISTS latitude NUMERIC(9,6);
ALTER TABLE blood_bank ADD COLUMN IF NOT EXISTS longitude NUMERIC(9,6);
ALTER TABLE blood_bank ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 4. Staff Entity
CREATE TABLE IF NOT EXISTS staff (
    staff_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    gender VARCHAR(10),
    phone_number VARCHAR(15),
    email VARCHAR(100),
    address VARCHAR(200),
    bank_id INT,
    role VARCHAR(50) DEFAULT 'Clinical Staff',
    medical_reg_no VARCHAR(50),
    specialization VARCHAR(100),
    hospital_affiliation VARCHAR(150),
    organization_name VARCHAR(150) DEFAULT 'Red Cross Blood Center',
    assigned_camp_id INT,
    verification_status VARCHAR(30) DEFAULT 'Verified',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE staff ADD COLUMN IF NOT EXISTS bank_id INT;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'Clinical Staff';
ALTER TABLE staff ADD COLUMN IF NOT EXISTS medical_reg_no VARCHAR(50);
ALTER TABLE staff ADD COLUMN IF NOT EXISTS specialization VARCHAR(100);
ALTER TABLE staff ADD COLUMN IF NOT EXISTS hospital_affiliation VARCHAR(150);
ALTER TABLE staff ADD COLUMN IF NOT EXISTS organization_name VARCHAR(150) DEFAULT 'Red Cross Blood Center';
ALTER TABLE staff ADD COLUMN IF NOT EXISTS assigned_camp_id INT;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS verification_status VARCHAR(30) DEFAULT 'Verified';
ALTER TABLE staff ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 5. Hospital Entity
CREATE TABLE IF NOT EXISTS hospital (
    hospital_id INT PRIMARY KEY,
    hospital_name VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    address VARCHAR(200) NOT NULL,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE hospital ADD COLUMN IF NOT EXISTS latitude NUMERIC(9,6);
ALTER TABLE hospital ADD COLUMN IF NOT EXISTS longitude NUMERIC(9,6);
ALTER TABLE hospital ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 6. Blood Donation Camp Entity
CREATE TABLE IF NOT EXISTS blood_donation_camp (
    organization_id INT PRIMARY KEY,
    organization_name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL DEFAULT '09:00 AM - 04:00 PM',
    location VARCHAR(100) NOT NULL,
    city VARCHAR(50) DEFAULT 'Ahmedabad',
    target_units INT DEFAULT 100,
    incharge_staff VARCHAR(100) DEFAULT 'Tirth Patel',
    contact_phone VARCHAR(20) DEFAULT '9876543210',
    status VARCHAR(30) DEFAULT 'Active',
    notes TEXT DEFAULT '',
    created_by_role VARCHAR(50) DEFAULT 'Super Administrator',
    doctor_reg_no VARCHAR(50) DEFAULT 'GMC-48291',
    approval_status VARCHAR(30) DEFAULT 'Approved',
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS city VARCHAR(50) DEFAULT 'Ahmedabad';
ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS target_units INT DEFAULT 100;
ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS incharge_staff VARCHAR(100) DEFAULT 'Tirth Patel';
ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(20) DEFAULT '9876543210';
ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'Active';
ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';
ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS created_by_role VARCHAR(50) DEFAULT 'Super Administrator';
ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS doctor_reg_no VARCHAR(50) DEFAULT 'GMC-48291';
ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS approval_status VARCHAR(30) DEFAULT 'Approved';
ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS latitude NUMERIC(9,6);
ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS longitude NUMERIC(9,6);
ALTER TABLE blood_donation_camp ALTER COLUMN time TYPE VARCHAR(50);
ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 7. Blood Inventory Entity
CREATE TABLE IF NOT EXISTS blood_inventory (
    inventory_id INT PRIMARY KEY,
    available_blood INT NOT NULL DEFAULT 0,
    blood_group VARCHAR(5) NOT NULL,
    storage_location VARCHAR(100) DEFAULT 'RACK-MAIN-COLD (+4°C)',
    expiry_date DATE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE blood_inventory ADD COLUMN IF NOT EXISTS storage_location VARCHAR(100) DEFAULT 'RACK-MAIN-COLD (+4°C)';
ALTER TABLE blood_inventory ADD COLUMN IF NOT EXISTS expiry_date DATE;
ALTER TABLE blood_inventory ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 8. Donation Transactions
CREATE TABLE IF NOT EXISTS donation (
    donation_id INT PRIMARY KEY,
    donor_id INT,
    staff_id INT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    organization_id INT,
    blood_group VARCHAR(5) NOT NULL,
    blood_quality VARCHAR(50) DEFAULT 'Good',
    inventory_id INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE donation ADD COLUMN IF NOT EXISTS staff_id INT;
ALTER TABLE donation ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 9. Blood Requisitions / Hospital Requests
CREATE TABLE IF NOT EXISTS blood_request (
    request_id INT PRIMARY KEY,
    recipient_id INT,
    hospital_id INT,
    request_name VARCHAR(100) NOT NULL,
    request_location VARCHAR(100) NOT NULL,
    request_date DATE NOT NULL DEFAULT CURRENT_DATE,
    disease VARCHAR(100),
    address VARCHAR(200),
    request_blood_group VARCHAR(5) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    urgency VARCHAR(50) DEFAULT 'Routine',
    matched_donor_id INT,
    dispatch_step VARCHAR(50) DEFAULT 'Pending',
    notified_donors JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE blood_request ADD COLUMN IF NOT EXISTS recipient_id INT;
ALTER TABLE blood_request ADD COLUMN IF NOT EXISTS matched_donor_id INT;
ALTER TABLE blood_request ADD COLUMN IF NOT EXISTS dispatch_step VARCHAR(50) DEFAULT 'Pending';
ALTER TABLE blood_request ADD COLUMN IF NOT EXISTS notified_donors JSONB DEFAULT '[]'::jsonb;
ALTER TABLE blood_request ALTER COLUMN status TYPE VARCHAR(50);
ALTER TABLE blood_request ALTER COLUMN urgency TYPE VARCHAR(50);
ALTER TABLE blood_request ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 10. Medical Examination & Donor Screening Reports
CREATE TABLE IF NOT EXISTS medical_report (
    report_id SERIAL PRIMARY KEY,
    donor_id INT NOT NULL,
    doctor_id INT,
    camp_id INT,
    hospital_id INT,
    report_date DATE NOT NULL DEFAULT CURRENT_DATE,
    hemoglobin NUMERIC(4,1) NOT NULL DEFAULT 13.5,
    blood_pressure VARCHAR(20) DEFAULT '120/80',
    pulse INT DEFAULT 72,
    weight_kg NUMERIC(4,1) DEFAULT 65.0,
    eligibility_status VARCHAR(50) NOT NULL DEFAULT 'Eligible',
    deferral_reason TEXT DEFAULT '',
    deferral_until DATE,
    doctor_notes TEXT DEFAULT '',
    doctor_name VARCHAR(100) DEFAULT 'Dr. Rakesh Patel',
    doctor_reg_no VARCHAR(50) DEFAULT 'GMC-48291',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Camp Appointments / Donor Registrations
CREATE TABLE IF NOT EXISTS camp_registration (
    registration_id SERIAL PRIMARY KEY,
    camp_id INT NOT NULL,
    donor_id INT NOT NULL,
    registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
    appointment_time VARCHAR(50) DEFAULT '10:00 AM',
    status VARCHAR(30) DEFAULT 'Registered',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_camp_donor UNIQUE (camp_id, donor_id)
);

-- 12. Real-Time Notification Stream
CREATE TABLE IF NOT EXISTS notification (
    notification_id SERIAL PRIMARY KEY,
    user_id INT,
    user_role VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    link VARCHAR(100) DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Audit Compliance Ledger
CREATE TABLE IF NOT EXISTS audit_log (
    log_id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    operator VARCHAR(100) NOT NULL,
    event VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    hash VARCHAR(64) NOT NULL,
    status VARCHAR(20) DEFAULT 'COMPLIANT'
);

-- Foreign Key Constraints
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_donation_donor') THEN
        ALTER TABLE donation ADD CONSTRAINT fk_donation_donor FOREIGN KEY (donor_id) REFERENCES donor(donor_id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_donation_staff') THEN
        ALTER TABLE donation ADD CONSTRAINT fk_donation_staff FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_donation_camp') THEN
        ALTER TABLE donation ADD CONSTRAINT fk_donation_camp FOREIGN KEY (organization_id) REFERENCES blood_donation_camp(organization_id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_donation_inventory') THEN
        ALTER TABLE donation ADD CONSTRAINT fk_donation_inventory FOREIGN KEY (inventory_id) REFERENCES blood_inventory(inventory_id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_request_hospital') THEN
        ALTER TABLE blood_request ADD CONSTRAINT fk_request_hospital FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_request_recipient') THEN
        ALTER TABLE blood_request ADD CONSTRAINT fk_request_recipient FOREIGN KEY (recipient_id) REFERENCES recipients(recipient_id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_request_matched_donor') THEN
        ALTER TABLE blood_request ADD CONSTRAINT fk_request_matched_donor FOREIGN KEY (matched_donor_id) REFERENCES donor(donor_id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_staff_bank') THEN
        ALTER TABLE staff ADD CONSTRAINT fk_staff_bank FOREIGN KEY (bank_id) REFERENCES blood_bank(bank_id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_med_report_donor') THEN
        ALTER TABLE medical_report ADD CONSTRAINT fk_med_report_donor FOREIGN KEY (donor_id) REFERENCES donor(donor_id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_camp_reg_camp') THEN
        ALTER TABLE camp_registration ADD CONSTRAINT fk_camp_reg_camp FOREIGN KEY (camp_id) REFERENCES blood_donation_camp(organization_id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_camp_reg_donor') THEN
        ALTER TABLE camp_registration ADD CONSTRAINT fk_camp_reg_donor FOREIGN KEY (donor_id) REFERENCES donor(donor_id) ON DELETE CASCADE;
    END IF;
END $$;

-- Indexes for Optimal Query Performance
CREATE INDEX IF NOT EXISTS idx_donor_blood_group ON donor(blood_group);
CREATE INDEX IF NOT EXISTS idx_donor_city ON donor(city);
CREATE INDEX IF NOT EXISTS idx_donor_type ON donor(donor_type);
CREATE INDEX IF NOT EXISTS idx_inventory_blood_group ON blood_inventory(blood_group);
CREATE INDEX IF NOT EXISTS idx_request_status ON blood_request(status);
CREATE INDEX IF NOT EXISTS idx_request_blood_group ON blood_request(request_blood_group);
CREATE INDEX IF NOT EXISTS idx_request_location ON blood_request(request_location);
CREATE INDEX IF NOT EXISTS idx_donation_date ON donation(date);
CREATE INDEX IF NOT EXISTS idx_medical_report_donor ON medical_report(donor_id);
CREATE INDEX IF NOT EXISTS idx_camp_reg_donor ON camp_registration(donor_id);
CREATE INDEX IF NOT EXISTS idx_notification_user_role ON notification(user_role);