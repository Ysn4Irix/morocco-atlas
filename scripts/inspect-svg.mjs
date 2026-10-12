import fs from 'node:fs';

const svg = fs.readFileSync('scripts/morocco-simplemaps.svg', 'utf-8');
console.log('SVG Length:', svg.length);

// Extract viewBox
const vbMatch = svg.match(/viewBox="([^"]+)"/);
console.log('viewBox:', vbMatch ? vbMatch[1] : 'none');

// Extract paths with id and name
const pathRegex = /<path[^>]+id="([^"]+)"[^>]+name="([^"]+)"[^>]*>/g;
let match;
while ((match = pathRegex.exec(svg)) !== null) {
  console.log(`id: ${match[1]}, name: ${match[2]}`);
}
