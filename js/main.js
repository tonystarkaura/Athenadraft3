/**
 * ATHENA INFONOMICS — CLIENT INTERACTION & ANIMATION ENGINE
 * Features:
 *  - Brand Preloader Orchestration with Exit Wipe
 *  - Magnetic Golden Dot Cursor with Spring Damping
 *  - Scroll-Driven Top Progress Bar & Parallax Layering
 *  - Dynamic Floating Data-Dots Transform Engine
 *  - Interactive Step-Rail Timeline Tracker (Discover · Inform · Transform)
 *  - Hero Content Slide Navigator
 *  - Eased Number Counters
 *  - Zero-Flicker Filterable Selected Work Portfolio
 *  - Sticky Glassmorphism Header & Mobile Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCustomCursor();
  initScrollEngine();
  initDotField();
  initHeaderAndNav();
  initHeroSlider();
  initCounters();
  initProjectsFilter();
});

/* ==========================================================================
   01. PRELOADER ORCHESTRATION (CALIBRATED BRAND PACING)
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('preloader-bar');
  if (!preloader) {
    document.body.classList.add('ath-ready');
    return;
  }

  let progress = 0;
  const startTime = performance.now();
  const targetDuration = 1500;

  function updateProgress(currentTime) {
    const elapsed = currentTime - startTime;
    const rawProgress = Math.min(elapsed / targetDuration, 1);
    const easeProgress = 1 - Math.pow(1 - rawProgress, 2.5);
    const pct = (easeProgress * 100).toFixed(2);

    if (progressBar) progressBar.style.width = `${pct}%`;

    if (rawProgress < 1) {
      requestAnimationFrame(updateProgress);
    } else {
      setTimeout(() => {
        preloader.classList.add('wipe-down');
        document.body.classList.add('ath-ready');
      }, 200);
    }
  }

  requestAnimationFrame(updateProgress);

  // Fallback safety timeout
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader && !preloader.classList.contains('wipe-down')) {
        preloader.classList.add('wipe-down');
        document.body.classList.add('ath-ready');
      }
    }, 2200);
  });
}

/* ==========================================================================
   02. BESPOKE PRECISION OPTIC & MAGNETIC CURSOR
   ========================================================================== */
function initCustomCursor() {
  const core = document.getElementById('custom-cursor-core');
  const optic = document.getElementById('custom-cursor-optic');
  const actionTag = document.getElementById('cursor-action-tag');
  if (!core || !optic || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let opticX = mouseX;
  let opticY = mouseY;
  let lastMouseX = mouseX;
  let lastMouseY = mouseY;
  let velX = 0;
  let velY = 0;
  let magneticTarget = null;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    core.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  // Kinetic render loop with velocity stretch & spring smoothing
  function renderOptic() {
    // Magnetic pull if hovering over marked element
    let targetX = mouseX;
    let targetY = mouseY;

    if (magneticTarget) {
      const rect = magneticTarget.getBoundingClientRect();
      const elemCenterX = rect.left + rect.width / 2;
      const elemCenterY = rect.top + rect.height / 2;
      // Pull 30% towards center
      targetX = mouseX + (elemCenterX - mouseX) * 0.35;
      targetY = mouseY + (elemCenterY - mouseY) * 0.35;
    }

    velX = (targetX - opticX) * 0.16;
    velY = (targetY - opticY) * 0.16;
    opticX += velX;
    opticY += velY;

    // Velocity stretch calculation
    const speed = Math.sqrt(velX * velX + velY * velY);
    const maxStretch = 1.25;
    const stretch = Math.min(1 + speed * 0.015, maxStretch);
    const angle = Math.atan2(velY, velX) * (180 / Math.PI);

    // Apply transform with kinetic angle
    if (speed > 1.5 && !optic.classList.contains('cursor-hover')) {
      optic.style.transform = `translate3d(${opticX}px, ${opticY}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${stretch}, ${2 - stretch})`;
    } else {
      optic.style.transform = `translate3d(${opticX}px, ${opticY}px, 0) translate(-50%, -50%)`;
    }

    requestAnimationFrame(renderOptic);
  }
  requestAnimationFrame(renderOptic);

  // Click shockwave ripple
  window.addEventListener('click', (e) => {
    const wave = document.createElement('div');
    wave.className = 'cursor-click-wave';
    wave.style.left = `${e.clientX}px`;
    wave.style.top = `${e.clientY}px`;
    document.body.appendChild(wave);
    setTimeout(() => wave.remove(), 600);
  });

  // Dark sections auto-detection
  const darkSections = document.querySelectorAll('.site-footer, .ecosystem-section, .preloader');
  darkSections.forEach(section => {
    section.addEventListener('mouseenter', () => optic.classList.add('optic-dark'));
    section.addEventListener('mouseleave', () => optic.classList.remove('optic-dark'));
  });

  // Intelligent Context Labels on Hover
  function bindHoverTarget(selector, label = '', isMagnetic = false) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mouseenter', () => {
        optic.classList.add('cursor-hover');
        if (isMagnetic) magneticTarget = el;
        if (label && actionTag) {
          actionTag.textContent = label;
          optic.classList.add('has-tag');
        }
      });
      el.addEventListener('mouseleave', () => {
        optic.classList.remove('cursor-hover');
        optic.classList.remove('has-tag');
        magneticTarget = null;
        if (actionTag) actionTag.textContent = '';
      });
    });
  }

  // Interactive element groupings
  bindHoverTarget('.card, .project-card, .res-cards', 'Explore →', false);
  bindHoverTarget('.btn-gold, .ln', 'Connect', true);
  bindHoverTarget('.ring', 'Open', true);
  bindHoverTarget('.filter-btn, .slide-nav-pill', 'Filter', false);
  bindHoverTarget('.hero-dots-field', 'Athena', false);
  bindHoverTarget('a:not(.card):not(.btn-gold):not(.ln):not(.filter-btn), button:not(.filter-btn), .svc, .pill', '', true);
}

