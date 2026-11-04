/**
 * RaktSetu (रक्तसेतु) — Spatial Holographic Vector Visualizations
 * Zero-dependency spatial SVG charting engine (Luminescent Bezier, Donut, Grouped Bars, Heatmap Matrix).
 */

(function (window) {
  'use strict';

  const SVGCharts = {

    // 1. Weekly Donation Velocity (Luminescent Bezier Multi-line)
    renderTrend(containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const donations = [32, 45, 58, 41, 62, 78, 54];
      const dispatches = [24, 30, 48, 38, 50, 65, 42];

      const w = 540;
      const h = 200;
      const padL = 40;
      const padR = 20;
      const padT = 20;
      const padB = 30;

      const chartW = w - padL - padR;
      const chartH = h - padT - padB;
      const maxVal = 90;

      const getX = (idx) => padL + (idx * (chartW / (days.length - 1)));
      const getY = (val) => padT + chartH - (val / maxVal * chartH);

      const makeSmoothPath = (data) => {
        let path = `M ${getX(0)} ${getY(data[0])}`;
        for (let i = 0; i < data.length - 1; i++) {
          const x0 = getX(i);
          const y0 = getY(data[i]);
          const x1 = getX(i + 1);
          const y1 = getY(data[i + 1]);
          const cx = (x0 + x1) / 2;
          path += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
        }
        return path;
      };

      const donationPath = makeSmoothPath(donations);
      const dispatchPath = makeSmoothPath(dispatches);
      const areaPath = `${donationPath} L ${getX(days.length - 1)} ${padT + chartH} L ${getX(0)} ${padT + chartH} Z`;

      let svg = `
        <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
          <defs>
            <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ff2d55" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="#ff2d55" stop-opacity="0.0"/>
            </linearGradient>
            <filter id="spatialGlowRed" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="spatialGlowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <!-- Grid Lines -->
          ${[0, 30, 60, 90].map(v => `
            <line x1="${padL}" y1="${getY(v)}" x2="${w - padR}" y2="${getY(v)}" stroke="rgba(255, 255, 255, 0.08)" stroke-dasharray="4 4" />
            <text x="${padL - 8}" y="${getY(v) + 4}" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="10.5">${v}</text>
          `).join('')}

          <!-- Area Fill -->
          <path d="${areaPath}" fill="url(#redGrad)" />

          <!-- X-Axis Labels -->
          ${days.map((d, i) => `
            <text x="${getX(i)}" y="${h - 8}" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="600">${d}</text>
          `).join('')}

          <!-- Dispatch Path (Cyan Glow) -->
          <path d="${dispatchPath}" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#spatialGlowCyan)" />

          <!-- Donation Path (Crimson Vitality Glow) -->
          <path d="${donationPath}" fill="none" stroke="#ff2d55" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#spatialGlowRed)" />

          <!-- Data Dots -->
          ${donations.map((v, i) => `
            <circle cx="${getX(i)}" cy="${getY(v)}" r="4.5" fill="#ff2d55" stroke="#ffffff" stroke-width="2" class="chart-data-point">
              <title>${days[i]}: ${v} Donations Logged</title>
            </circle>
          `).join('')}

          ${dispatches.map((v, i) => `
            <circle cx="${getX(i)}" cy="${getY(v)}" r="4" fill="#38bdf8" stroke="#ffffff" stroke-width="2" class="chart-data-point">
              <title>${days[i]}: ${v} Units Dispatched</title>
            </circle>
          `).join('')}
        </svg>
      `;

      container.innerHTML = svg;
    },

    // 2. Blood Group Distribution (Pure SVG Spatial Donut)
    renderDonut(containerId, legendId) {
      const container = document.getElementById(containerId);
      const legend = document.getElementById(legendId);
      if (!container) return;

      const data = [
        { label: 'O+', val: 60, color: '#ff2d55' },
        { label: 'B+', val: 50, color: '#00e5a3' },
        { label: 'A+', val: 40, color: '#38bdf8' },
        { label: 'O-', val: 85, color: '#a855f7' },
        { label: 'B-', val: 35, color: '#fbbf24' },
        { label: 'A-', val: 28, color: '#f43f5e' },
        { label: 'AB+', val: 25, color: '#14b8a6' },
        { label: 'AB-', val: 22, color: '#94a3b8' }
      ];

      const total = data.reduce((acc, d) => acc + d.val, 0);
      const radius = 70;
      const strokeWidth = 22;
      const circumference = 2 * Math.PI * radius;
      const center = 100;

      let currentOffset = 0;
      const segments = data.map(d => {
        const fraction = d.val / total;
        const strokeDasharray = `${fraction * circumference} ${circumference}`;
        const strokeDashoffset = -currentOffset;
        currentOffset += fraction * circumference;

        return `
          <circle
            cx="${center}" cy="${center}" r="${radius}"
            fill="none"
            stroke="${d.color}"
            stroke-width="${strokeWidth}"
            stroke-dasharray="${strokeDasharray}"
            stroke-dashoffset="${strokeDashoffset}"
            style="transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);"
          >
            <title>${d.label}: ${d.val} Units (${Math.round(fraction * 100)}%)</title>
          </circle>
        `;
      }).join('');

      container.innerHTML = `
        <svg viewBox="0 0 200 200" width="100%" height="100%" style="transform: rotate(-90deg);">
          ${segments}
        </svg>
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); text-align:center;">
          <div style="font-size:26px; font-weight:800; color:#ffffff; line-height:1; text-shadow:0 0 14px rgba(255,255,255,0.4);">${total}</div>
          <div style="font-size:10px; font-weight:700; color:#94a3b8; letter-spacing:0.08em; margin-top:3px; text-transform:uppercase;">TOTAL UNITS</div>
        </div>
      `;

      if (legend) {
        legend.innerHTML = data.map(d => `
          <div class="legend-item" style="color:#cbd5e1; font-size:11.5px;">
            <span class="legend-dot" style="background:${d.color}; box-shadow:0 0 6px ${d.color};"></span>
            <span>${d.label} (${Math.round(d.val / total * 100)}%)</span>
          </div>
        `).join('');
      }
    },

    // 3. Monthly Collection vs Usage Grouped Bar Chart
    renderBarChart(containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
      const collected = [120, 145, 160, 185, 210, 240];
      const dispatched = [95, 110, 130, 150, 175, 190];

      const w = 540;
      const h = 200;
      const padL = 40;
      const padR = 20;
      const padT = 20;
      const padB = 30;

      const chartW = w - padL - padR;
      const chartH = h - padT - padB;
      const maxVal = 260;
      const groupW = chartW / months.length;
      const barW = 14;

      const getY = (v) => padT + chartH - (v / maxVal * chartH);

      let svg = `
        <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
          ${[0, 65, 130, 195, 260].map(v => `
            <line x1="${padL}" y1="${getY(v)}" x2="${w - padR}" y2="${getY(v)}" stroke="rgba(255, 255, 255, 0.08)" stroke-dasharray="4 4" />
            <text x="${padL - 8}" y="${getY(v) + 4}" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="10.5">${v}</text>
          `).join('')}

          ${months.map((m, i) => {
        const groupX = padL + (i * groupW) + (groupW / 2);
        const colH = (collected[i] / maxVal) * chartH;
        const disH = (dispatched[i] / maxVal) * chartH;

        return `
              <!-- Collected Bar (Emerald) -->
              <rect
                x="${groupX - barW - 2}" y="${getY(collected[i])}"
                width="${barW}" height="${colH}"
                rx="4" fill="#00e5a3" style="filter:drop-shadow(0 0 6px rgba(0,229,163,0.4));" class="chart-data-point"
              >
                <title>${m} Collected: ${collected[i]} Units</title>
              </rect>

              <!-- Dispatched Bar (Crimson) -->
              <rect
                x="${groupX + 2}" y="${getY(dispatched[i])}"
                width="${barW}" height="${disH}"
                rx="4" fill="#ff2d55" style="filter:drop-shadow(0 0 6px rgba(255,45,85,0.4));" class="chart-data-point"
              >
                <title>${m} Dispatched: ${dispatched[i]} Units</title>
              </rect>

              <!-- X-Axis Label -->
              <text x="${groupX}" y="${h - 8}" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="600">${m}</text>
            `;
      }).join('')}
        </svg>
      `;

      container.innerHTML = svg;
    },

    // 4. Hospital Request Heatmap Matrix
    renderHeatmap(containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const hospitals = ['Civil Hospital', 'Apollo Surat', 'Sterling Vad.', 'Wockhardt Raj.', 'Zydus Meh.'];
      const bloodGroups = ['O+', 'A+', 'B+', 'AB+', 'O-'];

      // Intensity Matrix (0: Low, 1: Moderate, 2: High, 3: Critical)
      const matrix = [
        [3, 2, 3, 1, 3], // Civil
        [2, 1, 2, 0, 2], // Apollo
        [1, 3, 2, 1, 2], // Sterling
        [2, 1, 1, 2, 3], // Wockhardt
        [1, 0, 2, 1, 1]  // Zydus
      ];

      const colorMap = [
        'rgba(255, 255, 255, 0.04)',
        'rgba(251, 191, 36, 0.18)',
        'rgba(255, 45, 85, 0.28)',
        'rgba(255, 45, 85, 0.75)'
      ];
      const textColorMap = ['#94a3b8', '#fbbf24', '#ff476e', '#ffffff'];

      const w = 540;
      const h = 200;
      const padL = 95;
      const padT = 25;
      const cellW = (w - padL - 20) / bloodGroups.length;
      const cellH = (h - padT - 10) / hospitals.length;

      let svg = `
        <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">
          <!-- X Header -->
          ${bloodGroups.map((bg, i) => `
            <text x="${padL + (i * cellW) + (cellW / 2)}" y="${padT - 8}" text-anchor="middle" fill="#cbd5e1" font-weight="700" font-size="11">${bg}</text>
          `).join('')}

          <!-- Matrix Cells -->
          ${hospitals.map((hosp, r) => `
            <text x="${padL - 10}" y="${padT + (r * cellH) + (cellH / 2) + 4}" text-anchor="end" font-size="10.5" font-weight="500" fill="#94a3b8">${hosp}</text>
            ${bloodGroups.map((bg, c) => {
        const intensity = matrix[r][c];
        const x = padL + (c * cellW) + 2;
        const y = padT + (r * cellH) + 2;
        return `
                <rect x="${x}" y="${y}" width="${cellW - 4}" height="${cellH - 4}" rx="6" fill="${colorMap[intensity]}" class="chart-data-point" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1">
                  <title>${hosp} - ${bg}: Priority Level ${intensity === 3 ? 'Code Red' : (intensity === 2 ? 'High' : 'Normal')}</title>
                </rect>
                <text x="${x + (cellW - 4) / 2}" y="${y + (cellH - 4) / 2 + 3}" text-anchor="middle" font-size="10" font-weight="800" fill="${textColorMap[intensity]}">
                  ${intensity === 3 ? 'CRIT' : (intensity === 2 ? 'HIGH' : (intensity === 1 ? 'MOD' : 'OK'))}
                </text>
              `;
      }).join('')}
          `).join('')}
        </svg>
      `;

      container.innerHTML = svg;
    }
  };

  // Export to global window
  window.SVGCharts = SVGCharts;

})(window);
