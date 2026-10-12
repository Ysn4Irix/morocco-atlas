'use client';

import React, { useState, useMemo } from 'react';
import { getAllRegions, getProvincesByRegion, getCommunesByProvince } from '@/lib/morocco-data';
import { useI18n } from '@/lib/i18n';
import { Check, Copy, Layers, Code } from 'lucide-react';

export function AddressCascade({ initialRegionCode = '' }: { initialRegionCode?: string }) {
  const { language, t } = useI18n();
  const regions = useMemo(() => getAllRegions(), []);

  const [selectedRegionCode, setSelectedRegionCode] = useState<string>(initialRegionCode);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>('');
  const [selectedCommuneCode, setSelectedCommuneCode] = useState<string>('');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialRegionCode) {
      setSelectedRegionCode(initialRegionCode);
      setSelectedProvinceCode('');
      setSelectedCommuneCode('');
    }
  }, [initialRegionCode]);

  const provinces = useMemo(() => {
    return selectedRegionCode ? getProvincesByRegion(selectedRegionCode) : [];
  }, [selectedRegionCode]);

  const communes = useMemo(() => {
    return selectedProvinceCode ? getCommunesByProvince(selectedProvinceCode) : [];
  }, [selectedProvinceCode]);

  const selectedRegion = useMemo(() => {
    return regions.find(r => r.code === selectedRegionCode);
  }, [regions, selectedRegionCode]);

  const selectedProvince = useMemo(() => {
    return provinces.find(p => p.code === selectedProvinceCode);
  }, [provinces, selectedProvinceCode]);

  const selectedCommune = useMemo(() => {
    return communes.find(c => c.code === selectedCommuneCode);
  }, [communes, selectedCommuneCode]);

  const getName = (item?: { name: { ar: string; fr: string; en: string | null } }) => {
    if (!item) return '';
    if (language === 'ar') return item.name.ar;
    if (language === 'en') return item.name.en || item.name.fr;
    return item.name.fr;
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegionCode(e.target.value);
    setSelectedProvinceCode('');
    setSelectedCommuneCode('');
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvinceCode(e.target.value);
    setSelectedCommuneCode('');
  };

  const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCommuneCode(e.target.value);
  };

  const generatedPayload = useMemo(() => {
    if (!selectedRegion && !selectedProvince && !selectedCommune) return null;
    return {
      region: selectedRegion ? {
        code: selectedRegion.code,
        hcp_code: selectedRegion.hcp_code,
        name: selectedRegion.name
      } : null,
      province: selectedProvince ? {
        code: selectedProvince.code,
        hcp_code: selectedProvince.hcp_code,
        administrative_type: selectedProvince.administrative_type,
        name: selectedProvince.name
      } : null,
      commune: selectedCommune ? {
        code: selectedCommune.code,
        hcp_code: selectedCommune.hcp_code,
        name: selectedCommune.name
      } : null
    };
  }, [selectedRegion, selectedProvince, selectedCommune]);

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  return (
    <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <Layers className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {t.addressCascadeTitle}
            </h3>
          </div>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            {t.addressCascadeDesc}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Step 1: Region */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
            1. {t.region}
          </label>
          <select
            value={selectedRegionCode}
            onChange={handleRegionChange}
            className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 px-3.5 py-2.5 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-all"
          >
            <option value="">{t.selectRegion}</option>
            {regions.map((reg) => (
              <option key={reg.code} value={reg.code}>
                {getName(reg)} ({reg.hcp_code})
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: Province */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
            2. {t.province}
          </label>
          <select
            value={selectedProvinceCode}
            onChange={handleProvinceChange}
            disabled={!selectedRegionCode}
            className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 px-3.5 py-2.5 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <option value="">{t.selectProvince}</option>
            {provinces.map((prov) => (
              <option key={prov.code} value={prov.code}>
                {getName(prov)} [{prov.administrative_type}]
              </option>
            ))}
          </select>
        </div>

        {/* Step 3: Commune */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
            3. {t.commune}
          </label>
          <select
            value={selectedCommuneCode}
            onChange={handleCommuneChange}
            disabled={!selectedProvinceCode}
            className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 px-3.5 py-2.5 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <option value="">{t.selectCommune}</option>
            {communes.map((comm) => (
              <option key={comm.code} value={comm.code}>
                {getName(comm)} ({comm.hcp_code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Output preview */}
      {generatedPayload && (
        <div className="mt-6 rounded-xl border border-emerald-900/20 bg-emerald-950/5 dark:bg-emerald-950/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Code className="w-4 h-4" />
              Standardized Address Output
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(JSON.stringify(generatedPayload, null, 2), 'json')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-white dark:bg-stone-800 px-3 py-1.5 text-xs font-medium text-emerald-900 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
              >
                {copiedFormat === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedFormat === 'json' ? t.codeCopied : 'Copy JSON'}
              </button>
            </div>
          </div>

          <pre className="p-3 rounded-lg bg-stone-900 text-emerald-400 text-xs font-mono overflow-x-auto">
            {JSON.stringify(generatedPayload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
