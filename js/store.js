/**
 * HemaCare OS — Clinical State Store & Offline Cache
 * Reactive in-memory store synchronized with PostgreSQL Database.
 */

(function(window) {
  'use strict';

  const CITY_COORDINATES = {
    'Ahmedabad': { lat: 23.0225, lon: 72.5714 },
    'Surat': { lat: 21.1702, lon: 72.8311 },
    'Vadodara': { lat: 22.3072, lon: 73.1812 },
    'Rajkot': { lat: 22.3039, lon: 70.8022 },
    'Mehsana': { lat: 23.5880, lon: 72.3693 },
    'Gandhinagar': { lat: 23.2156, lon: 72.6369 },
    'Bhavnagar': { lat: 21.7645, lon: 72.1519 },
    'Jamnagar': { lat: 22.4707, lon: 70.0577 },
    'Anand': { lat: 22.5645, lon: 72.9289 }
  };

  const DEFAULT_STORE = {
    currentUser: {
      id: 1,
      name: 'Tirth Patel',
      email: 'admin@hemacare.org',
      role: 'Super Admin',
      avatar: 'TP',
      city: 'Ahmedabad',
      phone: '9876543210',
      organization: 'HemaCare OS Master HQ',
      title: 'Global System Administrator'
    },
    isAuthenticated: true,
    userLocation: {
      city: 'Ahmedabad',
      lat: 23.0225,
      lon: 72.5714
    },
    activeCampId: 6004,
    activeCamp: {
      id: 6004,
      name: 'Youth Rotary Blood Drive',
      date: '2026-09-15',
      time: '10:30 AM - 04:30 PM',
      location: 'Rajkot Sports Complex, Race Course',
      city: 'Rajkot',
      targetUnits: 110,
      collectedUnits: 42,
      inchargeStaff: 'Meera Joshi',
      phone: '9876543204',
      status: 'Active',
      notes: 'Live ongoing drive with walk-in intake active',
      doctorRegNo: 'GMC-48291',
      distanceKm: 215.0
    },
    donors: [
      { id: 1001, name: 'Rahul Sharma', address: 'A-101 Green Residency, Navrangpura', city: 'Ahmedabad', phone: '9876543210', age: 24, bloodGroup: 'O+', disease: 'None', email: 'rahul.sharma@donor.org', gender: 'Male', donorType: 'Permanent Donor', eligibilityStatus: 'Eligible', deferralReason: '', lastDonationDate: '2026-06-15', donationFrequency: 'Every 3 Months', donationsCount: 4 },
      { id: 1002, name: 'Rahul Shah', address: 'B-202 Shyam Society, Adajan', city: 'Surat', phone: '9876543211', age: 24, bloodGroup: 'A+', disease: 'None', email: 'rahul.shah@gmail.com', gender: 'Male', donorType: 'Permanent Donor', eligibilityStatus: 'Eligible', deferralReason: '', lastDonationDate: '2026-07-20', donationFrequency: 'Every 3 Months', donationsCount: 3 },
      { id: 1003, name: 'Priya Desai', address: 'C-303 Park Avenue, Alkapuri', city: 'Vadodara', phone: '9876543212', age: 22, bloodGroup: 'O+', disease: 'None', email: 'priya.desai@gmail.com', gender: 'Female', donorType: 'Permanent Donor', eligibilityStatus: 'Eligible', deferralReason: '', lastDonationDate: '2026-05-10', donationFrequency: 'Every 4 Months', donationsCount: 4 },
      { id: 1004, name: 'Neha Patel', address: 'D-404 Sunrise Society, Kalawad Road', city: 'Rajkot', phone: '9876543213', age: 20, bloodGroup: 'AB+', disease: 'None', email: 'neha.patel@gmail.com', gender: 'Female', donorType: 'One-Time Donor', eligibilityStatus: 'Eligible', deferralReason: '', lastDonationDate: '2026-08-01', donationFrequency: 'Occasional', donationsCount: 1 },
      { id: 1005, name: 'Amit Joshi', address: 'E-505 Lake View, Highway Road', city: 'Mehsana', phone: '9876543214', age: 26, bloodGroup: 'B-', disease: 'Mild Anemia', email: 'amit.joshi@gmail.com', gender: 'Male', donorType: 'Permanent Donor', eligibilityStatus: 'Temporarily Ineligible', deferralReason: 'Mild Anemia (Hb < 12.5 g/dL)', deferralUntil: '2026-10-01', lastDonationDate: '2026-04-12', donationFrequency: 'Every 3 Months', donationsCount: 5 },
      { id: 1006, name: 'Ananya Trivedi', address: 'Sector 7/B, Infocity', city: 'Gandhinagar', phone: '9876543215', age: 23, bloodGroup: 'A-', disease: 'None', email: 'ananya.trivedi@gmail.com', gender: 'Female', donorType: 'One-Time Donor', eligibilityStatus: 'Eligible', deferralReason: '', lastDonationDate: '2026-03-10', donationFrequency: 'Occasional', donationsCount: 2 },
      { id: 1007, name: 'Harshil Vora', address: 'Nilambag Circle, High Court Road', city: 'Bhavnagar', phone: '9876543216', age: 29, bloodGroup: 'O-', disease: 'None', email: 'harshil.vora@gmail.com', gender: 'Male', donorType: 'Permanent Donor', eligibilityStatus: 'Eligible', deferralReason: '', lastDonationDate: '2026-06-25', donationFrequency: 'Every 3 Months', donationsCount: 6 },
      { id: 1008, name: 'Kavita Rao', address: 'G-12 Royal Arcade, Ring Road', city: 'Surat', phone: '9876543217', age: 27, bloodGroup: 'AB-', disease: 'None', email: 'kavita.rao@gmail.com', gender: 'Female', donorType: 'One-Time Donor', eligibilityStatus: 'Eligible', deferralReason: '', lastDonationDate: '2026-02-18', donationFrequency: 'Occasional', donationsCount: 1 }
    ],
    inventory: [
      { id: 7001, bloodGroup: 'B+', units: 50, capacity: 80, expiringSoon: 2, rack: 'RACK-B1-COLD (+4°C)', expiryDate: '2026-10-25', lastUpdated: 'Today', status: 'Optimal' },
      { id: 7002, bloodGroup: 'A+', units: 40, capacity: 70, expiringSoon: 1, rack: 'RACK-A2-COLD (+4°C)', expiryDate: '2026-10-18', lastUpdated: 'Today', status: 'Optimal' },
      { id: 7003, bloodGroup: 'O+', units: 60, capacity: 100, expiringSoon: 3, rack: 'RACK-O1-COLD (+4°C)', expiryDate: '2026-10-28', lastUpdated: 'Today', status: 'Optimal' },
      { id: 7004, bloodGroup: 'AB+', units: 25, capacity: 50, expiringSoon: 0, rack: 'RACK-AB1-COLD (+4°C)', expiryDate: '2026-10-12', lastUpdated: 'Today', status: 'Optimal' },
      { id: 7005, bloodGroup: 'B-', units: 35, capacity: 60, expiringSoon: 1, rack: 'RACK-B2-COLD (+4°C)', expiryDate: '2026-10-15', lastUpdated: 'Today', status: 'Low' },
      { id: 7006, bloodGroup: 'A-', units: 28, capacity: 50, expiringSoon: 2, rack: 'RACK-A1-COLD (+4°C)', expiryDate: '2026-10-09', lastUpdated: 'Today', status: 'Low' },
      { id: 7007, bloodGroup: 'O-', units: 85, capacity: 120, expiringSoon: 4, rack: 'RACK-O2-EMERGENCY (+4°C)', expiryDate: '2026-10-30', lastUpdated: 'Today', status: 'Optimal' },
      { id: 7008, bloodGroup: 'AB-', units: 22, capacity: 50, expiringSoon: 1, rack: 'RACK-AB2-COLD (+4°C)', expiryDate: '2026-10-05', lastUpdated: 'Today', status: 'Critical' }
    ],
    requests: [
      { id: 9001, patientName: 'Karan Patel', hospitalId: 5001, hospitalName: 'Civil Hospital', location: 'Ahmedabad', date: '2026-08-02', disease: 'Accident Trauma', bloodGroup: 'B+', urgency: 'Emergency', unitsRequested: 4, status: 'Dispatched (Cold Chain Transit)', dispatchStep: 'Step 2: Cold Storage Inventory', dispatchTracking: 'DISP-GUJ-9001' },
      { id: 9002, patientName: 'Riya Shah', hospitalId: 5002, hospitalName: 'Apollo Hospital', location: 'Surat', date: '2026-08-06', disease: 'Severe Anemia', bloodGroup: 'A+', urgency: 'Urgent', unitsRequested: 2, status: 'Dispatched (Cold Chain Transit)', dispatchStep: 'Step 2: Cold Storage Inventory', dispatchTracking: 'DISP-GUJ-9002' },
      { id: 9003, patientName: 'Vivek Desai', hospitalId: 5003, hospitalName: 'Sterling Hospital', location: 'Vadodara', date: '2026-08-11', disease: 'Cardiovascular Surgery', bloodGroup: 'O+', urgency: 'Emergency', unitsRequested: 3, status: 'Pending Central Review', dispatchStep: 'Step 3: Permanent Donors Notified' },
      { id: 9004, patientName: 'Sneha Joshi', hospitalId: 5004, hospitalName: 'Wockhardt Hospital', location: 'Rajkot', date: '2026-08-16', disease: 'Oncology Platelets', bloodGroup: 'AB+', urgency: 'Urgent', unitsRequested: 2, status: 'Pending Central Review', dispatchStep: 'Step 3: Permanent Donors Notified' },
      { id: 9005, patientName: 'Manav Mehta', hospitalId: 5005, hospitalName: 'Zydus Hospital', location: 'Mehsana', date: '2026-08-21', disease: 'Thalassemia Major', bloodGroup: 'B-', urgency: 'Routine', unitsRequested: 1, status: 'Pending Central Review', dispatchStep: 'Step 4: All Donors Broadcasted' }
    ],
    camps: [
      { id: 6001, name: 'Red Cross Mega Blood Drive', date: '2026-08-01', time: '10:00 AM - 04:00 PM', location: 'Ahmedabad Main Ground, Navrangpura', city: 'Ahmedabad', targetUnits: 120, collectedUnits: 88, inchargeStaff: 'Meera Joshi', phone: '9876543204', status: 'Completed', notes: 'Red Cross Ahmedabad & Gujarat University Drive', doctorRegNo: 'GMC-48291', distanceKm: 2.1 },
      { id: 6002, name: 'Life Care Community Camp', date: '2026-08-05', time: '09:30 AM - 03:30 PM', location: 'Surat Community Hall, Adajan', city: 'Surat', targetUnits: 90, collectedUnits: 65, inchargeStaff: 'Pooja Shah', phone: '9876500002', status: 'Completed', notes: 'Corporate and voluntary youth drive', doctorRegNo: 'GMC-48291', distanceKm: 260.0 },
      { id: 6003, name: 'MS University Health Drive', date: '2026-08-10', time: '11:00 AM - 05:00 PM', location: 'MS University Campus, Sayajigunj', city: 'Vadodara', targetUnits: 150, collectedUnits: 120, inchargeStaff: 'Dr. Rakesh Patel', phone: '9876500001', status: 'Completed', notes: 'Campus mobile collection van', doctorRegNo: 'GMC-48291', distanceKm: 110.0 },
      { id: 6004, name: 'Youth Rotary Blood Drive', date: '2026-09-15', time: '10:30 AM - 04:30 PM', location: 'Rajkot Sports Complex, Race Course', city: 'Rajkot', targetUnits: 110, collectedUnits: 42, inchargeStaff: 'Meera Joshi', phone: '9876543204', status: 'Active', notes: 'Live ongoing drive with emergency donor queue', doctorRegNo: 'GMC-48291', distanceKm: 215.0 },
      { id: 6005, name: 'Save Life Civic Drive', date: '2026-09-22', time: '09:00 AM - 02:00 PM', location: 'Mehsana Civic Center, Highway Road', city: 'Mehsana', targetUnits: 100, collectedUnits: 0, inchargeStaff: 'Meera Joshi', phone: '9876543204', status: 'Upcoming', notes: 'Pre-screened community volunteers', doctorRegNo: 'GMC-48291', distanceKm: 75.0 }
    ],
    medicalReports: [
      { reportId: 801, donorId: 1001, donorName: 'Rahul Sharma', bloodGroup: 'O+', reportDate: '2026-08-15', hemoglobin: 14.8, bloodPressure: '120/80', pulse: 72, weightKg: 68.5, eligibilityStatus: 'Eligible', deferralReason: '', doctorNotes: 'Excellent clinical vitals. Cleared for whole blood donation.', doctorName: 'Dr. Rakesh Patel', doctorRegNo: 'GMC-48291' },
      { reportId: 802, donorId: 1002, donorName: 'Rahul Shah', bloodGroup: 'A+', reportDate: '2026-08-10', hemoglobin: 13.9, bloodPressure: '122/78', pulse: 76, weightKg: 64.0, eligibilityStatus: 'Eligible', deferralReason: '', doctorNotes: 'Normal physiological parameters. Hemoglobin adequate.', doctorName: 'Dr. Rakesh Patel', doctorRegNo: 'GMC-48291' },
      { reportId: 803, donorId: 1003, donorName: 'Priya Desai', bloodGroup: 'O+', reportDate: '2026-07-28', hemoglobin: 14.2, bloodPressure: '118/76', pulse: 70, weightKg: 58.0, eligibilityStatus: 'Eligible', deferralReason: '', doctorNotes: 'Screened and verified. Good component profile.', doctorName: 'Dr. Rakesh Patel', doctorRegNo: 'GMC-48291' },
      { reportId: 804, donorId: 1005, donorName: 'Amit Joshi', bloodGroup: 'B-', reportDate: '2026-09-01', hemoglobin: 11.8, bloodPressure: '124/82', pulse: 78, weightKg: 62.0, eligibilityStatus: 'Temporarily Ineligible', deferralReason: 'Mild Anemia (Hb < 12.5 g/dL)', deferralUntil: '2026-10-01', doctorNotes: 'Prescribed oral iron therapy. Re-evaluation in 30 days.', doctorName: 'Dr. Rakesh Patel', doctorRegNo: 'GMC-48291' }
    ],
    campRegistrations: [
      { registrationId: 501, campId: 6004, campName: 'Youth Rotary Blood Drive', donorId: 1001, donorName: 'Rahul Sharma', appointmentTime: '11:00 AM', status: 'Confirmed', campDate: '2026-09-15', city: 'Rajkot' },
      { registrationId: 502, campId: 6004, campName: 'Youth Rotary Blood Drive', donorId: 1004, donorName: 'Neha Patel', appointmentTime: '11:30 AM', status: 'Registered', campDate: '2026-09-15', city: 'Rajkot' },
      { registrationId: 503, campId: 6005, campName: 'Save Life Civic Drive', donorId: 1005, donorName: 'Amit Joshi', appointmentTime: '10:00 AM', status: 'Registered', campDate: '2026-09-22', city: 'Mehsana' }
    ],
    notifications: [
      { id: 1, userRole: 'Blood Donor', title: 'Camp Registration Confirmed', message: 'Your appointment for Youth Rotary Blood Drive on Sep 15, 2026 (11:00 AM) is confirmed.', type: 'success', isRead: false, timestamp: '10 mins ago' },
      { id: 2, userRole: 'Blood Donor', title: 'Upcoming Donation Reminder', message: 'You are eligible to donate whole blood! Red Cross Mega Drive is nearby in Ahmedabad.', type: 'info', isRead: false, timestamp: '1 hour ago' },
      { id: 3, userRole: 'Doctor', title: 'New Screening Report Uploaded', message: 'Clinical screening report for Rahul Shah (#1002) is pending final verification.', type: 'warning', isRead: false, timestamp: '2 hours ago' },
      { id: 4, userRole: 'Doctor', title: 'Emergency Blood Match Found', message: 'Patient Karan Patel (B+) matched with 3 nearby permanent donors in Ahmedabad.', type: 'critical', isRead: false, timestamp: '3 hours ago' },
      { id: 5, userRole: 'Blood Bank Staff', title: 'Inventory Low Alert: O- Negative', message: 'O Negative reserves have dropped below 30 Units safe threshold. Auto-dispatch active.', type: 'warning', isRead: false, timestamp: '4 hours ago' },
      { id: 6, userRole: 'Blood Bank Staff', title: 'New Camp Registration Received', message: 'Donor Rahul Sharma (#1001) registered for Camp #6004 appointment.', type: 'info', isRead: false, timestamp: '5 hours ago' },
      { id: 7, userRole: 'Hospital Coordinator', title: 'Dispatched Consignment Transit', message: 'Consignment DISP-GUJ-9001 (4 Units B+) en route via cold chain. Confirmation required on arrival.', type: 'info', isRead: false, timestamp: '15 mins ago' },
      { id: 8, userRole: 'Camp Organizer', title: 'Active Camp Live Roster Open', message: 'Camp #6004 walk-in portal active. 42 Units collected toward 110 Unit target.', type: 'success', isRead: false, timestamp: '30 mins ago' },
      { id: 9, userRole: 'Super Admin', title: 'Security Audit & RBAC Cleared', message: 'Central Node connected with 6 active role domains and audited telemetry.', type: 'success', isRead: false, timestamp: 'Just now' }
    ],
    staff: [
      { id: 1, name: 'Tirth Patel', phone: '9876543210', email: 'admin@hemacare.org', role: 'Super Admin', organization: 'HemaCare OS Master HQ' },
      { id: 1001, name: 'Kavita Patel', phone: '9876543210', email: 'kavita.staff@raktsetu.org', role: 'Blood Bank Staff', organization: 'Apex Central Blood Bank' },
      { id: 2001, name: 'Anil Shah', phone: '9876543205', email: 'coordinator.hospital@civil.org', role: 'Hospital Coordinator', organization: 'Civil Hospital Ahmedabad' },
      { id: 2002, name: 'Meera Joshi', phone: '9876543204', email: 'organizer.meera@redcross.org', role: 'Camp Organizer', organization: 'Red Cross Society Gujarat' },
      { id: 3001, name: 'Dr. Rakesh Patel', phone: '9876543201', email: 'dr.rakesh@civilhospital.in', role: 'Doctor', medicalRegNo: 'GMC-48291', specialization: 'Transfusion Medicine' }
    ],
    hospitals: [
      { id: 5001, name: 'Civil Hospital', city: 'Ahmedabad', address: 'Asarwa, Ahmedabad', coordinator: 'Anil Shah', contact: '9876543205' },
      { id: 5002, name: 'Apollo Hospital', city: 'Surat', address: 'Bhat, Surat', coordinator: 'Sunil Rao', contact: '9876543206' },
      { id: 5003, name: 'Sterling Hospital', city: 'Vadodara', address: 'Race Course, Vadodara', coordinator: 'Jatin Trivedi', contact: '9876543207' },
      { id: 5004, name: 'Wockhardt Hospital', city: 'Rajkot', address: 'Kalawad Road, Rajkot', coordinator: 'Bhavin Shah', contact: '9876543208' },
      { id: 5005, name: 'Zydus Hospital', city: 'Mehsana', address: 'Highway Road, Mehsana', coordinator: 'Chetan Dave', contact: '9876543209' }
    ],
    recipients: [
      { id: 2001, name: 'Karan Patel', bloodGroup: 'B+', disease: 'Accident Trauma' },
      { id: 2002, name: 'Riya Shah', bloodGroup: 'A+', disease: 'Severe Anemia' },
      { id: 2003, name: 'Vivek Desai', bloodGroup: 'O+', disease: 'Cardiovascular Surgery' },
      { id: 2004, name: 'Sneha Joshi', bloodGroup: 'AB+', disease: 'Oncology Platelets' },
      { id: 2005, name: 'Manav Mehta', bloodGroup: 'B-', disease: 'Thalassemia Major' }
    ],
    auditLogs: [
      { timestamp: '2026-09-19 12:55:10', operator: 'Tirth Patel', event: 'RBAC_SECURITY_MATRIX_DEPLOYED', module: 'SuperAdmin', hash: 'f9a2c44298fc1c149afbf4c8', status: 'COMPLIANT' },
      { timestamp: '2026-09-19 12:40:18', operator: 'Anil Shah', event: 'HOSPITAL_STOCK_REQUISITION_FILED', module: 'HospitalCoordination', hash: 'e3b0c44298fc1c149afbf4c8', status: 'COMPLIANT' },
      { timestamp: '2026-09-19 12:22:04', operator: 'Meera Joshi', event: 'CAMP_ONGOING_WALKIN_REGISTERED', module: 'CampIntake', hash: '8f434346648f6b96df89dda9', status: 'VERIFIED' },
      { timestamp: '2026-09-19 11:45:10', operator: 'Kavita Patel', event: 'COLD_CHAIN_TELEMETRY_LOG', module: 'Inventory', hash: '4b227777d4dd1fc61c6f884f', status: 'COMPLIANT' },
      { timestamp: '2026-09-19 11:22:04', operator: 'Dr. Rakesh Patel', event: 'CLINICAL_SCREENING_CLEARED', module: 'MedicalReview', hash: 'ca978112ca1bbdcafac231b3', status: 'VALIDATED' }
    ]
  };

  let localStore = null;
  const isExplicitLoggedOut = localStorage.getItem('hemacare_session_active') === 'false';

  try {
    const stored = localStorage.getItem('hemacare_clinical_store') || localStorage.getItem('raktsetu_clinical_store');
    localStore = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(DEFAULT_STORE));
    
    if (isExplicitLoggedOut) {
      localStore.isAuthenticated = false;
      localStore.currentUser = null;
    } else {
      localStore.isAuthenticated = true;
      if (!localStore.currentUser) {
        localStore.currentUser = JSON.parse(JSON.stringify(DEFAULT_STORE.currentUser));
      }
    }
  } catch (e) {
    localStore = JSON.parse(JSON.stringify(DEFAULT_STORE));
    localStore.isAuthenticated = !isExplicitLoggedOut;
    if (isExplicitLoggedOut) {
      localStore.currentUser = null;
    }
  }

  function saveStore() {
    try {
      localStorage.setItem('hemacare_clinical_store', JSON.stringify(localStore));
    } catch (e) {
      console.error('[HemaCare Store] LocalStorage save error', e);
    }
  }

  // Export to global window
  window.localStore = localStore;
  window.saveStore = saveStore;
  window.DEFAULT_STORE = DEFAULT_STORE;
  window.CITY_COORDINATES = CITY_COORDINATES;

})(window);
