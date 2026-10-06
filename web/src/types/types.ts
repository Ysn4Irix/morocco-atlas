export interface LocalizedName {
  ar: string;
  fr: string;
  en: string | null;
}

export interface Region {
  code: string;
  hcp_code: string;
  type: 'region';
  name: LocalizedName;
}

export interface Province {
  code: string;
  hcp_code: string;
  type: 'province_or_prefecture';
  administrative_type: 'province' | 'prefecture';
  name: LocalizedName;
  region_code: string;
}

export interface Commune {
  code: string;
  hcp_code: string;
  type: 'commune';
  name: LocalizedName;
  cercle_hcp_code: string | null;
  province_code: string;
  region_code: string;
}

export interface Arrondissement {
  code: string;
  hcp_code: string;
  type: 'arrondissement';
  name: LocalizedName;
  commune_code: string;
  prefecture_of_arrondissements_code: string | null;
  province_code: string;
  region_code: string;
}

export interface PrefectureOfArrondissements {
  code: string;
  hcp_code: string;
  type: 'prefecture_of_arrondissements';
  name: LocalizedName;
  province_code: string;
  region_code: string;
}

export interface MoroccoDataset {
  metadata: {
    status: string;
    service: string;
    version: string;
    timestamp: string;
  };
  regions: Region[];
  provinces: Province[];
  communes: Commune[];
  arrondissements: Arrondissement[];
  prefecturesOfArrondissements: PrefectureOfArrondissements[];
  counts: {
    regions: number;
    provinces: number;
    communes: number;
    arrondissements: number;
    prefecturesOfArrondissements: number;
  };
}
