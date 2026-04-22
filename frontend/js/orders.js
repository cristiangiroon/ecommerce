/* ============================================
   Módulo de Órdenes / Pedidos
   ============================================ */

/**
 * Procesa y crea una nueva orden de compra
 * @param {Event} evento - Evento submit del formulario de checkout
 */
async function procesarOrden(evento) {
  evento.preventDefault();

  const direccion = document.getElementById('checkout-direccion').value.trim();
  const metodoPago = document.getElementById('checkout-metodo-pago').value;
  const notas = document.getElementById('checkout-notas').value.trim();

  if (!direccion) {
    mostrarToast('La dirección de envío es obligatoria', 'error');
    return;
  }

  try {
    const datos = await peticionAPI(CONFIG.ENDPOINTS.ordenes, {
      method: 'POST',
      body: JSON.stringify({
        direccion_envio: direccion,
        metodo_pago: metodoPago,
        notas,
      }),
    });

    mostrarToast('Pedido realizado con éxito', 'exito');
    cargarCarritoBadge(); 
    navegarA('pedidos'); 
    cargarPedidos(); 
  } catch (error) {
    mostrarToast(error.message, 'error');
  }
}

/**
 * Carga y muestra el historial de pedidos del usuario
 */
async function cargarPedidos() {
  if (!requiereAuth()) return;

  try {
    const datos = await peticionAPI(CONFIG.ENDPOINTS.ordenes);
    const contenedor = document.getElementById('pedidos-contenido');

    if (datos.ordenes.length === 0) {
      contenedor.innerHTML = `
        <div class="carrito-vacio">
          <h2>No tienes pedidos</h2>
          <p>Realiza tu primera compra en LUXE Store</p>
          <button class="btn-primario" onclick="navegarA('catalogo')">Ir al Catálogo</button>
        </div>
      `;
      return;
    }

    contenedor.innerHTML = datos.ordenes.map(orden => `
      <div class="pedido-tarjeta">
        <div class="pedido-cabecera">
          <span class="pedido-id">Pedido #${orden.id}</span>
          <span class="pedido-estado estado-${orden.estado}">${orden.estado.charAt(0).toUpperCase() + orden.estado.slice(1)}</span>
        </div>
        <div class="resumen-linea">
          <span class="pedido-fecha">${formatearFecha(orden.creado_en)}</span>
          <span class="pedido-total">${formatearPrecio(orden.total)}</span>
        </div>
        <div class="resumen-linea" style="font-size:0.85rem; color:var(--color-texto-claro);">
          <span>Pago: ${orden.metodo_pago}</span>
        </div>
        <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn-ver-detalle" onclick="verDetalleOrden(${orden.id})">Ver Detalle</button>
          ${orden.estado === 'pendiente' ? `
            <button class="btn-ver-detalle" style="color:var(--color-acento);" onclick="cancelarOrden(${orden.id})">Cancelar</button>
          ` : ''}
        </div>
      </div>
    `).join('');
  } catch (error) {
    mostrarToast('Error al cargar pedidos', 'error');
  }
}

/**
 * Muestra el detalle completo de una orden en un modal
 * @param {number} ordenId - ID de la orden a mostrar
 */
async function verDetalleOrden(ordenId) {
  try {
    const datos = await peticionAPI(`${CONFIG.ENDPOINTS.ordenes}/${ordenId}`);
    const { orden, items } = datos;

    const modal = document.createElement('div');
    modal.className = 'modal-fondo';
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    modal.innerHTML = `
      <div class="modal-contenido">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <h2 style="color:var(--color-primario);">Pedido #${orden.id}</h2>
          <button onclick="this.closest('.modal-fondo').remove()" style="background:none; font-size:1.5rem; color:var(--color-texto-claro);">&#10005;</button>
        </div>
        <div class="resumen-linea">
          <span>Estado:</span>
          <span class="pedido-estado estado-${orden.estado}">${orden.estado}</span>
        </div>
        <div class="resumen-linea">
          <span>Fecha:</span>
          <span>${formatearFecha(orden.creado_en)}</span>
        </div>
        <div class="resumen-linea">
          <span>Método de pago:</span>
          <span>${orden.metodo_pago}</span>
        </div>
        <div style="margin:16px 0; padding:12px; background:var(--color-fondo); border-radius:8px;">
          <strong>Dirección de envío:</strong><br>
          <span style="color:var(--color-texto-claro);">${orden.direccion_envio}</span>
        </div>
        <h3 style="margin:16px 0 12px; color:var(--color-primario);">Productos</h3>
        ${items.map(item => `
          <div style="display:flex; gap:12px; padding:10px 0; border-bottom:1px solid var(--color-borde);">
            <img src="${item.imagen_url}" style="width:50px; height:50px; object-fit:cover; border-radius:6px;"
                 onerror="this.style.background='#f0f0f5'">
            <div style="flex:1;">
              <div style="font-weight:600;">${item.nombre}</div>
              <div style="font-size:0.85rem; color:var(--color-texto-claro);">
                ${item.talla ? `Talla: ${item.talla} | ` : ''}Cant: ${item.cantidad}
              </div>
            </div>
            <div style="font-weight:700; color:var(--color-acento);">${formatearPrecio(item.precio_unitario * item.cantidad)}</div>
          </div>
        `).join('')}
        <div class="resumen-total">
          <span>Total</span>
          <span>${formatearPrecio(orden.total)}</span>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  } catch (error) {
    mostrarToast('Error al cargar detalle del pedido', 'error');
  }
}

/**
 * Cancela una orden pendiente
 * @param {number} ordenId - ID de la orden a cancelar

 */
async function cancelarOrden(ordenId) {
  if (!confirm('¿Estás seguro de cancelar este pedido?')) return;

  try {
    await peticionAPI(`${CONFIG.ENDPOINTS.ordenes}/${ordenId}/cancelar`, {
      method: 'PUT',
    });
    
    mostrarToast('Pedido cancelado', 'info');
    cargarPedidos(); 
  } catch (error) {
    mostrarToast(error.message, 'error');
  }
}
