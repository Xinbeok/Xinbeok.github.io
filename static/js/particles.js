(function() {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  canvas.style.cssText = 'position:fixed;top:0;left:0;z-index:-1;';
  document.body.prepend(canvas);

  var w, h, particles = [], mouseX = -9999, mouseY = -9999;
  var COUNT = 130, MAX_DIST = 150;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', function(e) { mouseX = e.clientX; mouseY = e.clientY; });
    document.addEventListener('mouseleave', function() { mouseX = -9999; mouseY = -9999; });
  }

  function init() {
    particles = [];
    for (var i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        r: Math.random() * 2.5 + 1
      });
    }
  }
  init();
  window.addEventListener('resize', init);

  function draw() {
    var dark = document.documentElement.dataset.scheme === 'dark';

    // Background
    ctx.fillStyle = dark ? '#1a1a24' : '#f6f7f9';
    ctx.fillRect(0, 0, w, h);

    var pc = dark ? '180,210,255' : '80,120,200';
    var pa = dark ? 0.7 : 0.55;
    var la = dark ? 0.35 : 0.25;
    var ma = dark ? 0.45 : 0.35;
    var mc = dark ? '180,210,255' : '100,140,255';

    // Particle connections
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(' + pc + ',' + (1 - dist / MAX_DIST) * la + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Mouse connections
    if (mouseX > 0) {
      for (var i = 0; i < particles.length; i++) {
        var dxm = mouseX - particles[i].x;
        var dym = mouseY - particles[i].y;
        var distM = Math.sqrt(dxm * dxm + dym * dym);
        if (distM < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(mouseX, mouseY);
          ctx.lineTo(particles[i].x, particles[i].y);
          ctx.strokeStyle = 'rgba(' + mc + ',' + (1 - distM / MAX_DIST) * ma + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Update & draw particles
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      if (mouseX > 0) {
        var dxm = mouseX - p.x;
        var dym = mouseY - p.y;
        var distM = Math.sqrt(dxm * dxm + dym * dym);
        if (distM < 200) {
          p.vx += dxm * 0.00008;
          p.vy += dym * 0.00008;
        }
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;

      var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1.5) {
        p.vx = (p.vx / speed) * 1.5;
        p.vy = (p.vy / speed) * 1.5;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + pc + ',' + pa + ')';
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw();
})();
