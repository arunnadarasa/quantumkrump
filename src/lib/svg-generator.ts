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

export const generateResultsSVG = (results: any, jobMetadata?: JobMetadata): string => {
  const measurements = results.measurements || {};
  const probabilities = results.probabilities || {};
  const shots = results.shots || jobMetadata?.shots || 0;
  const circuit = results.circuit || jobMetadata?.circuit || 'Unknown Circuit';
  const timestamp = jobMetadata?.created_at 
    ? new Date(jobMetadata.created_at).toLocaleString() 
    : new Date().toLocaleString();
  const backend = jobMetadata?.backend_type || 'simulator';

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
  const margin = { top: 120, right: 20, bottom: 40, left: 120 };

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
  <!-- Background -->
  <rect width="100%" height="100%" fill="#ffffff"/>
  
  <!-- Header -->
  <text x="${chartWidth / 2}" y="30" text-anchor="middle" font-size="24" font-weight="bold" fill="#1a1a1a">
    Quantum Circuit Results
  </text>
  
  <!-- Metadata -->
  <text x="${chartWidth / 2}" y="55" text-anchor="middle" font-size="14" fill="#666666">
    Circuit: ${escapeXml(circuit)} | Shots: ${shots} | Backend: ${escapeXml(backend)}
  </text>
  <text x="${chartWidth / 2}" y="75" text-anchor="middle" font-size="12" fill="#999999">
    ${escapeXml(timestamp)}
  </text>
  
  <!-- Definitions -->
  <defs>
    <linearGradient id="probGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#e0e7ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Divider -->
  <line x1="40" y1="90" x2="${chartWidth - 40}" y2="90" stroke="#e0e0e0" stroke-width="2"/>
  
  <!-- Chart Title -->
  <text x="${chartWidth / 2}" y="${margin.top - 10}" text-anchor="middle" font-size="16" font-weight="600" fill="#333333">
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
    <text x="-10" y="${y + barHeight / 2 + 5}" text-anchor="end" font-size="14" font-family="monospace" fill="#333333">
      |${d.state}⟩
    </text>
    
    <!-- Bar -->
    <rect x="0" y="${y}" width="${barWidth}" height="${barHeight}" fill="#8b5cf6" rx="4"/>
    
    <!-- Count label -->
    <text x="${barWidth + 10}" y="${y + barHeight / 2 + 5}" font-size="12" fill="#666666">
      ${d.count} (${percentage}%)
    </text>
      `;
    }).join('')}
    
    <!-- X-axis -->
    <line x1="0" y1="${chartHeight - 40}" x2="${barMaxWidth}" y2="${chartHeight - 40}" stroke="#999999" stroke-width="1"/>
    <text x="${barMaxWidth / 2}" y="${chartHeight - 15}" text-anchor="middle" font-size="12" fill="#666666">
      Measurement Counts
    </text>
  </g>
  
  <!-- Probability Distribution Section -->
  <g transform="translate(${margin.left}, ${margin.top + chartHeight + 40})">
    <text x="${barMaxWidth / 2}" y="-20" text-anchor="middle" font-size="16" font-weight="600" fill="#333333">
      Probability Distribution
    </text>
    
    <!-- Y-axis labels and bars -->
    ${chartData.map((d, i) => {
      const y = i * (barHeight + barSpacing);
      const barWidth = (d.probability / maxProbability) * barMaxWidth;
      const percentage = (d.probability * 100).toFixed(2);
      
      return `
    <!-- State label -->
    <text x="-10" y="${y + barHeight / 2 + 5}" text-anchor="end" font-size="14" font-family="monospace" fill="#333333">
      |${d.state}⟩
    </text>
    
    <!-- Bar with gradient -->
    <rect x="0" y="${y}" width="${barWidth}" height="${barHeight}" fill="url(#probGradient)" rx="4"/>
    
    <!-- Percentage label -->
    <text x="${barWidth + 10}" y="${y + barHeight / 2 + 5}" font-size="12" fill="#666666">
      ${percentage}%
    </text>
      `;
    }).join('')}
    
    <!-- X-axis -->
    <line x1="0" y1="${probabilityHeight - 40}" x2="${barMaxWidth}" y2="${probabilityHeight - 40}" stroke="#999999" stroke-width="1"/>
    <text x="${barMaxWidth / 2}" y="${probabilityHeight - 15}" text-anchor="middle" font-size="12" fill="#666666">
      Probability
    </text>
  </g>
  
  <!-- Table Section -->
  <g transform="translate(0, ${margin.top + chartHeight + probabilityHeight + 80})">
    <text x="${chartWidth / 2}" y="0" text-anchor="middle" font-size="16" font-weight="600" fill="#333333">
      Detailed Results
    </text>
    
    <!-- Table Header -->
    <rect x="80" y="20" width="${chartWidth - 160}" height="30" fill="#f5f5f5" rx="4"/>
    <text x="120" y="40" font-size="12" font-weight="600" fill="#333333">State</text>
    <text x="${chartWidth / 2}" y="40" text-anchor="middle" font-size="12" font-weight="600" fill="#333333">Count</text>
    <text x="${chartWidth - 120}" y="40" text-anchor="end" font-size="12" font-weight="600" fill="#333333">Probability</text>
    
    <!-- Table Rows -->
    ${chartData.map((d, i) => {
      const y = 55 + i * 30;
      const percentage = (d.probability * 100).toFixed(2);
      
      return `
    <rect x="80" y="${y}" width="${chartWidth - 160}" height="28" fill="${i % 2 === 0 ? '#fafafa' : '#ffffff'}" rx="2"/>
    <text x="120" y="${y + 18}" font-size="12" font-family="monospace" fill="#333333">|${d.state}⟩</text>
    <text x="${chartWidth / 2}" y="${y + 18}" text-anchor="middle" font-size="12" fill="#333333">${d.count}</text>
    <text x="${chartWidth - 120}" y="${y + 18}" text-anchor="end" font-size="12" fill="#666666">${percentage}%</text>
      `;
    }).join('')}
  </g>
  
  <!-- Raw Data Section -->
  <g transform="translate(0, ${margin.top + chartHeight + probabilityHeight + tableHeight + 100})">
    <text x="${chartWidth / 2}" y="0" text-anchor="middle" font-size="16" font-weight="600" fill="#333333">
      Raw Data (JSON)
    </text>
    
    <!-- Data background -->
    <rect x="40" y="15" width="${chartWidth - 80}" height="${rawDataHeight - 40}" fill="#f9f9f9" rx="4" stroke="#e0e0e0" stroke-width="1"/>
    
    <!-- JSON content -->
    ${rawDataLines.map((line, i) => {
      const y = 35 + i * 14;
      const escapedLine = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
      return `<text x="50" y="${y}" font-size="10" font-family="monospace" fill="#333333">${escapedLine}</text>`;
    }).join('\n    ')}
  </g>
  
  <!-- Footer -->
  <text x="${chartWidth / 2}" y="${totalHeight - 20}" text-anchor="middle" font-size="10" fill="#999999">
    Generated by Quantum Krump Platform
  </text>
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