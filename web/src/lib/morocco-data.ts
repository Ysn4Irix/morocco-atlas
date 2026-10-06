import dataset from '@/data/morocco-dataset.json';
import { Region, Province, Commune, Arrondissement, LocalizedName, MoroccoDataset } from '@/types/types';

const data = dataset as unknown as MoroccoDataset;

export function getDatasetMetadata() {
  return data.metadata;
}

export function getDatasetStats() {
  return data.counts;
}

export function getAllRegions(): Region[] {
  return data.regions;
}

export function getRegionByCode(code: string): Region | undefined {
  return data.regions.find(r => r.code === code);
}

export function getAllProvinces(): Province[] {
  return data.provinces;
}

export function getProvincesByRegion(regionCode: string): Province[] {
  return data.provinces.filter(p => p.region_code === regionCode);
}

export function getProvinceByCode(code: string): Province | undefined {
  return data.provinces.find(p => p.code === code);
}

export function getAllCommunes(): Commune[] {
  return data.communes;
}

export function getCommunesByProvince(provinceCode: string): Commune[] {
  return data.communes.filter(c => c.province_code === provinceCode);
}

export function getCommuneByCode(code: string): Commune | undefined {
  return data.communes.find(c => c.code === code);
}

export function getAllArrondissements(): Arrondissement[] {
  return data.arrondissements;
}

export function getArrondissementsByCommune(communeCode: string): Arrondissement[] {
  return data.arrondissements.filter(a => a.commune_code === communeCode);
}

export interface SearchResultItem {
  id: string;
  code: string;
  type: 'region' | 'province' | 'commune' | 'arrondissement';
  hcp_code: string;
  name: LocalizedName;
  parentName?: string;
  region_code: string;
}

export function searchEntities(query: string, limit = 20): SearchResultItem[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toLowerCase();

  const results: SearchResultItem[] = [];

  // Match regions
  for (const r of data.regions) {
    if (
      r.code.toLowerCase().includes(q) ||
      r.hcp_code.includes(q) ||
      r.name.ar.toLowerCase().includes(q) ||
      r.name.fr.toLowerCase().includes(q) ||
      (r.name.en && r.name.en.toLowerCase().includes(q))
    ) {
      results.push({
        id: `reg-${r.code}`,
        code: r.code,
        type: 'region',
        hcp_code: r.hcp_code,
        name: r.name,
        region_code: r.code
      });
    }
  }

  // Match provinces
  for (const p of data.provinces) {
    if (
      p.code.toLowerCase().includes(q) ||
      p.hcp_code.includes(q) ||
      p.name.ar.toLowerCase().includes(q) ||
      p.name.fr.toLowerCase().includes(q) ||
      (p.name.en && p.name.en.toLowerCase().includes(q))
    ) {
      const parentReg = data.regions.find(r => r.code === p.region_code);
      results.push({
        id: `prov-${p.code}`,
        code: p.code,
        type: 'province',
        hcp_code: p.hcp_code,
        name: p.name,
        parentName: parentReg?.name.fr,
        region_code: p.region_code
      });
    }
  }

  // Match communes
  for (const c of data.communes) {
    if (
      c.code.toLowerCase().includes(q) ||
      c.hcp_code.includes(q) ||
      c.name.ar.toLowerCase().includes(q) ||
      c.name.fr.toLowerCase().includes(q) ||
      (c.name.en && c.name.en.toLowerCase().includes(q))
    ) {
      const parentProv = data.provinces.find(p => p.code === c.province_code);
      results.push({
        id: `comm-${c.code}`,
        code: c.code,
        type: 'commune',
        hcp_code: c.hcp_code,
        name: c.name,
        parentName: parentProv?.name.fr,
        region_code: c.region_code
      });
      if (results.length >= limit) break;
    }
  }

  return results.slice(0, limit);
}
