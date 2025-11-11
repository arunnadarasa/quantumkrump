import { decodeKrumpResults, getEnergyLevel, getSuggestedRoutine } from './krump-decoder';

export interface KrumpJobMetadata {
  circuit?: string;
  shots?: number;
  created_at?: string;
  backend_type?: string;
}

const escapeXml = (str: string): string => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const getEnergyColor = (energy: number): string => {
  switch (energy) {
    case 0: return '#94a3b8'; // slate
    case 1: return '#10b981'; // emerald
    case 2: return '#f59e0b'; // amber
    case 3: return '#f43f5e'; // rose
    default: return '#94a3b8';
  }
};

const getEnergyGradient = (energy: number): string => {
  switch (energy) {
    case 0: return 'url(#energyGradient0)';
    case 1: return 'url(#energyGradient1)';
    case 2: return 'url(#energyGradient2)';
    case 3: return 'url(#energyGradient3)';
    default: return 'url(#energyGradient0)';
  }
};

const getEnergyEmoji = (energy: number): string => {
  switch (energy) {
    case 0: return '💤';
    case 1: return '⚡';
    case 2: return '🔥';
    case 3: return '💥';
    default: return '💤';
  }
};

export const generateKrumpSVG = (results: any, jobMetadata?: KrumpJobMetadata): string => {
  const measurements = results.measurements || {};
  const probabilities = results.probabilities || {};
  const shots = results.shots || jobMetadata?.shots || 0;
  const circuit = results.circuit || jobMetadata?.circuit || 'krump_choreography';
  const timestamp = jobMetadata?.created_at 
    ? new Date(jobMetadata.created_at).toLocaleString() 
    : new Date().toLocaleString();
  const backend = jobMetadata?.backend_type || 'simulator';

  // Decode krump moves
  const decodedMoves = decodeKrumpResults(measurements, probabilities);
  const suggestedRoutine = getSuggestedRoutine(decodedMoves, 5);
  
  // Calculate average energy
  const avgEnergy = decodedMoves.reduce((sum, move) => sum + move.probability, 0) > 0
    ? decodedMoves.reduce((sum, move) => sum + move.energy * move.probability, 0)
    : 0;
  
  // Energy distribution
  const energyDist = { 0: 0, 1: 0, 2: 0, 3: 0 };
  decodedMoves.forEach(move => {
    energyDist[move.energy as keyof typeof energyDist] += move.probability;
  });

  const chartWidth = 650;
  const margin = { top: 120, left: 30, right: 30, bottom: 40 };
  
  // Calculate heights - much more compact
  const moveCardHeight = 80;
  const moveCardsPerRow = 2;
  const moveRows = Math.ceil(decodedMoves.length / moveCardsPerRow);
  const moveCardsHeight = moveRows * (moveCardHeight + 15) + 80;
  const routineHeight = 140;
  const tipsHeight = 110;
  const energyDistHeight = 200;
  
  const totalHeight = margin.top + moveCardsHeight + routineHeight + tipsHeight + energyDistHeight + 80;

  // Generate SVG
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${chartWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
  <!-- Premium Gradient Definitions -->
  <defs>
    <!-- Energy Level Gradients -->
    <linearGradient id="energyGradient0" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#cbd5e1;stop-opacity:0.2" />
      <stop offset="100%" style="stop-color:#94a3b8;stop-opacity:0.3" />
    </linearGradient>
    <linearGradient id="energyGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.15" />
      <stop offset="100%" style="stop-color:#059669;stop-opacity:0.25" />
    </linearGradient>
    <linearGradient id="energyGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:0.15" />
      <stop offset="100%" style="stop-color:#d97706;stop-opacity:0.25" />
    </linearGradient>
    <linearGradient id="energyGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f43f5e;stop-opacity:0.15" />
      <stop offset="100%" style="stop-color:#dc2626;stop-opacity:0.25" />
    </linearGradient>
    
    <!-- Background Gradients -->
    <linearGradient id="headerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:#6366f1;stop-opacity:0.05" />
    </linearGradient>
    
    <!-- Shadow filters -->
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
      <feOffset dx="0" dy="2" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.15"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background with subtle gradient -->
  <rect width="100%" height="100%" fill="url(#headerGradient)"/>
  <rect width="100%" height="100%" fill="#ffffff" opacity="0.95"/>
  
  <!-- Premium Header with glassmorphism effect -->
  <rect x="30" y="15" width="590" height="90" fill="#ffffff" rx="12" opacity="0.9" filter="url(#cardShadow)"/>
  <rect x="30" y="15" width="590" height="90" fill="url(#headerGradient)" rx="12" opacity="0.5"/>
  
  <text x="${chartWidth / 2}" y="40" text-anchor="middle" font-size="24" font-weight="700" fill="#1a1a1a">
    🎭 Krump Choreography Analysis
  </text>
  
  <text x="${chartWidth / 2}" y="62" text-anchor="middle" font-size="11" fill="#64748b" font-weight="500">
    ${escapeXml(circuit)} • ${shots} shots • ${escapeXml(backend)}
  </text>
  
  <!-- Energy gauge visualization -->
  <g transform="translate(${chartWidth / 2 - 80}, 75)">
    <rect x="0" y="0" width="160" height="20" fill="#f1f5f9" rx="10"/>
    <rect x="0" y="0" width="${avgEnergy * 40}" height="20" fill="url(#energyGradient${Math.round(avgEnergy)})" rx="10"/>
    <text x="80" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="#1e293b">
      Avg Energy: ${avgEnergy.toFixed(1)} ${getEnergyEmoji(Math.round(avgEnergy))}
    </text>
  </g>
  
  <!-- Move Breakdown Section -->
  <g transform="translate(0, ${margin.top})">
    <text x="${chartWidth / 2}" y="10" text-anchor="middle" font-size="16" font-weight="600" fill="#1e293b">
      MOVE BREAKDOWN
    </text>
    <line x1="220" y1="18" x2="430" y2="18" stroke="#e2e8f0" stroke-width="2"/>
    
    <!-- Two-column grid of compact move cards -->
    ${decodedMoves.map((move, i) => {
      const col = i % moveCardsPerRow;
      const row = Math.floor(i / moveCardsPerRow);
      const x = 30 + col * 305;
      const y = 35 + row * (moveCardHeight + 15);
      const progressCircumference = 2 * Math.PI * 22;
      const progressOffset = progressCircumference * (1 - move.probability);
      const energyColor = getEnergyColor(move.energy);
      const energyGrad = getEnergyGradient(move.energy);
      
      return `
    <!-- Compact Move Card ${i + 1} -->
    <g transform="translate(${x}, ${y})" filter="url(#cardShadow)">
      <rect x="0" y="0" width="290" height="${moveCardHeight}" fill="${energyGrad}" rx="8" stroke="${energyColor}" stroke-width="1.5"/>
      <rect x="0" y="0" width="290" height="${moveCardHeight}" fill="#ffffff" rx="8" opacity="0.85"/>
      
      <!-- Progress circle indicator -->
      <circle cx="35" cy="40" r="24" fill="none" stroke="#e2e8f0" stroke-width="3"/>
      <circle cx="35" cy="40" r="22" fill="none" stroke="${energyColor}" stroke-width="3"
              stroke-dasharray="${progressCircumference}"
              stroke-dashoffset="${progressOffset}"
              transform="rotate(-90 35 40)"
              stroke-linecap="round"/>
      <text x="35" y="45" text-anchor="middle" font-size="18" fill="#1e293b">${escapeXml(move.emoji)}</text>
      
      <!-- Move details -->
      <text x="68" y="22" font-size="13" font-weight="600" fill="#1e293b">${escapeXml(move.name)}</text>
      <text x="68" y="38" font-size="10" fill="#64748b" font-weight="500">
        ${(move.probability * 100).toFixed(1)}% • ${move.count} hits
      </text>
      
      <!-- Energy mini-bars -->
      <g transform="translate(68, 44)">
        ${Array.from({ length: 4 }).map((_, ei) => `
        <rect x="${ei * 12}" y="0" width="10" height="8" fill="${ei <= move.energy ? energyColor : '#e2e8f0'}" rx="2" opacity="${ei <= move.energy ? '1' : '0.3'}"/>
        `).join('')}
      </g>
      
      <!-- Component indicators (compact icons) -->
      <g transform="translate(68, 58)">
        <circle cx="5" cy="5" r="4" fill="${move.components.jabStomp ? energyColor : '#e2e8f0'}" opacity="${move.components.jabStomp ? '1' : '0.4'}"/>
        <text x="5" y="8" text-anchor="middle" font-size="7" fill="#fff" font-weight="700">S</text>
        
        <circle cx="22" cy="5" r="4" fill="${move.components.armSwing ? energyColor : '#e2e8f0'}" opacity="${move.components.armSwing ? '1' : '0.4'}"/>
        <text x="22" y="8" text-anchor="middle" font-size="7" fill="#fff" font-weight="700">W</text>
        
        <circle cx="39" cy="5" r="4" fill="${move.components.chestPop ? energyColor : '#e2e8f0'}" opacity="${move.components.chestPop ? '1' : '0.4'}"/>
        <text x="39" y="8" text-anchor="middle" font-size="7" fill="#fff" font-weight="700">P</text>
      </g>
    </g>
      `;
    }).join('')}
  </g>
  
  <!-- Suggested Routine - Horizontal Timeline -->
  <g transform="translate(0, ${margin.top + moveCardsHeight + 20})">
    <text x="${chartWidth / 2}" y="0" text-anchor="middle" font-size="16" font-weight="600" fill="#1e293b">
      🎯 SUGGESTED ROUTINE
    </text>
    <line x1="220" y1="8" x2="430" y2="8" stroke="#e2e8f0" stroke-width="2"/>
    
    <rect x="30" y="20" width="590" height="90" fill="#ecfdf5" rx="10" stroke="#10b981" stroke-width="2" filter="url(#cardShadow)"/>
    
    <!-- Horizontal flow with arrows -->
    ${suggestedRoutine.map((move, i) => {
      const x = 50 + i * 115;
      const energyColor = getEnergyColor(move.energy);
      
      return `
    <g transform="translate(${x}, 40)">
      <!-- Move bubble -->
      <circle cx="30" cy="30" r="26" fill="${energyColor}" opacity="0.2" stroke="${energyColor}" stroke-width="2"/>
      <text x="30" y="32" text-anchor="middle" font-size="20">${escapeXml(move.emoji)}</text>
      <text x="30" y="68" text-anchor="middle" font-size="9" font-weight="600" fill="#1e293b">${i + 1}. ${(move.probability * 100).toFixed(0)}%</text>
      ${i < suggestedRoutine.length - 1 ? `
      <!-- Arrow to next -->
      <path d="M 60 30 L 85 30" stroke="#10b981" stroke-width="2" fill="none"/>
      <path d="M 82 26 L 88 30 L 82 34" stroke="#10b981" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      ` : ''}
    </g>
      `;
    }).join('')}
  </g>
  
  <!-- Choreography Tips - Compact -->
  <g transform="translate(0, ${margin.top + moveCardsHeight + routineHeight + 35})">
    <text x="${chartWidth / 2}" y="0" text-anchor="middle" font-size="16" font-weight="600" fill="#1e293b">
      📝 TIPS
    </text>
    <line x1="270" y1="8" x2="380" y2="8" stroke="#e2e8f0" stroke-width="2"/>
    
    <rect x="30" y="18" width="590" height="70" fill="#fffbeb" rx="8" stroke="#f59e0b" stroke-width="1.5" filter="url(#cardShadow)"/>
    
    <text x="45" y="38" font-size="10" fill="#78716c">• Start with high-probability moves for impact</text>
    <text x="45" y="54" font-size="10" fill="#78716c">• Mix energy levels for dynamic flow</text>
    <text x="45" y="70" font-size="10" fill="#78716c">• Use low-probability moves as surprise accents</text>
  </g>
  
  <!-- Energy Distribution - Circular/Donut Visualization -->
  <g transform="translate(0, ${margin.top + moveCardsHeight + routineHeight + tipsHeight + 50})">
    <text x="${chartWidth / 2}" y="0" text-anchor="middle" font-size="16" font-weight="600" fill="#1e293b">
      ENERGY DISTRIBUTION
    </text>
    <line x1="210" y1="8" x2="440" y2="8" stroke="#e2e8f0" stroke-width="2"/>
    
    <!-- Circular distribution with radial segments -->
    <g transform="translate(${chartWidth / 2}, 95)">
      ${Object.entries(energyDist).map(([energy, prob], i) => {
        const angle = (i / 4) * 360;
        const startAngle = angle - 90;
        const endAngle = startAngle + 90;
        const radius = 60;
        const innerRadius = 35;
        
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        
        const x1 = Math.cos(startRad) * innerRadius;
        const y1 = Math.sin(startRad) * innerRadius;
        const x2 = Math.cos(startRad) * radius;
        const y2 = Math.sin(startRad) * radius;
        const x3 = Math.cos(endRad) * radius;
        const y3 = Math.sin(endRad) * radius;
        const x4 = Math.cos(endRad) * innerRadius;
        const y4 = Math.sin(endRad) * innerRadius;
        
        const energyNum = parseInt(energy);
        const color = getEnergyColor(energyNum);
        const emoji = getEnergyEmoji(energyNum);
        const label = ['Rest', 'Low', 'Med', 'High'][energyNum];
        
        const labelAngle = (startAngle + 45) * Math.PI / 180;
        const labelRadius = 80;
        const labelX = Math.cos(labelAngle) * labelRadius;
        const labelY = Math.sin(labelAngle) * labelRadius;
        
        return `
      <!-- Segment ${i} -->
      <path d="M ${x1} ${y1} L ${x2} ${y2} A ${radius} ${radius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}"
            fill="${color}" opacity="${prob > 0 ? 0.8 : 0.2}" stroke="#ffffff" stroke-width="2"/>
      
      <!-- Label -->
      <text x="${labelX}" y="${labelY}" text-anchor="middle" font-size="11" font-weight="600" fill="#1e293b">
        ${emoji} ${label}
      </text>
      <text x="${labelX}" y="${labelY + 14}" text-anchor="middle" font-size="10" fill="#64748b">
        ${(prob * 100).toFixed(1)}%
      </text>
        `;
      }).join('')}
      
      <!-- Center circle -->
      <circle cx="0" cy="0" r="32" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
      <text x="0" y="-8" text-anchor="middle" font-size="11" font-weight="600" fill="#64748b">ENERGY</text>
      <text x="0" y="8" text-anchor="middle" font-size="14" font-weight="700" fill="#8b5cf6">${avgEnergy.toFixed(1)}</text>
      <text x="0" y="20" text-anchor="middle" font-size="16">${getEnergyEmoji(Math.round(avgEnergy))}</text>
    </g>
  </g>
  
  <!-- Premium Footer -->
  <text x="${chartWidth / 2}" y="${totalHeight - 20}" text-anchor="middle" font-size="9" fill="#94a3b8" font-weight="500">
    Quantum Krump Platform • ${escapeXml(timestamp)}
  </text>
</svg>`;

  return svg;
};

export const downloadKrumpSVG = (svgContent: string, filename: string) => {
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
