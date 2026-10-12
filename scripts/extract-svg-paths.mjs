import fs from 'node:fs';

const svg = fs.readFileSync('scripts/morocco-simplemaps.svg', 'utf-8');

const idToCode = {
  MA01: 'tanger-tetouan-al-hoceima',
  MA02: 'oriental',
  MA03: 'fes-meknes',
  MA04: 'rabat-sale-kenitra',
  MA05: 'beni-mellal-khenifra',
  MA06: 'casablanca-settat',
  MA07: 'marrakech-safi',
  MA08: 'draa-tafilalet',
  MA09: 'souss-massa',
  MA10: 'guelmim-oued-noun',
  MA11: 'laayoune-sakia-el-hamra',
  MA12: 'dakhla-oued-ed-dahab'
};

// Colors palette matching Moroccan administrative style
const colors = {
  'tanger-tetouan-al-hoceima': '#0d9488', // Teal
  'oriental': '#0284c7', // Sky
  'fes-meknes': '#2563eb', // Blue
  'rabat-sale-kenitra': '#4f46e5', // Indigo
  'casablanca-settat': '#7c3aed', // Violet
  'beni-mellal-khenifra': '#9333ea', // Purple
  'marrakech-safi': '#e11d48', // Rose
  'draa-tafilalet': '#ea580c', // Orange
  'souss-massa': '#d97706', // Amber
  'guelmim-oued-noun': '#059669', // Emerald
  'laayoune-sakia-el-hamra': '#0891b2', // Cyan
  'dakhla-oued-ed-dahab': '#0284c7' // Light blue
};

const pathRegex = /<path\s+d="([^"]+)"[^>]*id="([^"]+)"[^>]*name="([^"]+)"[^>]*>/g;
let match;
const regions = [];

while ((match = pathRegex.exec(svg)) !== null) {
  const d = match[1];
  const id = match[2];
  const name = match[3];
  const code = idToCode[id];

  regions.push({
    id,
    code,
    nameEn: name,
    d,
    color: colors[code] || '#059669'
  });
}

console.log('Extracted', regions.length, 'regions');
regions.forEach(r => console.log(r.id, '->', r.code, `path len: ${r.d.length}`));

fs.writeFileSync('scripts/extracted-regions.json', JSON.stringify(regions, null, 2), 'utf-8');
