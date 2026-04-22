const { Router } = require('express');
const { verificarToken } = require('../../shared/middleware/auth');
const controlador = require('./controller');

const rutas = Router();

// Todas las rutas del carrito requieren autenticación
rutas.get('/', verificarToken, controlador.obtenerCarrito);
rutas.post('/agregar', verificarToken, controlador.agregarItem);
rutas.put('/item/:id', verificarToken, controlador.actualizarItem);
rutas.delete('/item/:id', verificarToken, controlador.eliminarItem);
rutas.delete('/vaciar', verificarToken, controlador.vaciarCarrito);

module.exports = rutas;
