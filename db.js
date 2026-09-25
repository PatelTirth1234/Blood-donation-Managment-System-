/**
 * HemaCare OS / RaktSetu — Enterprise PostgreSQL Database Connector & Pool Manager (Node.js)
 * Provides thread-safe connection pooling, automatic schema migration, seed execution,
 * and health diagnostics in JavaScript / Node.js.
 * 
 * Lead Administrator: Tirth Patel
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
const DB_NAME = process.env.DB_NAME || 'postgres';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
const DATABASE_URL = process.env.DATABASE_URL;
const DB_DEBUG = (process.env.DB_DEBUG || 'false').toLowerCase() === 'true';

// PostgreSQL Connection Pool configuration
const poolConfig = DATABASE_URL
  ? {
      connectionString: DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    }
  : {
      host: DB_HOST,
      port: DB_PORT,
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };

let pool = null;

/**
 * Returns the active PostgreSQL connection pool instance.
 */
function getPool() {
  if (!pool) {
    try {
      pool = new Pool(poolConfig);
      pool.on('error', (err) => {
        console.error('[PostgreSQL Pool Background Error]:', err.message);
      });
    } catch (err) {
      console.error('[PostgreSQL Pool Initialization Error]:', err.message);
      throw err;
    }
  }
  return pool;
}

/**
 * Executes a parameterized SQL query against PostgreSQL.
 * Supports auto-conversion of %s (Python style) if present to $1, $2, ... for maximum backwards compatibility.
 * 
 * @param {string} sql - SQL statement
 * @param {Array|Object} params - Query parameters
 * @param {string} fetchMode - 'all' (default), 'one', or 'none'
 * @param {boolean} commit - Kept for API symmetry
 * @returns {Promise<Array|Object|number>} Query result
 */
async function query(sql, params = [], fetchMode = 'all') {
  const startTime = Date.now();
  const poolInstance = getPool();

  // If params is passed as a single non-array value, convert to array
  let safeParams = Array.isArray(params) ? params : params !== undefined && params !== null ? [params] : [];

  // Convert Python-style '%s' placeholder to Postgres '$1, $2, ...' if present
  let formattedSql = sql;
  if (formattedSql.includes('%s')) {
    let index = 1;
    formattedSql = formattedSql.replace(/%s/g, () => `$${index++}`);
  }

  try {
    const result = await poolInstance.query(formattedSql, safeParams);
    const durationMs = Date.now() - startTime;

    if (DB_DEBUG) {
      console.log(`[PostgreSQL] ${formattedSql.trim().slice(0, 60)}... (${durationMs}ms)`);
    }

    if (fetchMode === 'one') {
      return result.rows.length > 0 ? result.rows[0] : null;
    } else if (fetchMode === 'none') {
      return result.rowCount || 0;
    } else {
      // 'all'
      return result.rows;
    }
  } catch (err) {
    console.error(`[PostgreSQL Query Error]: ${formattedSql.trim().slice(0, 100)} -> ${err.message}`);
    throw err;
  }
}

/**
 * Tests active PostgreSQL database connectivity and runtime version info.
 */
async function testConnection() {
  try {
    const res = await query('SELECT current_database() AS db, current_user AS usr, version() AS ver', [], 'one');
    if (res) {
      return {
        connected: true,
        database: res.db,
        user: res.usr,
        version: res.ver,
      };
    }
    return { connected: false, error: 'No response from database' };
  } catch (err) {
    return {
      connected: false,
      error: err.message,
    };
  }
}

/**
 * Initializes database tables from schema.sql and seeds.sql if not present,
 * and applies any necessary enterprise column migrations.
 */
