'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import {
  getAllRegions,
  getRegionByCode,
  getProvincesByRegion,
  getCommunesByProvince,
  getDatasetStats
} from '@/lib/morocco-data';
import { MapPin, Check, Copy, ArrowDownRight, ChevronDown, ChevronUp } from 'lucide-react';

interface RegionInspectorProps {
  selectedRegionCode: string | null;
  hoveredRegionCode: string | null;
  onSelectRegion: (regionCode: string | null) => void;
  activeProvinceCode?: string | null;
  onSelectProvince?: (provinceCode: string | null) => void;
  highlightedCommuneCode?: string | null;
}

export function RegionInspector({
  selectedRegionCode,
  hoveredRegionCode,
  onSelectRegion,
  activeProvinceCode,
  onSelectProvince,
  highlightedCommuneCode
}: RegionInspectorProps) {
  const { language, t } = useI18n();
  const [expandedProvince, setExpandedProvince] = useState<string | null>(activeProvinceCode || null);
  const [communeSearch, setCommuneSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Sync expanded province if external activeProvinceCode changes
  React.useEffect(() => {
    if (activeProvinceCode) {
      setExpandedProvince(activeProvinceCode);
    }
  }, [activeProvinceCode]);

  const stats = getDatasetStats();
  const allRegions = getAllRegions();

  // Active inspected region: selected wins over hover
  const displayCode = selectedRegionCode || hoveredRegionCode;
  const activeRegion = displayCode ? getRegionByCode(displayCode) : null;
  const activeProvinces = activeRegion ? getProvincesByRegion(activeRegion.code) : [];

  const getName = (nameObj?: { ar: string; fr: string; en: string | null }) => {
    if (!nameObj) return '';
    if (language === 'ar') return nameObj.ar;
    if (language === 'en') return nameObj.en || nameObj.fr;
    return nameObj.fr;
  };

  const copyCode = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleProvince = (provCode: string) => {
    const next = expandedProvince === provCode ? null : provCode;
    setExpandedProvince(next);
    onSelectProvince?.(next);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
            <MapPin className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            {t.details}
          </h3>
        </div>
      </div>

      {/* Region Inspector with Provinces & Communes */}
      <div className="flex-1 flex flex-col min-h-0 space-y-3">
          {activeRegion ? (
            <div className="space-y-3 flex-1 flex flex-col min-h-0">
              {/* Region Banner */}
              <div className="rounded-xl border border-emerald-900/10 dark:border-emerald-800/30 bg-emerald-50/60 dark:bg-emerald-950/20 p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white font-mono font-bold text-xs shadow-xs">
                      {activeRegion.hcp_code}
                    </span>
                    <div>
                      <h3 className="text-lg font-extrabold text-stone-900 dark:text-stone-100">
                        {getName(activeRegion.name)}
                      </h3>
                      {language !== 'ar' && (
                        <p className="text-xs text-stone-500 font-arabic">
                          {activeRegion.name.ar}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="rounded-lg bg-emerald-100 dark:bg-emerald-900/40 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    {activeProvinces.length} {t.provinces}
                  </span>
                </div>
              </div>

              {/* Subdivisions & Communes Section */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    {t.provinces} & {t.communes}
                  </h4>
                  <span className="text-[11px] text-stone-400">
                    Click any province to view communes
                  </span>
                </div>

                {/* Scrollable Provinces & Integrated Communes List */}
                <div className="flex-1 overflow-y-auto space-y-2 pe-1 max-h-[380px]">
                  {activeProvinces.map((prov) => {
                    const isExpanded = expandedProvince === prov.code;
                    const communes = isExpanded ? getCommunesByProvince(prov.code) : [];
                    const filteredCommunes = communes.filter((c) => {
                      if (!communeSearch) return true;
                      const q = communeSearch.toLowerCase();
                      return (
                        c.code.toLowerCase().includes(q) ||
                        c.hcp_code.includes(q) ||
                        c.name.ar.toLowerCase().includes(q) ||
                        c.name.fr.toLowerCase().includes(q) ||
                        (c.name.en && c.name.en.toLowerCase().includes(q))
                      );
                    });

                    return (
                      <div
                        key={prov.code}
                        className={`rounded-xl border transition-all ${
                          isExpanded
                            ? 'border-emerald-600/40 bg-emerald-50/20 dark:bg-emerald-950/20 p-3'
                            : 'border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 p-2.5 hover:border-stone-300'
                        }`}
                      >
                        {/* Province Bar Header */}
                        <div
                          onClick={() => toggleProvince(prov.code)}
                          className="flex items-center justify-between cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                                prov.administrative_type === 'prefecture'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300'
                              }`}
                            >
                              {prov.administrative_type}
                            </span>
                            <div>
                              <div className="font-bold text-xs text-stone-900 dark:text-stone-100">
                                {getName(prov.name)}
                              </div>
                              {language !== 'ar' && (
                                <div className="text-[10px] text-stone-400 font-arabic">
                                  {prov.name.ar}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => copyCode(e, prov.hcp_code)}
                              className="font-mono text-[10px] text-stone-400 hover:text-emerald-600 transition-colors px-1"
                              title={t.copyHcpCode}
                            >
                              {prov.hcp_code}
                            </button>
                            <span className="p-1 rounded-md text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-700/50">
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Integrated Communes List inside Province */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-emerald-900/10 dark:border-emerald-800/20 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                                {communes.length} {t.communes}
                              </span>
                              {communes.length > 8 && (
                                <input
                                  type="text"
                                  value={communeSearch}
                                  onChange={(e) => setCommuneSearch(e.target.value)}
                                  placeholder="Filter..."
                                  className="rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-2 py-0.5 text-[10px] w-28 focus:outline-none focus:border-emerald-600"
                                />
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto pe-1">
                              {filteredCommunes.map((comm) => {
                                const isHighlighted = highlightedCommuneCode === comm.code;
                                return (
                                  <div
                                    key={comm.code}
                                    className={`rounded-lg border p-2 flex items-center justify-between text-xs transition-colors ${
                                      isHighlighted
                                        ? 'border-emerald-600 bg-emerald-100/60 dark:bg-emerald-900/60'
                                        : 'border-stone-200/60 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-emerald-500/40'
                                    }`}
                                  >
                                    <div className="min-w-0 flex-1 me-1">
                                      <div className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                                        {getName(comm.name)}
                                      </div>
                                      {language !== 'ar' && (
                                        <div className="text-[10px] text-stone-400 font-arabic truncate">
                                          {comm.name.ar}
                                        </div>
                                      )}
                                    </div>

                                    <button
                                      onClick={(e) => copyCode(e, comm.hcp_code)}
                                      className="inline-flex items-center gap-0.5 font-mono text-[10px] text-stone-400 hover:text-emerald-600 shrink-0"
                                      title={t.copyHcpCode}
                                    >
                                      <span>{comm.hcp_code}</span>
                                      {copiedCode === comm.hcp_code ? (
                                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-2.5 h-2.5" />
                                      )}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Default State when no region is selected */
            <div className="flex-1 flex flex-col min-h-0 space-y-3">
              <div className="rounded-xl border border-emerald-900/10 dark:border-emerald-800/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-3.5">
                <h3 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-200 mb-1">
                  {t.appTitle}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {t.interactiveMapHint}
                </p>
              </div>

              {/* 12 Regions Grid */}
              <div className="flex-1 min-h-0 overflow-y-auto pe-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  {t.allRegions}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {allRegions.map((reg) => (
                    <button
                      key={reg.code}
                      onClick={() => onSelectRegion(reg.code)}
                      className="rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 p-2.5 text-start hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/30 transition-all flex items-center justify-between group"
                    >
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                          {reg.hcp_code}
                        </div>
                        <div className="font-bold text-xs text-stone-800 dark:text-stone-200 truncate">
                          {getName(reg.name)}
                        </div>
                      </div>
                      <ArrowDownRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-emerald-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Statistics Bar */}
          <div className="mt-auto pt-3 border-t border-stone-100 dark:border-stone-800 grid grid-cols-4 gap-2 text-center text-xs">
            <div className="rounded-lg bg-stone-50 dark:bg-stone-800 p-2">
              <div className="font-black text-emerald-700 dark:text-emerald-400 text-sm">{stats.regions}</div>
              <div className="text-[10px] text-stone-500">{t.regions}</div>
            </div>
            <div className="rounded-lg bg-stone-50 dark:bg-stone-800 p-2">
              <div className="font-black text-emerald-700 dark:text-emerald-400 text-sm">{stats.provinces}</div>
              <div className="text-[10px] text-stone-500">{t.provinces}</div>
            </div>
            <div className="rounded-lg bg-stone-50 dark:bg-stone-800 p-2">
              <div className="font-black text-emerald-700 dark:text-emerald-400 text-sm">{stats.communes}</div>
              <div className="text-[10px] text-stone-500">{t.communes}</div>
            </div>
            <div className="rounded-lg bg-stone-50 dark:bg-stone-800 p-2">
              <div className="font-black text-emerald-700 dark:text-emerald-400 text-sm">{stats.arrondissements}</div>
              <div className="text-[10px] text-stone-500">{t.arrondissements}</div>
            </div>
          </div>
        </div>
    </div>
  );
}
