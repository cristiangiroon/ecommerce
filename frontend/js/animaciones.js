/* ============================================
   Configuración de Animaciones
   Personaliza las velocidades y duraciones
   ============================================ */

// Configuración del carrusel
const CAROUSEL_CONFIG = {
  autoPlayInterval: 5000, // Cambiar slide cada 5 segundos
  transitionDuration: 1000, // Duración de la transición en ms
  pauseOnHover: true // Pausar al pasar el mouse
};

// Configuración de animaciones
const ANIMATION_CONFIG = {
  fadeInDuration: '0.6s',
  slideInDuration: '0.5s',
  hoverTransition: '0.3s',
  pulseInterval: '2s',
  bounceInterval: '2s'
};

// Aplicar configuración al carrusel
function aplicarConfigCarrusel() {
  const hero = document.querySelector('.hero');
  
  if (hero && CAROUSEL_CONFIG.pauseOnHover) {
    hero.addEventListener('mouseenter', () => {
      clearInterval(intervaloCarrusel);
    });
    
    hero.addEventListener('mouseleave', () => {
      intervaloCarrusel = setInterval(() => {
        slideActual = (slideActual + 1) % document.querySelectorAll('.hero-slide').length;
        mostrarSlide(slideActual);
      }, CAROUSEL_CONFIG.autoPlayInterval);
    });
  }
}

// Función para agregar efecto de parallax al scroll
function efectoParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-contenido');
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
      heroContent.style.opacity = 1 - (scrolled / 500);
    }
  });
}

// Función para agregar efecto de aparición al hacer scroll
function animarAlScroll() {
  const elementos = document.querySelectorAll('.producto-tarjeta, .categoria-tarjeta, .pedido-tarjeta');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1
  });
  
  elementos.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Función para agregar efecto de cursor personalizado
function cursorPersonalizado() {
  const cursor = document.createElement('div');
  cursor.className = 'cursor-personalizado';
  cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-cyan);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.2s ease;
    display: none;
  `;
  document.body.appendChild(cursor);
  
  document.addEventListener('mousemove', (e) => {
    cursor.style.display = 'block';
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
  });
  
  document.querySelectorAll('button, a, .producto-tarjeta').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(1.5)';
      cursor.style.borderColor = 'var(--color-acento)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursor.style.borderColor = 'var(--color-cyan)';
    });
  });
}

// Función para agregar efecto de partículas en el fondo
function particulasFondo() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
    opacity: 0.3;
  `;
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particulas = [];
  const numParticulas = 50;
  
  for (let i = 0; i < numParticulas; i++) {
    particulas.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radio: Math.random() * 2 + 1
    });
  }
  
  function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particulas.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
      ctx.fillStyle = '#0ce3e8';
      ctx.fill();
    });
    
    requestAnimationFrame(animar);
  }
  
  animar();
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Inicializar efectos opcionales
function inicializarEfectos() {
  // Descomentar los efectos que desees activar:
  
  // aplicarConfigCarrusel();
  // efectoParallax();
  animarAlScroll();
  // cursorPersonalizado(); // Solo para desktop
  // particulasFondo(); // Puede afectar el rendimiento
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarEfectos);
} else {
  inicializarEfectos();
}
