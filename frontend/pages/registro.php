<!-- ===== PÁGINA: REGISTRO ===== -->
<section id="pagina-registro">
  <div class="formulario-contenedor">
    <div class="formulario-tarjeta">
      <h2>Crear Cuenta</h2>
      <p class="formulario-subtitulo">Únete a la experiencia LUXE</p>
      <form onsubmit="registrarUsuario(event)">
        <div class="campo-grupo">
          <label>Nombre completo</label>
          <input type="text" id="registro-nombre" required placeholder="Tu nombre">
        </div>
        <div class="campo-grupo">
          <label>Email</label>
          <input type="email" id="registro-email" required placeholder="tu@email.com">
        </div>
        <div class="campo-grupo">
          <label>Teléfono (opcional)</label>
          <input type="tel" id="registro-telefono" placeholder="+1 234 567 8900">
        </div>
        <div class="campo-grupo">
          <label>Contraseña</label>
          <input type="password" id="registro-contrasena" required minlength="6" placeholder="Mínimo 6 caracteres">
        </div>
        <div class="campo-grupo">
          <label>Confirmar contraseña</label>
          <input type="password" id="registro-confirmar" required placeholder="Repite tu contraseña">
        </div>
        <button type="submit" class="btn-primario">Crear Cuenta</button>
      </form>
      <p class="formulario-enlace">
        ¿Ya tienes cuenta? <a href="index.php?page=login">Inicia sesión</a>
      </p>
    </div>
  </div>
</section>

<script>
  // Redirigir si ya está autenticado
  document.addEventListener('DOMContentLoaded', function() {
    if (estaAutenticado()) {
      window.location.href = 'index.php?page=inicio';
    }
  });
</script>
