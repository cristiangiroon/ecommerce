const express = require('express');
const cors = require('cors');
const { configuracion } = require('../../shared/config');
const rutas = require('./routes');

const app = express();

app.use(cors());

app.use(express.json());

// Montar las rutas del servicio de autenticación
app.use('/api/auth', rutas);

// Health check endpoint
app.get('/salud', (req, res) => res.json({ servicio: 'auth', estado: 'activo' }));

// Iniciar el servidor en el puerto configurado
const PUERTO = configuracion.puertos.auth;
app.listen(PUERTO, () => {
  console.log(`[Servicio Auth] ejecutándose en puerto ${PUERTO}`);
});

module.exports = app;
