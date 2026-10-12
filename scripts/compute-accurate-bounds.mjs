import fs from 'node:fs';

const regions = JSON.parse(fs.readFileSync('scripts/extracted-regions.json', 'utf-8'));
const dataset = JSON.parse(fs.readFileSync('shared/data/morocco-dataset.json', 'utf-8'));

function computePathBBox(d) {
  let curX = 0, curY = 0;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

  // Split into command chunks
  const commands = d.match(/[a-df-z][^a-df-z]*/gi) || [];

  for (const cmd of commands) {
    const type = cmd[0];
    const isRelative = type === type.toLowerCase();
    const isAbs = type === type.toUpperCase();
    const upper = type.toUpperCase();
    const nums = (cmd.slice(1).match(/-?[0-9]+(?:\.[0-9]+)?/g) || []).map(Number);

    if (upper === 'M' || upper === 'L' || upper === 'T') {
      for (let i = 0; i < nums.length; i += 2) {
        if (isRelative) {
          curX += nums[i];
          curY += nums[i + 1];
        } else {
          curX = nums[i];
          curY = nums[i + 1];
        }
        minX = Math.min(minX, curX);
        maxX = Math.max(maxX, curX);
        minY = Math.min(minY, curY);
        maxY = Math.max(maxY, curY);
      }
    } else if (upper === 'H') {
      for (const n of nums) {
        curX = isRelative ? curX + n : n;
        minX = Math.min(minX, curX);
        maxX = Math.max(maxX, curX);
      }
    } else if (upper === 'V') {
      for (const n of nums) {
        curY = isRelative ? curY + n : n;
        minY = Math.min(minY, curY);
        maxY = Math.max(maxY, curY);
      }
    } else if (upper === 'C') {
      for (let i = 0; i < nums.length; i += 6) {
        if (isRelative) {
          curX += nums[i + 4];
          curY += nums[i + 5];
        } else {
          curX = nums[i + 4];
          curY = nums[i + 5];
        }
        minX = Math.min(minX, curX);
        maxX = Math.max(maxX, curX);
        minY = Math.min(minY, curY);
        maxY = Math.max(maxY, curY);
      }
    } else if (upper === 'S' || upper === 'Q') {
      for (let i = 0; i < nums.length; i += 4) {
        if (isRelative) {
          curX += nums[i + 2];
          curY += nums[i + 3];
        } else {
          curX = nums[i + 2];
          curY = nums[i + 3];
        }
        minX = Math.min(minX, curX);
        maxX = Math.max(maxX, curX);
        minY = Math.min(minY, curY);
        maxY = Math.max(maxY, curY);
      }
    } else if (upper === 'A') {
      for (let i = 0; i < nums.length; i += 7) {
        if (isRelative) {
          curX += nums[i + 5];
          curY += nums[i + 6];
        } else {
          curX = nums[i + 5];
          curY = nums[i + 6];
        }
        minX = Math.min(minX, curX);
        maxX = Math.max(maxX, curX);
        minY = Math.min(minY, curY);
        maxY = Math.max(maxY, curY);
      }
    }
  }

  return {
    minX: Math.round(minX * 10) / 10,
    maxX: Math.round(maxX * 10) / 10,
    minY: Math.round(minY * 10) / 10,
    maxY: Math.round(maxY * 10) / 10,
    centerX: Math.round((minX + maxX) / 2),
    centerY: Math.round((minY + maxY) / 2)
  };
}

let totalMinX = Infinity, totalMaxX = -Infinity, totalMinY = Infinity, totalMaxY = -Infinity;

const results = regions.map(reg => {
  const bbox = computePathBBox(reg.d);
  totalMinX = Math.min(totalMinX, bbox.minX);
  totalMaxX = Math.max(totalMaxX, bbox.maxX);
  totalMinY = Math.min(totalMinY, bbox.minY);
  totalMaxY = Math.max(totalMaxY, bbox.maxY);

  const dbReg = dataset.regions.find(r => r.code === reg.code);

  return {
    code: reg.code,
    id: reg.id,
    nameEn: reg.nameEn,
    nameFr: dbReg ? dbReg.name.fr : reg.nameEn,
    nameAr: dbReg ? dbReg.name.ar : '',
    hcpCode: dbReg ? dbReg.hcp_code : '',
    color: reg.color,
    bbox,
    center: { x: bbox.centerX, y: bbox.centerY },
    path: reg.d
  };
});

console.log('Overall country Bounding Box:', {
  minX: totalMinX,
  maxX: totalMaxX,
  minY: totalMinY,
  maxY: totalMaxY,
  width: totalMaxX - totalMinX,
  height: totalMaxY - totalMinY
});

results.forEach(r => {
  console.log(`${r.code.padEnd(26)} center: (${r.center.x}, ${r.center.y})`);
});

fs.writeFileSync('scripts/accurate-regions.json', JSON.stringify(results, null, 2), 'utf-8');
