'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'fr' | 'en';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  dataSource: string;
  searchPlaceholder: string;
  regions: string;
  provinces: string;
  communes: string;
  arrondissements: string;
  hcpCode: string;
  administrativeType: string;
  region: string;
  province: string;
  commune: string;
  allRegions: string;
  selectRegion: string;
  selectProvince: string;
  selectCommune: string;
  interactiveMap: string;
  interactiveMapHint: string;
  searchResults: string;
  noResults: string;
  offlineReady: string;
  copyHcpCode: string;
  codeCopied: string;
  exploreByRegion: string;
  viewAllCommunes: string;
  details: string;
  apiReference: string;
  syncStatus: string;
  filterByRegion: string;
  clearFilter: string;
}

const translations: Record<Language, Translations> = {
  ar: {
    appTitle: 'دليل التقسيم الإداري للمملكة المغربية',
    appSubtitle: 'بيانات مفتوحة معتمدة مستخرجة من الإحصاء العام للسكان والسكنى (RGPH 2024)',
    dataSource: 'المصدر: المندوبية السامية للتخطيط (HCP)',
    searchPlaceholder: 'ابحث عن جهة، عمالة، إقليم، أو جماعة (مثلاً: مراكش، أكادير، 09.001)...',
    regions: 'الجهات',
    provinces: 'الأقاليم والعمالات',
    communes: 'الجماعات الترابية',
    arrondissements: 'المقاطعات',
    hcpCode: 'رمز HCP',
    administrativeType: 'الصفة الإدارية',
    region: 'الجهة',
    province: 'الإقليم / العمالة',
    commune: 'الجماعة',
    allRegions: 'جميع الجهات (12)',
    selectRegion: 'اختر الجهة أولاً',
    selectProvince: 'اختر الإقليم أو العمالة',
    selectCommune: 'اختر الجماعة',
    interactiveMap: 'الخريطة الإدارية التفاعلية',
    interactiveMapHint: 'انقر على أي جهة في الخريطة لتصفية أقاليمها وجماعاتها تلقائياً',
    searchResults: 'نتائج البحث',
    noResults: 'لا توجد نتائج مطابقة لبحثك',
    offlineReady: 'جاهز للاستخدام بدون اتصال',
    copyHcpCode: 'نسخ رمز HCP',
    codeCopied: 'تم النسخ!',
    exploreByRegion: 'استكشف حسب الجهة',
    viewAllCommunes: 'عرض الجماعات',
    details: 'تفاصيل التقسيم',
    apiReference: 'توثيق API',
    syncStatus: 'حالة البيانات: محدثة 2024',
    filterByRegion: 'تصفية حسب الجهة',
    clearFilter: 'إلغاء التصفية'
  },
  fr: {
    appTitle: 'Répertoire Administratif du Maroc',
    appSubtitle: 'Données ouvertes officielles basées sur le RGPH 2024 du Haut-Commissariat au Plan',
    dataSource: 'Source : Haut-Commissariat au Plan (HCP)',
    searchPlaceholder: 'Rechercher région, province, préfecture ou commune (ex: Marrakech, Agadir, 09.001)...',
    regions: 'Régions',
    provinces: 'Provinces et Préfectures',
    communes: 'Communes',
    arrondissements: 'Arrondissements',
    hcpCode: 'Code HCP',
    administrativeType: 'Type administratif',
    region: 'Région',
    province: 'Province / Préfecture',
    commune: 'Commune',
    allRegions: 'Toutes les régions (12)',
    selectRegion: 'Sélectionner une région',
    selectProvince: 'Sélectionner une province',
    selectCommune: 'Sélectionner une commune',
    interactiveMap: 'Carte Administrative Interactive',
    interactiveMapHint: 'Cliquez sur une région pour filtrer automatiquement ses subdivisions',
    searchResults: 'Résultats de recherche',
    noResults: 'Aucun résultat trouvé',
    offlineReady: 'Prêt hors-ligne',
    copyHcpCode: 'Copier code HCP',
    codeCopied: 'Copié !',
    exploreByRegion: 'Explorer par région',
    viewAllCommunes: 'Voir les communes',
    details: 'Détails administratifs',
    apiReference: 'Documentation API',
    syncStatus: 'État : Données RGPH 2024 à jour',
    filterByRegion: 'Filtrer par région',
    clearFilter: 'Réinitialiser le filtre'
  },
  en: {
    appTitle: 'Morocco Administrative Directory',
    appSubtitle: 'Official open data based on the HCP RGPH 2024 national census',
    dataSource: 'Source: Haut-Commissariat au Plan (HCP)',
    searchPlaceholder: 'Search region, province, prefecture or commune (e.g. Marrakech, Agadir, 09.001)...',
    regions: 'Regions',
    provinces: 'Provinces & Prefectures',
    communes: 'Communes',
    arrondissements: 'Arrondissements',
    hcpCode: 'HCP Code',
    administrativeType: 'Administrative Type',
    region: 'Region',
    province: 'Province / Prefecture',
    commune: 'Commune',
    allRegions: 'All Regions (12)',
    selectRegion: 'Select a region',
    selectProvince: 'Select a province',
    selectCommune: 'Select a commune',
    interactiveMap: 'Interactive Regional Map',
    interactiveMapHint: 'Click any region on the map to automatically filter subdivisions',
    searchResults: 'Search Results',
    noResults: 'No matches found',
    offlineReady: 'Offline Ready',
    copyHcpCode: 'Copy HCP Code',
    codeCopied: 'Copied!',
    exploreByRegion: 'Explore by Region',
    viewAllCommunes: 'View Communes',
    details: 'Administrative Details',
    apiReference: 'API Documentation',
    syncStatus: 'Status: RGPH 2024 Data Synchronized',
    filterByRegion: 'Filter by region',
    clearFilter: 'Clear filter'
  }
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: translations.fr,
  isRTL: false
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    const saved = localStorage.getItem('moroccodb_lang') as Language;
    if (saved && (saved === 'ar' || saved === 'fr' || saved === 'en')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('moroccodb_lang', lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
  }, [language]);

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        isRTL: language === 'ar'
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
