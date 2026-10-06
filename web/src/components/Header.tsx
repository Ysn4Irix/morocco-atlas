'use client';

import React from 'react';
import { useI18n, Language } from '@/lib/i18n';
import { MapPin, ExternalLink } from 'lucide-react';
import { getDatasetStats } from '@/lib/morocco-data';

export function Header() {
  const { language, setLanguage, t } = useI18n();
  const stats = getDatasetStats();

  const languages: { code: Language; label: string }[] = [
    { code: 'ar', label: 'العربية' },
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 dark:border-stone-800/80 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-md">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
              MoroccoAPI
              <span className="hidden sm:inline-block rounded-md bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">
                RGPH 2024
              </span>
            </h1>
            <p className="text-xs text-stone-500 hidden sm:block">
              {t.dataSource}
            </p>
          </div>
        </div>

        {/* Stats and Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:flex items-center gap-3 text-xs text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-200/50 dark:border-stone-800">
            <span><strong>{stats.regions}</strong> {t.regions}</span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span><strong>{stats.provinces}</strong> {t.provinces}</span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span><strong>{stats.communes}</strong> {t.communes}</span>
          </div>

          {/* Language Selector */}
          <div className="flex items-center rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 p-1 shadow-xs">
            {languages.map((item) => (
              <button
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  language === item.code
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* API Link */}
          <a
            href="https://moroccodb.ysnirix.xyz"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-stone-200 dark:border-stone-700 px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <span>API Docs</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </a>
        </div>
      </div>
    </header>
  );
}
