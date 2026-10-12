'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import {
  getAllRegions,
  getRegionByCode,
  getProvincesByRegion,
  getDatasetStats
} from '@/lib/morocco-data';
import { AddressCascade } from './AddressCascade';
import { MapPin, Layers, Check, Copy, ArrowDownRight } from 'lucide-react';

interface RegionInspectorProps {
  selectedRegionCode: string | null;
  hoveredRegionCode: string | null;
  onSelectRegion: (regionCode: string | null) => void;
}

export function RegionInspector({
  selectedRegionCode,
  hoveredRegionCode,
  onSelectRegion
}: RegionInspectorProps) {
  const { language, t } = useI18n();
  const [activeTab, setActiveTab] = useState<'inspector' | 'cascade'>('inspector');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const stats = getDatasetStats();
  const allRegions = getAllRegions();

  // The active inspected region is the selected one, or falls back to hovered
  const displayCode = selectedRegionCode || hoveredRegionCode;
  const activeRegion = displayCode ? getRegionByCode(displayCode) : null;
  const activeProvinces = activeRegion ? getProvincesByRegion(activeRegion.code) : [];

  const getName = (nameObj?: { ar: string; fr: string; en: string | null }) => {
    if (!nameObj) return '';
    if (language === 'ar') return nameObj.ar;
    if (language === 'en') return nameObj.en || nameObj.fr;
    return nameObj.fr;
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-sm">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3 mb-4">
        <div className="flex items-center gap-1 rounded-xl bg-stone-100 dark:bg-stone-800 p-1">
          <button
            onClick={() => setActiveTab('inspector')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'inspector'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.details}</span>
          </button>
          <button
            onClick={() => setActiveTab('cascade')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'cascade'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.addressCascadeTitle}</span>
          </button>
        </div>

        {selectedRegionCode && (
          <button
            onClick={() => onSelectRegion(null)}
            className="text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
          >
            {t.clearFilter}
          </button>
        )}
      </div>

      {/* Tab 1: Region Inspector Details */}
      {activeTab === 'inspector' && (
        <div className="flex-1 flex flex-col justify-between space-y-4">
          {activeRegion ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Region Hero Header */}
              <div className="rounded-xl border border-emerald-900/10 dark:border-emerald-800/30 bg-emerald-50/60 dark:bg-emerald-950/20 p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
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
                  <button
                    onClick={() => onSelectRegion(activeRegion.code)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      selectedRegionCode === activeRegion.code
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'border border-emerald-700/40 bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    {selectedRegionCode === activeRegion.code ? 'Filtered in Directory' : 'Filter Directory'}
                  </button>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-emerald-900/10 dark:border-emerald-800/30 text-xs text-emerald-900 dark:text-emerald-300 font-medium">
                  <span><strong>{activeProvinces.length}</strong> {t.provinces}</span>
                  <span>•</span>
                  <span>Code: <code className="font-mono bg-emerald-100/80 dark:bg-emerald-900/40 px-1 py-0.5 rounded">{activeRegion.code}</code></span>
                </div>
              </div>

              {/* Subdivisions / Provinces List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                  {t.provinces} ({activeProvinces.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pe-1">
                  {activeProvinces.map((prov) => (
                    <div
                      key={prov.code}
                      className="rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/50 p-2.5 flex items-center justify-between text-xs hover:border-emerald-500/40 transition-colors"
                    >
                      <div className="min-w-0 flex-1 me-2">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span
                            className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                              prov.administrative_type === 'prefecture'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300'
                            }`}
                          >
                            {prov.administrative_type}
                          </span>
                        </div>
                        <div className="font-bold text-stone-900 dark:text-stone-100 truncate">
                          {getName(prov.name)}
                        </div>
                      </div>

                      <button
                        onClick={() => copyCode(prov.hcp_code)}
                        className="inline-flex items-center gap-1 font-mono text-[10px] text-stone-400 hover:text-emerald-600 transition-colors"
                        title={t.copyHcpCode}
                      >
                        <span>{prov.hcp_code}</span>
                        {copiedCode === prov.hcp_code ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Empty selection state: Full Morocco Atlas Overview */
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-900/10 dark:border-emerald-800/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-4">
                <h3 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-200 mb-1">
                  {t.appTitle}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  {t.interactiveMapHint}. Select any of the 12 administrative regions on the map to inspect its prefectures, provinces, and communes.
                </p>
              </div>

              {/* Quick Regional Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  All 12 Administrative Regions
                </h4>
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pe-1">
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
          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 grid grid-cols-4 gap-2 text-center text-xs">
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
      )}

      {/* Tab 2: Address Cascade Builder */}
      {activeTab === 'cascade' && (
        <div className="flex-1 flex flex-col justify-between">
          <AddressCascade initialRegionCode={selectedRegionCode || ''} />
        </div>
      )}
    </div>
  );
}
