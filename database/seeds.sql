-- ============================================================================
-- HemaCare OS — Enterprise Seed Data
-- ============================================================================

-- 1. Seed Donors
INSERT INTO donor (donor_id, name, address, city, mobile_number, age, blood_group, disease, email, gender)
VALUES
(1001, 'Tirth Patel', 'A-101 Green Residency', 'Ahmedabad', '9876543210', 21, 'B+', 'None', 'tirth@gmail.com', 'Male'),
(1002, 'Rahul Shah', 'B-202 Shyam Society', 'Surat', '9876543211', 24, 'A+', 'None', 'rahul@gmail.com', 'Male'),
(1003, 'Priya Desai', 'C-303 Park Avenue', 'Vadodara', '9876543212', 22, 'O+', 'None', 'priya@gmail.com', 'Female'),
(1004, 'Neha Patel', 'D-404 Sunrise Society', 'Rajkot', '9876543213', 20, 'AB+', 'None', 'neha@gmail.com', 'Female'),
(1005, 'Amit Joshi', 'E-505 Lake View', 'Mehsana', '9876543214', 26, 'B-', 'None', 'amit@gmail.com', 'Male')
ON CONFLICT (donor_id) DO NOTHING;

-- 2. Seed Recipients
INSERT INTO recipients (recipient_id, name, address, email, age, blood_group, disease)
VALUES
(2001, 'Karan Patel', 'Ahmedabad', 'karan@gmail.com', 35, 'B+', 'Accident Trauma'),
(2002, 'Riya Shah', 'Surat', 'riya@gmail.com', 28, 'A+', 'Severe Anemia'),
(2003, 'Vivek Desai', 'Vadodara', 'vivek@gmail.com', 40, 'O+', 'Cardiovascular Surgery'),
(2004, 'Sneha Joshi', 'Rajkot', 'sneha@gmail.com', 30, 'AB+', 'Oncology Care'),
(2005, 'Manav Mehta', 'Mehsana', 'manav@gmail.com', 45, 'B-', 'Thalassemia Major')
ON CONFLICT (recipient_id) DO NOTHING;

-- 3. Seed Blood Banks
INSERT INTO blood_bank (bank_id, name, city, address, mobile_number, email)
VALUES
(4001, 'Red Cross Blood Bank', 'Ahmedabad', 'Navrangpura', '0791111111', 'redcross@gmail.com'),
(4002, 'Life Care Blood Bank', 'Surat', 'Ring Road', '0792222222', 'lifecare@gmail.com'),
(4003, 'City Blood Bank', 'Vadodara', 'Alkapuri', '0793333333', 'cityblood@gmail.com'),
(4004, 'Hope Blood Bank', 'Rajkot', 'Kalawad Road', '0794444444', 'hope@gmail.com'),
(4005, 'Health Blood Bank', 'Mehsana', 'Highway Road', '0795555555', 'health@gmail.com')
ON CONFLICT (bank_id) DO NOTHING;

-- 4. Seed Staff Members
INSERT INTO staff (staff_id, name, age, gender, phone_number, email, address, bank_id)
VALUES
(3001, 'Dr. Rakesh Patel', 35, 'Male', '9876500001', 'rakesh@gmail.com', 'Ahmedabad', 4001),
(3002, 'Pooja Shah', 29, 'Female', '9876500002', 'pooja@gmail.com', 'Surat', 4002),
(3003, 'Jay Mehta', 31, 'Male', '9876500003', 'jay@gmail.com', 'Vadodara', 4003),
(3004, 'Nisha Desai', 27, 'Female', '9876500004', 'nisha@gmail.com', 'Rajkot', 4004),
(3005, 'Kunal Joshi', 33, 'Male', '9876500005', 'kunal@gmail.com', 'Mehsana', 4005)
ON CONFLICT (staff_id) DO NOTHING;

-- 5. Seed Hospitals
INSERT INTO hospital (hospital_id, hospital_name, city, address)
VALUES
(5001, 'Civil Hospital', 'Ahmedabad', 'Asarwa'),
(5002, 'Apollo Hospital', 'Surat', 'Adajan'),
(5003, 'Sterling Hospital', 'Vadodara', 'Race Course'),
(5004, 'Wockhardt Hospital', 'Rajkot', 'Kalawad Road'),
(5005, 'Zydus Hospital', 'Mehsana', 'State Highway')
ON CONFLICT (hospital_id) DO NOTHING;

