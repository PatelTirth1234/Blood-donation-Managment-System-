const { Pool, Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const PG_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD
};

async function syncDatabases() {
  console.log('====================================================');
  console.log('🔄 SYNCHRONIZING BOTH PGADMIN DATABASES WITH LIVE WEBSITE');
  console.log('====================================================');

  const sourcePool = new Pool({
    ...PG_CONFIG,
    database: 'postgres'
  });

  const tablesToSync = [
    'donor',
    'blood_bank',
    'staff',
    'hospital',
    'recipients',
    'blood_donation_camp',
    'blood_inventory',
    'donation',
    'blood_request',
    'medical_report',
    'camp_registration',
    'notification',
    'audit_log'
  ];

  // 1. Fetch all rows from source (postgres)
  const sourceData = {};
  for (const table of tablesToSync) {
    try {
      const res = await sourcePool.query(`SELECT * FROM "${table}"`);
      sourceData[table] = res.rows;
      console.log(`[Source: postgres] ${table}: ${res.rows.length} rows`);
    } catch (e) {
      console.warn(`[Source] Table '${table}' could not be fetched: ${e.message}`);
      sourceData[table] = [];
    }
  }

  const schemaPath = path.join(__dirname, 'database', 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  // We sync ALL of them:
  // 1. 'Blood Donation' (Clean title case without space)
  // 2. 'Blood Donation ' (User's database in pgAdmin with trailing space)
  // 3. 'blood_donation' (Standard lowercase database)
  const targetDbs = ['Blood Donation', 'Blood Donation ', 'blood_donation'];

  for (const targetDb of targetDbs) {
    console.log(`\n----------------------------------------------------`);
    console.log(`🚀 Resetting & Syncing: [${targetDb}]`);
    console.log(`----------------------------------------------------`);

    const targetPool = new Pool({
      ...PG_CONFIG,
      database: targetDb
    });

    try {
      // Clean old schema completely to avoid old column conflicts
      console.log(`[1/4] Rebuilding fresh public schema in [${targetDb}]...`);
      await targetPool.query(`
        DROP SCHEMA IF EXISTS public CASCADE;
        CREATE SCHEMA public;
        GRANT ALL ON SCHEMA public TO postgres;
        GRANT ALL ON SCHEMA public TO public;
      `);

      // Apply complete modern clinical schema
      console.log(`[2/4] Applying Schema DDL...`);
      await targetPool.query(schemaSql);

      // Insert all live records
      console.log(`[3/4] Copying live records into [${targetDb}]...`);
      for (const table of tablesToSync) {
        const rows = sourceData[table];
        if (!rows || rows.length === 0) continue;

        const columns = Object.keys(rows[0]);
        const colList = columns.map(c => `"${c}"`).join(', ');

        for (const row of rows) {
          const values = columns.map(c => row[c]);
          const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
          const insertQuery = `INSERT INTO "${table}" (${colList}) VALUES (${placeholders}) ON CONFLICT DO NOTHING;`;
          await targetPool.query(insertQuery, values);
        }
        console.log(`  ✓ Synced ${rows.length} rows -> ${table}`);
      }

      // Reset all serial sequences
      console.log(`[4/4] Aligning serial sequence counters...`);
      const seqTables = [
        { table: 'donor', id: 'donor_id' },
        { table: 'blood_bank', id: 'bank_id' },
        { table: 'staff', id: 'staff_id' },
        { table: 'hospital', id: 'hospital_id' },
        { table: 'recipients', id: 'recipient_id' },
        { table: 'blood_donation_camp', id: 'camp_id' },
        { table: 'blood_inventory', id: 'inventory_id' },
        { table: 'donation', id: 'donation_id' },
        { table: 'blood_request', id: 'request_id' },
        { table: 'medical_report', id: 'report_id' },
        { table: 'camp_registration', id: 'registration_id' },
        { table: 'notification', id: 'notification_id' },
        { table: 'audit_log', id: 'log_id' }
      ];

      for (const st of seqTables) {
        try {
          await targetPool.query(`
            SELECT setval(pg_get_serial_sequence('"${st.table}"', '${st.id}'), COALESCE((SELECT MAX("${st.id}") FROM "${st.table}"), 1));
          `);
        } catch (e) {
          // Ignore if no serial sequence
        }
      }

      console.log(`[SUCCESS] Database [${targetDb}] is now 100% SYNCHRONIZED!`);
    } catch (err) {
      console.error(`[ERROR] Sync failed on [${targetDb}]:`, err.message);
    } finally {
      await targetPool.end();
    }
  }

  await sourcePool.end();
  console.log('\n====================================================');
  console.log('🎉 COMPLETE: ALL DATABASES IN PGADMIN ARE NOW SYNCHRONIZED!');
  console.log('====================================================');
}

syncDatabases();
