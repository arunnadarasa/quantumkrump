import ikfLogo from "@/assets/ikf-logo.png";
import iyqLogo from "@/assets/iyq-logo.png";

export interface CircuitPortraitMetadata {
  circuitName?: string;
  domain?: string;
  backend?: string;
  shots?: number;
  timestamp: string;
  prompt?: string;
  category?: string;
}

// Helper to escape XML special characters
const escapeXml = (text: string): string => {
  return text
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

// Syntax highlighting for Guppy code (safe version that won't break SVG)
function highlightGuppyCode(code: string, enableHighlight: boolean = true): { lineNumber: number; html: string }[] {
  const lines = code.split('\n');
  const keywords = ['@guppy', 'def', 'for', 'in', 'range', 'return', 'if', 'else', 'while'];
  
  return lines.map((line, index) => {
    // First, escape XML special characters
    let escaped = escapeXml(line);
    
    // If highlighting is disabled, return plain escaped text
    if (!enableHighlight) {
      return {
        lineNumber: index + 1,
        html: escaped
      };
    }
    
    // Split into code and comment parts at first '#'
    const hashIndex = escaped.indexOf('#');
    let codePart = hashIndex >= 0 ? escaped.substring(0, hashIndex) : escaped;
    let commentPart = hashIndex >= 0 ? escaped.substring(hashIndex) : '';
    
    // Only highlight keywords and functions in the code part (not in comments)
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
      codePart = codePart.replace(regex, '<tspan fill="#f472b6" font-weight="600">$1</tspan>');
    });
    
    // Highlight function names (word followed by parenthesis)
    codePart = codePart.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, '<tspan fill="#60a5fa">$1</tspan>(');
    
    // Wrap comment in italic tspan
    if (commentPart) {
      commentPart = '<tspan fill="#a78bfa" font-style="italic">' + commentPart + '</tspan>';
    }
    
    return {
      lineNumber: index + 1,
      html: codePart + commentPart
    };
  });
}

