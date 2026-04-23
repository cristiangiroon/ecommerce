/* ============================================
   Utilidades Globales
   ============================================ */
/**
 * @returns {string|null} Token de autenticación o null si no existe
 */
function obtenerToken() {
  return localStorage.getItem('luxe_token');
}
/**
 * Guarda la sesión del usuario en localStorage
 * @param {string} token - Token JWT recibido del backend
 * @param {Object} usuario - Objeto con datos del usuario (id, nombre, email)
 */
function guardarSesion(token, usuario) {
  localStorage.setItem('luxe_token', token);
  localStorage.setItem('luxe_usuario', JSON.stringify(usuario));
}

/**
 */
function cerrarSesion() {
  localStorage.removeItem('luxe_token');
  localStorage.removeItem('luxe_usuario');
  
  const loginEmail = document.getElementById('login-email');
  const loginContrasena = document.getElementById('login-contrasena');
  if (loginEmail) loginEmail.value = '';
  if (loginContrasena) loginContrasena.value = '';
  
  const registroNombre = document.getElementById('registro-nombre');
  const registroEmail = document.getElementById('registro-email');
  const registroTelefono = document.getElementById('registro-telefono');
  const registroContrasena = document.getElementById('registro-contrasena');
  const registroConfirmar = document.getElementById('registro-confirmar');
  if (registroNombre) registroNombre.value = '';
  if (registroEmail) registroEmail.value = '';
  if (registroTelefono) registroTelefono.value = '';
  if (registroContrasena) registroContrasena.value = '';
  if (registroConfirmar) registroConfirmar.value = '';
  
  actualizarUIUsuario();
  navegarA('inicio');
  mostrarToast('Sesión cerrada', 'info');
}
/**
 * Obtiene los datos del usuario actual desde localStorage
 * @returns {Object|null} Objeto con datos del usuario o null si no hay sesión
 */
function obtenerUsuario() {
  const datos = localStorage.getItem('luxe_usuario');
  return datos ? JSON.parse(datos) : null;
}

/**
 * @returns {boolean} 
 */
function estaAutenticado() {
  return !!obtenerToken();
}

/**
 * 
 * @param {string} endpoint - Ruta del endpoint (ej: '/api/productos')
 * @param {Object} opciones - Opciones de fetch (method, body, headers, etc.)
 * @returns {Promise<Object>} Datos de la respuesta en formato JSON
 * @throws {Error} Si la petición falla o el servidor retorna error
 */
async function peticionAPI(endpoint, opciones = {}) {
  const url = CONFIG.API_URL + endpoint;
  const headers = { 'Content-Type': 'application/json' };
  
  const token = obtenerToken();

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const respuesta = await fetch(url, {
    ...opciones,
    headers: { ...headers, ...opciones.headers },
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    // No cerrar sesión en endpoints de login/registro
    if ((respuesta.status === 403 || respuesta.status === 401) && token && !endpoint.includes('/login') && !endpoint.includes('/registro')) {
      cerrarSesion();
    }
    throw new Error(datos.error || 'Error en la petición');
  }

  return datos;
}

/**
 * Muestra una notificación temporal (toast) en la interfaz
 * @param {string} mensaje - Texto a mostrar en la notificación
 * @param {string} tipo - Tipo de notificación: 'info', 'exito', 'error'
 */
function mostrarToast(mensaje, tipo = 'info') {
  const contenedor = document.getElementById('toast-contenedor');
  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  toast.textContent = mensaje;
  contenedor.appendChild(toast);
  // Auto-eliminar después de 3 segundos
  setTimeout(() => toast.remove(), 3000);
}

/**
 * @param {number|string} precio - Precio a formatear
 * @returns {string} Precio formateado en pesos colombianos (ej: "$50.000")
 */
function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(precio);
}

/**
 * @param {string|Date} fecha 
 * @returns {string} 
 */
function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
