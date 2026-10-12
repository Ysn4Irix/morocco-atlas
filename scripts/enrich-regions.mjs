import fs from 'node:fs';

const regions = JSON.parse(fs.readFileSync('scripts/extracted-regions.json', 'utf-8'));
const dataset = JSON.parse(fs.readFileSync('shared/data/morocco-dataset.json', 'utf-8'));

// Region centroids by averaging points
const enrichedRegions = regions.map(reg => {
  const nums = reg.d.match(/-?[0-9]+(?:\.[0-9]+)?/g).map(Number);
  let sumX = 0, sumY = 0, count = 0;
  for (let i = 0; i < nums.length; i += 2) {
    sumX += nums[i];
    sumY += nums[i + 1];
    count++;
  }
  const center = {
    x: Math.round(sumX / count),
    y: Math.round(sumY / count)
  };

  const dbReg = dataset.regions.find(r => r.code === reg.code);

  return {
    code: reg.code,
    id: reg.id,
    nameEn: reg.nameEn,
    nameFr: dbReg ? dbReg.name.fr : reg.nameEn,
    nameAr: dbReg ? dbReg.name.ar : '',
    hcpCode: dbReg ? dbReg.hcp_code : '',
    color: reg.color,
    center,
    path: reg.d
  };
});

fs.writeFileSync('scripts/enriched-regions.json', JSON.stringify(enrichedRegions, null, 2), 'utf-8');
console.log('Enriched', enrichedRegions.length, 'regions');
