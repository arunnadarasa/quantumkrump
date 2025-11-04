import { decodeKrumpResults, getEnergyLevel, getSuggestedRoutine } from './krump-decoder';

export interface KrumpJobMetadata {
  circuit?: string;
  shots?: number;
  created_at?: string;
  backend_type?: string;
}

const getEnergyColor = (energy: number): string => {
  switch (energy) {
    case 0: return '#9ca3af'; // gray
    case 1: return '#10b981'; // emerald
    case 2: return '#f59e0b'; // amber
    case 3: return '#f43f5e'; // rose
    default: return '#9ca3af';
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
  const avgEnergy = decodedMoves.reduce((sum, move) => sum + move.energy * move.probability, 0);
  
  // Energy distribution
  const energyDist = { 0: 0, 1: 0, 2: 0, 3: 0 };
  decodedMoves.forEach(move => {
    energyDist[move.energy as keyof typeof energyDist] += move.probability;
  });

  const chartWidth = 700;
  const margin = { top: 140, left: 40, right: 40, bottom: 40 };
  
  // Calculate heights
  const moveCardHeight = 180;
  const moveCardsHeight = decodedMoves.length * (moveCardHeight + 20) + 60;
  const routineHeight = 280;
  const tipsHeight = 200;
  const energyDistHeight = 250;
  
  // Raw data
  const rawData = {
    results,
    metadata: jobMetadata,
    decoded_moves: decodedMoves,
    suggested_routine: suggestedRoutine,
    average_energy: avgEnergy
  };
  const rawDataJSON = JSON.stringify(rawData, null, 2);
  const rawDataLines = rawDataJSON.split('\n');
  const rawDataHeight = Math.min(rawDataLines.length * 14 + 60, 800); // Cap at 800px
  
  const totalHeight = margin.top + moveCardsHeight + routineHeight + tipsHeight + energyDistHeight + rawDataHeight + 100;

  // Generate SVG
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${chartWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
  <!-- Definitions -->
  <defs>
    <linearGradient id="energyGradientHigh" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#f43f5e;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#dc2626;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="energyGradientMedium" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#d97706;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="energyGradientLow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="#ffffff"/>
  
  <!-- Header -->
  <text x="${chartWidth / 2}" y="30" text-anchor="middle" font-size="28" font-weight="bold" fill="#1a1a1a">
    🎭 Krump Choreography Analysis
  </text>
  
  <!-- Metadata -->
  <text x="${chartWidth / 2}" y="60" text-anchor="middle" font-size="14" fill="#666666">
    Circuit: ${circuit} | Shots: ${shots} | Backend: ${backend}
  </text>
  <text x="${chartWidth / 2}" y="80" text-anchor="middle" font-size="12" fill="#999999">
    ${timestamp}
  </text>
  <text x="${chartWidth / 2}" y="105" text-anchor="middle" font-size="16" font-weight="600" fill="#8b5cf6">
    Average Energy: ${getEnergyLevel(Math.round(avgEnergy))} (${avgEnergy.toFixed(2)})
  </text>
  
  <!-- Divider -->
  <line x1="60" y1="120" x2="${chartWidth - 60}" y2="120" stroke="#e0e0e0" stroke-width="2"/>
  
  <!-- Move Breakdown Section -->
  <g transform="translate(0, ${margin.top})">
    <text x="${chartWidth / 2}" y="0" text-anchor="middle" font-size="20" font-weight="600" fill="#333333">
      Move Breakdown
    </text>
    
    ${decodedMoves.map((move, i) => {
      const y = 40 + i * (moveCardHeight + 20);
      const barWidth = (move.probability * 520);
      const energyColor = getEnergyColor(move.energy);
      const energyEmoji = getEnergyEmoji(move.energy);
      
      return `
    <!-- Move Card ${i + 1} -->
    <g transform="translate(60, ${y})">
      <!-- Card background -->
      <rect x="0" y="0" width="580" height="${moveCardHeight - 10}" fill="#fafafa" rx="8" stroke="#e0e0e0" stroke-width="1"/>
      
      <!-- Move name and emoji -->
      <text x="20" y="30" font-size="16" font-weight="600" fill="#1a1a1a">${move.emoji} ${move.name}</text>
      
      <!-- Energy level -->
      <text x="20" y="55" font-size="14" fill="#666666">Energy: ${getEnergyLevel(move.energy)} (${move.energy})</text>
      
      <!-- Count and probability -->
      <text x="20" y="80" font-size="13" fill="#666666">Count: ${move.count} | Probability: ${(move.probability * 100).toFixed(1)}%</text>
      
      <!-- Probability bar -->
      <rect x="20" y="90" width="${barWidth}" height="20" fill="${energyColor}" rx="4" opacity="0.8"/>
      
      <!-- Components -->
      <text x="20" y="125" font-size="12" fill="#666666">Components:</text>
      <text x="20" y="145" font-size="11" fill="#333333">
        ${move.components.jabStomp ? '✅' : '❌'} Stomp | ${move.components.armSwing ? '✅' : '❌'} Swing | ${move.components.chestPop ? '✅' : '❌'} Pop
      </text>
      
      <!-- Description -->
      <text x="20" y="165" font-size="10" fill="#999999">${move.description}</text>
    </g>
      `;
    }).join('')}
  </g>
  
  <!-- Suggested Routine Section -->
  <g transform="translate(0, ${margin.top + moveCardsHeight + 40})">
    <text x="${chartWidth / 2}" y="0" text-anchor="middle" font-size="20" font-weight="600" fill="#333333">
      🎯 Suggested Routine (Top 5)
    </text>
    
    <rect x="60" y="20" width="580" height="220" fill="#f0fdf4" rx="8" stroke="#10b981" stroke-width="2"/>
    
    ${suggestedRoutine.map((move, i) => {
      const y = 50 + i * 40;
      return `
    <text x="80" y="${y}" font-size="14" font-weight="500" fill="#1a1a1a">
      ${i + 1}. ${move.emoji} ${move.name} (${(move.probability * 100).toFixed(1)}%)
    </text>
      `;
    }).join('')}
  </g>
  
  <!-- Choreography Tips Section -->
  <g transform="translate(0, ${margin.top + moveCardsHeight + routineHeight + 60})">
    <text x="${chartWidth / 2}" y="0" text-anchor="middle" font-size="20" font-weight="600" fill="#333333">
      📝 Choreography Tips
    </text>
    
    <rect x="60" y="20" width="580" height="140" fill="#fef3c7" rx="8" stroke="#f59e0b" stroke-width="2"/>
    
    <text x="80" y="50" font-size="12" fill="#333333">• Start with highest probability moves for impact</text>
    <text x="80" y="75" font-size="12" fill="#333333">• Mix energy levels (💤→⚡→🔥→💥) for dynamic flow</text>
    <text x="80" y="100" font-size="12" fill="#333333">• Repeat top 3 moves for memorability</text>
    <text x="80" y="125" font-size="12" fill="#333333">• Use lower probability moves as surprise accents</text>
  </g>
  
  <!-- Energy Distribution Section -->
  <g transform="translate(0, ${margin.top + moveCardsHeight + routineHeight + tipsHeight + 80})">
    <text x="${chartWidth / 2}" y="0" text-anchor="middle" font-size="20" font-weight="600" fill="#333333">
      Energy Distribution
    </text>
    
    ${Object.entries(energyDist).map(([energy, prob], i) => {
      const y = 40 + i * 45;
      const barWidth = prob * 500;
      const energyNum = parseInt(energy);
      const color = getEnergyColor(energyNum);
      const emoji = getEnergyEmoji(energyNum);
      const label = ['Rest', 'Low', 'Medium', 'High'][energyNum];
      
      return `
    <text x="80" y="${y}" font-size="14" font-weight="500" fill="#333333">${emoji} ${label} (${energyNum}):</text>
    <rect x="180" y="${y - 15}" width="${barWidth}" height="20" fill="${color}" rx="4" opacity="0.8"/>
    <text x="${185 + barWidth}" y="${y}" font-size="12" fill="#666666">${(prob * 100).toFixed(1)}%</text>
      `;
    }).join('')}
  </g>
  
  <!-- Raw Data Section -->
  <g transform="translate(0, ${margin.top + moveCardsHeight + routineHeight + tipsHeight + energyDistHeight + 100})">
    <text x="${chartWidth / 2}" y="0" text-anchor="middle" font-size="16" font-weight="600" fill="#333333">
      Raw Data (JSON)
    </text>
    
    <!-- Data background -->
    <rect x="40" y="15" width="${chartWidth - 80}" height="${rawDataHeight - 40}" fill="#f9f9f9" rx="4" stroke="#e0e0e0" stroke-width="1"/>
    
    <!-- JSON content (first 50 lines max for readability) -->
    ${rawDataLines.slice(0, 50).map((line, i) => {
      const y = 35 + i * 14;
      const escapedLine = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
      return `<text x="50" y="${y}" font-size="9" font-family="monospace" fill="#333333">${escapedLine}</text>`;
    }).join('\n    ')}
    ${rawDataLines.length > 50 ? `<text x="50" y="${35 + 50 * 14}" font-size="9" font-family="monospace" fill="#999999">... (${rawDataLines.length - 50} more lines)</text>` : ''}
  </g>
  
  <!-- Footer -->
  <text x="${chartWidth / 2}" y="${totalHeight - 20}" text-anchor="middle" font-size="10" fill="#999999">
    Generated by Quantum Krump Platform | Dance meets Quantum Computing
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
