import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'https://moroccodb.ysnirix.xyz/api/v1';

async function fetchEndpoint(endpoint) {
  const url = `${BASE_URL}${endpoint}`;
  console.log(`Fetching ${url}...`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function main() {
  const outputDir = path.resolve('shared', 'data');
  fs.mkdirSync(outputDir, { recursive: true });

  const [status, regions, provinces, communes, arrondissements, prefecturesOfArrondissements] = await Promise.all([
    fetchEndpoint('/status'),
    fetchEndpoint('/regions'),
    fetchEndpoint('/provinces'),
    fetchEndpoint('/communes'),
    fetchEndpoint('/arrondissements'),
    fetchEndpoint('/prefectures-of-arrondissements')
  ]);

  const dataset = {
    metadata: status.data,
    regions: regions.data,
    provinces: provinces.data,
    communes: communes.data,
    arrondissements: arrondissements.data,
    prefecturesOfArrondissements: prefecturesOfArrondissements.data,
    counts: {
      regions: regions.data.length,
      provinces: provinces.data.length,
      communes: communes.data.length,
      arrondissements: arrondissements.data.length,
      prefecturesOfArrondissements: prefecturesOfArrondissements.data.length
    }
  };

  const outputPath = path.join(outputDir, 'morocco-dataset.json');
  fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2), 'utf-8');
  console.log(`Saved dataset to ${outputPath}`);
  console.log(`Summary: ${JSON.stringify(dataset.counts, null, 2)}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
