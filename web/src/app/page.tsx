'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { MoroccoMap } from '@/components/MoroccoMap';
import { RegionInspector } from '@/components/RegionInspector';
import { useI18n } from '@/lib/i18n';
import { SearchResultItem, getCommuneByCode } from '@/lib/morocco-data';

export default function HomePage() {
  const { t } = useI18n();
  const [selectedRegionCode, setSelectedRegionCode] = useState<string | null>(null);
  const [hoveredRegionCode, setHoveredRegionCode] = useState<string | null>(null);
  const [activeProvinceCode, setActiveProvinceCode] = useState<string | null>(null);
  const [highlightedCommuneCode, setHighlightedCommuneCode] = useState<string | null>(null);

  const handleSelectSearchResult = (item: SearchResultItem) => {
    if (item.type === 'region') {
      setSelectedRegionCode(item.code);
      setActiveProvinceCode(null);
      setHighlightedCommuneCode(null);
    } else if (item.type === 'province') {
      setSelectedRegionCode(item.region_code);
      setActiveProvinceCode(item.code);
      setHighlightedCommuneCode(null);
    } else if (item.type === 'commune') {
      const comm = getCommuneByCode(item.code);
      setSelectedRegionCode(item.region_code);
      if (comm) {
        setActiveProvinceCode(comm.province_code);
      }
      setHighlightedCommuneCode(item.code);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/50 dark:bg-stone-950">
      <Header onSelectSearchResult={handleSelectSearchResult} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 space-y-8">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/50 px-3.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            {t.syncStatus}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
            {t.appTitle}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400">
            {t.appSubtitle}
          </p>
        </section>

        {/* Top Grid: Interactive Map + Companion Region Inspector with Communes */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Map Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <MoroccoMap
              selectedRegionCode={selectedRegionCode}
              onSelectRegion={(code) => {
                setSelectedRegionCode(code);
                setActiveProvinceCode(null);
                setHighlightedCommuneCode(null);
              }}
              hoveredRegionCode={hoveredRegionCode}
              onHoverRegion={setHoveredRegionCode}
            />
          </div>

          {/* Companion Region Inspector Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <RegionInspector
              selectedRegionCode={selectedRegionCode}
              hoveredRegionCode={hoveredRegionCode}
              onSelectRegion={(code) => {
                setSelectedRegionCode(code);
                setActiveProvinceCode(null);
                setHighlightedCommuneCode(null);
              }}
              activeProvinceCode={activeProvinceCode}
              onSelectProvince={setActiveProvinceCode}
              highlightedCommuneCode={highlightedCommuneCode}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-8 text-xs text-stone-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-start">
            <p className="font-semibold text-stone-700 dark:text-stone-300">
              Morocco Administrative Directory · Built with MoroccoAPI
            </p>
            <p>
              Dataset source: Haut-Commissariat au Plan (HCP) · RGPH 2024 · License CC-BY-4.0
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://moroccodb.ysnirix.xyz/openapi.json"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-700 dark:hover:text-emerald-400 underline"
            >
              OpenAPI JSON
            </a>
            <a
              href="https://moroccodb.ysnirix.xyz/api/v1/status"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-700 dark:hover:text-emerald-400 underline"
            >
              Status Endpoint
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