/* ==========================================================================
   03. SCROLL PROGRESS, PARALLAX & REVEAL ENGINE
   ========================================================================== */
function initScrollEngine() {
  const progressBar = document.getElementById('scroll-progress-line');
  const heroParallax = document.getElementById('ath-par');

  function onScroll() {
    const scrollY = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;

    // Top progress line
    if (progressBar) progressBar.style.width = `${progress}%`;

    // Hero image subtle parallax
    if (heroParallax && heroParallax.parentElement) {
      const rect = heroParallax.parentElement.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const offset = ((rect.top + rect.height / 2) - window.innerHeight / 2) * -0.08;
        heroParallax.style.transform = `translateY(${offset.toFixed(1)}px)`;
      }
    }

    // Step-Rail fill update
    updateStepRail();

    // Scroll reveal triggers
    document.querySelectorAll('[data-reveal]:not(.in)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88) {
        el.classList.add('in');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  // Step-Rail Progress Tracker
  function updateStepRail() {
    const wrap = document.getElementById('ath-steps');
    if (!wrap) return;
    const rows = wrap.querySelectorAll('.svc');
    const dots = wrap.querySelectorAll('.stepdot');
    const fill = document.getElementById('ath-stepfill');
    if (!rows.length || !fill) return;

    const firstRow = rows[0];
    const lastRow = rows[rows.length - 1];
    const top = firstRow.offsetTop + 54;
    const span = (lastRow.offsetTop + lastRow.offsetHeight - 54) - top;
    const line = window.innerHeight * 0.55;

    let reached = 0;
    rows.forEach((row, i) => {
      const r = row.getBoundingClientRect();
      const on = r.top < line;
      if (dots[i]) {
        dots[i].classList.toggle('on', on || (i === 0 && r.top < window.innerHeight * 0.85));
      }
      if (on) {
        reached = (row.offsetTop + row.offsetHeight - top);
      }
    });

    const clamped = Math.max(0, Math.min(span, reached));
    fill.style.height = `${clamped}px`;
  }
}

/* ==========================================================================
   04. FLOATING ATMOSPHERIC DATA-DOTS & FAVICON MORPH ENGINE
   ========================================================================== */
function initDotField() {
  const field = document.getElementById('ath-field');
  if (!field) return;

  // 1. Generate high-precision APLYD favicon logomark coordinates
  // SVG viewBox: 0 0 233.82 258.16
  function getLogoPoints() {
    const pts = [];
    const cx = 116.91, cy = 211.9, r = 28.76;

    // A. Golden Emblem Circle (25 gold dots)
    pts.push({ x: cx, y: cy, type: 'gold', isCore: true }); // central core dot

    const innerCount = 8;
    for (let i = 0; i < innerCount; i++) {
      const a = (i / innerCount) * Math.PI * 2;
      pts.push({ x: cx + Math.cos(a) * (r * 0.52), y: cy + Math.sin(a) * (r * 0.52), type: 'gold' });
    }

    const outerCount = 16;
    for (let i = 0; i < outerCount; i++) {
      const a = (i / outerCount) * Math.PI * 2;
      pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, type: 'gold' });
    }

    // B. Navy Chevron Polygon (98 navy dots)
    // Top Apex Solid Triangle (y: 8 to 72)
    for (let y = 8; y <= 72; y += 14) {
      const halfWidth = (y / 258.16) * (233.82 / 2);
      const count = Math.max(2, Math.round(halfWidth / 9));
      for (let j = 0; j < count; j++) {
        const u = count === 1 ? 0.5 : j / (count - 1);
        const x = (cx - halfWidth) + u * (2 * halfWidth);
        pts.push({ x, y, type: 'navy' });
      }
    }

    // Left & Right Arms (y: 78.07 to 258.16)
    const steps = 14;
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const y = 78.07 + t * (258.16 - 78.07);

      // Left Arm outer & piecewise inner
      const leftOuterX = 116.89 * (1 - (y / 258.16));
      let leftInnerX;
      if (y < 166.24) {
        const k = (y - 78.07) / (166.24 - 78.07);
        leftInnerX = 116.91 * (1 - k) + 76.83 * k;
      } else if (y < 194.61) {
        const k = (y - 166.24) / (194.61 - 166.24);
        leftInnerX = 76.83 * (1 - k) + 64.04 * k;
      } else {
        const k = (y - 194.61) / (258.16 - 194.61);
        leftInnerX = 64.04 * (1 - k) + 35.32 * k;
      }

      // Right Arm outer & piecewise inner
      const rightOuterX = 116.89 + (y / 258.16) * (233.82 - 116.89);
      let rightInnerX;
      if (y < 166.24) {
        const k = (y - 78.07) / (166.24 - 78.07);
        rightInnerX = 116.91 * (1 - k) + 156.68 * k;
      } else if (y < 194.61) {
        const k = (y - 166.24) / (194.61 - 166.24);
        rightInnerX = 156.68 * (1 - k) + 169.6 * k;
      } else {
        const k = (y - 194.61) / (258.16 - 194.61);
        rightInnerX = 169.6 * (1 - k) + 198.46 * k;
      }

      pts.push({ x: leftOuterX, y, type: 'navy' });
      pts.push({ x: (leftOuterX + leftInnerX) * 0.5, y, type: 'navy' });
      pts.push({ x: leftInnerX, y, type: 'navy' });

      pts.push({ x: rightInnerX, y, type: 'navy' });
      pts.push({ x: (rightOuterX + rightInnerX) * 0.5, y, type: 'navy' });
      pts.push({ x: rightOuterX, y, type: 'navy' });
    }

    // Bottom Feet
    pts.push({ x: 17, y: 258.16, type: 'navy' });
    pts.push({ x: 216, y: 258.16, type: 'navy' });

    return pts;
  }

  const logoPoints = getLogoPoints();
  const totalDots = logoPoints.length; // 123 dots

  field.innerHTML = '';

  // 2. SVG layer for network lines
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'dots-lattice-svg');
  field.appendChild(svg);

  // Deterministic PRNG for consistent organic distribution
  let seed = 77;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;

  // 3. Instantiate dots
  const dotsData = [];
  for (let i = 0; i < totalDots; i++) {
    const lp = logoPoints[i];
    const dot = document.createElement('span');
    dot.className = 'fd ' + (lp.type === 'gold' ? 'fd-gold' : 'fd-navy') + (lp.isCore ? ' fd-core' : '');
    field.appendChild(dot);

    // Initial scattered position on the right quadrant
    const sx = 8 + rnd() * 84;
    const sy = 8 + rnd() * 84;

    // Grid position on scroll (11 x 12 matrix)
    const gRow = Math.floor(i / 11);
    const gCol = i % 11;
    const gx = 10 + (gCol / 10) * 80;
    const gy = 10 + (gRow / 11) * 80;

    dotsData.push({
      el: dot,
      lx: lp.x,
      ly: lp.y,
      type: lp.type,
      isCore: !!lp.isCore,
      sx,
      sy,
      gx,
      gy,
      curX: 0,
      curY: 0,
      phase: rnd() * Math.PI * 2,
      speed: 0.6 + rnd() * 0.8,
      ampX: 3 + rnd() * 5,
      ampY: 3 + rnd() * 5,
      delay: rnd() * 0.4
    });
  }

  // 4. Create network connecting lines between nearby points in the logo
  const linesData = [];
  for (let i = 0; i < dotsData.length; i++) {
    for (let j = i + 1; j < dotsData.length; j++) {
      const dx = dotsData[i].lx - dotsData[j].lx;
      const dy = dotsData[i].ly - dotsData[j].ly;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Connect close neighbors in logo structure
      if (dist < 22 && linesData.length < 90) {
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('class', 'dots-lattice-line');
        svg.appendChild(line);
        linesData.push({ line, from: i, to: j });
      }
    }
  }

  // 5. Interactive Mouse & Hover Tracking with Smooth Proximity
  let isHovered = false;
  let mouseX = -1000;
  let mouseY = -1000;

  field.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  field.addEventListener('mouseleave', () => {
    isHovered = false;
  });

  window.addEventListener('mousemove', (e) => {
    const rect = field.getBoundingClientRect();
    const pad = 30;
    if (
      e.clientX >= rect.left - pad &&
      e.clientX <= rect.right + pad &&
      e.clientY >= rect.top - pad &&
      e.clientY <= rect.bottom + pad
    ) {
      isHovered = true;
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    } else {
      isHovered = false;
    }
  }, { passive: true });

  // 6. Scroll Tracking
  let scrollProgress = 0;
  function calculateScroll() {
    const scrollY = window.scrollY;
    const rawT = Math.max(0, Math.min(1, scrollY / 380));
    scrollProgress = rawT < 0.5 
      ? 4 * rawT * rawT * rawT 
      : 1 - Math.pow(-2 * rawT + 2, 3) / 2;
  }
  window.addEventListener('scroll', calculateScroll, { passive: true });
  calculateScroll();

  // 7. Kinetic Animation Loop with Silky Smooth Particle Spring Physics
  let hoverFactor = 0;
  let isInitialized = false;

  function animate(timestamp) {
    const w = field.offsetWidth;
    const h = field.offsetHeight;

    if (w > 0 && h > 0) {
      const time = timestamp * 0.001;

      // Smooth gradual hover factor transition (~0.8s luxurious ease)
      const targetHover = isHovered ? 1.0 : 0.0;
      hoverFactor += (targetHover - hoverFactor) * 0.045;

      // Smoothstep easing curve
      const hSmooth = hoverFactor * hoverFactor * (3 - 2 * hoverFactor);

      // Logo sizing calculation
      const svgW = 233.82;
      const svgH = 258.16;
      const maxLW = Math.min(w * 0.66, 320);
      const maxLH = maxLW * (svgH / svgW);
      const LW = maxLH > h * 0.80 ? (h * 0.80) * (svgW / svgH) : maxLW;
      const LH = LW * (svgH / svgW);
      const offsetX = (w - LW) / 2;
      const offsetY = (h - LH) / 2;

      const sEase = scrollProgress;

      // Update dots positions with individual spring lerping
      for (let i = 0; i < dotsData.length; i++) {
        const d = dotsData[i];

        // Position 1: Ambient floating constellation
        const floatFactor = (1 - hSmooth * 0.85) * (1 - sEase * 0.7);
        const floatX = Math.sin(time * d.speed + d.phase) * d.ampX * floatFactor;
        const floatY = Math.cos(time * d.speed * 0.85 + d.phase) * d.ampY * floatFactor;
        const ambX = (d.sx / 100) * w + floatX;
        const ambY = (d.sy / 100) * h + floatY;

        // Position 2: Grid matrix on scroll
        const gridX = (d.gx / 100) * w;
        const gridY = (d.gy / 100) * h;

        // Position 3: Exact APLYD favicon logomark coordinate
        const logoX = offsetX + (d.lx / svgW) * LW;
        const logoY = offsetY + (d.ly / svgH) * LH;

        // Interactive subtle mouse parallax when logo is formed
        let parallaxX = 0;
        let parallaxY = 0;
        if (hSmooth > 0.3 && mouseX > 0 && mouseY > 0) {
          parallaxX = (mouseX - w / 2) * 0.025 * hSmooth;
          parallaxY = (mouseY - h / 2) * 0.025 * hSmooth;
        }

        // Base target before hover morph
        const baseTargetX = ambX + (gridX - ambX) * sEase;
        const baseTargetY = ambY + (gridY - ambY) * sEase;

        // Destination coordinate for this frame
        const destX = baseTargetX + (logoX + parallaxX - baseTargetX) * hSmooth;
        const destY = baseTargetY + (logoY + parallaxY - baseTargetY) * hSmooth;

        // First frame initialization
        if (!isInitialized) {
          d.curX = destX;
          d.curY = destY;
        } else {
          // Continuous smooth spring physics with individual dot speed
          const springRate = 0.075 + d.speed * 0.035;
          d.curX += (destX - d.curX) * springRate;
          d.curY += (destY - d.curY) * springRate;
        }

        // Dynamic scale & opacity modulation
        const scale = 0.85 + 0.28 * hSmooth;
        const opacity = d.type === 'gold'
          ? (0.7 + 0.3 * hSmooth)
          : (0.45 + 0.45 * hSmooth);

        d.el.style.transform = `translate3d(${d.curX.toFixed(1)}px, ${d.curY.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(2)})`;
        d.el.style.opacity = opacity.toFixed(2);
      }

      isInitialized = true;

      // Update SVG network lines
      const lineOpacity = Math.max(0, (sEase - 0.1) / 0.9) * 0.35 * (1 - hSmooth);
      for (let i = 0; i < linesData.length; i++) {
        const l = linesData[i];
        const p1 = dotsData[l.from];
        const p2 = dotsData[l.to];

        l.line.setAttribute('x1', p1.curX.toFixed(1));
        l.line.setAttribute('y1', p1.curY.toFixed(1));
        l.line.setAttribute('x2', p2.curX.toFixed(1));
        l.line.setAttribute('y2', p2.curY.toFixed(1));
        l.line.style.opacity = lineOpacity.toFixed(2);
      }
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/* ==========================================================================
   05. HEADER & MOBILE NAVIGATION
   ========================================================================== */
function initHeaderAndNav() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('active');
      }
    });

    const dropdownToggles = navMenu.querySelectorAll('.nav-item.has-dropdown');
    dropdownToggles.forEach(item => {
      const link = item.querySelector('.nav-link');
      if (link) {
        link.addEventListener('click', (e) => {
          if (window.innerWidth <= 980) {
            e.preventDefault();
            item.classList.toggle('dropdown-open');
          }
        });
      }
    });
  }
}

