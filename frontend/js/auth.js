/* ============================================
   Módulo de Autenticación
   ============================================ */

/**
 * Maneja el inicio de sesión del usuario
 * @param {Event} evento - Evento submit del formulario
 * 
 */
async function iniciarSesion(evento) {
  evento.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const contrasena = document.getElementById('login-contrasena').value;

  try {
    const datos = await peticionAPI(CONFIG.ENDPOINTS.login, {
      method: 'POST',
      body: JSON.stringify({ email, contrasena }),
    });

    guardarSesion(datos.token, datos.usuario);
    actualizarUIUsuario();
    mostrarToast(`Bienvenido, ${datos.usuario.nombre}`, 'exito');
    navegarA('inicio');
    cargarCarritoBadge();
  } catch (error) {
    mostrarToast(error.message, 'error');
  }
}
/**
 * @param {Event} evento - Evento submit del formulario
 * 
 */
async function registrarUsuario(evento) {
  evento.preventDefault();
  const nombre = document.getElementById('registro-nombre').value.trim();
  const email = document.getElementById('registro-email').value.trim();
  const telefono = document.getElementById('registro-telefono').value.trim();
  const contrasena = document.getElementById('registro-contrasena').value;
  const confirmar = document.getElementById('registro-confirmar').value;

  if (contrasena !== confirmar) {
    mostrarToast('Las contraseñas no coinciden', 'error');
    return;
  }

  try {
    const datos = await peticionAPI(CONFIG.ENDPOINTS.registro, {
      method: 'POST',
      body: JSON.stringify({ nombre, email, contrasena, telefono }),
    });

    guardarSesion(datos.token, datos.usuario);
    actualizarUIUsuario();
    mostrarToast('Cuenta creada exitosamente', 'exito');
    navegarA('inicio');
  } catch (error) {
    mostrarToast(error.message, 'error');
  }
}

/**
 */
function actualizarUIUsuario() {
  const usuario = obtenerUsuario();
  const enlaceMovil = document.getElementById('enlace-sesion-movil');
  const btnUsuario = document.getElementById('btn-usuario');

  if (usuario) {
    enlaceMovil.innerHTML = `
      <a href="#" onclick="cerrarSesion(); toggleMenuMovil()">Cerrar Sesión (${usuario.nombre})</a>
    `;
    btnUsuario.title = usuario.nombre;
    btnUsuario.onclick = () => {
      if (confirm(`¿Deseas cerrar sesión, ${usuario.nombre}?`)) {
        cerrarSesion();
      }
    };
  } else {
    enlaceMovil.innerHTML = `
      <a href="#" onclick="navegarA('login'); toggleMenuMovil()">Iniciar Sesión</a>
    `;
    btnUsuario.title = 'Iniciar Sesión';
    btnUsuario.onclick = () => navegarA('login');
  }
}

/**
 * @returns {boolean} true si está autenticado, false si no
 * 
 */
function requiereAuth(paginaDestino) {
  if (!estaAutenticado()) {
    mostrarToast('Inicia sesión para continuar', 'info');
    navegarA('login');
    return false;
  }
  return true;
}
