<!-- ===== PÁGINA: DETALLE PRODUCTO ===== -->
<section id="pagina-detalle">
  <div class="seccion contenedor">
    <button class="btn-volver" onclick="window.history.back()">
      ← Volver
    </button>
    <div class="detalle-producto" id="detalle-contenido">
      <div class="cargando">
        <div class="spinner"></div>
      </div>
    </div>
  </div>
</section>

<script>
  // Cargar detalle del producto
  document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get('id');
    
    if (productoId) {
      verDetalle(productoId);
    } else {
      document.getElementById('detalle-contenido').innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <h2>Producto no encontrado</h2>
          <p style="color: var(--color-texto-claro); margin: 20px 0;">El producto que buscas no existe.</p>
          <button class="btn-primario" onclick="window.location.href='index.php?page=catalogo'">Volver al Catálogo</button>
        </div>
      `;
    }
  });
</script>
