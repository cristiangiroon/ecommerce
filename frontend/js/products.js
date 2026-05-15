/* ============================================
   Módulo de Productos
   ============================================ */

const ICONOS_CATEGORIA = {
  'Deportivos': '&#127939;',
  'Casuales': '&#128094;',
  'Formales': '&#128084;',
  'Botas': '&#129455;',
  'Sandalias': '&#129487;',
};

/**
 */
async function cargarCategorias() {
  try {
    const datos = await peticionAPI(CONFIG.ENDPOINTS.categorias);
    const grid = document.getElementById('categorias-grid');
    const select = document.getElementById('filtro-categoria');

    grid.innerHTML = datos.categorias.map(cat => `
      <div class="categoria-tarjeta" onclick="filtrarPorCategoria(${cat.id})">
        <div class="categoria-icono">${ICONOS_CATEGORIA[cat.nombre] || '&#128095;'}</div>
        <div class="categoria-nombre">${cat.nombre}</div>
      </div>
    `).join('');

    datos.categorias.forEach(cat => {
      const opcion = document.createElement('option');
      opcion.value = cat.id;
      opcion.textContent = cat.nombre;
      select.appendChild(opcion);
    });
  } catch (error) {
    console.error('Error al cargar categorías:', error);
  }
}

async function cargarMarcas() {
  try {
    const datos = await peticionAPI(CONFIG.ENDPOINTS.marcas);
    const select = document.getElementById('filtro-marca');
    datos.marcas.forEach(marca => {
      const opcion = document.createElement('option');
      opcion.value = marca;
      opcion.textContent = marca;
      select.appendChild(opcion);
    });
  } catch (error) {
    console.error('Error al cargar marcas:', error);
  }
}

async function cargarDestacados() {
  try {
    const datos = await peticionAPI(CONFIG.ENDPOINTS.destacados);
    renderizarProductos(datos.productos, 'productos-destacados');
  } catch (error) {
    console.error('Error al cargar destacados:', error);
  }
}

/**
 * Filtra y carga productos según los criterios seleccionados
 */
async function filtrarProductos() {
  const busqueda = document.getElementById('filtro-busqueda').value;
  const categoria = document.getElementById('filtro-categoria').value;
  const genero = document.getElementById('filtro-genero').value;
  const marca = document.getElementById('filtro-marca').value;
  const orden = document.getElementById('filtro-orden').value;

  const params = new URLSearchParams();
  if (busqueda) params.append('busqueda', busqueda);
  if (categoria) params.append('categoria', categoria);
  if (genero) params.append('genero', genero);
  if (marca) params.append('marca', marca);
  if (orden) params.append('orden', orden);

  try {
    document.getElementById('cargando-productos').classList.remove('oculto');
    
    const datos = await peticionAPI(`${CONFIG.ENDPOINTS.productos}?${params.toString()}`);
    
    renderizarProductos(datos.productos, 'productos-catalogo');
  } catch (error) {
    mostrarToast('Error al cargar productos', 'error');
  } finally {
    document.getElementById('cargando-productos').classList.add('oculto');
  }
}

function filtrarPorCategoria(categoriaId) {
  navegarA('catalogo');
  document.getElementById('filtro-categoria').value = categoriaId;
  filtrarProductos();
}

/**
 * Renderiza una lista de productos en el contenedor especificado
 * @param {Array} productos - Array de objetos producto
 * @param {string} contenedorId - ID del elemento HTML donde renderizar
 * 
 */
