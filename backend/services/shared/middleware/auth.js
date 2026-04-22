const jwt = require('jsonwebtoken');
const { configuracion } = require('../config');

/**
 * Middleware para verificar que el usuario esté autenticado mediante JWT
 * Extrae el token del header Authorization y valida su firma
 */
function verificarToken(req, res, next) {
  const encabezado = req.headers['authorization'];
  if (!encabezado) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  const token = encabezado.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  try {
    const decodificado = jwt.verify(token, configuracion.jwtSecreto);
    req.usuario = decodificado; // Contiene: {id, email, rol}
    next(); // Continuar con el siguiente middleware o controlador
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

/**
 * Middleware para verificar que el usuario tenga rol de administrador
 * Debe usarse después de verificarToken
 */
function verificarAdmin(req, res, next) {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: se requiere rol de administrador' });
  }
  next();
}

module.exports = { verificarToken, verificarAdmin };
