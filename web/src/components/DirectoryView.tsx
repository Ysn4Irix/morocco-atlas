'use client';

import React, { useState, useMemo } from 'react';
import {
  getAllRegions,
  getProvincesByRegion,
  getCommunesByProvince,
  searchEntities,
  getDatasetStats
} from '@/lib/morocco-data';
import { useI18n } from '@/lib/i18n';
import { Search, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface DirectoryViewProps {
  selectedRegionCode: string | null;
  onSelectRegion: (code: string | null) => void;
}

export function DirectoryView({ selectedRegionCode, onSelectRegion }: DirectoryViewProps) {
  const { language, t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProvince, setExpandedProvince] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const stats = useMemo(() => getDatasetStats(), []);
  const allRegions = useMemo(() => getAllRegions(), []);

  const searchResults = useMemo(() => {
    return searchEntities(searchQuery, 24);
  }, [searchQuery]);

  const activeRegions = useMemo(() => {
    if (selectedRegionCode) {
      return allRegions.filter(r => r.code === selectedRegionCode);
    }
    return allRegions;
  }, [allRegions, selectedRegionCode]);

  const getName = (itemOrName?: { name: { ar: string; fr: string; en: string | null } } | { ar: string; fr: string; en: string | null }) => {
    if (!itemOrName) return '';
    const nameObj = 'name' in itemOrName ? itemOrName.name : itemOrName;
    if (language === 'ar') return nameObj.ar;
    if (language === 'en') return nameObj.en || nameObj.fr;
    return nameObj.fr;
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleProvince = (code: string) => {
    setExpandedProvince(prev => (prev === code ? null : code));
  };

  return (
    <div className="space-y-6">
      {/* Search Input Bar */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 text-stone-400">
          <Search className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-4 ps-12 pe-4 text-sm text-stone-900 dark:text-stone-100 shadow-sm transition-all focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 end-0 flex items-center pe-4 text-xs font-semibold text-stone-400 hover:text-stone-700"
          >
            Clear
          </button>
        )}
      </div>

      {/* Live Search Results View */}
      {searchQuery.trim().length > 0 ? (
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              {t.searchResults} ({searchResults.length})
            </h3>
            <span className="text-xs text-stone-500">
              {stats.communes} communes cataloged
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div className="py-12 text-center text-sm text-stone-500">
              {t.noResults}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-stone-100 dark:border-stone-800/80 bg-stone-50 dark:bg-stone-800/40 p-3.5 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="inline-flex items-center rounded-md bg-emerald-100/80 dark:bg-emerald-950/80 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase">
                        {item.type}
                      </span>
                      <button
                        onClick={() => copyCode(item.hcp_code)}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-stone-500 hover:text-emerald-600 transition-colors"
                        title={t.copyHcpCode}
                      >
                        <span>{item.hcp_code}</span>
                        {copiedCode === item.hcp_code ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      {getName(item)}
                    </h4>
                    {item.name.ar && language !== 'ar' && (
                      <p className="text-xs text-stone-500 mt-0.5 font-arabic">
                        {item.name.ar}
                      </p>
                    )}
                  </div>
                  {item.parentName && (
                    <div className="mt-2 text-[11px] text-stone-500 pt-2 border-t border-stone-200/50 dark:border-stone-800">
                      Parent: {item.parentName}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Hierarchical Explorer by Region */
        <div className="space-y-6">
          {activeRegions.map((region) => {
            const provinces = getProvincesByRegion(region.code);
            return (
              <div
                key={region.code}
                className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-sm transition-all"
              >
                {/* Region Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-sm">
                      {region.hcp_code}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                        {getName(region)}
                        {language !== 'ar' && (
                          <span className="text-xs font-normal text-stone-400">
                            ({region.name.ar})
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-stone-500">
                        {provinces.length} {t.provinces}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectRegion(selectedRegionCode === region.code ? null : region.code)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                        selectedRegionCode === region.code
                          ? 'bg-emerald-700 text-white shadow-sm'
                          : 'border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {selectedRegionCode === region.code ? t.clearFilter : t.filterByRegion}
                    </button>
                  </div>
                </div>

                {/* Provinces Grid */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {provinces.map((prov) => {
                    const isExpanded = expandedProvince === prov.code;
                    const communes = isExpanded ? getCommunesByProvince(prov.code) : [];

                    return (
                      <div
                        key={prov.code}
                        className={`rounded-xl border transition-all ${
                          isExpanded
                            ? 'col-span-full border-emerald-600/40 bg-emerald-950/5 dark:bg-emerald-950/20 p-4'
                            : 'border-stone-100 dark:border-stone-800/80 bg-stone-50/60 dark:bg-stone-800/40 p-3.5 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span
                                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                                  prov.administrative_type === 'prefecture'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300'
                                }`}
                              >
                                {prov.administrative_type}
                              </span>
                              <span className="font-mono text-[11px] text-stone-400">
                                {prov.hcp_code}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                              {getName(prov)}
                            </h4>
                            {language !== 'ar' && (
                              <p className="text-xs text-stone-500 font-arabic">
                                {prov.name.ar}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => toggleProvince(prov.code)}
                            className="inline-flex items-center gap-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 px-2.5 py-1 text-xs font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-100 transition-colors"
                          >
                            <span>{t.communes}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {/* Communes accordion list */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-emerald-900/10 dark:border-emerald-800/20">
                            <div className="mb-3 flex items-center justify-between">
                              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                                {communes.length} {t.communes} in {getName(prov)}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                              {communes.map((comm) => (
                                <div
                                  key={comm.code}
                                  className="rounded-lg border border-stone-200/70 dark:border-stone-800 bg-white dark:bg-stone-900 p-2.5 shadow-xs"
                                >
                                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono mb-1">
                                    <span>{comm.hcp_code}</span>
                                    <button
                                      onClick={() => copyCode(comm.hcp_code)}
                                      className="hover:text-emerald-600"
                                      title={t.copyHcpCode}
                                    >
                                      {copiedCode === comm.hcp_code ? (
                                        <Check className="w-3 h-3 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                  <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                                    {getName(comm)}
                                  </div>
                                  {language !== 'ar' && (
                                    <div className="text-[11px] text-stone-500 font-arabic mt-0.5">
                                      {comm.name.ar}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
