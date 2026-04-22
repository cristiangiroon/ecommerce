const { Router } = require('express');
const { verificarToken } = require('../../shared/middleware/auth');
const controlador = require('./controller');

const rutas = Router();

// Rutas públicas (no requieren autenticación)
rutas.post('/registro', controlador.registrar);
rutas.post('/login', controlador.iniciarSesion);


// Rutas protegidas (requieren token JWT válido)
rutas.get('/perfil', verificarToken, controlador.obtenerPerfil);
rutas.put('/perfil', verificarToken, controlador.actualizarPerfil);

module.exports = rutas;
