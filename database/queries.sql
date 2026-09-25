-- ============================================================================
-- HemaCare OS — Analytical & Clinical SQL Queries
-- ============================================================================

-- 1. List All Active Donors with Complete Screening Clearance
SELECT 
    d.donor_id,
    d.name,
    d.blood_group,
    d.city,
    d.mobile_number,
    d.age,
    d.disease,
    CASE 
        WHEN LOWER(d.disease) = 'none' OR d.disease IS NULL THEN 'Cleared' 
        ELSE 'Medical Clearance Required' 
    END AS screening_status,
    COUNT(dn.donation_id) AS total_donations
FROM donor d
LEFT JOIN donation dn ON d.donor_id = dn.donor_id
GROUP BY d.donor_id, d.name, d.blood_group, d.city, d.mobile_number, d.age, d.disease
ORDER BY total_donations DESC, d.donor_id ASC;

-- 2. Real-Time Blood Inventory & Cold-Chain Capacity Utilization
SELECT 
    bi.inventory_id,
    bi.blood_group,
    bi.available_blood AS current_units,
    80 AS target_capacity,
    ROUND((bi.available_blood::NUMERIC / 80) * 100, 1) AS fill_percentage,
    CASE 
        WHEN bi.available_blood >= 45 THEN 'OPTIMAL'
        WHEN bi.available_blood >= 25 THEN 'MODERATE / REPLENISH'
        ELSE 'CRITICAL CODE RED'
    END AS inventory_health_status
FROM blood_inventory bi
ORDER BY bi.available_blood ASC;

-- 3. Emergency Hospital Requests Joined with Hospital Facility Records
SELECT 
    br.request_id,
    br.request_name AS patient_name,
    h.hospital_name,
    h.city AS hospital_city,
    br.request_blood_group,
    br.disease AS clinical_indication,
    br.urgency,
    br.status,
    br.request_date
FROM blood_request br
INNER JOIN hospital h ON br.hospital_id = h.hospital_id
ORDER BY 
    CASE br.urgency 
        WHEN 'Emergency' THEN 1 
        WHEN 'Urgent' THEN 2 
        ELSE 3 
    END ASC,
    br.request_date DESC;

-- 4. Blood Donation Camps Summary with Donation Yield
SELECT 
    bdc.organization_id,
    bdc.organization_name,
    bdc.location,
    bdc.date,
    bdc.time,
    COUNT(d.donation_id) AS units_collected
FROM blood_donation_camp bdc
LEFT JOIN donation d ON bdc.organization_id = d.organization_id
GROUP BY bdc.organization_id, bdc.organization_name, bdc.location, bdc.date, bdc.time
ORDER BY bdc.date DESC;

-- 5. Cross-Match Matrix: Compatible Blood Units Available for Critical Requests
SELECT 
    br.request_id,
    br.request_name AS patient_name,
    br.request_blood_group AS needed_group,
    bi.available_blood AS compatible_stock
FROM blood_request br
LEFT JOIN blood_inventory bi ON br.request_blood_group = bi.blood_group
WHERE br.status = 'Pending'
ORDER BY br.urgency ASC;

-- 6. City-Wise Donor Demographics & Active Donor Distribution
SELECT 
    d.city,
    COUNT(DISTINCT d.donor_id) AS total_registered_donors,
    COUNT(dn.donation_id) AS total_donations_collected,
    COUNT(DISTINCT CASE WHEN LOWER(COALESCE(d.disease, 'none')) = 'none' THEN d.donor_id END) AS cleared_donors,
    COUNT(DISTINCT CASE WHEN LOWER(COALESCE(d.disease, 'none')) != 'none' THEN d.donor_id END) AS review_required_donors,
    ARRAY_TO_STRING(ARRAY_AGG(DISTINCT d.blood_group), ', ') AS available_blood_groups
FROM donor d
LEFT JOIN donation dn ON d.donor_id = dn.donor_id
GROUP BY d.city
ORDER BY total_registered_donors DESC, d.city ASC;

-- 7. Geographical Emergency Cross-Matching by City and Blood Group
SELECT 
    r.request_id,
    r.request_name AS patient_name,
    COALESCE(h.hospital_name, 'General Hospital') AS hospital_name,
    r.request_location AS hospital_city,
    r.request_blood_group,
    r.urgency,
    d.donor_id AS matched_donor_id,
    d.name AS matched_donor_name,
    d.city AS matched_donor_city,
    d.mobile_number AS matched_donor_phone,
    d.blood_group AS matched_donor_blood_group,
    CASE 
        WHEN LOWER(COALESCE(d.disease, 'none')) = 'none' THEN 'Cleared' 
        ELSE 'Pending' 
    END AS donor_clearance
FROM blood_request r
LEFT JOIN hospital h ON r.hospital_id = h.hospital_id
INNER JOIN donor d ON r.request_blood_group = d.blood_group
    AND (
        LOWER(r.request_location) = LOWER(d.city)
        OR LOWER(r.request_location) LIKE '%' || LOWER(d.city) || '%'
        OR LOWER(d.city) LIKE '%' || LOWER(r.request_location) || '%'
    )
WHERE r.status IN ('Pending', 'Pending Match')
ORDER BY 
    CASE r.urgency 
        WHEN 'Emergency' THEN 1 
        WHEN 'Urgent' THEN 2 
        ELSE 3 
    END, 
    r.request_id ASC;

-- 8. Parameterized Multi-Filter Donor Search (City + Blood Group + Clearance + Text Search)
-- Example: City = 'Ahmedabad', Blood Group = 'B+', Clearance = 'Cleared', Search = 'Patel'
SELECT 
    d.donor_id AS id,
    d.name,
    d.city,
    d.address,
    d.mobile_number AS phone,
    d.email,
    d.blood_group AS "bloodGroup",
    d.age,
    d.gender,
    CASE WHEN LOWER(COALESCE(d.disease, 'none')) = 'none' THEN 'Cleared' ELSE 'Pending' END AS clearance,
    (SELECT COUNT(*) FROM donation WHERE donor_id = d.donor_id) AS "donationsCount"
FROM donor d
WHERE (LOWER(d.city) = 'ahmedabad' OR 'ALL' = 'ALL')
  AND (d.blood_group = 'B+' OR 'ALL' = 'ALL')
  AND (CASE WHEN LOWER(COALESCE(d.disease, 'none')) = 'none' THEN 'Cleared' ELSE 'Pending' END = 'Cleared' OR 'ALL' = 'ALL')
  AND (
    LOWER(d.name) LIKE '%patel%' OR 
    d.donor_id::text LIKE '%patel%' OR 
    LOWER(d.city) LIKE '%patel%' OR 
    d.mobile_number LIKE '%patel%'
  )
ORDER BY d.donor_id DESC;

-- 9. Update Donor Clinical Record & Location
UPDATE donor
SET 
    name = 'Tirth Patel',
    city = 'Ahmedabad',
    address = 'A-101 Green Residency, Navrangpura',
    mobile_number = '9876543210',
    blood_group = 'B+',
    age = 22,
    gender = 'Male',
    disease = 'None',
    email = 'tirth.patel@gmail.com'
WHERE donor_id = 1001
RETURNING donor_id, name, city, blood_group, disease;

