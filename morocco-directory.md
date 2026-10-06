# Morocco Administrative Directory (Web & Android)

## Goal
Build a trilingual (Arabic, French, English) administrative directory of Morocco for Web and Android using MoroccoAPI (HCP RGPH 2024 data). The Web app is built with Next.js 15, Tailwind CSS, an interactive SVG regional map, and instant hierarchy drilldown. The Android app is a native Jetpack Compose app with an offline-first pre-seeded Room database and automatic background sync.

## Architecture

```
                  ┌──────────────────────────────────────────────┐
                  │ MoroccoAPI (https://moroccodb.ysnirix.xyz)   │
                  │   - /api/v1/status                           │
                  │   - /api/v1/regions                          │
                  │   - /api/v1/provinces                        │
                  │   - /api/v1/communes                         │
                  │   - /api/v1/arrondissements                  │
                  │   - /api/v1/locations/search?q={query}       │
                  └──────────────┬───────────────────────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
  ┌──────────────────────────────┐ ┌──────────────────────────────┐
  │ WEB APP (web/)               │ │ ANDROID APP (android/)       │
  │ - Next.js 15 (App Router)    │ │ - Kotlin + Jetpack Compose   │
  │ - TypeScript + Tailwind CSS  │ │ - Pre-seeded Room Database   │
  │ - Interactive SVG Region Map │ │ - Smart Background Sync      │
  │ - Trilingual Switcher (RTL)  │ │   (Checks /api/v1/status)    │
  │ - SEO routes for divisions   │ │ - Retrofit2 / OkHttp3        │
  │ - Fast Client-side Search    │ │ - Trilingual RTL (Arabic)    │
  │ - Address Cascade Generator  │ │ - 100% Offline by Default    │
  └──────────────────────────────┘ └──────────────────────────────┘
```

## Decisions Confirmed
1. **Android Offline Seeding + Smart Sync**: Pre-seeded SQLite database in APK assets for instant zero-latency offline start. On launch or via periodic WorkManager, app automatically performs a 1 KB check to `/api/v1/status` in the background. If newer data is available, it syncs updates gracefully. A manual "Check for updates" option is also provided in Settings.
2. **Web Framework**: Next.js 15 with App Router and Tailwind CSS, featuring server-rendered SEO pages for all 12 regions and communes, paired with client-side fast filtering and SVG map visualization.
3. **Trilingual RTL/LTR**: Arabic (Cairo font, RTL layout), French, and English with seamless language switching.

## Tasks

- [x] Task 1: Initialize git repository and project workspaces (`web/` and `android/`) -> Verify: Repository clean and directories ready.
- [x] Task 2: Build dataset extraction script to generate typed seed JSON and SQLite DB -> Verify: Seed database has 12 regions, 75 provinces, 1,503 communes, and 41 arrondissements.
- [x] Task 3: Create Next.js 15 Web application with Tailwind CSS and RTL configuration -> Verify: App boots locally and supports RTL direction switching.
- [x] Task 4: Implement interactive 12-Region SVG Map component for Web -> Verify: Clicking any region highlights boundaries and filters province list.
- [x] Task 5: Build Web hierarchical drilldown, search bar, and address cascade widget -> Verify: Instant search across 1,503 communes with sub-50ms response.
- [x] Task 6: Initialize Native Android project with Jetpack Compose & Material 3 -> Verify: Gradle build configuration valid with Compose dependencies.
- [x] Task 7: Set up Room Database with pre-packaged database asset (`assets/moroccodb.db`) -> Verify: Room entities map to HCP schema and query cleanly offline.
- [x] Task 8: Implement Android background sync service with Retrofit2 -> Verify: App checks `/api/v1/status` and logs sync check results.
- [x] Task 9: Build Android UI screens (Regional Atlas, Search, Commune Details, Settings) -> Verify: Composable screens support English, French, and Arabic RTL.
- [x] Task 10: Run verification checklist and mobile responsiveness tests -> Verify: Passes linting, Next.js production build, and assembleDebug APK generation.

## Done When
- [x] Web application displays all Moroccan administrative divisions with interactive SVG map, fast search, SEO pages, and trilingual RTL switching.
- [x] Android application compiles cleanly (`app-debug.apk`), launches offline with pre-seeded data, supports Arabic RTL, and checks for updates against the live API.
