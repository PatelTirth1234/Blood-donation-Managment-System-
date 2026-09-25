/**
 * HemaCare OS / RaktSetu — Rich Dataset Reset & Seeder (Node.js)
 * Populates diverse Gujarat donors, realistic donations, requests, and inventory stock.
 */

const db = require('../db');

const donorsData = [
  [1001, 'Tirth Patel', 'A-101 Green Residency, Navrangpura', 'Ahmedabad', '9876543210', 21, 'B+', 'None', 'tirth.patel@gmail.com', 'Male'],
  [1002, 'Rahul Shah', 'B-202 Shyam Society, Adajan', 'Surat', '9876543211', 24, 'A+', 'None', 'rahul.shah@gmail.com', 'Male'],
  [1003, 'Priya Desai', 'C-303 Park Avenue, Alkapuri', 'Vadodara', '9876543212', 22, 'O+', 'None', 'priya.desai@gmail.com', 'Female'],
  [1004, 'Neha Patel', 'D-404 Sunrise Society, Kalawad Road', 'Rajkot', '9876543213', 20, 'AB+', 'None', 'neha.patel@gmail.com', 'Female'],
  [1005, 'Amit Joshi', 'E-505 Lake View, Highway Road', 'Mehsana', '9876543214', 26, 'B-', 'None', 'amit.joshi@gmail.com', 'Male'],
  [1006, 'Ananya Trivedi', 'Sector 7/B, Infocity', 'Gandhinagar', '9876543215', 23, 'A-', 'None', 'ananya.trivedi@gmail.com', 'Female'],
  [1007, 'Harshil Vora', 'Nilambag Circle, High Court Road', 'Bhavnagar', '9876543216', 29, 'O-', 'None', 'harshil.vora@gmail.com', 'Male'],
  [1008, 'Kavita Rao', 'G-12 Royal Arcade, Ring Road', 'Surat', '9876543217', 27, 'AB-', 'None', 'kavita.rao@gmail.com', 'Female'],
  [1009, 'Devendra Parmar', 'Shivalik Heights, Maninagar East', 'Ahmedabad', '9876543218', 34, 'B+', 'None', 'devendra.p@gmail.com', 'Male'],
  [1010, 'Mansi Mehta', 'Vasna-Bhayli Road, Gotri', 'Vadodara', '9876543219', 25, 'A+', 'None', 'mansi.mehta@gmail.com', 'Female'],
  [1011, 'Chirag Solanki', 'Patel Colony, Street 4', 'Jamnagar', '9876543220', 31, 'O+', 'None', 'chirag.solanki@gmail.com', 'Male'],
  [1012, 'Ritu Chawla', 'Amul Dairy Road, Anand Town', 'Anand', '9876543221', 28, 'AB+', 'None', 'ritu.chawla@gmail.com', 'Female'],
  [1013, 'Parthiv Gadhvi', 'University Road, 150 Feet Ring Road', 'Rajkot', '9876543222', 22, 'A-', 'None', 'parthiv.gadhvi@gmail.com', 'Male'],
  [1014, 'Shweta Dave', 'Sector 21, Near CH Road', 'Gandhinagar', '9876543223', 30, 'B-', 'None', 'shweta.dave@gmail.com', 'Female'],
  [1015, 'Jaydeep Rathod', 'Vesu VIP Road, Near University', 'Surat', '9876543224', 33, 'O-', 'None', 'jaydeep.rathod@gmail.com', 'Male'],
  [1016, 'Hiral Bhatt', 'Sindhu Bhavan Road, Bodakdev', 'Ahmedabad', '9876543225', 26, 'AB-', 'None', 'hiral.bhatt@gmail.com', 'Female'],
  [1017, 'Nirav Soni', 'Waghawadi Road, Near Victoria Park', 'Bhavnagar', '9876543226', 35, 'B+', 'None', 'nirav.soni@gmail.com', 'Male'],
  [1018, 'Dhara Panchal', 'Radhanpur Road, Mehsana', 'Mehsana', '9876543227', 24, 'A+', 'None', 'dhara.panchal@gmail.com', 'Female'],
  [1019, 'Vishal Zala', 'Khambhalia Gate, Digjam Area', 'Jamnagar', '9876543228', 27, 'O+', 'None', 'vishal.zala@gmail.com', 'Male'],
  [1020, 'Snehal Shah', 'Fatehgunj Main Road', 'Vadodara', '9876543229', 32, 'AB+', 'None', 'snehal.shah@gmail.com', 'Female'],
];

