<!-- ===== PÁGINA: LOGIN ===== -->
<section id="pagina-login">
  <div class="formulario-contenedor">
    <div class="formulario-tarjeta">
      <h2>Iniciar Sesión</h2>
      <p class="formulario-subtitulo">Bienvenido de vuelta a LUXE Store</p>
      <form onsubmit="iniciarSesion(event)">
        <div class="campo-grupo">
          <label>Email</label>
          <input type="email" id="login-email" required placeholder="tu@email.com">
        </div>
        <div class="campo-grupo">
          <label>Contraseña</label>
          <input type="password" id="login-contrasena" required placeholder="Tu contraseña">
        </div>
        <button type="submit" class="btn-primario">Iniciar Sesión</button>
      </form>
      <p class="formulario-enlace">
        ¿No tienes cuenta? <a href="index.php?page=registro">Regístrate aquí</a>
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
