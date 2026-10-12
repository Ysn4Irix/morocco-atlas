'use client';

import React, { useState } from 'react';
import { MOROCCO_REGIONS_MAP, MAP_VIEWBOX, RegionMapPath } from '@/data/morocco-regions-map';
import { useI18n } from '@/lib/i18n';

interface MoroccoMapProps {
  selectedRegionCode: string | null;
  onSelectRegion: (regionCode: string | null) => void;
  hoveredRegionCode?: string | null;
  onHoverRegion?: (regionCode: string | null) => void;
}

export function MoroccoMap({
  selectedRegionCode,
  onSelectRegion,
  hoveredRegionCode,
  onHoverRegion
}: MoroccoMapProps) {
  const { language, t } = useI18n();
  const [internalHover, setInternalHover] = useState<RegionMapPath | null>(null);

  const activeHoverCode = hoveredRegionCode || internalHover?.code;
  const activeHoverRegion = MOROCCO_REGIONS_MAP.find(r => r.code === activeHoverCode) || internalHover;

  const getRegionName = (reg: RegionMapPath) => {
    if (language === 'ar') return reg.nameAr;
    if (language === 'en') return reg.nameEn;
    return reg.nameFr;
  };

  const handleMouseEnter = (region: RegionMapPath) => {
    setInternalHover(region);
    onHoverRegion?.(region.code);
  };

  const handleMouseLeave = () => {
    setInternalHover(null);
    onHoverRegion?.(null);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-600"></span>
            {t.interactiveMap}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {t.interactiveMapHint}
          </p>
        </div>
        {selectedRegionCode && (
          <button
            onClick={() => onSelectRegion(null)}
            className="rounded-lg border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            {t.clearFilter}
          </button>
        )}
      </div>

      {/* SVG Map Container */}
      <div className="relative flex-1 flex justify-center items-center py-2 min-h-[380px]">
        <svg
          viewBox={MAP_VIEWBOX}
          className="w-full max-w-[460px] h-auto drop-shadow-sm select-none transition-all"
          aria-label="Morocco 12 Administrative Regions Map"
        >
          <g>
            {MOROCCO_REGIONS_MAP.map((region) => {
              const isSelected = selectedRegionCode === region.code;
              const isHovered = activeHoverCode === region.code;

              return (
                <path
                  key={region.code}
                  d={region.path}
                  fill={isSelected ? '#059669' : isHovered ? region.hoverColor : region.color}
                  stroke={isSelected ? '#ffffff' : '#f8fafc'}
                  strokeWidth={isSelected ? '2.5' : '1'}
                  className="cursor-pointer transition-colors duration-150 outline-none"
                  style={{
                    filter: isSelected ? 'drop-shadow(0 2px 8px rgba(5, 150, 105, 0.45))' : 'none',
                    opacity: isSelected ? 1 : isHovered ? 0.95 : 0.85
                  }}
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
                  onMouseEnter={() => handleMouseEnter(region)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
          </g>
        </svg>

        {/* Floating Tooltip / Badge for Hovered Region */}
        {activeHoverRegion && (
          <div
            className="pointer-events-none absolute bottom-3 start-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-900/90 dark:bg-stone-950/95 px-3.5 py-2 text-xs text-white shadow-lg backdrop-blur-md transition-all animate-in fade-in"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-emerald-500 text-[9px] font-bold text-white">
                {activeHoverRegion.hcpCode}
              </span>
              <span className="font-bold text-sm text-emerald-400">
                {getRegionName(activeHoverRegion)}
              </span>
            </div>
            {language !== 'ar' && (
              <div className="text-[11px] text-stone-300 font-arabic mt-0.5">
                {activeHoverRegion.nameAr}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Region quick filter pills */}
      <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap gap-1.5 justify-center">
        {MOROCCO_REGIONS_MAP.map((region) => {
          const isSelected = selectedRegionCode === region.code;
          return (
            <button
              key={region.code}
              onClick={() => onSelectRegion(isSelected ? null : region.code)}
              onMouseEnter={() => handleMouseEnter(region)}
              onMouseLeave={handleMouseLeave}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400/50'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
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