/* ==========================================================================
   06. HERO STORYTELLING ENGINE & CINEMATIC VIDEO CONTROLLER
   ========================================================================== */
function initHeroSlider() {
  const storiesData = [
    {
      eyebrow: "THE ATHENA ECOSYSTEM · PARENT FOUNDATION",
      title: "Everything begins<br class=\"hero-br\"> with Athena.",
      leadText: "Athena Infonomics is the parent foundation behind an interconnected social impact ecosystem. Mobilizing field research agronomists, frontline surveyors, and digital advisory across 60+ countries to turn ground truth into lasting human progress.",
      caption: "Parent Foundation · 60+ Nations Worldwide",
      videoSrc: "videos/hero-agronomy-field-research-32190.mp4",
      poster: "images/hero-fieldwork.jpg"
    },
    {
      eyebrow: "APPLIED ARTIFICIAL INTELLIGENCE · ECOSYSTEM CHILD",
      title: "APLYD: Applied AI for<br class=\"hero-br\"> governments & institutions",
      leadText: "The Chief AI Officer for institutions — applied intelligence, drone aerial analytics, and decision models built on data that reflects operational reality and ethical governance to empower communities.",
      caption: "APLYD.com · Chief AI Officer for Institutions",
      videoSrc: "videos/hero-drone-survey-outdoors-44644.mp4",
      poster: "images/work-governance.jpg"
    },
    {
      eyebrow: "SOFTWARE PLATFORM · ECOSYSTEM CHILD",
      title: "TolaData: Web-based M&amp;E<br class=\"hero-br\"> software for global development",
      leadText: "Specialized monitoring and evaluation software built for development teams to manage indicator tracking, digital tablet field collection, and report on real-time program outcomes across 5 continents.",
      caption: "TolaData.com · M&E Software Platform",
      videoSrc: "videos/hero-woman-tablet-field-24129.mp4",
      poster: "images/case-agri-digital.jpg"
    }
  ];

  const storyPills = document.querySelectorAll('.hero-story-pill, .slide-nav-pill');
  const ecoCards = document.querySelectorAll('.hero-ecosystem-card');
  const heroEyebrow = document.getElementById('hero-eyebrow-text');
  const heroTitle = document.getElementById('hero-title-text');
  const leadText = document.getElementById('hero-lead-text');
  const captionText = document.getElementById('hero-caption-text');
  const bgVideo = document.getElementById('hero-bg-video');
  const videoToggleBtn = document.getElementById('video-toggle-btn');
  const toggleText = document.getElementById('video-toggle-text');
  const iconPause = document.querySelector('.video-icon-pause');
  const iconPlay = document.querySelector('.video-icon-play');

  let currentStory = 0;
  let storyInterval = null;
  let isVideoPlaying = true;

  // Update Story Narrative
  function updateStory(index) {
    const data = storiesData[index];
    if (!data) return;

    storyPills.forEach((p, i) => {
      const isSelected = i === index;
      p.classList.toggle('active', isSelected);
      p.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    ecoCards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });

    if (heroEyebrow) {
      heroEyebrow.style.opacity = '0';
      setTimeout(() => {
        heroEyebrow.textContent = data.eyebrow;
        heroEyebrow.style.opacity = '1';
      }, 120);
    }

    if (heroTitle) {
      heroTitle.style.opacity = '0';
      setTimeout(() => {
        heroTitle.innerHTML = data.title;
        heroTitle.style.opacity = '1';
      }, 140);
    }

    if (leadText) {
      leadText.style.opacity = '0';
      setTimeout(() => {
        leadText.textContent = data.leadText;
        leadText.style.opacity = '1';
      }, 160);
    }

    if (captionText) {
      captionText.textContent = data.caption;
    }

    // Seamlessly cross-fade / update video source if different
    if (bgVideo && data.videoSrc) {
      const currentSrc = bgVideo.currentSrc || bgVideo.src;
      if (!currentSrc.includes(data.videoSrc)) {
        bgVideo.style.opacity = '0.5';
        setTimeout(() => {
          bgVideo.src = data.videoSrc;
          bgVideo.poster = data.poster;
          if (isVideoPlaying) {
            bgVideo.play().catch(() => {});
          }
          bgVideo.style.opacity = '1';
        }, 220);
      }
    }

    currentStory = index;
  }

  // Interactive Story Switchers (Pills)
  storyPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const storyIdx = parseInt(pill.getAttribute('data-story') || '0', 10);
      updateStory(storyIdx);
      restartInterval();
    });
  });

  // Interactive Story Switchers (Ecosystem Cards)
  ecoCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return; // Allow direct link clicks
      const storyIdx = parseInt(card.getAttribute('data-story') || '0', 10);
      updateStory(storyIdx);
      restartInterval();
    });
  });

  // Background Video Play/Pause Toggle
  if (videoToggleBtn && bgVideo) {
    videoToggleBtn.addEventListener('click', () => {
      if (bgVideo.paused) {
        bgVideo.play().then(() => {
          isVideoPlaying = true;
          if (toggleText) toggleText.textContent = 'Pause Story';
          if (iconPause) iconPause.style.display = 'block';
          if (iconPlay) iconPlay.style.display = 'none';
          videoToggleBtn.setAttribute('aria-label', 'Pause background video');
        }).catch(() => {});
      } else {
        bgVideo.pause();
        isVideoPlaying = false;
        if (toggleText) toggleText.textContent = 'Play Story';
        if (iconPause) iconPause.style.display = 'none';
        if (iconPlay) iconPlay.style.display = 'block';
        videoToggleBtn.setAttribute('aria-label', 'Play background video');
      }
    });
  }

  // IntersectionObserver: Pause video when hero is scrolled out of view to save GPU/CPU
  const heroSection = document.querySelector('.hero-section');
  if (heroSection && bgVideo && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (isVideoPlaying && bgVideo.paused) {
            bgVideo.play().catch(() => {});
          }
        } else {
          if (!bgVideo.paused) {
            bgVideo.pause();
          }
        }
      });
    }, { threshold: 0.15 });

    videoObserver.observe(heroSection);
  }

  function startInterval() {
    storyInterval = setInterval(() => {
      const next = (currentStory + 1) % storiesData.length;
      updateStory(next);
    }, 9500);
  }

  function restartInterval() {
    clearInterval(storyInterval);
    startInterval();
  }

  startInterval();
}

