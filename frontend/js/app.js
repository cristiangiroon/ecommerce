/* ============================================
   Aplicación Principal - Inicialización
   ============================================ */

window.addEventListener('scroll', () => {
  const btn = document.getElementById('btn-volver-arriba');
  if (btn) {
    btn.classList.toggle('visible', window.scrollY > 300);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Cargado');
  
  // Cargar funciones globales
  try {
    if (typeof actualizarUIUsuario === 'function') actualizarUIUsuario();
    if (typeof cargarCarritoBadge === 'function') cargarCarritoBadge();
  } catch (error) {
    console.error('Error al cargar funciones iniciales:', error);
  }
  
  console.log('App inicializada correctamente');
});

// Función para toggle del menú móvil
function toggleMenuMovil() {
  const menu = document.getElementById('menu-movil');
  if (menu) {
    menu.classList.toggle('visible');
  }
}

// Función para toggle del menú de usuario (placeholder)
function toggleMenuUsuario() {
  // Implementar menú desplegable de usuario si es necesario
  console.log('Toggle menú usuario');
}
