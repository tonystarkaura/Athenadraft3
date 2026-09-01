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
  initStoryExplorers();
  initInteractiveTimelines();
  initOfficeClocks();
  initVoicesTabs();
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
   06. INNOVATIVE 3D ECOSYSTEM CONSTELLATION & MORPHING ENGINE
   ========================================================================== */
function initHeroSlider() {
  const ecosystemData = [
    {
      badge: "Parent Foundation & Research Practice",
      title: "Ground-Truth Evidence & Strategic Policy Reform",
      leadText: "Athena Infonomics is the parent foundation orchestrating rigorous social science research, field data collection across 60+ countries, and systemic policy reform to solve complex development challenges.",
      chips: [
        "60+ Nations Worldwide",
        "95+ Development Specialists",
        "430+ Field Engagements"
      ],
      primaryBtn: { text: "Explore Athena Story", href: "about-us.html", target: "_self" },
      secondaryBtn: null,
      videoSrc: "videos/hero-agronomy-field-research-32190.mp4",
      poster: "images/hero-fieldwork.jpg",
      coreCaption: "GROUND TRUTH INTELLIGENCE",
      themeColor: "#D19C33"
    },
    {
      badge: "Child Company · Applied AI Partner",
      title: "The Chief AI Officer for Public Institutions",
      leadText: "APLYD builds high-leverage artificial intelligence systems, predictive decision-support engines, and ethical AI sandboxes tailored for public sector leaders, government agencies, and utilities.",
      chips: [
        "AI Sandboxing & Governance",
        "Automated Public Delivery",
        "Predictive Scenario Modelling"
      ],
      primaryBtn: { text: "Visit APLYD.com ↗", href: "https://aplyd.com", target: "_blank" },
      secondaryBtn: null,
      videoSrc: "videos/hero-drone-survey-outdoors-44644.mp4",
      poster: "images/work-governance.jpg",
      coreCaption: "NEURAL DECISION NETWORKS",
      themeColor: "#3854D0"
    },
    {
      badge: "Child Company · M&E Software Platform",
      title: "Next-Gen Monitoring & Evaluation Software",
      leadText: "TolaData is the purpose-built cloud monitoring and evaluation software empowering international development teams, NGOs, and donors with real-time indicator tracking, results frameworks, and automated impact reporting.",
      chips: [
        "Real-Time Indicator Dashboards",
        "Multi-Project Frameworks",
        "100+ Global Nonprofits"
      ],
      primaryBtn: { text: "Visit TolaData.com ↗", href: "https://www.toladata.com", target: "_blank" },
      secondaryBtn: null,
      videoSrc: "videos/hero-woman-tablet-field-24129.mp4",
      poster: "images/case-agri-digital.jpg",
      coreCaption: "REAL-TIME IMPACT TELEMETRY",
      themeColor: "#00A389"
    }
  ];

  // DOM Elements
  const heroSection = document.querySelector('.hero-constellation-section') || document.querySelector('.hero-section');
  const badgeText = document.getElementById('hero-badge-text');
  const titleText = document.getElementById('hero-title-text');
  const leadText = document.getElementById('hero-lead-text');
  const chipsContainer = document.getElementById('hero-capabilities-chips');
  const primaryBtn = document.getElementById('hero-btn-primary');
  const secondaryBtn = document.getElementById('hero-btn-secondary');
  const logoNodes = document.querySelectorAll('.nexus-logo-node');
  const bgVideos = document.querySelectorAll('.hero-video-stream');
  const canvas = document.getElementById('constellation-canvas');

  let currentIndex = 0;
  let timerStartTime = performance.now();
  const SLIDE_DURATION = 5000;
  let isUserHovered = false;

  // ----------------------------------------------------
  // HTML5 Canvas Particle Constellation Morphing Engine
  // ----------------------------------------------------
  let ctx = null;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let particles = [];
  const TOTAL_PARTICLES = 220;
  let mouse = { x: -1000, y: -1000, active: false };
  let shockwave = { x: 0, y: 0, radius: 0, active: false };

  function initCanvas() {
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Build Particles Pool - Exclusively Brand Gold Palette
    particles = [];
    const goldPalette = ['#D19C33', '#E5B34B', '#F5E9D1', '#F7B731', '#C48F29'];
    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const color = goldPalette[i % goldPalette.length];
      particles.push({
        x: Math.random() * (canvasWidth || 500),
        y: Math.random() * (canvasHeight || 500),
        curX: Math.random() * (canvasWidth || 500),
        curY: Math.random() * (canvasHeight || 500),
        targetX: canvasWidth / 2,
        targetY: canvasHeight / 2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: 1.8 + Math.random() * 2.4,
        color: color,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 0.8,
        pulseSpeed: 0.03 + Math.random() * 0.04
      });
    }

    setMorphTargets(currentIndex);

    // Mouse Tracking on Arena
    const arena = document.getElementById('hero-constellation-arena');
    if (arena) {
      arena.addEventListener('mousemove', (e) => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
        mouse.active = true;
      }, { passive: true });

      arena.addEventListener('mouseleave', () => {
        mouse.active = false;
        mouse.x = -1000;
        mouse.y = -1000;
      });

      arena.addEventListener('click', (e) => {
        const r = canvas.getBoundingClientRect();
        shockwave.x = e.clientX - r.left;
        shockwave.y = e.clientY - r.top;
        shockwave.radius = 0;
        shockwave.active = true;
      });
    }
  }

  function resizeCanvas() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasWidth = rect.width || canvas.parentElement.clientWidth || 500;
    canvasHeight = rect.height || canvas.parentElement.clientHeight || 500;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    if (ctx) ctx.scale(dpr, dpr);
    if (particles.length) setMorphTargets(currentIndex);
  }

  // Generate Geometric Coordinate Target Maps
  function setMorphTargets(entityIdx) {
    if (!canvasWidth || !canvasHeight) return;
    const cx = canvasWidth / 2;
    const cy = canvasHeight / 2;
    const w = canvasWidth;
    const h = canvasHeight;

    // Triangle Apex Node Positions
    const pAthena = { x: cx, y: h * 0.22 };
    const pPlyd = { x: w * 0.24, y: h * 0.76 };
    const pTola = { x: w * 0.76, y: h * 0.76 };

    particles.forEach((p, i) => {
      let tx = cx, ty = cy;

      if (entityIdx === 0) {
        // --- MODE 0: ATHENA INFONOMICS (THE "A" APEX EMBLEM + CONCENTRIC SONAR RAYS) ---
        if (i < 90) {
          // Iconic Chevron Triangle
          if (i < 45) {
            // Left Arm
            const k = i / 45;
            tx = pAthena.x + (pPlyd.x - pAthena.x) * k;
            ty = pAthena.y + (pPlyd.y - pAthena.y) * k;
          } else {
            // Right Arm
            const k = (i - 45) / 45;
            tx = pAthena.x + (pTola.x - pAthena.x) * k;
            ty = pAthena.y + (pTola.y - pAthena.y) * k;
          }
        } else if (i < 130) {
          // Horizontal Crossbar
          const k = (i - 90) / 40;
          tx = (w * 0.35) + k * (w * 0.3);
          ty = cy + 20;
        } else if (i < 170) {
          // Golden Pivot Core Sphere
          const angle = ((i - 130) / 40) * Math.PI * 2;
          const rad = 28 + (i % 3) * 12;
          tx = cx + Math.cos(angle) * rad;
          ty = cy + Math.sin(angle) * rad;
        } else {
          // Orbiting Ambient Field
          const angle = ((i - 170) / 50) * Math.PI * 2;
          const rad = 130 + (i % 5) * 22;
          tx = cx + Math.cos(angle) * rad;
          ty = cy + Math.sin(angle) * rad;
        }

      } else if (entityIdx === 1) {
        // --- MODE 1: APLYD (APPLIED AI NEURAL NETWORK MATRIX) ---
        const layers = 5;
        const layerIdx = i % layers;
        const nodesInLayer = Math.floor(TOTAL_PARTICLES / layers);
        const nodeIdx = Math.floor(i / layers);

        const lx = w * 0.18 + (layerIdx / (layers - 1)) * (w * 0.64);
        const ly = h * 0.2 + (nodeIdx / nodesInLayer) * (h * 0.6);
        tx = lx + (Math.sin(i * 0.3) * 14);
        ty = ly + (Math.cos(i * 0.3) * 14);

      } else {
        // --- MODE 2: TOLADATA (REAL-TIME M&E INDICATOR TELEMETRY RADAR) ---
        if (i < 110) {
          // Outer Rotating Radar Dial
          const angle = (i / 110) * Math.PI * 2;
          const rad = Math.min(w, h) * 0.34;
          tx = cx + Math.cos(angle) * rad;
          ty = cy + Math.sin(angle) * rad;
        } else if (i < 170) {
          // Inner Metric Ring
          const angle = ((i - 110) / 60) * Math.PI * 2;
          const rad = Math.min(w, h) * 0.20;
          tx = cx + Math.cos(angle) * rad;
          ty = cy + Math.sin(angle) * rad;
        } else {
          // Telemetry Crossbars & Signal Beacons
          const k = (i - 170) / 50;
          const side = i % 2 === 0 ? 1 : -1;
          tx = cx + side * (k * (w * 0.36));
          ty = cy + (Math.sin(k * 10) * 25);
        }
      }

      p.targetX = tx;
      p.targetY = ty;
    });
  }

  function renderCanvas() {
    if (!ctx || !canvasWidth || !canvasHeight) {
      requestAnimationFrame(renderCanvas);
      return;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 1. Draw Connecting Orbital Triangle Splines
    const cx = canvasWidth / 2;
    const h = canvasHeight;
    const w = canvasWidth;
    const pAthena = { x: cx, y: h * 0.22 };
    const pPlyd = { x: w * 0.24, y: h * 0.76 };
    const pTola = { x: w * 0.76, y: h * 0.76 };

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(209, 156, 51, 0.18)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 6]);
    ctx.moveTo(pAthena.x, pAthena.y);
    ctx.lineTo(pPlyd.x, pPlyd.y);
    ctx.lineTo(pTola.x, pTola.y);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Draw Shockwave Ripple
    if (shockwave.active) {
      shockwave.radius += 8;
      ctx.beginPath();
      ctx.arc(shockwave.x, shockwave.y, shockwave.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(209, 156, 51, ${Math.max(0, 1 - shockwave.radius / 260)})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      if (shockwave.radius > 260) shockwave.active = false;
    }

    // 3. Update & Render Particles (All Brand Gold)
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Spring Physics toward Target
      p.phase += p.pulseSpeed;
      const wobbleX = Math.sin(p.phase) * 3;
      const wobbleY = Math.cos(p.phase) * 3;

      const spring = 0.065 * p.speed;
      p.curX += ((p.targetX + wobbleX) - p.curX) * spring;
      p.curY += ((p.targetY + wobbleY) - p.curY) * spring;

      // Mouse Interaction (Deflection & Proximity Laser)
      if (mouse.active) {
        const dx = p.curX - mouse.x;
        const dy = p.curY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          const force = (110 - dist) / 110;
          p.curX += (dx / dist) * force * 12;
          p.curY += (dy / dist) * force * 12;

          if (i % 6 === 0) {
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.curX, p.curY);
            ctx.strokeStyle = `rgba(209, 156, 51, ${0.45 * force})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw Inter-Particle Constellation Network Lines (All Brand Gold)
      for (let j = i + 1; j < particles.length; j++) {
        if (j > i + 14) break; // Optimization limit
        const p2 = particles[j];
        const dx = p.curX - p2.curX;
        const dy = p.curY - p2.curY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 46) {
          const lineAlpha = (1 - dist / 46) * 0.28;
          ctx.beginPath();
          ctx.moveTo(p.curX, p.curY);
          ctx.lineTo(p2.curX, p2.curY);
          ctx.strokeStyle = `rgba(209, 156, 51, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Draw Particle Dot with Warm Gold Glow
      ctx.beginPath();
      ctx.arc(p.curX, p.curY, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = '#D19C33';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset
    }

    requestAnimationFrame(renderCanvas);
  }

  // ----------------------------------------------------
  // Synchronized Entity & Narrative Update
  // ----------------------------------------------------
  function updateEcosystemFocus(index, smoothTransition = true) {
    const data = ecosystemData[index];
    if (!data) return;

    currentIndex = index;
    timerStartTime = performance.now();

    // 1. Morph Particle Constellation Target Positions
    setMorphTargets(index);

    // 2. Update 3 Floating Holographic Logo Nodes
    logoNodes.forEach((node, i) => {
      const isActive = i === index;
      node.classList.toggle('active', isActive);
      node.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // 3. Update Story Glass Card Narrative
    if (smoothTransition) {
      if (badgeText) badgeText.style.opacity = '0';
      if (titleText) titleText.style.opacity = '0';
      if (leadText) leadText.style.opacity = '0';
      if (chipsContainer) chipsContainer.style.opacity = '0';

      setTimeout(() => {
        if (badgeText) {
          badgeText.textContent = data.badge;
          badgeText.style.opacity = '1';
        }
        if (titleText) {
          titleText.innerHTML = data.title;
          titleText.style.opacity = '1';
        }
        if (leadText) {
          leadText.textContent = data.leadText;
          leadText.style.opacity = '1';
        }
        if (chipsContainer) {
          chipsContainer.innerHTML = data.chips.map(chip => 
            `<span class="nexus-chip"><span class="chip-dot"></span> ${chip}</span>`
          ).join('');
          chipsContainer.style.opacity = '1';
        }

        // Action Buttons
        if (primaryBtn) {
          primaryBtn.textContent = data.primaryBtn.text;
          primaryBtn.href = data.primaryBtn.href;
          primaryBtn.target = data.primaryBtn.target;
        }
        if (secondaryBtn) {
          if (data.secondaryBtn) {
            secondaryBtn.style.display = 'inline-flex';
            secondaryBtn.textContent = data.secondaryBtn.text;
            secondaryBtn.href = data.secondaryBtn.href;
            secondaryBtn.target = data.secondaryBtn.target;
          } else {
            secondaryBtn.style.display = 'none';
          }
        }
      }, 140);
    }

    // 5. Update Background Video with Seamless Hardware-Accelerated Cross-fade
    bgVideos.forEach((vid, i) => {
      const isActive = i === index;
      vid.classList.toggle('active', isActive);
      if (isActive && vid.paused) {
        vid.play().catch(() => {});
      }
    });
  }

  // ----------------------------------------------------
  // 5-Second Master Ticker Loop
  // ----------------------------------------------------
  function tickerLoop(now) {
    if (!isUserHovered) {
      const elapsed = now - timerStartTime;
      if (elapsed >= SLIDE_DURATION) {
        const nextIndex = (currentIndex + 1) % ecosystemData.length;
        updateEcosystemFocus(nextIndex);
      }
    }
    requestAnimationFrame(tickerLoop);
  }

  // Interactivity: Click Logo Nodes
  logoNodes.forEach(node => {
    node.addEventListener('click', () => {
      const idx = parseInt(node.getAttribute('data-index') || '0', 10);
      updateEcosystemFocus(idx);
    });

    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const idx = parseInt(node.getAttribute('data-index') || '0', 10);
        updateEcosystemFocus(idx);
      }
    });
  });

  // Hover pauses rotation so reader can explore dots
  if (heroSection) {
    heroSection.addEventListener('mouseenter', () => {
      isUserHovered = true;
    });

    heroSection.addEventListener('mouseleave', () => {
      isUserHovered = false;
      timerStartTime = performance.now();
    });
  }

  // Keyboard navigation support
  window.addEventListener('keydown', (e) => {
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
    if (e.key === 'ArrowRight') {
      const nextIndex = (currentIndex + 1) % ecosystemData.length;
      updateEcosystemFocus(nextIndex);
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (currentIndex - 1 + ecosystemData.length) % ecosystemData.length;
      updateEcosystemFocus(prevIndex);
    }
  });

  // Initialize
  initCanvas();
  renderCanvas();
  updateEcosystemFocus(0, false);
  requestAnimationFrame(tickerLoop);
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

/* ==========================================================================
   09. STORY & METHODOLOGY EXPLORER CONTROLLER (TABS / STEPPERS)
   ========================================================================== */
function initStoryExplorers() {
  const explorers = document.querySelectorAll('.story-explorer');
  explorers.forEach(explorer => {
    const stepBtns = explorer.querySelectorAll('.explorer-step-btn');
    const panes = explorer.querySelectorAll('.explorer-pane');

    stepBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        stepBtns.forEach(b => b.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target-pane');
        const targetPane = targetId ? explorer.querySelector(`#${targetId}`) : panes[idx];
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  });
}

/* ==========================================================================
   10. INTERACTIVE TIMELINE CONTROLLER (15-YEAR MILESTONES)
   ========================================================================== */
function initInteractiveTimelines() {
  const timelineWraps = document.querySelectorAll('.interactive-timeline-wrap');
  timelineWraps.forEach(wrap => {
    const stepPoints = wrap.querySelectorAll('.timeline-step-point');
    const detailCards = wrap.querySelectorAll('.milestone-detail-card');

    stepPoints.forEach((point, idx) => {
      point.addEventListener('click', () => {
        stepPoints.forEach(p => p.classList.remove('active'));
        detailCards.forEach(c => c.style.display = 'none');

        point.classList.add('active');
        const targetId = point.getAttribute('data-milestone-target');
        const targetCard = targetId ? wrap.querySelector(`#${targetId}`) : detailCards[idx];
        if (targetCard) {
          targetCard.style.display = 'grid';
          targetCard.style.opacity = '0';
          targetCard.style.transform = 'translateY(12px)';
          requestAnimationFrame(() => {
            targetCard.style.opacity = '1';
            targetCard.style.transform = 'translateY(0)';
          });
        }
      });
    });
  });
}

/* ==========================================================================
   11. LIVE GLOBAL OFFICE TIMEZONE CLOCKS
   ========================================================================== */
function initOfficeClocks() {
  const clockBadges = document.querySelectorAll('.office-clock-time[data-tz]');
  if (!clockBadges.length) return;

  function updateClocks() {
    const now = new Date();
    clockBadges.forEach(badge => {
      const tz = badge.getAttribute('data-tz');
      try {
        const timeStr = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }).format(now);
        
        badge.textContent = timeStr;

        // Check if business hours (9am - 6pm local)
        const hour = parseInt(new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          hour: 'numeric',
          hour12: false
        }).format(now), 10);

        const card = badge.closest('.office-hub-card');
        const statusDot = card?.querySelector('.office-status-dot');
        const statusText = card?.querySelector('.office-status-text');

        if (statusDot) {
          const isOpen = hour >= 9 && hour < 18;
          statusDot.classList.toggle('closed', !isOpen);
          if (statusText) statusText.textContent = isOpen ? 'Open Now' : 'After Hours';
        }
      } catch (e) {
        // Fallback gracefully
      }
    });
  }

  updateClocks();
  setInterval(updateClocks, 30000);
}

/* ==========================================================================
   12. VOICES & PERSPECTIVES TAB FILTER
   ========================================================================== */
function initVoicesTabs() {
  const voiceContainers = document.querySelectorAll('.voices-filter-container');
  voiceContainers.forEach(container => {
    const tabBtns = container.querySelectorAll('.voice-tab-btn');
    const sections = container.querySelectorAll('.voice-section');

    tabBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        sections.forEach(s => s.style.display = 'none');

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target-voice');
        const targetSection = targetId ? container.querySelector(`#${targetId}`) : sections[idx];
        if (targetSection) {
          targetSection.style.display = 'grid';
        }
      });
    });
  });
}


