// Script para inspeccionar tablas en Azure PostgreSQL
const { Client } = require('pg');

const databases = [
  {
    name: 'ppp_core',
    connectionString: 'postgresql://pppadmin:PppSecure2025!@ppp-postgres-local.postgres.database.azure.com:5432/ppp_core?sslmode=require'
  },
  {
    name: 'ppp_auth',
    connectionString: 'postgresql://pppadmin:PppSecure2025!@ppp-postgres-local.postgres.database.azure.com:5432/ppp_auth?sslmode=require'
  },
  {
    name: 'ppp_companias',
    connectionString: 'postgresql://pppadmin:PppSecure2025!@ppp-postgres-local.postgres.database.azure.com:5432/ppp_companias?sslmode=require'
  },
  {
    name: 'ppp_evaluaciones',
    connectionString: 'postgresql://pppadmin:PppSecure2025!@ppp-postgres-local.postgres.database.azure.com:5432/ppp_evaluaciones?sslmode=require'
  }
];

async function inspectDatabase(db) {
  const client = new Client({ connectionString: db.connectionString });
  
  try {
    await client.connect();
    console.log(`\n${'='.repeat(60)}`);
    console.log(`DATABASE: ${db.name}`);
    console.log('='.repeat(60));
    
    // Listar todas las tablas
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    const result = await client.query(tablesQuery);
    
    if (result.rows.length === 0) {
      console.log('❌ No hay tablas en esta base de datos');
    } else {
      console.log(`✅ Tablas encontradas (${result.rows.length}):\n`);
      for (const row of result.rows) {
        // Contar registros en cada tabla
        try {
          const countResult = await client.query(`SELECT COUNT(*) FROM "${row.table_name}"`);
          const count = countResult.rows[0].count;
          console.log(`  - ${row.table_name.padEnd(40)} (${count} registros)`);
        } catch (err) {
          console.log(`  - ${row.table_name.padEnd(40)} (error al contar)`);
        }
      }
    }
    
  } catch (error) {
    console.log(`❌ ERROR en ${db.name}:`, error.message);
  } finally {
    await client.end();
  }
}

async function main() {
  console.log('\n🔍 INSPECCIONANDO BASES DE DATOS EN AZURE\n');
  
  for (const db of databases) {
    await inspectDatabase(db);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ INSPECCION COMPLETADA');
  console.log('='.repeat(60) + '\n');
}

main().catch(console.error);
