const express = require('express');
const cors = require('cors');
const { configuracion } = require('../../shared/config');
const rutas = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/carrito', rutas);

app.get('/salud', (req, res) => res.json({ servicio: 'carrito', estado: 'activo' }));

const PUERTO = configuracion.puertos.carrito;
app.listen(PUERTO, () => {
  console.log(`[Servicio Carrito] ejecutándose en puerto ${PUERTO}`);
});

module.exports = app;
