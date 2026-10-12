'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { searchEntities, SearchResultItem } from '@/lib/morocco-data';
import { Search, X, Check, Copy, ArrowRight } from 'lucide-react';

interface NavSearchProps {
  onSelectResult: (item: SearchResultItem) => void;
}

export function NavSearch({ onSelectResult }: NavSearchProps) {
  const { language, t } = useI18n();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = React.useMemo(() => {
    return searchEntities(query, 10);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleSelect = (item: SearchResultItem) => {
    onSelectResult(item);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-stone-400">
          <Search className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length > 0) setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsOpen(false);
          }}
          placeholder={t.searchPlaceholder}
          className="w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 py-1.5 ps-9 pe-8 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:border-emerald-600 focus:bg-white dark:focus:bg-stone-950 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all shadow-xs"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute inset-y-0 end-0 flex items-center pe-2.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full mt-2 w-full max-h-[380px] overflow-y-auto rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-2.5 py-1.5 text-[11px] font-bold text-stone-400 flex items-center justify-between border-b border-stone-100 dark:border-stone-800 mb-1">
            <span>{t.searchResults} ({results.length})</span>
            <span className="text-[10px]">HCP RGPH 2024</span>
          </div>

          {results.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-400">
              {t.noResults}
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="rounded-xl p-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer transition-colors flex items-center justify-between group"
                >
                  <div className="min-w-0 flex-1 me-2">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                        item.type === 'region'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : item.type === 'province'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                          : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                      }`}>
                        {item.type}
                      </span>
                      {item.parentName && (
                        <span className="text-[10px] text-stone-400 truncate">
                          in {item.parentName}
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                      {getName(item.name)}
                    </div>
                    {language !== 'ar' && item.name.ar && (
                      <div className="text-[10px] text-stone-400 font-arabic truncate">
                        {item.name.ar}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => copyCode(e, item.hcp_code)}
                      className="inline-flex items-center gap-1 font-mono text-[10px] text-stone-400 hover:text-emerald-600 transition-colors px-1 py-0.5 rounded"
                      title={t.copyHcpCode}
                    >
                      <span>{item.hcp_code}</span>
                      {copiedCode === item.hcp_code ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-emerald-600 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
