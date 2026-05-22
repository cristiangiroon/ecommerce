<!-- ===== PÁGINA: CATÁLOGO ===== -->
<section id="pagina-catalogo">
  <div class="seccion contenedor">
    <button class="btn-volver" onclick="window.history.back()">
      ← Volver
    </button>
    <div class="seccion-titulo">
      <h2>Nuestro Catálogo</h2>
      <p>Explora toda nuestra colección</p>
      <div class="linea-decorativa"></div>
    </div>
    <div class="filtros-barra">
      <input type="text" id="filtro-busqueda" placeholder="Buscar zapatos..." oninput="filtrarProductos()">
      <div class="filtros-grupo">
        <select id="filtro-categoria" onchange="filtrarProductos()">
          <option value="">Categoría</option>
        </select>
        <select id="filtro-genero" onchange="filtrarProductos()">
          <option value="">Género</option>
          <option value="hombre">Hombre</option>
          <option value="mujer">Mujer</option>
          <option value="unisex">Unisex</option>
        </select>
        <select id="filtro-marca" onchange="filtrarProductos()">
          <option value="">Marca</option>
        </select>
        <select id="filtro-orden" onchange="filtrarProductos()">
          <option value="">Ordenar por</option>
          <option value="precio_asc">Precio: Menor a Mayor</option>
          <option value="precio_desc">Precio: Mayor a Menor</option>
          <option value="nombre">Nombre A-Z</option>
          <option value="nuevo">Más Recientes</option>
        </select>
      </div>
    </div>
    <div class="productos-grid" id="productos-catalogo"></div>
    <div class="cargando oculto" id="cargando-productos">
      <div class="spinner"></div>
    </div>
  </div>
</section>

<script>
  // Cargar datos al cargar la página
  document.addEventListener('DOMContentLoaded', function() {
    cargarCategorias();
    cargarMarcas();
    filtrarProductos();
  });
</script>
