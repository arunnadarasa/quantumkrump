import ikfLogo from "@/assets/ikf-logo.png";
import iyqLogoWhite from "@/assets/iyq-logo-white.png";
import quantumKrumpLogo from "@/assets/quantum-krump-logo.png";

export interface JobMetadata {
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

// Convert image to base64 for embedding in SVG
async function imageToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const generateResultsSVG = async (results: any, jobMetadata?: JobMetadata): Promise<string> => {
  const measurements = results.measurements || {};
  const probabilities = results.probabilities || {};
  const shots = results.shots || jobMetadata?.shots || 0;
  const circuit = results.circuit || jobMetadata?.circuit || 'Unknown Circuit';
  const timestamp = jobMetadata?.created_at 
    ? new Date(jobMetadata.created_at).toLocaleString() 
    : new Date().toLocaleString();
  const backend = jobMetadata?.backend_type || 'simulator';

  // Convert logos to base64 for SVG embedding
  const ikfBase64 = await imageToBase64(ikfLogo);
  const iyqBase64 = await imageToBase64(iyqLogoWhite);
  const quantumKrumpBase64 = await imageToBase64(quantumKrumpLogo);

  // Prepare chart data
  const chartData = Object.entries(measurements).map(([state, count]) => ({
    state,
    count: Number(count),
    probability: probabilities[state] || 0
  })).sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...chartData.map(d => d.count));
  const maxProbability = Math.max(...chartData.map(d => d.probability));
  const barHeight = 30;
  const barSpacing = 10;
  const chartHeight = chartData.length * (barHeight + barSpacing) + 40;
  const probabilityHeight = chartData.length * (barHeight + barSpacing) + 40;
  const chartWidth = 600;
  const barMaxWidth = 350;
  const margin = { top: 150, right: 20, bottom: 80, left: 120 };

  // Prepare raw data JSON
  const rawData = {
    results,
    metadata: jobMetadata
  };
  const rawDataJSON = JSON.stringify(rawData, null, 2);
  const rawDataLines = rawDataJSON.split('\n');
  const rawDataHeight = rawDataLines.length * 14 + 60;

  // Calculate total height
  const tableHeight = chartData.length * 30 + 80;
  const totalHeight = margin.top + chartHeight + probabilityHeight + tableHeight + rawDataHeight + 140;

