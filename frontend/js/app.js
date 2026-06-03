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
  
  // Cargar funciones solo si existen
  try {
    if (typeof actualizarUIUsuario === 'function') actualizarUIUsuario();
    if (typeof cargarCategorias === 'function') cargarCategorias();
    if (typeof cargarMarcas === 'function') cargarMarcas();
    if (typeof cargarDestacados === 'function') cargarDestacados();
    if (typeof cargarCarritoBadge === 'function') cargarCarritoBadge();
  } catch (error) {
    console.error('Error al cargar funciones iniciales:', error);
  }
  
  // Soporte para navegación con teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && paginaActual !== 'inicio') {
      navegarAtras();
    }
  });
  
  console.log('App inicializada correctamente');
});
