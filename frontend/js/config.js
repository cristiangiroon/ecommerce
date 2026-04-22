/* ============================================
   Configuración Global del Frontend
   ============================================ */

/**
 * Objeto de configuración centralizada
 * 
 * API_URL: URL base del servidor backend
 * ENDPOINTS: Mapeo de todas las rutas del API disponibles
 */
const CONFIG = {
  // URL base del backend (cambiar según entorno)
  API_URL: 'http://localhost:3000',
  
  // Endpoints del API REST
  ENDPOINTS: {
    // Autenticación
    login: '/api/auth/login',
    registro: '/api/auth/registro',
    perfil: '/api/auth/perfil',
    
    // Productos
    productos: '/api/productos',
    productoDetalle: '/api/productos', // + /:id
    destacados: '/api/productos/destacados',
    categorias: '/api/productos/categorias',
    marcas: '/api/productos/marcas',
    
    // Carrito de compras
    carrito: '/api/carrito',
    carritoAgregar: '/api/carrito/agregar',
    carritoActualizar: '/api/carrito/item', // + /:id (PUT)
    carritoEliminar: '/api/carrito/item', // + /:id (DELETE)
    carritoVaciar: '/api/carrito/vaciar',
    
    // Órdenes/Pedidos
    ordenes: '/api/ordenes',
    ordenDetalle: '/api/ordenes', // + /:id
    ordenCancelar: '/api/ordenes', // + /:id/cancelar
  },
};
