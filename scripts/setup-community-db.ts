/**
 * Setup script for community database tables.
 * Run once after creating your Vercel Postgres database:
 *
 *   npx tsx scripts/setup-community-db.ts
 *
 * Requires POSTGRES_URL (set automatically by Vercel, or in .env.local for local dev).
 */
import fs from 'fs';
import path from 'path';
import { sql } from '@vercel/postgres';

async function main() {
  const sqlFile = path.join(__dirname, 'init-community-db.sql');
  const schema = fs.readFileSync(sqlFile, 'utf-8');

  // Split on semicolons and execute each statement
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const statement of statements) {
    console.log(`Executing: ${statement.slice(0, 60)}...`);
    await sql.query(statement);
  }

  console.log('✅ Community database tables created successfully.');
}

main().catch(err => {
  console.error('Failed to set up community database:', err);
  process.exit(1);
});
