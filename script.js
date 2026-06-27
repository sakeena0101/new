/* ========================================
   MALK AGENCY - JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ======= LOADER =======
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hide');
    document.body.style.overflow = 'visible';
  }, 2200);
  document.body.style.overflow = 'hidden';

  // ======= CUSTOM CURSOR =======
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .service-card, .ind-card, .port-card, .why-item, .checkbox-label').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // ======= NAVBAR =======
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Active nav link
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });

  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });

  // ======= SCROLL ANIMATIONS =======
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // ======= COUNTER ANIMATION =======
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  const statsSection = document.querySelector('.hero-stats');
  let statsAnimated = false;
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      document.querySelectorAll('.stat-num[data-target]').forEach(el => {
        animateCounter(el);
      });
    }
  }, { threshold: 0.5 });
  if (statsSection) statsObserver.observe(statsSection);

  // ======= TESTIMONIALS SLIDER =======
  const track = document.getElementById('testiTrack');
  const dotsContainer = document.getElementById('testiDots');
  const cards = track ? track.querySelectorAll('.testi-card') : [];
  let currentIndex = 0;
  let autoPlay;

  function getVisibleCount() {
    return window.innerWidth < 640 ? 1 : window.innerWidth < 960 ? 1 : 3;
  }

  function setupDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const count = Math.ceil(cards.length / getVisibleCount());
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(index) {
    const visibleCount = getVisibleCount();
    const maxIndex = Math.ceil(cards.length / visibleCount) - 1;
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    const cardWidth = track ? track.querySelector('.testi-card').offsetWidth + 24 : 0;
    if (track) track.style.transform = `translateX(-${currentIndex * visibleCount * cardWidth}px)`;
    document.querySelectorAll('.testi-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(currentIndex - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    const visibleCount = getVisibleCount();
    const maxIndex = Math.ceil(cards.length / visibleCount) - 1;
    goTo(currentIndex >= maxIndex ? 0 : currentIndex + 1);
    resetAuto();
  });

  function startAuto() {
    autoPlay = setInterval(() => {
      const visibleCount = getVisibleCount();
      const maxIndex = Math.ceil(cards.length / visibleCount) - 1;
      goTo(currentIndex >= maxIndex ? 0 : currentIndex + 1);
    }, 4500);
  }
  function resetAuto() { clearInterval(autoPlay); startAuto(); }

  setupDots();
  startAuto();
  window.addEventListener('resize', () => { setupDots(); goTo(0); });

  // ======= SMOOTH SCROLL =======
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ======= CONTACT FORM =======
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '✓ Sent! We\'ll call you within 24 hours.';
      btn.style.background = '#22c55e';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 4000);
    });
  }

  // ======= PARALLAX ORBS =======
  window.addEventListener('mousemove', (e) => {
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');
    if (!orb1 || !orb2) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    orb1.style.transform = `translate(${x}px, ${y}px)`;
    orb2.style.transform = `translate(${-x * 0.7}px, ${-y * 0.7}px)`;
  });

  // ======= SERVICE CARD TILT =======
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      card.style.transform = `translateY(-6px) rotateX(${-y}deg) rotateY(${x}deg)`;
      card.style.transformStyle = 'preserve-3d';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ======= MARQUEE PAUSE ON HOVER =======
  const marquee = document.querySelector('.marquee-inner');
  if (marquee) {
    marquee.addEventListener('mouseenter', () => marquee.style.animationPlayState = 'paused');
    marquee.addEventListener('mouseleave', () => marquee.style.animationPlayState = 'running');
  }

  // ======= PORTFOLIO CARD HOVER =======
  document.querySelectorAll('.port-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.zIndex = '5';
    });
    card.addEventListener('mouseleave', () => {
      card.style.zIndex = '';
    });
  });

  // ======= SCROLL PROGRESS BAR =======
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px;
    background: linear-gradient(90deg, #a07828, #c9a84c, #e8c96a);
    z-index: 9999; width: 0%; transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(progressBar);
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  });

  // ======= FOOTER YEAR =======
  const yearEls = document.querySelectorAll('.year');
  yearEls.forEach(el => el.textContent = new Date().getFullYear());

  console.log('%c MALK Agency Website Loaded ✦ ', 'background:#0a0a0a;color:#c9a84c;font-size:14px;font-weight:bold;padding:8px 16px;border-radius:4px;');
});