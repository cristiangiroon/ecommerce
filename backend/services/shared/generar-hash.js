const bcrypt = require('bcrypt');

// Número de rondas para bcrypt (mismo que en el sistema)
const RONDAS_SAL = 10;

/**
 * Script para generar hash de contraseña
 * Uso: node generar-hash.js
 */
async function generarHash() {
  // Cambia esta contraseña por la que desees
  const contrasenaDeseada = 'admin123';
  
  try {
    const hash = await bcrypt.hash(contrasenaDeseada, RONDAS_SAL);
    
    console.log('\n=== HASH GENERADO ===');
    console.log('Contraseña:', contrasenaDeseada);
    console.log('Hash:', hash);
    console.log('\n=== QUERY SQL PARA ACTUALIZAR ===');
    console.log(`UPDATE usuarios SET contrasena = '${hash}' WHERE email = 'admin@luxestore.com';`);
    console.log('\nEjecuta este query en tu base de datos PostgreSQL\n');
  } catch (error) {
    console.error('Error al generar hash:', error);
  }
}

generarHash();
