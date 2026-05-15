/* ============================================
   Sistema de Navegación - SPA Router
   Este archivo debe cargarse PRIMERO
   ============================================ */

const PAGINAS = ['inicio', 'catalogo', 'detalle', 'carrito', 'checkout', 'login', 'registro', 'pedidos'];

// Historial de navegación
let historialNavegacion = ['inicio'];
let paginaActual = 'inicio';

/**
 * Navegar a una página
 * @param {string} pagina - Nombre de la página a mostrar
 */
function navegarA(pagina) {
  console.log('Navegando a:', pagina);
  
  // Guardar en historial
  if (paginaActual !== pagina) {
    historialNavegacion.push(pagina);
    paginaActual = pagina;
  }

  // Ocultar todas las páginas
  PAGINAS.forEach(p => {
    const el = document.getElementById(`pagina-${p}`);
    if (el) {
      el.classList.add('oculto');
    }
  });

  // Mostrar la página solicitada
  const paginaEl = document.getElementById(`pagina-${pagina}`);
  if (paginaEl) {
    paginaEl.classList.remove('oculto');
    console.log('Página mostrada:', pagina);
  } else {
    console.error('Página no encontrada:', pagina);
  }

  // Actualizar navegación activa
  document.querySelectorAll('.nav-enlaces a').forEach(a => {
    if (a.dataset.pagina === pagina) {
      a.classList.add('activo');
    } else {
      a.classList.remove('activo');
    }
  });

  // Scroll al inicio
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Cargar contenido específico
  setTimeout(() => {
    try {
      switch (pagina) {
        case 'catalogo':
          if (typeof filtrarProductos === 'function') {
            filtrarProductos();
          }
          break;
        case 'carrito':
          if (typeof cargarCarrito === 'function') {
            cargarCarrito();
          }
          break;
        case 'pedidos':
          if (typeof cargarPedidos === 'function') {
            cargarPedidos();
          }
          break;
      }
    } catch (error) {
      console.error('Error al cargar contenido:', error);
    }
  }, 100);
}

/**
 * Navegar hacia atrás en el historial
 */
function navegarAtras() {
  if (historialNavegacion.length > 1) {
    historialNavegacion.pop();
    const paginaAnterior = historialNavegacion[historialNavegacion.length - 1];
    historialNavegacion.pop();
    navegarA(paginaAnterior);
  } else {
    navegarA('inicio');
  }
}

/**
 * Obtener página anterior del historial
 */
function obtenerPaginaAnterior() {
  if (historialNavegacion.length > 1) {
    return historialNavegacion[historialNavegacion.length - 2];
  }
  return 'inicio';
}

/**
 * Toggle menú móvil
 */
function toggleMenuMovil() {
  const menu = document.getElementById('menu-movil');
  if (menu) {
    menu.classList.toggle('visible');
  }
}

/**
 * Toggle menú usuario
 */
function toggleMenuUsuario() {
  // Implementar si es necesario
  console.log('Toggle menú usuario');
}

console.log('Router cargado correctamente');
