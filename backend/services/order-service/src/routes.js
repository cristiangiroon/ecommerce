const { Router } = require('express');
const { verificarToken } = require('../../shared/middleware/auth');
const controlador = require('./controller');

const rutas = Router();

// Todas las rutas de órdenes requieren autenticación
rutas.post('/', verificarToken, controlador.crearOrden); // Crear orden desde carrito
rutas.get('/', verificarToken, controlador.obtenerOrdenes); // Listar órdenes del usuario
rutas.get('/:id', verificarToken, controlador.obtenerOrdenPorId); // Detalle de orden
rutas.put('/:id/cancelar', verificarToken, controlador.cancelarOrden); // Cancelar orden pendiente

module.exports = rutas;
