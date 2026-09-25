/**
 * PostgreSQL Database Quick Diagnostic (Node.js)
 */

const db = require('./db');

async function main() {
  const diag = await db.testConnection();
  console.log('PostgreSQL connection:', diag);

  const tables = await db.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name",
    [],
    'all'
  );
  console.log('Tables in PostgreSQL:', tables.map((t) => t.table_name));

  for (const t of tables) {
    const name = t.table_name;
    try {
      const cnt = await db.query(`SELECT COUNT(*) AS count FROM "${name}"`, [], 'one');
      console.log(` - ${name}: ${cnt.count} rows`);
    } catch (e) {
      console.log(` - ${name}: error ${e.message}`);
    }
  }

  process.exit(0);
}

main();
