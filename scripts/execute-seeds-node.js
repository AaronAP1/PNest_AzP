// Script para ejecutar seeds directamente desde Node.js (UTF-8)
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const config = {
  host: 'ppp-postgres-local.postgres.database.azure.com',
  port: 5432,
  user: 'pppadmin',
  password: 'PppSecure2025!',
  ssl: { rejectUnauthorized: false }
};

const scripts = [
  { db: 'ppp_core', file: 'seed-core-fixed2.sql', name: 'CORE (Facultades, Escuelas, Lineas)' },
  { db: 'ppp_auth', file: 'seed-auth-fixed2.sql', name: 'AUTH (Roles, Usuarios, Supervisores, Alumnos)' },
  { db: 'ppp_companias', file: 'seed-companias-fixed2.sql', name: 'COMPANIAS (Empresas, Solicitudes, etc)' }
];

async function executeSeed(dbName, scriptFile, description) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Ejecutando: ${description}`);
  console.log(`Database: ${dbName}`);
  console.log('='.repeat(80));
  
  const client = new Client({ ...config, database: dbName });
  
  try {
    await client.connect();
    console.log('✅ Conectado a Azure PostgreSQL');
    
    // Leer archivo SQL
    const scriptPath = path.join(__dirname, scriptFile);
    const sqlContent = fs.readFileSync(scriptPath, 'utf8');
    
    // Ejecutar
    const result = await client.query(sqlContent);
    console.log(`✅ Script ejecutado exitosamente`);
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    if (error.position) {
      console.log(`   Posición del error: ${error.position}`);
    }
  } finally {
    await client.end();
  }
}

async function main() {
  console.log('\n🚀 EJECUTANDO SEEDS EN AZURE POSTGRESQL\n');
  
  for (const script of scripts) {
    await executeSeed(script.db, script.file, script.name);
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ PROCESO COMPLETADO');
  console.log('='.repeat(80) + '\n');
}

main().catch(console.error);
