const express = require('express');
const cors = require('cors');
const { configuracion } = require('../../shared/config');
const rutas = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/productos', rutas);

app.get('/salud', (req, res) => res.json({ servicio: 'productos', estado: 'activo' }));

const PUERTO = configuracion.puertos.productos;
app.listen(PUERTO, () => {
  console.log(`[Servicio Productos] ejecutándose en puerto ${PUERTO}`);
});

module.exports = app;
