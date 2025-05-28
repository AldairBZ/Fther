// Esperar a que cargue el DOM
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('fondo');
    const ctx = canvas.getContext('2d');
    let W, H;
  
    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
  
    // Confeti multicolor
    const confettiColors = ['#f94144','#f3722c','#f9c74f','#90be6d','#577590'];
    const confetti = Array.from({ length: 120 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 6 + 4,
      speed: Math.random() * 2 + 1,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      tilt: Math.random() * 10 - 5
    }));
  
    function drawConfetti() {
      confetti.forEach(c => {
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x + c.tilt, c.y + c.size);
        ctx.lineTo(c.x + c.tilt + c.size, c.y + c.tilt);
        ctx.closePath();
        ctx.fill();
  
        c.y += c.speed;
        c.x += Math.sin(c.y / 20);
        if (c.y > H) c.y = -10;
        if (c.x > W || c.x < 0) c.x = Math.random() * W;
      });
    }
  
    // Globos interactivos
    const balloonSources = ['globo-rojo.png', 'globo-azul.png', 'globo-verde.png'];
    const balloons = balloonSources.map(src => {
      const img = new Image(); img.src = src;
      return Array.from({ length: 5 }, () => ({ img, x: Math.random() * (W - 60), y: H + Math.random() * 200, speed: Math.random() * 1 + 0.5, size: 60, pop: false }));
    }).flat();
  
    function drawBalloons() {
      balloons.forEach(b => {
        if (!b.pop && b.img.complete) ctx.drawImage(b.img, b.x, b.y, b.size, b.size * 1.2);
        b.y -= b.speed;
        if (b.y < -80) b.y = H + Math.random() * 200;
      });
    }
  
    canvas.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      balloons.forEach(b => {
        if (!b.pop && mx > b.x && mx < b.x + b.size && my > b.y && my < b.y + b.size * 1.2) {
          b.pop = true;
          setTimeout(() => b.pop = false, 400);
        }
      });
    });
  
    // Lottie (personaje)
    lottie.loadAnimation({
      container: document.getElementById('animacion-personaje'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'personaje.json'
    });
  
    // Control de música con botón
    const btn = document.getElementById('play-music');
    const audio = document.getElementById('musica');
    btn.addEventListener('click', () => {
      audio.play().catch(err => console.log('Error al reproducir:', err));
      btn.style.display = 'none';
    });
  
    // Loop de animaciones
    function loop() {
      ctx.clearRect(0, 0, W, H);
      drawConfetti();
      drawBalloons();
      requestAnimationFrame(loop);
    }
    loop();
  });