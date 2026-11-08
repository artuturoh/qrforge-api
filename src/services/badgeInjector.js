/**
 * Escapes XML/SVG special characters
 */
function escapeXml(unsafe = '') {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Injects a modern, centered rounded badge into an SVG QR code string.
 *
 * @param {string} svgString - Raw SVG string from qrcode library
 * @param {string} badgeText - Short text label (up to 6 chars)
 * @param {object} colors - { dark: '#0F172A', light: '#FFFFFF' }
 * @returns {string} SVG string with centered badge injected
 */
export function injectCenterBadge(svgString, badgeText, colors = {}) {
  if (!badgeText || typeof badgeText !== 'string' || !svgString) {
    return svgString;
  }

  const cleanText = badgeText.trim().slice(0, 6);
  if (!cleanText) return svgString;

  const darkColor = colors.dark || '#0F172A';
  const lightColor = colors.light || '#FFFFFF';

  // Extract viewBox or width/height
  const viewBoxMatch = svgString.match(/viewBox="([^"]+)"/i);
  let minX = 0;
  let minY = 0;
  let vbWidth = 33;
  let vbHeight = 33;

  if (viewBoxMatch && viewBoxMatch[1]) {
    const parts = viewBoxMatch[1].trim().split(/\s+/).map(Number);
    if (parts.length === 4 && !parts.some(isNaN)) {
      [minX, minY, vbWidth, vbHeight] = parts;
    }
  } else {
    const widthMatch = svgString.match(/width="(\d+)"/i);
    const heightMatch = svgString.match(/height="(\d+)"/i);
    if (widthMatch) vbWidth = Number(widthMatch[1]);
    if (heightMatch) vbHeight = Number(heightMatch[1]);
  }

  const cx = minX + vbWidth / 2;
  const cy = minY + vbHeight / 2;

  // Scale badge proportionally to viewBox dimensions and text length
  // Keeps QR code within 15-25% center occlusion for 100% scannability with Level H error correction
  const textLen = cleanText.length;
  const badgeW = Math.min(vbWidth * 0.34, Math.max(vbWidth * 0.20, vbWidth * (0.09 + textLen * 0.045)));
  const badgeH = vbHeight * 0.165;
  const badgeX = cx - badgeW / 2;
  const badgeY = cy - badgeH / 2;
  const rx = badgeH * 0.28;
  const strokeWidth = Math.max(0.3, vbWidth * 0.015);
  const fontSize = badgeH * 0.58;

  const escapedText = escapeXml(cleanText.toUpperCase());

  const badgeElement = `
  <g id="qrforge-center-badge">
    <!-- Outer contrasting shadow/glow border -->
    <rect x="${(badgeX - strokeWidth * 0.4).toFixed(3)}" y="${(badgeY - strokeWidth * 0.4).toFixed(3)}" width="${(badgeW + strokeWidth * 0.8).toFixed(3)}" height="${(badgeH + strokeWidth * 0.8).toFixed(3)}" rx="${(rx * 1.1).toFixed(3)}" ry="${(rx * 1.1).toFixed(3)}" fill="${lightColor}" opacity="0.95"/>
    <!-- Badge Background -->
    <rect x="${badgeX.toFixed(3)}" y="${badgeY.toFixed(3)}" width="${badgeW.toFixed(3)}" height="${badgeH.toFixed(3)}" rx="${rx.toFixed(3)}" ry="${rx.toFixed(3)}" fill="${lightColor}" stroke="${darkColor}" stroke-width="${strokeWidth.toFixed(3)}" shape-rendering="geometricPrecision"/>
    <!-- Bold Badge Label -->
    <text x="${cx.toFixed(3)}" y="${cy.toFixed(3)}" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="800" font-size="${fontSize.toFixed(3)}" letter-spacing="0.5" fill="${darkColor}" text-anchor="middle" dominant-baseline="central">${escapedText}</text>
  </g>
</svg>`;

  return svgString.replace(/<\/svg>\s*$/i, badgeElement);
}
