'use client';

import React from 'react';
import { useI18n, Language } from '@/lib/i18n';
import { MapPin, ExternalLink } from 'lucide-react';
import { SearchResultItem } from '@/lib/morocco-data';
import { NavSearch } from './NavSearch';

interface HeaderProps {
  onSelectSearchResult?: (item: SearchResultItem) => void;
}

export function Header({ onSelectSearchResult }: HeaderProps) {
  const { language, setLanguage } = useI18n();

  const languages: { code: Language; label: string }[] = [
    { code: 'ar', label: 'العربية' },
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 dark:border-stone-800/80 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-md">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              MoroccoAPI
              <span className="hidden sm:inline-block rounded-md bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-800 dark:text-emerald-300">
                RGPH 2024
              </span>
            </h1>
          </div>
        </div>

        {/* Global Nav Search */}
        <div className="flex-1 max-w-md mx-2">
          {onSelectSearchResult && (
            <NavSearch onSelectResult={onSelectSearchResult} />
          )}
        </div>

        {/* Language Switcher, Stats & Docs */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Selector */}
          <div className="flex items-center rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 p-1 shadow-xs">
            {languages.map((item) => (
              <button
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`rounded-lg px-2 py-0.5 text-xs font-semibold transition-all ${
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
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-stone-200 dark:border-stone-700 px-2.5 py-1 text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <span>API Docs</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </a>
        </div>
      </div>
    </header>
  );
}
