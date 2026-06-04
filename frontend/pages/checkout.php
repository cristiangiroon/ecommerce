<!-- ===== PÁGINA: CHECKOUT ===== -->
<section id="pagina-checkout">
  <div class="seccion contenedor">
    <button class="btn-volver" onclick="window.location.href='index.php?page=carrito'">
      ← Volver al Carrito
    </button>
    <div class="seccion-titulo">
      <h2>Finalizar Compra</h2>
      <div class="linea-decorativa"></div>
    </div>
    <div class="checkout-grid">
      <div class="formulario-tarjeta">
        <h2>Datos de Envío</h2>
        <form id="formulario-checkout" onsubmit="procesarOrden(event)">
          <div class="campo-grupo">
            <label>Dirección de envío</label>
            <textarea id="checkout-direccion" rows="3" required placeholder="Calle, número, ciudad, código postal..."></textarea>
          </div>
          <div class="campo-grupo">
            <label>Método de pago</label>
            <select id="checkout-metodo-pago">
              <option value="tarjeta">Tarjeta de Crédito/Débito</option>
              <option value="transferencia">Transferencia Bancaria</option>
              <option value="efectivo">Pago en Efectivo</option>
            </select>
          </div>
          <div class="campo-grupo">
            <label>Notas adicionales (opcional)</label>
            <textarea id="checkout-notas" rows="2" placeholder="Instrucciones especiales de entrega..."></textarea>
          </div>
          <button type="submit" class="btn-primario">Confirmar Pedido</button>
        </form>
      </div>
      <div class="carrito-resumen" id="checkout-resumen">
        <div class="cargando">
          <div class="spinner"></div>
        </div>
      </div>
    </div>
  </div>
</section>

<script>
  // Cargar resumen del checkout
  document.addEventListener('DOMContentLoaded', function() {
    if (!estaAutenticado()) {
      window.location.href = 'index.php?page=login';
      return;
    }
    cargarResumenCheckout();
  });
</script>
