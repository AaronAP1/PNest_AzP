// Script para inspeccionar valores enum en Azure PostgreSQL
const { Client } = require('pg');

const client = new Client({
  host: 'ppp-postgres-local.postgres.database.azure.com',
  port: 5432,
  user: 'pppadmin',
  password: 'PppSecure2025!',
  database: 'ppp_companias',
  ssl: { rejectUnauthorized: false }
});

async function inspectEnums() {
  try {
    await client.connect();
    console.log('\n🔍 INSPECCIONANDO VALORES ENUM EN ppp_companias\n');
    
    // Consultar tipos enum
    const query = `
      SELECT t.typname as enum_name, e.enumlabel as enum_value
      FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
      ORDER BY t.typname, e.enumsortorder;
    `;
    
    const result = await client.query(query);
    
    let currentEnum = '';
    for (const row of result.rows) {
      if (row.enum_name !== currentEnum) {
        if (currentEnum) console.log('');
        console.log(`ENUM: ${row.enum_name}`);
        console.log('='.repeat(60));
        currentEnum = row.enum_name;
      }
      console.log(`  - ${row.enum_value}`);
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await client.end();
  }
}

inspectEnums();