  // Generate SVG
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${chartWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
  <!-- Definitions -->
  <defs>
    <!-- Background gradient (purple to navy diagonal) -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#5b21b6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e3a8a;stop-opacity:1" />
    </linearGradient>
    
    <!-- Quantum dots pattern -->
    <pattern id="quantumDots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="5" cy="5" r="1.5" fill="#ffffff" opacity="0.15"/>
      <circle cx="25" cy="15" r="1" fill="#a78bfa" opacity="0.2"/>
      <circle cx="15" cy="30" r="1.2" fill="#c4b5fd" opacity="0.15"/>
      <circle cx="35" cy="25" r="0.8" fill="#ffffff" opacity="0.1"/>
    </pattern>
    
    <!-- Text glow effect -->
    <filter id="textGlow">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- Header gradient -->
    <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:0.9" />
      <stop offset="100%" style="stop-color:#6366f1;stop-opacity:0.9" />
    </linearGradient>
    
    <!-- Bar gradients -->
    <linearGradient id="barGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#a78bfa;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
    
    <linearGradient id="probGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#c4b5fd;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#a78bfa;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background with gradient -->
  <rect width="100%" height="100%" fill="url(#bgGradient)"/>
  
  <!-- Quantum dots overlay -->
  <rect width="100%" height="100%" fill="url(#quantumDots)"/>
  
  <!-- Decorative border -->
  <rect x="10" y="10" width="${chartWidth - 20}" height="${totalHeight - 20}" 
        fill="none" stroke="url(#headerGradient)" stroke-width="2" rx="20" opacity="0.3"/>
  
  <!-- Header -->
  <g>
    <rect x="30" y="15" width="${chartWidth - 60}" height="120" fill="url(#headerGradient)" rx="12" opacity="0.8"/>
    
    <!-- IKF Logo (left) -->
    <image href="${ikfBase64}" x="45" y="25" width="70" height="70" preserveAspectRatio="xMidYMid meet"/>
    
    <!-- IYQ White Logo (right) -->
    <image href="${iyqBase64}" x="${chartWidth - 115}" y="25" width="70" height="70" preserveAspectRatio="xMidYMid meet"/>
    
    <!-- Title -->
    <text x="${chartWidth / 2}" y="55" text-anchor="middle" font-size="22" font-weight="700" fill="#ffffff" filter="url(#textGlow)">
      ⚛️ Quantum Circuit Results
    </text>
    
    <!-- Metadata -->
    <text x="${chartWidth / 2}" y="80" text-anchor="middle" font-size="11" fill="#e0e7ff" font-weight="500">
      ${escapeXml(circuit)} • ${shots} shots • ${escapeXml(backend)}
    </text>
    <text x="${chartWidth / 2}" y="100" text-anchor="middle" font-size="9" fill="#c4b5fd">
      ${escapeXml(timestamp)}
    </text>
  </g>
  
  <!-- Divider -->
  <line x1="40" y1="145" x2="${chartWidth - 40}" y2="145" stroke="#a78bfa" stroke-width="1" opacity="0.3"/>
  
  <!-- Chart Title -->
  <text x="${chartWidth / 2}" y="${margin.top - 10}" text-anchor="middle" font-size="16" font-weight="600" fill="#ffffff" filter="url(#textGlow)">
    Measurement Distribution
  </text>
  
  <!-- Chart -->
  <g transform="translate(${margin.left}, ${margin.top})">
    <!-- Y-axis labels and bars -->
    ${chartData.map((d, i) => {
      const y = i * (barHeight + barSpacing);
      const barWidth = (d.count / maxCount) * barMaxWidth;
      const percentage = (d.probability * 100).toFixed(1);
      
      return `
    <!-- State label -->
    <text x="-10" y="${y + barHeight / 2 + 5}" text-anchor="end" font-size="14" font-family="monospace" fill="#e0e7ff">
      |${d.state}⟩
    </text>
    
    <!-- Bar -->
    <rect x="0" y="${y}" width="${barWidth}" height="${barHeight}" fill="url(#barGradient)" rx="4" opacity="0.9"/>
    
    <!-- Count label -->
    <text x="${barWidth + 10}" y="${y + barHeight / 2 + 5}" font-size="12" fill="#c4b5fd">
      ${d.count} (${percentage}%)
    </text>
      `;
    }).join('')}
    
    <!-- X-axis -->
    <line x1="0" y1="${chartHeight - 40}" x2="${barMaxWidth}" y2="${chartHeight - 40}" stroke="#a78bfa" stroke-width="1" opacity="0.5"/>
    <text x="${barMaxWidth / 2}" y="${chartHeight - 15}" text-anchor="middle" font-size="12" fill="#c4b5fd">
      Measurement Counts
    </text>
  </g>
  
  <!-- Probability Distribution Section -->
  <g transform="translate(${margin.left}, ${margin.top + chartHeight + 40})">
    <text x="${barMaxWidth / 2}" y="-20" text-anchor="middle" font-size="16" font-weight="600" fill="#ffffff" filter="url(#textGlow)">
      Probability Distribution
    </text>
    
    <!-- Y-axis labels and bars -->
    ${chartData.map((d, i) => {
      const y = i * (barHeight + barSpacing);
      const barWidth = (d.probability / maxProbability) * barMaxWidth;
      const percentage = (d.probability * 100).toFixed(2);
      
      return `
    <!-- State label -->
    <text x="-10" y="${y + barHeight / 2 + 5}" text-anchor="end" font-size="14" font-family="monospace" fill="#e0e7ff">
      |${d.state}⟩
    </text>
    
    <!-- Bar with gradient -->
    <rect x="0" y="${y}" width="${barWidth}" height="${barHeight}" fill="url(#probGradient)" rx="4" opacity="0.9"/>
    
    <!-- Percentage label -->
    <text x="${barWidth + 10}" y="${y + barHeight / 2 + 5}" font-size="12" fill="#c4b5fd">
      ${percentage}%
    </text>
      `;
    }).join('')}
    
    <!-- X-axis -->
    <line x1="0" y1="${probabilityHeight - 40}" x2="${barMaxWidth}" y2="${probabilityHeight - 40}" stroke="#a78bfa" stroke-width="1" opacity="0.5"/>
    <text x="${barMaxWidth / 2}" y="${probabilityHeight - 15}" text-anchor="middle" font-size="12" fill="#c4b5fd">
      Probability
    </text>
  </g>
  
  <!-- Table Section -->
  <g transform="translate(0, ${margin.top + chartHeight + probabilityHeight + 80})">
    <text x="${chartWidth / 2}" y="0" text-anchor="middle" font-size="16" font-weight="600" fill="#ffffff" filter="url(#textGlow)">
      Detailed Results
    </text>
    
    <!-- Table Header -->
    <rect x="80" y="20" width="${chartWidth - 160}" height="30" fill="#1e293b" rx="4" opacity="0.8"/>
    <text x="120" y="40" font-size="12" font-weight="600" fill="#ffffff">State</text>
    <text x="${chartWidth / 2}" y="40" text-anchor="middle" font-size="12" font-weight="600" fill="#ffffff">Count</text>
    <text x="${chartWidth - 120}" y="40" text-anchor="end" font-size="12" font-weight="600" fill="#ffffff">Probability</text>
    
    <!-- Table Rows -->
    ${chartData.map((d, i) => {
      const y = 55 + i * 30;
      const percentage = (d.probability * 100).toFixed(2);
      
      return `
    <rect x="80" y="${y}" width="${chartWidth - 160}" height="28" fill="${i % 2 === 0 ? '#1e293b' : '#0f172a'}" rx="2" opacity="0.6"/>
    <text x="120" y="${y + 18}" font-size="12" font-family="monospace" fill="#e0e7ff">|${d.state}⟩</text>
    <text x="${chartWidth / 2}" y="${y + 18}" text-anchor="middle" font-size="12" fill="#e0e7ff">${d.count}</text>
    <text x="${chartWidth - 120}" y="${y + 18}" text-anchor="end" font-size="12" fill="#c4b5fd">${percentage}%</text>
      `;
    }).join('')}
  </g>
  
  <!-- Raw Data Section -->
  <g transform="translate(0, ${margin.top + chartHeight + probabilityHeight + tableHeight + 100})">
    <text x="${chartWidth / 2}" y="0" text-anchor="middle" font-size="16" font-weight="600" fill="#ffffff" filter="url(#textGlow)">
      Raw Data (JSON)
    </text>
    
    <!-- Data background -->
    <rect x="40" y="15" width="${chartWidth - 80}" height="${rawDataHeight - 40}" fill="#0f172a" rx="4" stroke="#a78bfa" stroke-width="1" opacity="0.7"/>
    
    <!-- JSON content -->
    ${rawDataLines.map((line, i) => {
      const y = 35 + i * 14;
      const escapedLine = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
      return `<text x="50" y="${y}" font-size="10" font-family="monospace" fill="#c4b5fd">${escapedLine}</text>`;
    }).join('\n    ')}
  </g>
  
  <!-- Footer -->
  <g transform="translate(0, ${totalHeight - 70})">
    <rect width="100%" height="70" fill="#0f172a" rx="15" opacity="0.8"/>
    
    <!-- Quantum Krump Logo (footer right) -->
    <image href="${quantumKrumpBase64}" x="${chartWidth - 75}" y="10" width="50" height="50" preserveAspectRatio="xMidYMid meet" filter="url(#textGlow)"/>
    
    <text x="60" y="40" text-anchor="start" font-size="10" fill="#e0e7ff" font-weight="500">
      Quantum Krump Platform • ${escapeXml(timestamp)}
    </text>
  </g>
</svg>`;

  return svg;
};

export const downloadSVG = (svgContent: string, filename: string) => {
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