/* ==========================================================================
   07. METRICS COUNTER ANIMATION
   ========================================================================== */
function initCounters() {
  const counterElements = document.querySelectorAll('[data-count]');
  if (!counterElements.length) return;

  function triggerCount(el) {
    if (el.dataset.counted === 'true') return;
    el.dataset.counted = 'true';

    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;

    const startTime = performance.now();
    const duration = 1400;

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * ease);
      el.textContent = current.toLocaleString() + (progress === 1 ? suffix : '');

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          triggerCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    counterElements.forEach(el => observer.observe(el));
  } else {
    counterElements.forEach(triggerCount);
  }
}

/* ==========================================================================
   08. UNIVERSAL CATALOG FILTER & REAL-TIME SEARCH (PROJECTS, TEAM, RESOURCES, BLOG)
   ========================================================================== */
function initProjectsFilter() {
  // 1. Filter button handling (works with .filter-btn and .filter-pill-btn)
  const filterBtns = document.querySelectorAll('.filter-btn, .filter-pill-btn');
  const catalogCards = document.querySelectorAll('.project-card[data-category], .team-card[data-category], .resource-card[data-category], .blog-card[data-category], .vertical-card[data-category]');

  if (filterBtns.length && catalogCards.length) {
    let isFiltering = false;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (isFiltering || btn.classList.contains('active')) return;

        // Scope to sibling buttons in the same container if multiple filters exist
        const container = btn.closest('.work-filter-bar, .catalog-filter-bar, .filter-pills-row') || document;
        container.querySelectorAll('.filter-btn, .filter-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterVal = (btn.getAttribute('data-filter') || 'all').toLowerCase();
        isFiltering = true;

        catalogCards.forEach(card => {
          card.classList.add('filter-invisible');
        });

        setTimeout(() => {
          let visibleCount = 0;
          catalogCards.forEach(card => {
            const categories = (card.getAttribute('data-category') || '').toLowerCase().split(' ');
            const shouldShow = (filterVal === 'all' || categories.includes(filterVal) || categories.some(c => c.includes(filterVal)));

            if (shouldShow) {
              card.classList.remove('filter-hide');
              visibleCount++;
            } else {
              card.classList.add('filter-hide');
            }
          });

          // Check for empty state
          const emptyMsg = document.getElementById('catalog-empty-msg');
          if (emptyMsg) {
            emptyMsg.style.display = visibleCount === 0 ? 'block' : 'none';
          }

          void document.body.offsetHeight;

          requestAnimationFrame(() => {
            catalogCards.forEach(card => {
              if (!card.classList.contains('filter-hide')) {
                card.classList.remove('filter-invisible');
              }
            });

            setTimeout(() => {
              isFiltering = false;
            }, 250);
          });
        }, 180);
      });
    });
  }

  // 2. Real-time Search input handling
  const searchInputs = document.querySelectorAll('.catalog-search-input');
  searchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      const targetGrid = input.closest('.section, section, .wrap')?.querySelectorAll('.project-card, .team-card, .resource-card, .blog-card, .vertical-card') || catalogCards;

      targetGrid.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (!term || text.includes(term)) {
          card.classList.remove('filter-hide');
          card.classList.remove('filter-invisible');
        } else {
          card.classList.add('filter-hide');
        }
      });
    });
  });

  // 3. Mobile Navigation Drawer Integration
  const menuToggle = document.getElementById('menu-toggle');
  const navDrawer = document.getElementById('mobile-nav-drawer');
  const navBackdrop = document.getElementById('mobile-nav-backdrop');

  if (menuToggle && (navDrawer || navBackdrop)) {
    function toggleDrawer(open) {
      if (menuToggle) menuToggle.classList.toggle('open', open);
      if (navDrawer) navDrawer.classList.toggle('open', open);
      if (navBackdrop) navBackdrop.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }

    menuToggle.addEventListener('click', () => {
      const isOpen = navDrawer?.classList.contains('open') || false;
      toggleDrawer(!isOpen);
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', () => toggleDrawer(false));
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggleDrawer(false);
    });
  }
}

