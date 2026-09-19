/* ============================================================
   NORRM STUDIO — MAIN JAVASCRIPT
   ============================================================ */

(function () {
  'use strict';

  // ── NAV SCROLL EFFECT (solid color swap, NO blur/gradient)
  const nav = document.getElementById('main-nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── MOBILE HAMBURGER
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }

  // ── ACTIVE NAV LINK
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  const currentClean = currentFile.replace('.html', '') || 'index';
  document.querySelectorAll('.nav__links a, .nav__mobile a:not(.nav__cta)').forEach(link => {
    const href = (link.getAttribute('href') || '').replace('.html', '') || 'index';
    if (href === currentClean || href === currentFile) {
      link.classList.add('active');
    }
  });

  // ── INTERSECTION OBSERVER: FADE-UP
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // ── SMOOTH SCROLL ANCHORS
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const navH = nav ? nav.offsetHeight : 0;
        const y = target.getBoundingClientRect().top + window.pageYOffset - navH - 16;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ── VIDEO PLAY ON CLICK & PLAYBACK CONTROL
  document.querySelectorAll('.video-card').forEach(card => {
    const playBtn = card.querySelector('.video-card__play-btn');
    const video = card.querySelector('video');
    const overlay = card.querySelector('.video-card__play');
    if (!video) return;

    const startPlay = () => {
      const sources = video.querySelectorAll('source[data-src]');
      sources.forEach(s => {
        s.src = s.dataset.src;
        s.removeAttribute('data-src');
      });
      if (!video.src && video.dataset.src) {
        video.src = video.dataset.src;
      }
      video.style.display = 'block';
      video.play().catch(() => {});
      card.classList.add('playing');
      if (overlay) overlay.style.display = 'none';
    };

    if (playBtn) {
      playBtn.addEventListener('click', startPlay);
    }
    if (overlay) {
      overlay.addEventListener('click', startPlay);
    }

    video.addEventListener('play', () => {
      if (overlay) overlay.style.display = 'none';
      card.classList.add('playing');
    });

    video.addEventListener('pause', () => {
      if (overlay) overlay.style.display = 'flex';
      card.classList.remove('playing');
    });
  });

  // ── CALENDLY PRIMARY LOADER (contact page only)
  // When Calendly widget is on page, inject immediately for priority loading
  const calendlyWidget = document.querySelector('.calendly-inline-widget');
  if (calendlyWidget) {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
  }

})();
