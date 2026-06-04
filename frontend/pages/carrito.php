<!-- ===== PÁGINA: CARRITO ===== -->
<section id="pagina-carrito">
  <div class="seccion contenedor">
    <button class="btn-volver" onclick="window.history.back()">
      ← Volver
    </button>
    <div class="seccion-titulo">
      <h2>Tu Carrito</h2>
      <div class="linea-decorativa"></div>
    </div>
    <div id="carrito-contenido">
      <div class="cargando">
        <div class="spinner"></div>
      </div>
    </div>
  </div>
</section>

<script>
  // Cargar carrito al cargar la página
  document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();
  });
</script>
