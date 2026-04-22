const express = require('express');
const cors = require('cors');
const { configuracion } = require('../../shared/config');
const rutas = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/ordenes', rutas);

app.get('/salud', (req, res) => res.json({ servicio: 'ordenes', estado: 'activo' }));

const PUERTO = configuracion.puertos.ordenes;
app.listen(PUERTO, () => {
  console.log(`[Servicio Ordenes] ejecutándose en puerto ${PUERTO}`);
});

module.exports = app;
