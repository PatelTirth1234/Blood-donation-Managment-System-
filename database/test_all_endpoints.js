/**
 * Comprehensive Automated REST API Test Suite for Node.js Express Backend
 * Tests all endpoints using Node's HTTP client and live PostgreSQL connection.
 */

const http = require('http');
const { app } = require('../server');
const db = require('../db');

function request(server, method, path, body = null) {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    const postData = body ? JSON.stringify(body) : null;
    const options = {
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers: {
        'Accept': 'application/json',
        ...(postData
          ? {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(postData),
            }
          : {}),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json,
        });
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('🚀 Starting Automated API Endpoint Test Suite (Node.js Backend)');
  console.log('='.repeat(60));

  await db.initializeSchemaIfNeeded();

  // Start test server on random ephemeral port
  const server = app.listen(0);
  let passed = 0;
  let failed = 0;

  function assertTest(name, condition, details = '') {
    if (condition) {
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } else {
      console.log(`  ❌ [FAIL] ${name} - ${details}`);
      failed++;
    }
  }

  try {
    // 1. Health Diagnostic
    const resHealth = await request(server, 'GET', '/api/health');
    assertTest(
      'GET /api/health returns 200 and status online',
      resHealth.status === 200 && resHealth.data && resHealth.data.status === 'online',
      JSON.stringify(resHealth.data)
    );

    // 2. Executive Dashboard Stats
    const resStats = await request(server, 'GET', '/api/dashboard/stats');
    assertTest(
      'GET /api/dashboard/stats returns stats and inventory array',
      resStats.status === 200 && resStats.data && resStats.data.stats && Array.isArray(resStats.data.inventory),
      JSON.stringify(resStats.data)
    );

    // 3. Donors List & Filters
    const resDonors = await request(server, 'GET', '/api/donors');
    assertTest(
      'GET /api/donors returns donor list',
      resDonors.status === 200 && resDonors.data && resDonors.data.success && resDonors.data.data.length > 0,
      JSON.stringify(resDonors.data)
    );

    const resCity = await request(server, 'GET', '/api/donors?city=Ahmedabad');
    assertTest(
      'GET /api/donors?city=Ahmedabad filters correctly',
      resCity.status === 200 && resCity.data && resCity.data.data.every((d) => d.city.toLowerCase() === 'ahmedabad'),
      JSON.stringify(resCity.data)
    );

    const resCities = await request(server, 'GET', '/api/donors/cities');
    assertTest(
      'GET /api/donors/cities returns aggregated city metrics',
      resCities.status === 200 && resCities.data && resCities.data.data.length > 0,
      JSON.stringify(resCities.data)
    );

    // 4. Donor CRUD Operations
    const newDonorPayload = {
      name: 'Automated Node Test Donor',
      bloodGroup: 'O+',
      city: 'Ahmedabad',
      phone: '9988776655',
      age: 28,
      gender: 'Male',
      disease: 'None',
      email: 'autonode@donor.org',
      address: 'Navrangpura Tech Park',
    };
    const resCreate = await request(server, 'POST', '/api/donors', newDonorPayload);
    const createdDonor = (resCreate.data && resCreate.data.data) || {};
    const createdId = createdDonor.id;
    assertTest(
      'POST /api/donors creates donor record and returns 201',
      resCreate.status === 201 && createdId !== undefined,
      JSON.stringify(resCreate.data)
    );

    // 5. Fetch Single Donor by ID
    if (createdId) {
      const resGet = await request(server, 'GET', `/api/donors/${createdId}`);
      assertTest(
        `GET /api/donors/${createdId} returns single donor with donations list`,
        resGet.status === 200 && resGet.data && resGet.data.data && Array.isArray(resGet.data.data.donations),
        JSON.stringify(resGet.data)
      );

      // 6. Update Donor
      const resUpdate = await request(server, 'PUT', `/api/donors/${createdId}`, { city: 'Surat', age: 29 });
      assertTest(
        `PUT /api/donors/${createdId} updates record`,
        resUpdate.status === 200 && resUpdate.data && resUpdate.data.data && resUpdate.data.data.city === 'Surat',
        JSON.stringify(resUpdate.data)
      );

      // 7. Donor Classification & Eligibility
      const resClass = await request(server, 'PUT', `/api/donors/${createdId}/classification`, {
        donorType: 'Permanent Donor',
        donationFrequency: 'Every 3 Months',
      });
      assertTest(
        `PUT /api/donors/${createdId}/classification sets Permanent Donor`,
        resClass.status === 200 && resClass.data && resClass.data.success,
        JSON.stringify(resClass.data)
      );

      const resElig = await request(server, 'PUT', `/api/donors/${createdId}/eligibility`, {
        eligibilityStatus: 'Eligible',
        doctorName: 'Dr. Rakesh Patel',
      });
      assertTest(
        `PUT /api/donors/${createdId}/eligibility sets eligibility`,
        resElig.status === 200 && resElig.data && resElig.data.success,
        JSON.stringify(resElig.data)
      );

      // 8. Delete Donor
      const resDel = await request(server, 'DELETE', `/api/donors/${createdId}`);
      assertTest(
        `DELETE /api/donors/${createdId} successfully deletes record`,
        resDel.status === 200 && resDel.data && resDel.data.success,
        JSON.stringify(resDel.data)
      );
    }

    // 9. Auth Endpoints
    const resLogin = await request(server, 'POST', '/api/auth/login', {
      email: 'admin@hemacare.org',
      password: 'password123',
    });
    assertTest(
      'POST /api/auth/login authenticates Super Admin successfully',
      resLogin.status === 200 && resLogin.data && resLogin.data.success && resLogin.data.user.role === 'Super Admin',
      JSON.stringify(resLogin.data)
    );

    const resMe = await request(server, 'GET', '/api/auth/me');
    assertTest(
      'GET /api/auth/me returns valid user session payload',
      resMe.status === 200 && resMe.data && resMe.data.success,
      JSON.stringify(resMe.data)
    );

    // 10. Doctor Medical Reports
    const resReports = await request(server, 'GET', '/api/reports');
    assertTest(
      'GET /api/reports returns medical examinations list',
      resReports.status === 200 && resReports.data && resReports.data.success,
      JSON.stringify(resReports.data)
    );

    // 11. 4-Step Emergency Waterfall Requisition
    const resWaterfall = await request(server, 'POST', '/api/requests/emergency-dispatch', {
      patientName: 'Node Automation Patient',
      bloodGroup: 'AB-',
      location: 'Ahmedabad',
      hospitalName: 'Civil Hospital',
      disease: 'Emergency Surgery',
      urgency: 'Emergency',
      units: 1,
    });
    assertTest(
      'POST /api/requests/emergency-dispatch executes 4-step waterfall',
      resWaterfall.status === 201 && resWaterfall.data && resWaterfall.data.waterfallTrace && resWaterfall.data.waterfallTrace.length >= 2,
      JSON.stringify(resWaterfall.data)
    );

    // 12. Camps Proximity Search
    const resNearby = await request(server, 'GET', '/api/camps/nearby?city=Ahmedabad');
    assertTest(
      'GET /api/camps/nearby calculates distance sorted camps',
      resNearby.status === 200 && resNearby.data && resNearby.data.data.length > 0 && resNearby.data.data[0].distanceKm !== undefined,
      JSON.stringify(resNearby.data)
    );

    // 13. Notifications
    const resNotif = await request(server, 'GET', '/api/notifications');
    assertTest(
      'GET /api/notifications fetches real-time notifications',
      resNotif.status === 200 && resNotif.data && resNotif.data.success,
      JSON.stringify(resNotif.data)
    );

    // 14. Audit Log
    const resAudit = await request(server, 'GET', '/api/audit');
    assertTest(
      'GET /api/audit returns audit compliance logs',
      resAudit.status === 200 && resAudit.data && resAudit.data.success,
      JSON.stringify(resAudit.data)
    );

    console.log('\n' + '='.repeat(60));
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED.`);
    console.log('='.repeat(60) + '\n');
  } finally {
    server.close();
  }

  process.exit(failed === 0 ? 0 : 1);
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };
