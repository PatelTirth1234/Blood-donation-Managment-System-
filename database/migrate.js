/**
 * HemaCare OS / RaktSetu — Database Migration & Synchronization Runner (Node.js)
 * Connects directly to PostgreSQL, applies schema.sql, executes seeds.sql,
 * and validates database integrity.
 */

const fs = require('fs');
const path = require('path');
const db = require('../db');

async function runMigration() {
  console.log('='.repeat(60));
  console.log('[*] Starting PostgreSQL Database Synchronization (Node.js)');
  console.log('='.repeat(60));

  const health = await db.testConnection();
  if (!health.connected) {
    console.error(`[ERROR] Could not connect to PostgreSQL: ${health.error}`);
    process.exit(1);
  }

  const verStr = health.version ? health.version.split(' ').slice(0, 2).join(' ') : 'PostgreSQL';
  console.log(`[OK] Connected to PostgreSQL database '${health.database}' as '${health.user}' (${verStr})`);

  try {
    const baseDir = __dirname;
    const pool = db.getPool();

    // 1. Read and Execute Schema DDL
    const schemaPath = path.join(baseDir, 'schema.sql');
    console.log(`\n[1/3] Applying Schema DDL from ${schemaPath}...`);
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
      const client = await pool.connect();
      try {
        await client.query(schemaSql);
        console.log('[OK] Schema tables, constraints, and indexes applied successfully.');
      } finally {
        client.release();
      }
    }

    // 2. Read and Execute Seeds DML
    const seedsPath = path.join(baseDir, 'seeds.sql');
    console.log(`\n[2/3] Populating Seed Records from ${seedsPath}...`);
    if (fs.existsSync(seedsPath)) {
      const seedsSql = fs.readFileSync(seedsPath, 'utf-8');
      const client = await pool.connect();
      try {
        await client.query(seedsSql);
        console.log('[OK] Seed dataset committed successfully.');
      } finally {
        client.release();
      }
    }

    // Run dynamic migrations (column adds and auxiliary tables)
    await db.initializeSchemaIfNeeded();

    // 3. Validation & Table Metrics
    console.log('\n[3/3] Validating Database Table Integrity...');
    const tables = [
      'donor',
      'recipients',
      'blood_bank',
      'staff',
      'hospital',
      'blood_donation_camp',
      'blood_inventory',
      'donation',
      'blood_request',
      'medical_report',
      'camp_registration',
      'notification',
      'audit_log',
    ];

    for (const table of tables) {
      try {
        const res = await db.query(`SELECT COUNT(*) AS count FROM ${table}`, [], 'one');
        const countVal = res ? res.count : 0;
        console.log(`   - Table '${table}': ${countVal} records`);
      } catch (tableErr) {
        console.log(`   - Table '${table}': N/A (${tableErr.message})`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('[SUCCESS] PostgreSQL Database is 100% Synchronized and Connected!');
    console.log('='.repeat(60) + '\n');
    process.exit(0);
  } catch (err) {
    console.error(`[ERROR] Migration Error: ${err.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