async function initializeSchemaIfNeeded() {
  try {
    const check = await query("SELECT to_regclass('public.donor') AS exists", [], 'one');
    const baseDir = path.resolve(__dirname);

    if (!check || !check.exists) {
      console.log('[PostgreSQL] Initializing tables from schema.sql...');
      const primaryPath = path.join(baseDir, 'database', 'schema.sql');
      const fallbackPath = path.join(baseDir, 'Blood Donation.sql');

      let targetSqlPath = null;
      if (fs.existsSync(primaryPath)) {
        targetSqlPath = primaryPath;
      } else if (fs.existsSync(fallbackPath)) {
        targetSqlPath = fallbackPath;
      }

      if (targetSqlPath) {
        const sqlContent = fs.readFileSync(targetSqlPath, 'utf-8');
        const poolInstance = getPool();
        const client = await poolInstance.connect();
        try {
          await client.query(sqlContent);
          console.log(`[PostgreSQL] Schema successfully initialized from ${path.basename(targetSqlPath)}.`);
        } finally {
          client.release();
        }

        // Apply seeds if available
        const seedsPath = path.join(baseDir, 'database', 'seeds.sql');
        if (fs.existsSync(seedsPath) && targetSqlPath === primaryPath) {
          const seedsContent = fs.readFileSync(seedsPath, 'utf-8');
          const seedClient = await poolInstance.connect();
          try {
            await seedClient.query(seedsContent);
            console.log('[PostgreSQL] Seed records successfully populated.');
          } finally {
            seedClient.release();
          }
        }
      }
    } else {
      console.log('[PostgreSQL] Database schema verified and active.');
    }

    // Ensure all operational RBAC tables and columns exist
    const schemaMigrations = [
      "ALTER TABLE donor ADD COLUMN IF NOT EXISTS donor_type VARCHAR(30) DEFAULT 'One-Time Donor';",
      "ALTER TABLE donor ADD COLUMN IF NOT EXISTS eligibility_status VARCHAR(30) DEFAULT 'Eligible';",
      "ALTER TABLE donor ADD COLUMN IF NOT EXISTS deferral_reason TEXT DEFAULT '';",
      "ALTER TABLE donor ADD COLUMN IF NOT EXISTS deferral_until DATE;",
      "ALTER TABLE donor ADD COLUMN IF NOT EXISTS latitude NUMERIC(9,6);",
      "ALTER TABLE donor ADD COLUMN IF NOT EXISTS longitude NUMERIC(9,6);",
      "ALTER TABLE donor ADD COLUMN IF NOT EXISTS last_donation_date DATE;",
      "ALTER TABLE donor ADD COLUMN IF NOT EXISTS donation_frequency VARCHAR(50) DEFAULT 'Occasional';",
      "ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS city VARCHAR(50) DEFAULT 'Ahmedabad';",
      "ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS target_units INT DEFAULT 100;",
      "ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS incharge_staff VARCHAR(100) DEFAULT 'Tirth Patel';",
      "ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(20) DEFAULT '9876543210';",
      "ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'Active';",
      "ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';",
      "ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS created_by_role VARCHAR(50) DEFAULT 'Super Administrator';",
      "ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS doctor_reg_no VARCHAR(50) DEFAULT 'GMC-48291';",
      "ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS approval_status VARCHAR(30) DEFAULT 'Approved';",
      "ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS latitude NUMERIC(9,6);",
      "ALTER TABLE blood_donation_camp ADD COLUMN IF NOT EXISTS longitude NUMERIC(9,6);",
      "ALTER TABLE blood_donation_camp ALTER COLUMN time TYPE VARCHAR(50);",
      "ALTER TABLE staff ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'Clinical Staff';",
      "ALTER TABLE staff ADD COLUMN IF NOT EXISTS medical_reg_no VARCHAR(50);",
      "ALTER TABLE staff ADD COLUMN IF NOT EXISTS specialization VARCHAR(100);",
      "ALTER TABLE staff ADD COLUMN IF NOT EXISTS hospital_affiliation VARCHAR(150);",
      "ALTER TABLE staff ADD COLUMN IF NOT EXISTS organization_name VARCHAR(150) DEFAULT 'Red Cross Blood Center';",
      "ALTER TABLE staff ADD COLUMN IF NOT EXISTS assigned_camp_id INT;",
      "ALTER TABLE staff ADD COLUMN IF NOT EXISTS verification_status VARCHAR(30) DEFAULT 'Verified';",
      "ALTER TABLE blood_request ADD COLUMN IF NOT EXISTS dispatch_step VARCHAR(50) DEFAULT 'Pending';",
      "ALTER TABLE blood_request ADD COLUMN IF NOT EXISTS notified_donors JSONB DEFAULT '[]'::jsonb;",
      "ALTER TABLE blood_inventory ADD COLUMN IF NOT EXISTS storage_location VARCHAR(100) DEFAULT 'RACK-MAIN-COLD (+4°C)';",
      "ALTER TABLE blood_inventory ADD COLUMN IF NOT EXISTS expiry_date DATE;",
      `CREATE TABLE IF NOT EXISTS medical_report (
          report_id SERIAL PRIMARY KEY,
          donor_id INT NOT NULL REFERENCES donor(donor_id) ON DELETE CASCADE,
          doctor_id INT REFERENCES staff(staff_id) ON DELETE SET NULL,
          camp_id INT REFERENCES blood_donation_camp(organization_id) ON DELETE SET NULL,
          hospital_id INT REFERENCES hospital(hospital_id) ON DELETE SET NULL,
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
      );`,
      `CREATE TABLE IF NOT EXISTS camp_registration (
          registration_id SERIAL PRIMARY KEY,
          camp_id INT NOT NULL REFERENCES blood_donation_camp(organization_id) ON DELETE CASCADE,
          donor_id INT NOT NULL REFERENCES donor(donor_id) ON DELETE CASCADE,
          registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
          appointment_time VARCHAR(50) DEFAULT '10:00 AM',
          status VARCHAR(30) DEFAULT 'Registered',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT unique_camp_donor UNIQUE (camp_id, donor_id)
      );`,
      `CREATE TABLE IF NOT EXISTS notification (
          notification_id SERIAL PRIMARY KEY,
          user_id INT,
          user_role VARCHAR(50) NOT NULL,
          title VARCHAR(150) NOT NULL,
          message TEXT NOT NULL,
          type VARCHAR(50) DEFAULT 'info',
          is_read BOOLEAN DEFAULT FALSE,
          link VARCHAR(100) DEFAULT '',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );`
    ];

    for (const stmt of schemaMigrations) {
      try {
        await query(stmt, [], 'none');
      } catch (migrationErr) {
        // Suppress benign migration warnings (e.g. column already exists or table exists)
      }
    }
  } catch (err) {
    console.warn(`[PostgreSQL Schema Init Warning]: ${err.message}`);
  }
}

/**
 * Manually populates database seed records from seeds.sql.
 */
async function seedDatabase() {
  try {
    const baseDir = path.resolve(__dirname);
    const seedsPath = path.join(baseDir, 'database', 'seeds.sql');
    if (fs.existsSync(seedsPath)) {
      const seedsContent = fs.readFileSync(seedsPath, 'utf-8');
      const poolInstance = getPool();
      const client = await poolInstance.connect();
      try {
        await client.query(seedsContent);
        console.log('[PostgreSQL] Database seeds applied successfully.');
      } finally {
        client.release();
      }
    }
  } catch (err) {
    console.error(`[PostgreSQL Seed Error]: ${err.message}`);
  }
}

module.exports = {
  getPool,
  query,
  testConnection,
  initializeSchemaIfNeeded,
  seedDatabase,
};

if (require.main === module) {
  testConnection().then((diag) => {
    console.log('PostgreSQL Diagnostic:', diag);
    process.exit(diag.connected ? 0 : 1);
  });
}
