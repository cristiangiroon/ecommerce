/* ============================================
   Breadcrumbs (Migas de Pan)
   Sistema de navegación contextual
   ============================================ */

// Mapeo de páginas a breadcrumbs
const BREADCRUMB_MAP = {
  'inicio': [
    { nombre: 'Inicio', pagina: 'inicio' }
  ],
  'catalogo': [
    { nombre: 'Inicio', pagina: 'inicio' },
    { nombre: 'Catálogo', pagina: 'catalogo' }
  ],
  'detalle': [
    { nombre: 'Inicio', pagina: 'inicio' },
    { nombre: 'Catálogo', pagina: 'catalogo' },
    { nombre: 'Detalle', pagina: 'detalle' }
  ],
  'carrito': [
    { nombre: 'Inicio', pagina: 'inicio' },
    { nombre: 'Catálogo', pagina: 'catalogo' },
    { nombre: 'Carrito', pagina: 'carrito' }
  ],
  'checkout': [
    { nombre: 'Inicio', pagina: 'inicio' },
    { nombre: 'Carrito', pagina: 'carrito' },
    { nombre: 'Checkout', pagina: 'checkout' }
  ],
  'pedidos': [
    { nombre: 'Inicio', pagina: 'inicio' },
    { nombre: 'Mis Pedidos', pagina: 'pedidos' }
  ],
  'login': [
    { nombre: 'Inicio', pagina: 'inicio' },
    { nombre: 'Iniciar Sesión', pagina: 'login' }
  ],
  'registro': [
    { nombre: 'Inicio', pagina: 'inicio' },
    { nombre: 'Login', pagina: 'login' },
    { nombre: 'Registro', pagina: 'registro' }
  ]
};

/**
 * Generar HTML del breadcrumb
 * @param {string} paginaActual - Página actual
 * @returns {string} HTML del breadcrumb
 */
function generarBreadcrumb(paginaActual) {
  const ruta = BREADCRUMB_MAP[paginaActual] || BREADCRUMB_MAP['inicio'];
  
  let html = '<nav class="breadcrumb" aria-label="Breadcrumb">';
  
  ruta.forEach((item, index) => {
    const esUltimo = index === ruta.length - 1;
    
    if (esUltimo) {
      html += `<span class="breadcrumb-actual">${item.nombre}</span>`;
    } else {
      html += `<a href="#" onclick="navegarA('${item.pagina}'); return false;">${item.nombre}</a>`;
      html += '<span class="breadcrumb-separador">/</span>';
    }
  });
  
  html += '</nav>';
  return html;
}

/**
 * Actualizar breadcrumb en la página
 * @param {string} paginaActual - Página actual
 * @param {string} contenedorId - ID del contenedor donde insertar el breadcrumb
 */
function actualizarBreadcrumb(paginaActual, contenedorId = 'breadcrumb-container') {
  const contenedor = document.getElementById(contenedorId);
  if (contenedor) {
    contenedor.innerHTML = generarBreadcrumb(paginaActual);
  }
}

/**
 * Insertar breadcrumb automáticamente en las páginas
 */
function insertarBreadcrumbsAutomaticos() {
  // Páginas que deben tener breadcrumb
  const paginasConBreadcrumb = ['catalogo', 'detalle', 'carrito', 'checkout', 'pedidos'];
  
  paginasConBreadcrumb.forEach(pagina => {
    const seccion = document.getElementById(`pagina-${pagina}`);
    if (seccion) {
      const contenedor = seccion.querySelector('.contenedor, .formulario-contenedor');
      if (contenedor) {
        // Buscar si ya existe un breadcrumb
        let breadcrumbDiv = contenedor.querySelector('.breadcrumb-wrapper');
        
        if (!breadcrumbDiv) {
          // Crear contenedor para breadcrumb
          breadcrumbDiv = document.createElement('div');
          breadcrumbDiv.className = 'breadcrumb-wrapper';
          breadcrumbDiv.id = `breadcrumb-${pagina}`;
          
          // Insertar antes del primer hijo
          contenedor.insertBefore(breadcrumbDiv, contenedor.firstChild);
        }
        
        // Generar breadcrumb
        breadcrumbDiv.innerHTML = generarBreadcrumb(pagina);
      }
    }
  });
}

/**
 * Actualizar breadcrumb cuando cambia la página
 */
function actualizarBreadcrumbDinamico(pagina) {
  const breadcrumbDiv = document.getElementById(`breadcrumb-${pagina}`);
  if (breadcrumbDiv) {
    breadcrumbDiv.innerHTML = generarBreadcrumb(pagina);
  }
}

// Inicializar breadcrumbs cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', insertarBreadcrumbsAutomaticos);
} else {
  insertarBreadcrumbsAutomaticos();
}

// Exportar funciones para uso global
window.generarBreadcrumb = generarBreadcrumb;
window.actualizarBreadcrumb = actualizarBreadcrumb;
window.actualizarBreadcrumbDinamico = actualizarBreadcrumbDinamico;
