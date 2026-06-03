/* ============================================
   Carrusel del Hero
   ============================================ */

let slideActual = 0;
let intervaloCarrusel;

function iniciarCarrusel() {
  const slides = document.querySelectorAll('.hero-slide');
  const indicadores = document.querySelectorAll('.indicador');
  
  if (slides.length === 0) return;

  function mostrarSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('activo', i === index);
    });
    indicadores.forEach((ind, i) => {
      ind.classList.toggle('activo', i === index);
    });
  }

  function siguienteSlide() {
    slideActual = (slideActual + 1) % slides.length;
    mostrarSlide(slideActual);
  }

  function anteriorSlide() {
    slideActual = (slideActual - 1 + slides.length) % slides.length;
    mostrarSlide(slideActual);
  }

  function irASlide(index) {
    slideActual = index;
    mostrarSlide(slideActual);
    reiniciarIntervalo();
  }

  function reiniciarIntervalo() {
    clearInterval(intervaloCarrusel);
    intervaloCarrusel = setInterval(siguienteSlide, 5000);
  }

  // Configurar flechas
  const flechaIzq = document.querySelector('.flecha-izq');
  const flechaDer = document.querySelector('.flecha-der');
  
  if (flechaIzq) flechaIzq.addEventListener('click', () => {
    anteriorSlide();
    reiniciarIntervalo();
  });
  
  if (flechaDer) flechaDer.addEventListener('click', () => {
    siguienteSlide();
    reiniciarIntervalo();
  });

  // Configurar indicadores
  indicadores.forEach((ind, i) => {
    ind.addEventListener('click', () => irASlide(i));
  });

  // Iniciar carrusel automático
  intervaloCarrusel = setInterval(siguienteSlide, 5000);
  mostrarSlide(0);
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciarCarrusel);
} else {
  iniciarCarrusel();
}
