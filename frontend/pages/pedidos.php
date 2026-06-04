<!-- ===== PÁGINA: PEDIDOS ===== -->
<section id="pagina-pedidos">
  <div class="seccion contenedor">
    <button class="btn-volver" onclick="window.location.href='index.php?page=inicio'">
      ← Volver al Inicio
    </button>
    <div class="seccion-titulo">
      <h2>Mis Pedidos</h2>
      <p>Historial de tus compras</p>
      <div class="linea-decorativa"></div>
    </div>
    <div id="pedidos-contenido">
      <div class="cargando">
        <div class="spinner"></div>
      </div>
    </div>
  </div>
</section>

<script>
  // Cargar pedidos al cargar la página
  document.addEventListener('DOMContentLoaded', function() {
    if (!estaAutenticado()) {
      document.getElementById('pedidos-contenido').innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <h2>Inicia sesión para ver tus pedidos</h2>
          <p style="color: var(--color-texto-claro); margin: 20px 0;">Necesitas iniciar sesión para acceder a tu historial de pedidos.</p>
          <button class="btn-primario" onclick="window.location.href='index.php?page=login'">Iniciar Sesión</button>
        </div>
      `;
      return;
    }
    cargarPedidos();
  });
</script>