-- 6. Seed Donation Camps
INSERT INTO blood_donation_camp (organization_id, organization_name, date, time, location)
VALUES
(6001, 'Red Cross Blood Drive', '2026-08-01', '10:00:00', 'Ahmedabad Main Ground'),
(6002, 'Life Care Community Camp', '2026-08-05', '09:30:00', 'Surat Community Hall'),
(6003, 'University Health Drive', '2026-08-10', '11:00:00', 'Vadodara University'),
(6004, 'Youth Blood Drive', '2026-08-15', '10:30:00', 'Rajkot Sports Complex'),
(6005, 'Save Life Civic Drive', '2026-08-20', '09:00:00', 'Mehsana Civic Center')
ON CONFLICT (organization_id) DO NOTHING;

-- 7. Seed Inventory
INSERT INTO blood_inventory (inventory_id, available_blood, blood_group)
VALUES
(7001, 50, 'B+'),
(7002, 40, 'A+'),
(7003, 60, 'O+'),
(7004, 25, 'AB+'),
(7005, 35, 'B-'),
(7006, 28, 'A-'),
(7007, 85, 'O-'),
(7008, 22, 'AB-')
ON CONFLICT (inventory_id) DO UPDATE 
SET available_blood = EXCLUDED.available_blood, last_updated = CURRENT_TIMESTAMP;

-- 8. Seed Donation Records
INSERT INTO donation (donation_id, donor_id, date, organization_id, blood_group, blood_quality, inventory_id)
VALUES
(8001, 1001, '2026-08-01', 6001, 'B+', 'Good', 7001),
(8002, 1002, '2026-08-05', 6002, 'A+', 'Good', 7002),
(8003, 1003, '2026-08-10', 6003, 'O+', 'Excellent', 7003),
(8004, 1004, '2026-08-15', 6004, 'AB+', 'Good', 7004),
(8005, 1005, '2026-08-20', 6005, 'B-', 'Excellent', 7005)
ON CONFLICT (donation_id) DO NOTHING;

-- 9. Seed Requisitions
INSERT INTO blood_request (request_id, request_name, request_location, request_date, disease, address, hospital_id, request_blood_group, status, urgency)
VALUES
(9001, 'Karan Patel', 'Ahmedabad', '2026-08-02', 'Accident Trauma', 'Ahmedabad', 5001, 'B+', 'Dispatched', 'Emergency'),
(9002, 'Riya Shah', 'Surat', '2026-08-06', 'Severe Anemia', 'Surat', 5002, 'A+', 'Dispatched', 'Urgent'),
(9003, 'Vivek Desai', 'Vadodara', '2026-08-11', 'Cardiovascular Surgery', 'Vadodara', 5003, 'O+', 'Pending', 'Emergency'),
(9004, 'Sneha Joshi', 'Rajkot', '2026-08-16', 'Oncology Platelets', 'Rajkot', 5004, 'AB+', 'Pending', 'Urgent'),
(9005, 'Manav Mehta', 'Mehsana', '2026-08-21', 'Thalassemia Major', 'Mehsana', 5005, 'B-', 'Pending', 'Routine')
ON CONFLICT (request_id) DO NOTHING;

-- 10. Seed Audit Logs
INSERT INTO audit_log (operator, event, module, hash, status)
VALUES
('Dr. Rakesh Patel', 'COLD_CHAIN_TELEMETRY_LOG', 'Inventory', 'e3b0c44298fc1c149afbf4c8', 'COMPLIANT'),
('Dr. Rakesh Patel', 'EMERGENCY_DISPATCH_CODE_RED', 'Dispatch', '8f434346648f6b96df89dda9', 'VERIFIED'),
('Pooja Shah', 'DONOR_INTAKE_SCREENING', 'Donors', 'ca978112ca1bbdcafac231b3', 'COMPLIANT'),
('System Daemon', 'EXPIRY_BATCH_VERIFICATION', 'Storage', '4b227777d4dd1fc61c6f884f', 'VALIDATED');
