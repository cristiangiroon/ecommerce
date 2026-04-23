const fs = require('fs');
const path = require('path');
const { poolBD } = require('./services/shared/config');

async function runSchema() {
  try {
    console.log('Conectando a la base de datos...');

    // Leer el archivo schema.sql
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    // Ejecutar el schema
    await poolBD.query(schemaSQL);
    console.log('Schema ejecutado exitosamente. Base de datos recargada.');

  } catch (error) {
    console.error('Error al recargar la base de datos:', error);
  } finally {
    process.exit(0);
  }
}

runSchema();