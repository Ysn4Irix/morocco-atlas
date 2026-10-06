'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { MoroccoMap } from '@/components/MoroccoMap';
import { AddressCascade } from '@/components/AddressCascade';
import { DirectoryView } from '@/components/DirectoryView';
import { useI18n } from '@/lib/i18n';

export default function HomePage() {
  const { t } = useI18n();
  const [selectedRegionCode, setSelectedRegionCode] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/50 dark:bg-stone-950">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 space-y-10">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-3">
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

        {/* Top Grid: Interactive Map + Cascading Address Selector */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map Column */}
          <div className="lg:col-span-5 space-y-4">
            <MoroccoMap
              selectedRegionCode={selectedRegionCode}
              onSelectRegion={setSelectedRegionCode}
            />
          </div>

          {/* Cascading Address Widget Column */}
          <div className="lg:col-span-7 space-y-4">
            <AddressCascade />
          </div>
        </section>

        {/* Full Directory & Search Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span className="h-3 w-1 bg-emerald-600 rounded-full"></span>
              {t.exploreByRegion}
            </h3>
          </div>
          <DirectoryView
            selectedRegionCode={selectedRegionCode}
            onSelectRegion={setSelectedRegionCode}
          />
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
