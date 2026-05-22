<!-- ===== PÁGINA: INICIO ===== -->
<section id="pagina-inicio">
  <div class="hero">
    <div class="hero-carrusel">
      <!-- Slide 1 -->
      <div class="hero-slide hero-slide-1 activo">
        <div class="hero-contenido">
          <h1>Encuentra tu estilo<br><span class="resaltado">perfecto</span></h1>
          <p>Descubre nuestra colección exclusiva de calzado premium. Calidad, estilo y confort en cada paso.</p>
          <button class="btn-primario" onclick="window.location.href='index.php?page=catalogo'">Explorar Catálogo</button>
        </div>
      </div>
      <!-- Slide 2 -->
      <div class="hero-slide hero-slide-2">
        <div class="hero-contenido">
          <h1>Ofertas<br><span class="resaltado">increíbles</span></h1>
          <p>Hasta 50% de descuento en productos seleccionados. No te pierdas estas ofertas exclusivas.</p>
          <button class="btn-primario" onclick="window.location.href='index.php?page=catalogo'">Ver Ofertas</button>
        </div>
      </div>
      <!-- Slide 3 -->
      <div class="hero-slide hero-slide-3">
        <div class="hero-contenido">
          <h1>Nuevas<br><span class="resaltado">colecciones</span></h1>
          <p>Las últimas tendencias en calzado ya están aquí. Renueva tu estilo con nuestras novedades.</p>
          <button class="btn-primario" onclick="window.location.href='index.php?page=catalogo'">Ver Novedades</button>
        </div>
      </div>
    </div>
    <!-- Flechas de navegación -->
    <div class="hero-flechas">
      <button class="flecha flecha-izq">&#8249;</button>
      <button class="flecha flecha-der">&#8250;</button>
    </div>
    <!-- Indicadores -->
    <div class="hero-indicadores">
      <span class="indicador activo"></span>
      <span class="indicador"></span>
      <span class="indicador"></span>
    </div>
  </div>

  <!-- Categorías -->
  <div class="seccion contenedor">
    <div class="seccion-titulo">
      <h2>Categorías</h2>
      <p>Encuentra exactamente lo que buscas</p>
      <div class="linea-decorativa"></div>
    </div>
    <div class="categorias-grid" id="categorias-grid"></div>
  </div>

  <!-- Productos Destacados -->
  <div class="seccion contenedor">
    <div class="seccion-titulo">
      <h2>Productos Destacados</h2>
      <p>Los favoritos de nuestros clientes</p>
      <div class="linea-decorativa"></div>
    </div>
    <div class="productos-grid" id="productos-destacados"></div>
  </div>
</section>

<script>
  // Cargar datos al cargar la página
  document.addEventListener('DOMContentLoaded', function() {
    cargarCategorias();
    cargarDestacados();
  });
</script>
