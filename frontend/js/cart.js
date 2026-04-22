/* ============================================
   Módulo de Carrito
   ============================================ */

/**
 * Agrega un producto al carrito del usuario
 * @param {number} productoId - ID del producto a agregar
 * @param {number} cantidad - Cantidad de unidades (por defecto 1)
 * @param {string|null} talla - Talla seleccionada (opcional)
 * 
 */
async function agregarAlCarrito(productoId, cantidad = 1, talla = null) {
  if (!requiereAuth()) return;

  try {
    await peticionAPI(CONFIG.ENDPOINTS.carritoAgregar, {
      method: 'POST',
      body: JSON.stringify({
        producto_id: productoId,
        cantidad,
        talla: talla || tallaSeleccionada, 
      }),
    });

    mostrarToast('Producto agregado al carrito', 'exito');
    cargarCarritoBadge(); // Actualizar contador del carrito
  } catch (error) {
    mostrarToast(error.message, 'error');
  }
}

/**
 * Carga y renderiza el contenido del carrito de compras

 */
async function cargarCarrito() {
  if (!estaAutenticado()) {
    document.getElementById('carrito-contenido').innerHTML = `
      <div class="carrito-vacio">
        <h2>Tu carrito está vacío</h2>
        <p>Inicia sesión para ver tu carrito</p>
        <button class="btn-primario" onclick="navegarA('login')">Iniciar Sesión</button>
      </div>
    `;
    return;
  }

  try {
    const datos = await peticionAPI(CONFIG.ENDPOINTS.carrito);
    const contenedor = document.getElementById('carrito-contenido');

    if (datos.items.length === 0) {
      contenedor.innerHTML = `
        <div class="carrito-vacio">
          <h2>Tu carrito está vacío</h2>
          <p>Explora nuestro catálogo y encuentra lo que buscas</p>
          <button class="btn-primario" onclick="navegarA('catalogo')">Ir al Catálogo</button>
        </div>
      `;
      return;
    }

    // Renderizar items del carrito y resumen
    contenedor.innerHTML = `
      <div class="carrito-items">
        ${datos.items.map(item => `
          <div class="carrito-item">
            <img src="${item.imagen_url}" alt="${item.nombre}" class="carrito-item-imagen"
                 onerror="this.style.background='#f0f0f5'">
            <div class="carrito-item-info">
              <div>
                <div class="carrito-item-nombre">${item.nombre}</div>
                ${item.talla ? `<div class="carrito-item-talla">Talla: ${item.talla}</div>` : ''}
              </div>
              <div class="carrito-item-controles">
                <button class="btn-cantidad" onclick="actualizarCantidadCarrito(${item.id}, ${item.cantidad - 1})">-</button>
                <span>${item.cantidad}</span>
                <button class="btn-cantidad" onclick="actualizarCantidadCarrito(${item.id}, ${item.cantidad + 1})">+</button>
                <span class="carrito-item-precio">${formatearPrecio((item.precio_oferta || item.precio) * item.cantidad)}</span>
                <button class="btn-eliminar-item" onclick="eliminarDelCarrito(${item.id})">&#10005;</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="carrito-resumen">
        <div class="resumen-linea">
          <span>Subtotal (${datos.cantidad_items} items)</span>
          <span>${formatearPrecio(datos.total)}</span>
        </div>
        <div class="resumen-linea">
          <span>Envío</span>
          <span style="color: #4caf50; font-weight:600;">Gratis</span>
        </div>
        <div class="resumen-total">
          <span>Total</span>
          <span>${formatearPrecio(datos.total)}</span>
        </div>
        <div style="margin-top:20px; display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn-primario" onclick="irACheckout()" style="flex:1;">Finalizar Compra</button>
          <button class="btn-secundario" onclick="vaciarCarrito()" style="flex:0;">Vaciar</button>
        </div>
      </div>
    `;
  } catch (error) {
    mostrarToast('Error al cargar el carrito', 'error');
  }
}

/**
 * Actualiza la cantidad de un item en el carrito
 * @param {number} itemId - ID del item en el carrito
 * @param {number} nuevaCantidad - Nueva cantidad deseada

 */
async function actualizarCantidadCarrito(itemId, nuevaCantidad) {
  // Si la cantidad es menor a 1, eliminar el item
  if (nuevaCantidad < 1) {
    eliminarDelCarrito(itemId);
    return;
  }

  try {
    await peticionAPI(`${CONFIG.ENDPOINTS.carrito}/item/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ cantidad: nuevaCantidad }),
    });
    cargarCarrito(); // Recargar vista del carrito
    cargarCarritoBadge(); // Actualizar badge
  } catch (error) {
    mostrarToast(error.message, 'error');
  }
}

async function eliminarDelCarrito(itemId) {
  try {
    await peticionAPI(`${CONFIG.ENDPOINTS.carrito}/item/${itemId}`, {
      method: 'DELETE',
    });
    mostrarToast('Producto eliminado', 'info');
    cargarCarrito();
    cargarCarritoBadge();
  } catch (error) {
    mostrarToast(error.message, 'error');
  }
}

async function vaciarCarrito() {
  if (!confirm('¿Estás seguro de vaciar el carrito?')) return;

  try {
    await peticionAPI(CONFIG.ENDPOINTS.carritoVaciar, { method: 'DELETE' });
    mostrarToast('Carrito vaciado', 'info');
    cargarCarrito();
    cargarCarritoBadge();
  } catch (error) {
    mostrarToast(error.message, 'error');
  }
}

/**
 * Actualiza el badge (contador) del carrito en el header
 * Muestra el número total de items en el carrito
 */
async function cargarCarritoBadge() {
  if (!estaAutenticado()) {
    document.getElementById('badge-carrito').classList.add('oculto');
    return;
  }

  try {
    const datos = await peticionAPI(CONFIG.ENDPOINTS.carrito);
    const badge = document.getElementById('badge-carrito');
    
    if (datos.cantidad_items > 0) {
      badge.textContent = datos.cantidad_items;
      badge.classList.remove('oculto');
    } else {
      badge.classList.add('oculto');
    }
  } catch {
  }
}

function irACheckout() {
  navegarA('checkout');
  cargarResumenCheckout();
}

async function cargarResumenCheckout() {
  try {
    const datos = await peticionAPI(CONFIG.ENDPOINTS.carrito);
    const resumen = document.getElementById('checkout-resumen');

    resumen.innerHTML = `
      <h3 style="margin-bottom:16px; color:var(--color-primario);">Resumen del Pedido</h3>
      ${datos.items.map(item => `
        <div class="resumen-linea">
          <span>${item.nombre} x${item.cantidad}</span>
          <span>${formatearPrecio((item.precio_oferta || item.precio) * item.cantidad)}</span>
        </div>
      `).join('')}
      <div class="resumen-total">
        <span>Total a pagar</span>
        <span>${formatearPrecio(datos.total)}</span>
      </div>
    `;
  } catch (error) {
    mostrarToast('Error al cargar resumen', 'error');
  }
}