export async function generateCircuitPortraitSVG(
  guppyCode: string,
  metadata: CircuitPortraitMetadata,
  options?: { highlight?: boolean }
): Promise<string> {
  const ikfBase64 = await imageToBase64(ikfLogo);
  const iyqBase64 = await imageToBase64(iyqLogo);
  
  const enableHighlight = options?.highlight !== false;
  const highlightedLines = highlightGuppyCode(guppyCode, enableHighlight);
  const lineHeight = 20;
  const codeStartY = 240;
  const codeHeight = Math.max(highlightedLines.length * lineHeight + 60, 400);
  
  // Calculate additional space for prompt and category
  const promptHeight = metadata.prompt ? 80 : 0;
  const categoryHeight = metadata.category ? 40 : 0;
  const totalHeight = codeHeight + 380 + promptHeight + categoryHeight;
  
  // Generate code lines SVG
  const codeLinesSVG = highlightedLines.map((line, index) => {
    const y = codeStartY + index * lineHeight + 40;
    return `
      <text x="60" y="${y}" fill="#64748b" font-size="14" font-family="monospace">${line.lineNumber}</text>
      <text x="100" y="${y}" fill="#e2e8f0" font-size="14" font-family="monospace">${line.html}</text>
    `;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <!-- Gradient backgrounds -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e1b4b;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#312e81;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e3a8a;stop-opacity:1" />
    </linearGradient>
    
    <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:0.3" />
      <stop offset="50%" style="stop-color:#06b6d4;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0.3" />
    </linearGradient>
    
    <linearGradient id="codeBoxGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1e293b;stop-opacity:0.95" />
      <stop offset="100%" style="stop-color:#0f172a;stop-opacity:0.95" />
    </linearGradient>
    
    <!-- Glow filter -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- Quantum particle pattern -->
    <pattern id="quantumDots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="5" cy="5" r="1" fill="#8b5cf6" opacity="0.2"/>
      <circle cx="25" cy="15" r="1" fill="#06b6d4" opacity="0.2"/>
      <circle cx="15" cy="30" r="1" fill="#8b5cf6" opacity="0.2"/>
      <circle cx="35" cy="25" r="1" fill="#06b6d4" opacity="0.2"/>
    </pattern>
  </defs>
  
  <!-- Main background -->
  <rect width="1200" height="${totalHeight}" fill="url(#bgGradient)"/>
  <rect width="1200" height="${totalHeight}" fill="url(#quantumDots)"/>
  
  <!-- Decorative border -->
  <rect x="20" y="20" width="1160" height="${totalHeight - 40}" 
        fill="none" stroke="url(#headerGradient)" stroke-width="2" rx="20"/>
  
  <!-- Header section -->
  <rect x="40" y="40" width="1120" height="160" fill="url(#headerGradient)" rx="15"/>
  
  <!-- IKF Logo -->
  <image href="${ikfBase64}" x="60" y="55" width="120" height="120" preserveAspectRatio="xMidYMid meet"/>
  
  <!-- IYQ Logo -->
  <image href="${iyqBase64}" x="1020" y="55" width="120" height="120" preserveAspectRatio="xMidYMid meet"/>
  
  <!-- Main title -->
  <text x="600" y="100" text-anchor="middle" fill="#ffffff" font-size="42" font-weight="700" 
        font-family="Arial, sans-serif" filter="url(#glow)">
    KRUMP QUANTUM VIBE CODER
  </text>
  
  <!-- Subtitle -->
  <text x="600" y="140" text-anchor="middle" fill="#e0e7ff" font-size="18" font-weight="400" 
        font-family="Arial, sans-serif">
    International Year of Quantum Science and Technology 2025
  </text>
  
  <!-- Decorative line -->
  <line x1="200" y1="170" x2="1000" y2="170" stroke="#8b5cf6" stroke-width="1" opacity="0.5"/>
  
  <!-- Domain badge (if available) -->
  ${metadata.domain ? `
  <rect x="500" y="190" width="200" height="30" fill="#8b5cf6" rx="15" opacity="0.3"/>
  <text x="600" y="210" text-anchor="middle" fill="#e0e7ff" font-size="14" font-weight="600" 
        font-family="Arial, sans-serif">
    ${escapeXml(metadata.domain)}
  </text>
  ` : ''}
  
  <!-- Code container -->
  <rect x="40" y="${codeStartY - 20}" width="1120" height="${codeHeight}" 
        fill="url(#codeBoxGradient)" rx="15" 
        stroke="#8b5cf6" stroke-width="2" opacity="0.8"/>
  
  <!-- Glowing border effect -->
  <rect x="40" y="${codeStartY - 20}" width="1120" height="${codeHeight}" 
        fill="none" rx="15" 
        stroke="#06b6d4" stroke-width="1" opacity="0.3" filter="url(#glow)"/>
  
  <!-- Code title -->
  <text x="600" y="${codeStartY + 5}" text-anchor="middle" fill="#a78bfa" font-size="16" 
        font-weight="600" font-family="Arial, sans-serif">
    ${escapeXml(metadata.circuitName || 'Quantum Circuit')}
  </text>
  
  <!-- Code lines -->
  ${codeLinesSVG}
  
  ${metadata.prompt ? `
  <!-- Prompt section -->
  <text x="80" y="${codeStartY + codeHeight + 40}" fill="#a78bfa" font-size="14" 
        font-weight="600" font-family="Arial, sans-serif">
    ORIGINAL PROMPT:
  </text>
  <text x="80" y="${codeStartY + codeHeight + 65}" fill="#e0e7ff" font-size="13" 
        font-family="Arial, sans-serif">
    ${escapeXml(metadata.prompt.substring(0, 140))}${metadata.prompt.length > 140 ? '...' : ''}
  </text>
  ` : ''}
  
  ${metadata.category ? `
  <!-- Category section -->
  <rect x="80" y="${codeStartY + codeHeight + (metadata.prompt ? 85 : 40)}" width="${Math.max(150, metadata.category.length * 8 + 40)}" height="28" 
        fill="#8b5cf6" rx="14" opacity="0.4"/>
  <text x="${90 + Math.max(150, metadata.category.length * 8 + 40) / 2}" y="${codeStartY + codeHeight + (metadata.prompt ? 104 : 59)}" 
        text-anchor="middle" fill="#e0e7ff" font-size="12" font-weight="600" 
        font-family="Arial, sans-serif">
    ${escapeXml(metadata.category)}
  </text>
  ` : ''}
  
  <!-- Footer section -->
  <rect x="40" y="${totalHeight - 120}" width="1120" height="80" fill="#0f172a" rx="15" opacity="0.8"/>
  
  <!-- Decorative footer line -->
  <line x1="80" y1="${totalHeight - 110}" x2="1120" y2="${totalHeight - 110}" 
        stroke="#8b5cf6" stroke-width="1" opacity="0.5"/>
  
  <!-- Timestamp -->
  <text x="80" y="${totalHeight - 80}" fill="#e0e7ff" font-size="16" font-weight="500" 
        font-family="Arial, sans-serif">
    Generated: ${escapeXml(metadata.timestamp)}
  </text>
  
  <!-- Circuit metadata -->
  ${metadata.backend || metadata.shots ? `
  <text x="80" y="${totalHeight - 55}" fill="#94a3b8" font-size="14" font-family="Arial, sans-serif">
    ${metadata.backend ? `Backend: ${escapeXml(metadata.backend)}` : ''} ${metadata.backend && metadata.shots ? '|' : ''} ${metadata.shots ? `Shots: ${escapeXml(String(metadata.shots))}` : ''}
  </text>
  ` : ''}
  
  <!-- Quantum decorative elements -->
  <circle cx="1100" cy="${totalHeight - 70}" r="25" fill="none" stroke="#8b5cf6" stroke-width="1" opacity="0.3"/>
  <circle cx="1100" cy="${totalHeight - 70}" r="15" fill="none" stroke="#06b6d4" stroke-width="1" opacity="0.5"/>
  <circle cx="1100" cy="${totalHeight - 70}" r="3" fill="#8b5cf6" opacity="0.8" filter="url(#glow)"/>
</svg>`;
}

export function downloadCircuitPortrait(svgContent: string, filename: string) {
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
