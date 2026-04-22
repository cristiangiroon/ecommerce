const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { configuracion } = require('../../shared/config');

const app = express();

// Habilitar CORS para permitir peticiones desde el frontend
app.use(cors());

/**
 * Función helper para crear un proxy middleware
 * Redirige las peticiones al microservicio correspondiente
 */
const crearProxy = (puerto) =>
  createProxyMiddleware({
    target: `http://localhost:${puerto}`, // URL del microservicio destino
    changeOrigin: true, // Cambia el origen del host header
  });


app.use('/api/auth', crearProxy(configuracion.puertos.auth));
app.use('/api/productos', crearProxy(configuracion.puertos.productos));
app.use('/api/carrito', crearProxy(configuracion.puertos.carrito));
app.use('/api/ordenes', crearProxy(configuracion.puertos.ordenes));

app.get('/salud', (req, res) => {
  res.json({ servicio: 'gateway', estado: 'activo', puertos: configuracion.puertos });
});

const PUERTO = configuracion.puertos.gateway;
app.listen(PUERTO, () => {
  console.log(`[API Gateway] ejecutándose en puerto ${PUERTO}`);
  console.log(`  -> Auth:      http://localhost:${configuracion.puertos.auth}`);
  console.log(`  -> Productos: http://localhost:${configuracion.puertos.productos}`);
  console.log(`  -> Carrito:   http://localhost:${configuracion.puertos.carrito}`);
  console.log(`  -> Ordenes:   http://localhost:${configuracion.puertos.ordenes}`);
});