function renderizarProductos(productos, contenedorId) {
  const contenedor = document.getElementById(contenedorId);

  // Si no hay productos, mostrar mensaje
  if (productos.length === 0) {
    contenedor.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--color-texto-claro);">
        <p style="font-size:1.2rem;">No se encontraron productos</p>
      </div>
    `;
    return;
  }

  contenedor.innerHTML = productos.map(p => {
    const tieneOferta = p.precio_oferta && parseFloat(p.precio_oferta) < parseFloat(p.precio);
    const descuento = tieneOferta
      ? Math.round((1 - p.precio_oferta / p.precio) * 100)
      : 0;

    return `
      <div class="producto-tarjeta" onclick="verDetalle(${p.id})">
        <img src="${p.imagen_url}" alt="${p.nombre}" class="producto-imagen"
             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 220%22><rect fill=%22%23f0f0f5%22 width=%22300%22 height=%22220%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2218%22>LUXE</text></svg>'">
        <div class="producto-info">
          <div class="producto-marca">${p.marca}</div>
          <div class="producto-nombre">${p.nombre}</div>
          <div class="producto-categoria">${p.categoria_nombre || ''}</div>
          <div class="producto-precios">
            <span class="precio-actual">${formatearPrecio(tieneOferta ? p.precio_oferta : p.precio)}</span>
            ${tieneOferta ? `<span class="precio-original">${formatearPrecio(p.precio)}</span>
            <span class="etiqueta-oferta">-${descuento}%</span>` : ''}
          </div>
          <div class="producto-acciones" onclick="event.stopPropagation()">
            <button class="btn-ver-detalle" onclick="verDetalle(${p.id})" style="flex: 1;">Ver detalles</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Muestra la página de detalle de un producto específico
 * @param {number} productoId - ID del producto a mostrar

 */
async function verDetalle(productoId) {
  try {
    const datos = await peticionAPI(`${CONFIG.ENDPOINTS.productos}/${productoId}`);
    const p = datos.producto;
    
    const tieneOferta = p.precio_oferta && parseFloat(p.precio_oferta) < parseFloat(p.precio);
    
    const tallas = p.tallas ? p.tallas.split(',') : [];

    // Renderizar vista de detalle
    const contenedor = document.getElementById('detalle-contenido');
    contenedor.innerHTML = `
      <img src="${p.imagen_url}" alt="${p.nombre}" class="detalle-imagen"
           onerror="this.style.background='#f0f0f5'">
      <div class="detalle-info">
        <div class="producto-marca">${p.marca} | ${p.categoria_nombre || ''} | ${p.genero}</div>
        <h1>${p.nombre}</h1>
        <p class="detalle-descripcion">${p.descripcion}</p>
        <div class="detalle-precios">
          <span class="precio-actual">${formatearPrecio(tieneOferta ? p.precio_oferta : p.precio)}</span>
          ${tieneOferta ? `<span class="precio-original">${formatearPrecio(p.precio)}</span>` : ''}
        </div>

        ${tallas.length > 0 ? `
          <div class="selector-talla">
            <label>Talla:</label>
            <div class="tallas-grid">
              ${tallas.map(t => `
                <button class="talla-boton" onclick="seleccionarTalla(this, '${t.trim()}')">${t.trim()}</button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="selector-cantidad">
          <label>Cantidad:</label>
          <div class="cantidad-control">
            <button onclick="cambiarCantidadDetalle(-1)">-</button>
            <span id="detalle-cantidad">1</span>
            <button onclick="cambiarCantidadDetalle(1)">+</button>
          </div>
        </div>

        <p class="stock-info ${p.stock < 10 ? 'bajo' : ''}">
          ${p.stock > 0 ? `${p.stock} unidades disponibles` : 'Agotado'}
        </p>

        <div class="detalle-acciones">
          <button class="btn-primario" onclick="agregarAlCarritoDetalle(${p.id})" ${p.stock === 0 ? 'disabled' : ''}>
            ${p.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
          </button>
        </div>
      </div>
    `;

    navegarA('detalle');
  } catch (error) {
    mostrarToast('Error al cargar el producto', 'error');
  }
}

// Variable global para almacenar la talla seleccionada
let tallaSeleccionada = null;

/**
 * Maneja la selección de talla en la página de detalle
 * @param {HTMLElement} boton - Botón de talla clickeado
 * @param {string} talla - Valor de la talla seleccionada
 */
function seleccionarTalla(boton, talla) {
  document.querySelectorAll('.talla-boton').forEach(b => b.classList.remove('seleccionada'));
  
  boton.classList.add('seleccionada');
  
  tallaSeleccionada = talla;
}

/**
 * Cambia la cantidad en el selector de la página de detalle
 * @param {number} cambio - Incremento o decremento (-1 o +1)
 */
function cambiarCantidadDetalle(cambio) {
  const el = document.getElementById('detalle-cantidad');
  let cantidad = parseInt(el.textContent) + cambio;
  
  if (cantidad < 1) cantidad = 1;
  if (cantidad > 10) cantidad = 10;
  
  el.textContent = cantidad;
}

/**
 * @param {number} productoId - ID del producto
 */
function agregarAlCarritoDetalle(productoId) {
  const tallas = document.querySelectorAll('.talla-boton');
  
  if (tallas.length > 0 && !tallaSeleccionada) {
    mostrarToast('Por favor, selecciona una talla antes de agregar al carrito', 'error');
    return;
  }
  
  const cantidad = parseInt(document.getElementById('detalle-cantidad').textContent);
  agregarAlCarrito(productoId, cantidad, tallaSeleccionada);
  tallaSeleccionada = null;
}
