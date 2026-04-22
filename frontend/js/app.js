/* ============================================
   Aplicación Principal - Router SPA
   ============================================ */


const PAGINAS = ['inicio', 'catalogo', 'detalle', 'carrito', 'checkout', 'login', 'registro', 'pedidos'];

const PAGINAS_PROTEGIDAS = ['carrito', 'checkout', 'pedidos'];

/**
 
 * @param {string} pagina - Nombre de la página a mostrar
 */
function navegarA(pagina) {
  if (PAGINAS_PROTEGIDAS.includes(pagina) && !estaAutenticado()) {
    mostrarToast('Inicia sesión para continuar', 'info');
    pagina = 'login';
  }

  PAGINAS.forEach(p => {
    const el = document.getElementById(`pagina-${p}`);
    if (el) el.classList.add('oculto');
  });

  const paginaEl = document.getElementById(`pagina-${pagina}`);
  if (paginaEl) paginaEl.classList.remove('oculto');

  document.querySelectorAll('.nav-enlaces a').forEach(a => {
    a.classList.toggle('activo', a.dataset.pagina === pagina);
  });

  // Scroll suave al inicio de la página
  window.scrollTo({ top: 0, behavior: 'smooth' });

  switch (pagina) {
    case 'catalogo':
      filtrarProductos(); // Cargar productos del catálogo
      break;
    case 'carrito':
      cargarCarrito(); // Cargar items del carrito
      break;
    case 'pedidos':
      cargarPedidos(); // Cargar historial de pedidos
      break;
  }
}


function toggleMenuMovil() {
  document.getElementById('menu-movil').classList.toggle('visible');
}


window.addEventListener('scroll', () => {
  const btn = document.getElementById('btn-volver-arriba');
  btn.classList.toggle('visible', window.scrollY > 300);
});


document.addEventListener('DOMContentLoaded', () => {
  actualizarUIUsuario();
  cargarCategorias();
  cargarMarcas();
  cargarDestacados();
  cargarCarritoBadge();
});
