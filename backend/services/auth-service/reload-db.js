const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'postgres' // Conectar a postgres para crear la base de datos
});

async function runSchema() {
  try {
    await client.connect();
    console.log('Conectado a PostgreSQL');

    // Leer el archivo schema.sql
    const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    // Ejecutar el schema
    await client.query(schemaSQL);
    console.log('Schema ejecutado exitosamente. Base de datos recargada con credenciales admin actualizadas.');

  } catch (error) {
    console.error('Error al recargar la base de datos:', error);
  } finally {
    await client.end();
  }
}

runSchema();