// Importar Pool de PostgreSQL para gestionar conexiones a la base de datos
const { Pool } = require('pg');
// Cargar variables de entorno desde el archivo .env en la raíz del proyecto
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

// Pool de conexiones a PostgreSQL - reutilizable por todos los microservicios
// Permite múltiples conexiones simultáneas y las gestiona eficientemente
const poolBD = new Pool({
  host: process.env.BD_HOST || 'localhost',
  port: parseInt(process.env.BD_PUERTO) || 5432,
  database: process.env.BD_NOMBRE || 'luxe_store',
  user: process.env.BD_USUARIO || 'postgres',
  password: process.env.BD_CONTRASENA || 'postgres',
});

// Configuración centralizada compartida entre todos los microservicios
const configuracion = {
  // Secreto para firmar y verificar tokens JWT
  jwtSecreto: process.env.JWT_SECRETO || 'luxe_store_secreto_desarrollo',
  // Tiempo de expiración de los tokens (24 horas por defecto)
  jwtExpiracion: process.env.JWT_EXPIRACION || '24h',
  // Puertos de cada microservicio - permite configuración flexible
  puertos: {
    auth: parseInt(process.env.PUERTO_AUTH) || 3001,
    productos: parseInt(process.env.PUERTO_PRODUCTOS) || 3002,
    carrito: parseInt(process.env.PUERTO_CARRITO) || 3003,
    ordenes: parseInt(process.env.PUERTO_ORDENES) || 3004,
    gateway: parseInt(process.env.PUERTO_GATEWAY) || 3000,
    frontend: parseInt(process.env.PUERTO_FRONTEND) || 8080,
  },
};

module.exports = { poolBD, configuracion };
