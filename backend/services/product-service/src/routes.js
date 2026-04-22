const { Router } = require('express');
const controlador = require('./controller');

const rutas = Router();

// Todas las rutas de productos son públicas (no requieren autenticación)
rutas.get('/', controlador.obtenerTodos); // Listar con filtros y paginación
rutas.get('/destacados', controlador.obtenerDestacados); // Productos destacados
rutas.get('/categorias', controlador.obtenerCategorias); // Listar categorías
rutas.get('/marcas', controlador.obtenerMarcas); // Listar marcas
rutas.get('/:id', controlador.obtenerPorId); // Detalle de producto (debe ir al final)

module.exports = rutas;
