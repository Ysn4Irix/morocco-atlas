'use client';

import React, { useState } from 'react';
import { MOROCCO_REGIONS_MAP, RegionMapPath } from '@/data/morocco-regions-map';
import { useI18n } from '@/lib/i18n';

interface MoroccoMapProps {
  selectedRegionCode: string | null;
  onSelectRegion: (regionCode: string | null) => void;
}

export function MoroccoMap({ selectedRegionCode, onSelectRegion }: MoroccoMapProps) {
  const { language, t } = useI18n();
  const [hoveredRegion, setHoveredRegion] = useState<RegionMapPath | null>(null);

  const getRegionName = (reg: RegionMapPath) => {
    if (language === 'ar') return reg.nameAr;
    if (language === 'en') return reg.nameEn;
    return reg.nameFr;
  };

  return (
    <div className="relative rounded-2xl border border-emerald-950/20 bg-gradient-to-b from-emerald-900/10 to-teal-950/20 p-4 shadow-sm backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-600"></span>
            {t.interactiveMap}
          </h2>
          <p className="text-xs text-emerald-800/70 dark:text-emerald-300/70">
            {t.interactiveMapHint}
          </p>
        </div>
        {selectedRegionCode && (
          <button
            onClick={() => onSelectRegion(null)}
            className="rounded-lg border border-emerald-700/30 bg-emerald-100/50 dark:bg-emerald-900/40 px-2.5 py-1 text-xs font-semibold text-emerald-900 dark:text-emerald-200 hover:bg-emerald-200/60 dark:hover:bg-emerald-800/60 transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            {t.clearFilter}
          </button>
        )}
      </div>

      <div className="relative flex justify-center items-center py-2">
        <svg
          viewBox="0 0 560 720"
          className="w-full max-w-[420px] h-auto drop-shadow-md select-none transition-all"
          aria-label="Morocco 12 Administrative Regions Map"
        >
          <g>
            {MOROCCO_REGIONS_MAP.map((region) => {
              const isSelected = selectedRegionCode === region.code;
              const isHovered = hoveredRegion?.code === region.code;

              return (
                <g key={region.code}>
                  <path
                    d={region.path}
                    fill={isSelected ? '#059669' : isHovered ? region.hoverColor : region.color}
                    stroke={isSelected ? '#ffffff' : '#042f2e'}
                    strokeWidth={isSelected ? '2.5' : '1.2'}
                    className="cursor-pointer transition-all duration-200 outline-none"
                    role="button"
                    tabIndex={0}
                    aria-label={getRegionName(region)}
                    aria-pressed={isSelected}
                    onClick={() => onSelectRegion(isSelected ? null : region.code)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectRegion(isSelected ? null : region.code);
                      }
                    }}
                    onMouseEnter={() => setHoveredRegion(region)}
                    onMouseLeave={() => setHoveredRegion(null)}
                  />
                  {/* Subtle Label Marker */}
                  <circle
                    cx={region.center.x}
                    cy={region.center.y}
                    r={isSelected ? 4 : 2.5}
                    fill="#ffffff"
                    pointerEvents="none"
                  />
                </g>
              );
            })}
          </g>
        </svg>

        {/* Hover / Active Badge */}
        {hoveredRegion && (
          <div
            className="pointer-events-none absolute bottom-4 start-4 rounded-xl border border-emerald-600/30 bg-emerald-950/90 px-3.5 py-2 text-xs text-emerald-50 shadow-lg backdrop-blur-md transition-all animate-in fade-in"
          >
            <div className="font-bold text-sm text-emerald-300">
              {getRegionName(hoveredRegion)}
            </div>
            <div className="text-[11px] text-emerald-200/80">
              {hoveredRegion.code}
            </div>
          </div>
        )}
      </div>

      {/* Region quick pills */}
      <div className="mt-2 flex flex-wrap gap-1.5 justify-center">
        {MOROCCO_REGIONS_MAP.map((region) => {
          const isSelected = selectedRegionCode === region.code;
          return (
            <button
              key={region.code}
              onClick={() => onSelectRegion(isSelected ? null : region.code)}
              className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition-all ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 border border-emerald-900/10'
              }`}
            >
              {getRegionName(region)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
