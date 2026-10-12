# Morocco Administrative Directory (Atlas du Maroc / دليل المغرب الإداري)

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg?logo=next.js)](https://nextjs.org/)
[![Android](https://img.shields.io/badge/Android-Jetpack%20Compose-green.svg?logo=android)](https://developer.android.com/jetpack/compose)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg?logo=docker)](https://www.docker.com/)
[![HCP Census](https://img.shields.io/badge/Data-HCP%20RGPH%202024-amber.svg)](https://moroccodb.ysnirix.xyz)

An open-source, production-ready **Web Application** and **Native Android Application** exploring the official administrative territorial divisions of the Kingdom of Morocco, powered by [MoroccoAPI](https://moroccodb.ysnirix.xyz/api/v1).

Based on the official **Recensement Général de la Population et de l'Habitat (RGPH 2024)** census dataset published by Morocco's Haut-Commissariat au Plan (HCP).

---

## 🇲🇦 Administrative Hierarchy & Dataset

| Level | Classification | Count | Description |
| :--- | :--- | :---: | :--- |
| **Level 1** | **Régions (الجهات)** | **12** | First-level administrative regions of the Kingdom |
| **Level 2** | **Provinces & Préfectures (الأقاليم والعمالات)** | **75** | Second-level subdivisions (provinces and urban prefectures) |
| **Level 3** | **Communes (الجماعات الترابية)** | **1,503** | Urban and rural territorial municipalities |
| **Level 4** | **Arrondissements (المقاطعات)** | **41** | Sub-municipal districts across major metropolitan cities |

All entities feature:
- Official hierarchical **HCP codes** (e.g., `09.001.01.01`)
- **Trilingual designations**: Arabic (`ar`), French (`fr`), and English (`en`)
- Accurate vector coordinate boundaries

---

## 📐 Architecture

```
                      ┌─────────────────────────────────────────────────────────┐
                      │          MoroccoAPI (https://moroccodb.ysnirix.xyz)     │
                      │                 HCP RGPH 2024 Open Data API             │
                      └────────────────────────────┬────────────────────────────┘
                                                   │
                       ┌───────────────────────────┴───────────────────────────┐
                       ▼                                                       ▼
        ┌─────────────────────────────┐                         ┌─────────────────────────────┐
        │   WEB APP (web/)            │                         │   ANDROID APP (android/)    │
        │   - Next.js 15 (App Router) │                         │   - Kotlin + Compose + M3   │
        │   - TypeScript 5            │                         │   - Offline Room DB (Asset) │
        │   - Tailwind CSS v4         │                         │   - TopAppBar Nav Search    │
        │   - Interactive SVG Map     │                         │   - Expandable Accordion    │
        │   - Top Nav Universal Search│                         │   - Trilingual Arabic RTL   │
        │   - Integrated Communes     │                         │   - Background Sync API     │
        │   - Docker Compose + Nginx  │                         │   - Pre-seeded APK (Zero ms)│
        └─────────────────────────────┘                         └─────────────────────────────┘
```

---

## ✨ Features

### 🌐 Web Application (`web/`)
- **Interactive 12-Region Vector Map**: Custom SVG map with authentic geographic boundaries, hover states, synchronized selections, and accessibility support.
- **Top Navigation Universal Search**: Real-time autocomplete dropdown filtering across all 12 regions, 75 provinces, and 1,503 communes with direct drilldown.
- **Companion Region Inspector**:
  - Administrative division counters (regions, provinces, communes, arrondissements).
  - Expandable province accordion cards with integrated commune listings.
  - In-province commune search filter.
  - One-click HCP code copying to clipboard with visual confirmation.
- **Trilingual RTL / LTR Layouts**:
  - Arabic (Cairo font, native RTL layout)
  - French (LTR)
  - English (LTR)
- **Production Containerization**:
  - Multi-stage Next.js Dockerfile with standalone runner (~100 MB footprint).
  - Production Nginx reverse proxy with Gzip compression and security headers.
  - Dedicated `/api/health` probe endpoint.

### 📱 Android Application (`android/`)
- **100% Offline-First by Default**: Bundled with a pre-seeded SQLite database (`moroccodb.db`, 368 KB) loaded via Room (`AppDatabase.createFromAsset`), providing instant startup and search with zero network latency.
- **Top Navigation Bar Universal Search**: Real-time search across all divisions directly in the top app bar with categorized badges (`REGION`, `PROVINCE`, `COMMUNE`).
- **Expandable Province Accordions**: Communes are integrated directly inside province cards with in-card filtering and one-tap HCP code copying.
- **Trilingual with Native Arabic RTL**: Dynamic layout direction flipping (`LocalLayoutDirection provides LayoutDirection.Rtl`) with Arabic typography.
- **Smart Background Sync**: Checks `/api/v1/status` on startup and syncs updates silently if newer HCP census revisions are released.

---

## 🚀 Quickstart

### 1. Web Application (Local Development)

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To create a production build:
```bash
npm run build
npm start
```

---

### 2. Production Docker Compose Deployment

Run the web application behind an Nginx reverse proxy with a single command:

```bash
# 1. Copy environment configuration
cp .env.example .env

# 2. Build and launch services in detached mode
docker compose up -d --build

# 3. Verify container health status
docker compose ps

# 4. View application logs
docker compose logs -f
```

The application is accessible on port `80` (or the configured `PORT` in `.env`).

---

### 3. Native Android Application

Build the debug APK with Gradle:

```bash
cd android
./gradlew assembleDebug
```

The compiled APK will be generated at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

Or open the `android/` directory in **Android Studio** and run on any emulator or physical device running Android 7.0 (API 24) or newer.

---

## 📁 Repository Structure

```
morocco-db/
├── LICENSE                         # MIT Open Source License
├── README.md                       # Master documentation
├── docker-compose.yml              # Production Docker Compose configuration
├── .env.example                    # Environment variable template
├── nginx/
│   ├── Dockerfile                  # Production Nginx 1.27 Alpine image
│   └── nginx.conf                  # Reverse proxy with Gzip and security headers
├── shared/
│   ├── data/
│   │   ├── morocco-dataset.json    # Canonical HCP RGPH 2024 dataset
│   │   └── moroccodb.db            # Canonical pre-seeded SQLite database
│   ├── map/
│   │   └── morocco-regions-map.ts  # 12-Region vector SVG path coordinates
│   └── types.ts                    # Shared TypeScript data models
├── scripts/
│   ├── extract-dataset.mjs         # Dataset downloader from MoroccoAPI
│   └── generate_sqlite_db.py       # SQLite database builder for Android Room
├── web/                            # Next.js 15 Web Application
│   ├── Dockerfile                  # Multi-stage production container
│   ├── .dockerignore               # Docker build exclusions
│   ├── package.json                # Web dependencies and scripts
│   ├── src/
│   │   ├── app/                    # Next.js App Router and /api/health
│   │   ├── components/             # MoroccoMap, RegionInspector, NavSearch, Header
│   │   ├── data/                   # Bundled dataset and SVG map data
│   │   └── lib/                    # i18n and data query services
│   └── README.md                   # Web-specific documentation
└── android/                        # Native Android Jetpack Compose Application
    ├── build.gradle.kts            # Project Gradle build script
    └── app/
        ├── build.gradle.kts        # Android module build script
        └── src/main/
            ├── AndroidManifest.xml # App manifest
            ├── assets/moroccodb.db # Pre-seeded Room database asset
            ├── java/com/moroccoapi/atlas/
            │   ├── data/local/     # Room Entities, DAO, AppDatabase
            │   ├── data/remote/    # Retrofit Service and API models
            │   ├── data/repository/# Offline repository and sync manager
            │   └── ui/             # AtlasApp, AtlasViewModel, Screens, Theme
            └── res/                # Trilingual string resources (ar, fr, en)
```

---

## 📊 Data Pipeline & Synchronization

To regenerate or update the local datasets from the upstream API:

1. **Extract Latest API Data**:
   ```bash
   node scripts/extract-dataset.mjs
   ```
   This refreshes `shared/data/morocco-dataset.json` with the latest census payload.

2. **Rebuild Pre-seeded SQLite Database**:
   ```bash
   python scripts/generate_sqlite_db.py
   ```
   This recompiles `shared/data/moroccodb.db` and copies it to `android/app/src/main/assets/moroccodb.db`.

---

## ⚖️ Attribution & License

- **Source API**: [MoroccoAPI](https://moroccodb.ysnirix.xyz) by ysnirix.
- **Dataset Producer**: Haut-Commissariat au Plan (HCP), Kingdom of Morocco.
- **Census Data License**: Creative Commons Attribution 4.0 International (CC-BY-4.0).
- **Software Code License**: This project is licensed under the [MIT License](LICENSE).
