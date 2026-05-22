  <!-- ========== ENCABEZADO ========== -->
  <header class="encabezado">
    <nav class="nav-contenedor">
      <a href="index.php?page=inicio" class="logo">LUXE<span>.</span></a>
      <ul class="nav-enlaces">
        <li><a href="index.php?page=inicio" class="<?php echo ($page ?? '') === 'inicio' ? 'activo' : ''; ?>" data-pagina="inicio">Inicio</a></li>
        <li><a href="index.php?page=catalogo" class="<?php echo ($page ?? '') === 'catalogo' ? 'activo' : ''; ?>" data-pagina="catalogo">Catálogo</a></li>
        <li><a href="index.php?page=carrito" class="<?php echo ($page ?? '') === 'carrito' ? 'activo' : ''; ?>" data-pagina="carrito">Carrito</a></li>
        <li><a href="index.php?page=pedidos" class="<?php echo ($page ?? '') === 'pedidos' ? 'activo' : ''; ?>" data-pagina="pedidos">Mis Pedidos</a></li>
      </ul>
      <div class="nav-acciones">
        <button class="btn-icono" onclick="window.location.href='index.php?page=carrito'" title="Carrito">
          &#128722;
          <span class="badge-carrito oculto" id="badge-carrito">0</span>
        </button>
        <button class="btn-icono" id="btn-usuario" onclick="toggleMenuUsuario()" title="Mi cuenta">
          &#128100;
        </button>
        <button class="btn-menu-movil" onclick="toggleMenuMovil()">&#9776;</button>
      </div>
    </nav>
  </header>

  <!-- ========== MENÚ MÓVIL ========== -->
  <div class="menu-movil" id="menu-movil">
    <div class="menu-movil-cabecera">
      <span class="logo">LUXE<span>.</span></span>
      <button class="btn-icono" onclick="toggleMenuMovil()">&#10005;</button>
    </div>
    <ul class="menu-movil-enlaces">
      <li><a href="index.php?page=inicio" onclick="toggleMenuMovil()">Inicio</a></li>
      <li><a href="index.php?page=catalogo" onclick="toggleMenuMovil()">Catálogo</a></li>
      <li><a href="index.php?page=carrito" onclick="toggleMenuMovil()">Carrito</a></li>
      <li><a href="index.php?page=pedidos" onclick="toggleMenuMovil()">Mis Pedidos</a></li>
      <li id="enlace-sesion-movil"><a href="index.php?page=login" onclick="toggleMenuMovil()">Iniciar Sesión</a></li>
    </ul>
  </div>

  <!-- ========== TOAST NOTIFICACIONES ========== -->
  <div class="toast-contenedor" id="toast-contenedor"></div>

  <!-- ========== CONTENIDO PRINCIPAL ========== -->
  <main id="contenido-principal">
