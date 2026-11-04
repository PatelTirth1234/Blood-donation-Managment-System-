/**
 * ============================================================================
 * RaktSetu (रक्तसेतु) — Spatial UI Physics & VisionOS Interaction Engine
 * Features:
 *  - 3D Holographic Perspective Tilt on Cards & Widgets
 *  - Dynamic Specular Spotlight Tracking (--mouse-x, --mouse-y)
 *  - Ambient Spatial Aurora Parallax
 *  - Volumetric Liquid Meniscus Animation for Blood Inventory
 *  - Specular Glow Waves & Interactive Micro-Physics
 * ============================================================================
 */

(function () {
  'use strict';

  class SpatialEngine {
    constructor() {
      this.cards = [];
      this.init();
    }

    init() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.boot());
      } else {
        this.boot();
      }
    }

    boot() {
      this.bindGlobalParallax();
      this.bindCardTiltPhysics();
      this.enhanceBloodVials();
      this.bindDynamicSpotlight();
      this.setupObserver();
    }

    // Dynamic 3D Cursor Spotlight on Windows and Cards
    bindDynamicSpotlight() {
      window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        document.documentElement.style.setProperty('--cursor-x', `${x}%`);
        document.documentElement.style.setProperty('--cursor-y', `${y}%`);

        // Parallax on Ambient Aurora Orbs
        const orb1 = document.querySelector('.spatial-orb-1');
        const orb2 = document.querySelector('.spatial-orb-2');
        const orb3 = document.querySelector('.spatial-orb-3');

        const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.02;

        if (orb1) orb1.style.transform = `translate(${moveX * -1.5}px, ${moveY * -1.5}px)`;
        if (orb2) orb2.style.transform = `translate(${moveX * 1.8}px, ${moveY * 1.8}px)`;
        if (orb3) orb3.style.transform = `translate(${moveX * -0.8}px, ${moveY * 0.8}px)`;
      }, { passive: true });
    }

    // 3D Perspective Tilt Physics for Glassmorphic Cards
    bindCardTiltPhysics() {
      const selector = '.kpi-card, .blood-card, .iot-sensor-box, .spatial-tilt, .hospital-stock-card';
      const attachTilt = (el) => {
        if (el.dataset.spatialTiltAttached) return;
        el.dataset.spatialTiltAttached = 'true';

        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          // Set local card spotlight coords
          el.style.setProperty('--card-x', `${(x / rect.width) * 100}%`);
          el.style.setProperty('--card-y', `${(y / rect.height) * 100}%`);

          // Calculate tilt angle (max 8 degrees)
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -7;
          const rotateY = ((x - centerX) / centerX) * 7;

          el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px) scale3d(1.015, 1.015, 1.015)`;
        }, { passive: true });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)';
        });
      };

      document.querySelectorAll(selector).forEach(attachTilt);
    }

    // Volumetric 3D Blood Vial Liquid Wave and Meniscus Enhancement
    enhanceBloodVials() {
      document.querySelectorAll('.blood-card').forEach((card) => {
        if (card.querySelector('.vial-specular-glare')) return;

        // Add specular glare overlay
        const glare = document.createElement('div');
        glare.className = 'vial-specular-glare';
        card.appendChild(glare);

        // Add liquid meniscus wave overlay on progress track
        const track = card.querySelector('.blood-progress-track');
        if (track && !track.querySelector('.vial-liquid-wave')) {
          const wave = document.createElement('div');
          wave.className = 'vial-liquid-wave';
          track.appendChild(wave);
        }
      });
    }

    // Observe DOM mutations to bind new dynamically rendered cards
    setupObserver() {
      const observer = new MutationObserver(() => {
        this.bindCardTiltPhysics();
        this.enhanceBloodVials();
      });

      const fullGrid = document.getElementById('fullInventoryGrid');
      const bloodGrid = document.getElementById('bloodCardsGrid');

      if (fullGrid) observer.observe(fullGrid, { childList: true, subtree: true });
      if (bloodGrid) observer.observe(bloodGrid, { childList: true, subtree: true });
    }

    bindGlobalParallax() {
      // Add subtle ripple pulse on interactive click
      document.addEventListener('click', (e) => {
        const target = e.target.closest('.btn, .nav-item, .search-pill-btn, .topbar-btn-action, .kpi-card, .blood-card');
        if (!target) return;

        const ripple = document.createElement('span');
        ripple.className = 'spatial-click-ripple';
        const rect = target.getBoundingClientRect();
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        target.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    }
  }

  // Export globally
  window.SpatialEngine = new SpatialEngine();
})();
