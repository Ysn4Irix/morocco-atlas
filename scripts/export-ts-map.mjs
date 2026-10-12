import fs from 'node:fs';

const regions = JSON.parse(fs.readFileSync('scripts/accurate-regions.json', 'utf-8'));

// Modern, sophisticated palette inspired by Moroccan landscapes (Atlantic ocean, cedar forests, terracotta, ochre, desert sands)
const palette = {
  'tanger-tetouan-al-hoceima': { color: '#047857', hover: '#10b981' }, // Deep Mediterranean Emerald
  'oriental':                  { color: '#0284c7', hover: '#38bdf8' }, // Atlas Azure
  'fes-meknes':                { color: '#2563eb', hover: '#60a5fa' }, // Imperial Cobalt
  'rabat-sale-kenitra':        { color: '#4f46e5', hover: '#818cf8' }, // Capital Indigo
  'casablanca-settat':          { color: '#7c3aed', hover: '#a78bfa' }, // Metropolitan Violet
  'beni-mellal-khenifra':      { color: '#9333ea', hover: '#c084fc' }, // Cedar Purple
  'marrakech-safi':            { color: '#be123c', hover: '#f43f5e' }, // Ochre Red
  'draa-tafilalet':            { color: '#c2410c', hover: '#fb923c' }, // Oasis Terracotta
  'souss-massa':               { color: '#b45309', hover: '#f59e0b' }, // Argan Amber
  'guelmim-oued-noun':         { color: '#0f766e', hover: '#2dd4bf' }, // Desert Gate Teal
  'laayoune-sakia-el-hamra':   { color: '#0369a1', hover: '#0ea5e9' }, // Atlantic Dune Ocean
  'dakhla-oued-ed-dahab':      { color: '#0284c7', hover: '#38bdf8' }  // Lagoon Blue
};

const mapContent = `export interface RegionMapPath {
  code: string;
  nameEn: string;
  nameFr: string;
  nameAr: string;
  hcpCode: string;
  color: string;
  hoverColor: string;
  center: { x: number; y: number };
  path: string;
}

export const MAP_VIEWBOX = "60 30 880 930";

export const MOROCCO_REGIONS_MAP: RegionMapPath[] = ${JSON.stringify(
  regions.map(r => ({
    code: r.code,
    nameEn: r.nameEn,
    nameFr: r.nameFr,
    nameAr: r.nameAr,
    hcpCode: r.hcpCode,
    color: palette[r.code]?.color || r.color,
    hoverColor: palette[r.code]?.hover || '#10b981',
    center: r.center,
    path: r.path
  })),
  null,
  2
)};
`;

fs.writeFileSync('shared/map/morocco-regions-map.ts', mapContent, 'utf-8');
fs.writeFileSync('web/src/data/morocco-regions-map.ts', mapContent, 'utf-8');
console.log('Successfully wrote real Morocco SVG map to shared and web!');
