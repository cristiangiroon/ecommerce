const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { poolBD, configuracion } = require('../../shared/config');

const RONDAS_SAL = 10;

/**
 * Controlador para registrar un nuevo usuario
 * Crea el usuario, su carrito y retorna un token JWT
 */
async function registrar(req, res) {
  try {
    const { nombre, email, contrasena, telefono, direccion } = req.body;

    if (!nombre || !email || !contrasena) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
    }

    const existente = await poolBD.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (existente.rows.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const contrasenaHash = await bcrypt.hash(contrasena, RONDAS_SAL);

    const resultado = await poolBD.query(
      `INSERT INTO usuarios (nombre, email, contrasena, telefono, direccion)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre, email, rol, creado_en`,
      [nombre, email, contrasenaHash, telefono || null, direccion || null]
    );

    const usuario = resultado.rows[0];

    await poolBD.query('INSERT INTO carritos (usuario_id) VALUES ($1)', [usuario.id]);

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      configuracion.jwtSecreto,
      { expiresIn: configuracion.jwtExpiracion }
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario,
      token,
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * Controlador para iniciar sesión
 * Valida credenciales y retorna un token JWT
 */
async function iniciarSesion(req, res) {
  try {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    const resultado = await poolBD.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (resultado.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = resultado.rows[0];
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      configuracion.jwtSecreto,
      { expiresIn: configuracion.jwtExpiracion }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
      token,
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function obtenerPerfil(req, res) {
  try {
    const resultado = await poolBD.query(
      'SELECT id, nombre, email, telefono, direccion, rol, creado_en FROM usuarios WHERE id = $1',
      [req.usuario.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ usuario: resultado.rows[0] });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function actualizarPerfil(req, res) {
  try {
    const { nombre, telefono, direccion } = req.body;
    const resultado = await poolBD.query(
      `UPDATE usuarios SET nombre = COALESCE($1, nombre), telefono = COALESCE($2, telefono),
       direccion = COALESCE($3, direccion), actualizado_en = CURRENT_TIMESTAMP
       WHERE id = $4 RETURNING id, nombre, email, telefono, direccion, rol`,
      [nombre, telefono, direccion, req.usuario.id]
    );

    res.json({ mensaje: 'Perfil actualizado', usuario: resultado.rows[0] });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { registrar, iniciarSesion, obtenerPerfil, actualizarPerfil };
