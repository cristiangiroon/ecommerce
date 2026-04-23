const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

const dbConfig = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'postgres',
};

async function ejecutarSchema() {
  let client = new Client(dbConfig);
  await client.connect();
  let buffer = '';
  const lines = schemaSql.split(/\r?\n/);

  try {
    for (let linea of lines) {
      linea = linea.trim();
      if (!linea || linea.startsWith('--')) continue;

      if (linea.startsWith('\\c ')) {
        if (buffer.trim()) {
          await client.query(buffer);
          buffer = '';
        }
        await client.end();
        let newDb = linea.split(/\s+/)[1].trim();
        if (newDb.endsWith(';')) newDb = newDb.slice(0, -1).trim();
        client = new Client({ ...dbConfig, database: newDb });
        await client.connect();
        continue;
      }

      buffer += linea + '\n';
      if (linea.endsWith(';')) {
        try {
          await client.query(buffer);
        } catch (err) {
          if (err.code === '42P04' && buffer.trim().toLowerCase().startsWith('create database')) {
            console.log('La base de datos ya existe, continuando...');
          } else {
            throw err;
          }
        }
        buffer = '';
      }
    }

    if (buffer.trim()) {
      await client.query(buffer);
    }

    console.log('Schema cargado correctamente.');
  } catch (error) {
    console.error('Error al cargar schema:', error.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

ejecutarSchema();
