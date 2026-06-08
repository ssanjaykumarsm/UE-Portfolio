/* ============================================================
   SCRIPT.JS — Sanjay Kumar SM Portfolio
   ============================================================ */

// ── PARTICLE CANVAS ──────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = -Math.random() * 0.8 - 0.2;
      this.opacity = Math.random() * 0.6 + 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
      // Red or white particles
      this.isRed = Math.random() < 0.35;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;
      const lifeRatio = this.life / this.maxLife;
      if (lifeRatio < 0.1) this.opacity = lifeRatio * 10 * 0.7;
      else if (lifeRatio > 0.7) this.opacity = (1 - lifeRatio) / 0.3 * 0.7;
      if (this.life >= this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      if (this.isRed) {
        ctx.shadowColor = 'hsl(0, 100%, 50%)';
        ctx.shadowBlur = 6;
        ctx.fillStyle = 'hsl(0, 100%, 60%)';
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
      }
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 120; i++) {
    const p = new Particle();
    p.life = Math.floor(Math.random() * p.maxLife);
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 100) * 0.08;
          ctx.strokeStyle = particles[i].isRed ? 'hsl(0,100%,50%)' : 'rgba(255,255,255,1)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(animate);
  }
  animate();

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else animate();
  });
})();

// ── TYPEWRITER ────────────────────────────────────────────────
(function typewriter() {
  const el = document.getElementById('dynamicText');
  if (!el) return;
  const words = ['Developer', 'Designer', 'Level Artist', 'AI Programmer', 'Creator'];
  let wordIndex = 0, charIndex = 0, isDeleting = false;

  function type() {
    const word = words[wordIndex];
    if (!isDeleting) {
      el.textContent = word.slice(0, ++charIndex);
      if (charIndex === word.length) {
        isDeleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = word.slice(0, --charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(type, isDeleting ? 60 : 100);
  }
  type();
})();

// ── NAVBAR ────────────────────────────────────────────────────
(function navbar() {
  const nav = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links = navLinks ? navLinks.querySelectorAll('.nav-link') : [];

  window.addEventListener('scroll', () => {
    nav && nav.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveLink();
  });

  hamburger && hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks && navLinks.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger && hamburger.classList.remove('open');
      navLinks && navLinks.classList.remove('open');
    });
  });

  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === '#' + current) l.classList.add('active');
    });
  }
})();

// ── SCROLL REVEAL ─────────────────────────────────────────────
(function scrollReveal() {
  const elements = document.querySelectorAll(
    '.skill-category, .service-card, .project-card, .timeline-card, .contact-card, .section-header, .about-grid, .tech-badge'
  );
  elements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

// ── SKILL BARS ────────────────────────────────────────────────
(function skillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const w = bar.getAttribute('data-width');
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();

// ── PROJECT GALLERY ───────────────────────────────────────────
function switchGallery(index, galleryId) {
  const gallery = document.getElementById(galleryId);
  if (!gallery) return;
  const imgs = gallery.querySelectorAll('.gallery-img');
  const thumbs = gallery.querySelectorAll('.thumb');
  imgs.forEach((img, i) => img.classList.toggle('active', i === index));
  thumbs.forEach((thumb, i) => thumb.classList.toggle('active', i === index));
}

// Auto-slideshow for galleries
(function autoSlide() {
  const galleries = [
    { id: 'shooterGallery', count: 2 },
    { id: 'envGallery', count: 3 }
  ];
  galleries.forEach(({ id, count }) => {
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % count;
      switchGallery(idx, id);
    }, 4000);
  });
})();

// ── CONTACT FORM ──────────────────────────────────────────────
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const note = document.getElementById('formNote');
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const subject = document.getElementById('contactSubject').value.trim();
  const msg = document.getElementById('contactMsg').value.trim();

  // Build mailto link
  const mailtoLink = `mailto:ssanjaykumarsm@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`)}`;

  btn.innerHTML = '<span>Sending...</span>';
  btn.disabled = true;

  setTimeout(() => {
    window.location.href = mailtoLink;
    btn.innerHTML = `<span>Message Sent!</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
    btn.style.background = 'linear-gradient(135deg, #15803d, #22c55e)';
    note.textContent = '✓ Your email client has been opened. Thank you!';
    setTimeout(() => {
      btn.innerHTML = `<span>Send Message</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
      btn.style.background = '';
      btn.disabled = false;
      note.textContent = '';
      e.target.reset();
    }, 4000);
  }, 800);
}

// ── 3D CARD TILT ──────────────────────────────────────────────
(function cardTilt() {
  const cards = document.querySelectorAll('.service-card, .skill-category');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ── CURSOR GLOW ───────────────────────────────────────────────
(function cursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999; border-radius: 50%;
    width: 300px; height: 300px; margin: -150px 0 0 -150px;
    background: radial-gradient(ellipse at center, hsla(0,100%,50%,0.04) 0%, transparent 70%);
    transition: transform 0.1s ease; will-change: transform;
  `;
  document.body.appendChild(glow);
  let mx = 0, my = 0, gx = 0, gy = 0;

  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

  function animGlow() {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    glow.style.transform = `translate(${gx}px, ${gy}px)`;
    requestAnimationFrame(animGlow);
  }
  animGlow();
})();

// ── SMOOTH SCROLL ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── IMAGE ERROR FALLBACK ──────────────────────────────────────
(function imageErrorHandling() {
  const imgs = document.querySelectorAll('.gallery-img, .thumb img');
  imgs.forEach(img => {
    img.addEventListener('error', function() {
      // Hide broken image, let CSS background show
      this.style.opacity = '0';
      this.style.pointerEvents = 'none';
    });
    img.addEventListener('load', function() {
      this.style.opacity = '';
    });
  });
})();


// ── COUNTER ANIMATION for hero stats ─────────────────────────
(function animateCounters() {
  const nums = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const hasPlus = text.includes('+');
        const target = parseInt(text);
        if (isNaN(target)) return;
        let start = 0;
        const duration = 1500;
        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(ease * target) + (hasPlus ? '+' : '');
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  nums.forEach(n => observer.observe(n));
})();
