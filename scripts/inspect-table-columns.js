// Script para inspeccionar columnas de tablas en Azure PostgreSQL
const { Client } = require('pg');

const databases = [
  {
    name: 'ppp_core',
    connectionString: 'postgresql://pppadmin:PppSecure2025!@ppp-postgres-local.postgres.database.azure.com:5432/ppp_core?sslmode=require',
    tables: ['facultad', 'escuela', 'linea_facultad']
  },
  {
    name: 'ppp_auth',
    connectionString: 'postgresql://pppadmin:PppSecure2025!@ppp-postgres-local.postgres.database.azure.com:5432/ppp_auth?sslmode=require',
    tables: ['rol', 'usuario', 'supervisor', 'alumno']
  },
  {
    name: 'ppp_companias',
    connectionString: 'postgresql://pppadmin:PppSecure2025!@ppp-postgres-local.postgres.database.azure.com:5432/ppp_companias?sslmode=require',
    tables: ['empresa', 'carta_presentacion', 'solicitud_ppp', 'reuniones', 'tipo_documento', 'documento']
  },
  {
    name: 'ppp_evaluaciones',
    connectionString: 'postgresql://pppadmin:PppSecure2025!@ppp-postgres-local.postgres.database.azure.com:5432/ppp_evaluaciones?sslmode=require',
    tables: ['dimension_transversal', 'preguntas', 'evaluacion_supervisor']
  }
];

async function inspectTableColumns(db) {
  const client = new Client({ connectionString: db.connectionString });
  
  try {
    await client.connect();
    console.log(`\n${'='.repeat(80)}`);
    console.log(`DATABASE: ${db.name}`);
    console.log('='.repeat(80));
    
    for (const tableName of db.tables) {
      console.log(`\n  TABLE: ${tableName}`);
      console.log(`  ${'-'.repeat(76)}`);
      
      // Obtener columnas
      const columnsQuery = `
        SELECT 
          column_name, 
          data_type, 
          is_nullable,
          column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = $1
        ORDER BY ordinal_position;
      `;
      
      const result = await client.query(columnsQuery, [tableName]);
      
      if (result.rows.length === 0) {
        console.log(`  ❌ Tabla no encontrada o sin columnas`);
      } else {
        console.log(`  Columnas (${result.rows.length}):`);
        for (const col of result.rows) {
          const nullable = col.is_nullable === 'YES' ? '' : 'NOT NULL';
          const defaultVal = col.column_default ? `DEFAULT ${col.column_default}` : '';
          console.log(`    - ${col.column_name.padEnd(30)} ${col.data_type.padEnd(20)} ${nullable} ${defaultVal}`);
        }
      }
    }
    
  } catch (error) {
    console.log(`  ❌ ERROR: ${error.message}`);
  } finally {
    await client.end();
  }
}

async function main() {
  console.log('\n🔍 INSPECCIONANDO COLUMNAS DE TABLAS EN AZURE\n');
  
  for (const db of databases) {
    await inspectTableColumns(db);
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ INSPECCION COMPLETADA');
  console.log('='.repeat(80) + '\n');
}

main().catch(console.error);
