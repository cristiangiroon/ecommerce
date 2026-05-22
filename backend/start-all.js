const { spawn } = require('child_process');
const path = require('path');

const servicios = [
  { nombre: 'Auth',     ruta: 'services/auth-service/src/server.js', tipo: 'node' },
  { nombre: 'Products', ruta: 'services/product-service/src/server.js', tipo: 'node' },
  { nombre: 'Cart',     ruta: 'services/cart-service/src/server.js', tipo: 'node' },
  { nombre: 'Orders',   ruta: 'services/order-service/src/server.js', tipo: 'node' },
  { nombre: 'Gateway',  ruta: 'services/gateway/src/server.js', tipo: 'node' },
  { nombre: 'Frontend', ruta: '../frontend', tipo: 'php' },
];

const procesos = [];

function iniciarServicio(servicio) {
  let proceso;
  
  if (servicio.tipo === 'php') {
    const rutaFrontend = path.join(__dirname, servicio.ruta);
    proceso = spawn('php', ['-S', 'localhost:8000', '-t', rutaFrontend], {
      stdio: 'inherit',
      env: process.env,
    });
  } else {
    const rutaArchivo = path.join(__dirname, servicio.ruta);
    proceso = spawn('node', [rutaArchivo], {
      stdio: 'inherit',
      env: process.env,
    });
  }

  proceso.on('error', (error) => {
    console.error(`[${servicio.nombre}] Error al iniciar: ${error.message}`);
  });

  proceso.on('exit', (codigo) => {
    if (codigo !== null && codigo !== 0) {
      console.error(`[${servicio.nombre}] Terminó con código ${codigo}`);
    }
  });

  procesos.push({ nombre: servicio.nombre, proceso });
}

console.log('========================================');
console.log('  LUXE Store - Iniciando servicios...');
console.log('========================================\n');

servicios.forEach(iniciarServicio);

process.on('SIGINT', () => {
  console.log('\nDeteniendo todos los servicios...');
  procesos.forEach(({ nombre, proceso }) => {
    console.log(`  Deteniendo ${nombre}...`);
    proceso.kill('SIGTERM');
  });
  process.exit(0);
});

process.on('SIGTERM', () => {
  procesos.forEach(({ proceso }) => proceso.kill('SIGTERM'));
  process.exit(0);
});