async function resetAndSeed() {
  console.log('='.repeat(60));
  console.log('🔄 Resetting & Populating Rich Dataset (Node.js)');
  console.log('='.repeat(60));

  try {
    await db.initializeSchemaIfNeeded();

    // 1. Clean donation & request tables foreign keys to donor
    await db.query('DELETE FROM donation;', [], 'none');
    await db.query('UPDATE blood_request SET matched_donor_id = NULL;', [], 'none');
    await db.query('DELETE FROM camp_registration;', [], 'none');
    await db.query('DELETE FROM medical_report;', [], 'none');
    await db.query('DELETE FROM donor;', [], 'none');

    console.log('[1/4] Cleared old donor records & related dependencies.');

    // 2. Insert all 20 unique, diverse donors
    for (const d of donorsData) {
      await db.query(
        `INSERT INTO donor (donor_id, name, address, city, mobile_number, age, blood_group, disease, email, gender, donor_type, eligibility_status, last_donation_date, donation_frequency)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Eligible', '2026-08-15', $12)
         ON CONFLICT (donor_id) DO NOTHING;`,
        [...d, d[0] % 2 === 0 ? 'Permanent Donor' : 'One-Time Donor', d[0] % 2 === 0 ? 'Every 3 Months' : 'Occasional'],
        'none'
      );
    }
    console.log(`[2/4] Populated ${donorsData.length} diverse donors.`);

    // 3. Seed realistic donations
    const donationsData = [
      [8001, 1001, 3001, '2026-08-01', 6001, 'B+', 'Excellent', 7001],
      [8002, 1002, 3002, '2026-08-05', 6002, 'A+', 'Good', 7002],
      [8003, 1003, 3003, '2026-08-10', 6003, 'O+', 'Excellent', 7003],
      [8004, 1004, 3004, '2026-08-15', 6004, 'AB+', 'Good', 7004],
      [8005, 1005, 3005, '2026-08-20', 6005, 'B-', 'Excellent', 7005],
      [8006, 1006, 3001, '2026-08-22', 6001, 'A-', 'Good', 7006],
      [8007, 1007, 3002, '2026-08-25', 6002, 'O-', 'Excellent', 7007],
      [8008, 1008, 3003, '2026-08-28', 6003, 'AB-', 'Good', 7008],
      [8009, 1009, 3001, '2026-08-29', 6001, 'B+', 'Excellent', 7001],
      [8010, 1010, 3003, '2026-08-30', 6003, 'A+', 'Good', 7002],
      [8011, 1011, 3004, '2026-09-01', 6004, 'O+', 'Excellent', 7003],
      [8012, 1015, 3002, '2026-09-03', 6002, 'O-', 'Excellent', 7007],
      [8013, 1017, 3005, '2026-09-05', 6005, 'B+', 'Good', 7001],
    ];

    for (const don of donationsData) {
      await db.query(
        `INSERT INTO donation (donation_id, donor_id, staff_id, date, organization_id, blood_group, blood_quality, inventory_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (donation_id) DO NOTHING;`,
        don,
        'none'
      );
    }
    console.log(`[3/4] Populated ${donationsData.length} donation records.`);

    // 4. Seed clean requisitions & inventory
    await db.query('DELETE FROM blood_request;', [], 'none');
    const requestsData = [
      [9001, 2001, 5001, 'Karan Patel', 'Ahmedabad', '2026-09-01', 'Accident Trauma ICU', 'Ahmedabad', 'B+', 'Dispatched', 'Emergency', 1001],
      [9002, 2002, 5002, 'Riya Shah', 'Surat', '2026-09-03', 'Severe Postpartum Anemia', 'Surat', 'A+', 'Dispatched', 'Urgent', 1002],
      [9003, 2003, 5003, 'Vivek Desai', 'Vadodara', '2026-09-05', 'Cardiovascular Open Heart Bypass', 'Vadodara', 'O+', 'Pending Match', 'Emergency', null],
      [9004, 2004, 5004, 'Sneha Joshi', 'Rajkot', '2026-09-06', 'Oncology Platelets Need', 'Rajkot', 'AB+', 'Approved/Dispatched', 'Urgent', null],
      [9005, 2005, 5005, 'Manav Mehta', 'Mehsana', '2026-09-07', 'Thalassemia Major Transfusion', 'Mehsana', 'B-', 'Pending Match', 'Routine', null],
      [9006, null, 5001, 'Deepak Sharma', 'Ahmedabad', '2026-09-08', 'Neurosurgery Blood Loss', 'Ahmedabad', 'O-', 'Approved/Dispatched', 'Emergency', null],
      [9007, null, 5002, 'Kailashben Patel', 'Surat', '2026-09-09', 'Acute Hemorrhage Emergency', 'Surat', 'AB-', 'Pending Match', 'Emergency', null],
    ];

    for (const r of requestsData) {
      await db.query(
        `INSERT INTO blood_request (request_id, recipient_id, hospital_id, request_name, request_location, request_date, disease, address, request_blood_group, status, urgency, matched_donor_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (request_id) DO NOTHING;`,
        r,
        'none'
      );
    }

    const invData = [
      [7001, 52, 'B+'],
      [7002, 44, 'A+'],
      [7003, 63, 'O+'],
      [7004, 26, 'AB+'],
      [7005, 36, 'B-'],
      [7006, 29, 'A-'],
      [7007, 86, 'O-'],
      [7008, 18, 'AB-'],
    ];

    for (const inv of invData) {
      await db.query(
        `INSERT INTO blood_inventory (inventory_id, available_blood, blood_group)
         VALUES ($1, $2, $3)
         ON CONFLICT (inventory_id) DO UPDATE SET available_blood = EXCLUDED.available_blood;`,
        inv,
        'none'
      );
    }
    console.log('[4/4] Seeded requisitions and standard cold storage inventories.');

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Rich Dataset successfully seeded into PostgreSQL!');
    console.log('='.repeat(60) + '\n');
    process.exit(0);
  } catch (err) {
    console.error(`[ERROR] Seeding Error: ${err.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  resetAndSeed();
}

module.exports = { resetAndSeed };
