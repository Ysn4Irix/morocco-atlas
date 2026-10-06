# Morocco Administrative Directory (Atlas du Maroc / دليل المغرب الإداري)

A complete, production-ready **Web application** and **Native Android application** built around the [MoroccoAPI](https://moroccodb.ysnirix.xyz/api/v1) open data service.

Based on the official Haut-Commissariat au Plan (HCP) **Recensement Général de la Population et de l'Habitat (RGPH 2024)** national census dataset, licensed under **CC-BY-4.0**.

---

## 🇲🇦 Data Scope & Coverage

* **12 Administrative Regions** (Tanger-Tetouan-Al Hoceima, Oriental, Fès-Meknès, Rabat-Salé-Kénitra, Béni Mellal-Khénifra, Casablanca-Settat, Marrakech-Safi, Drâa-Tafilalet, Souss-Massa, Guelmim-Oued Noun, Laâyoune-Sakia El Hamra, Dakhla-Oued Ed-Dahab)
* **75 Provinces and Prefectures** (with explicit classification)
* **1,503 Communes** (Urban and Rural)
* **41 Arrondissements** across Morocco's 6 subdivided metropolitan cities
* **8 Prefectures of Arrondissements** in Greater Casablanca
* **Trilingual Names**: Arabic (`ar`), French (`fr`), and English (`en`) for every entity
* **Official HCP hierarchical codes** (e.g. `09.001.01.01`)

---

## 🌐 Web Application (`web/`)

Built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS**.

### Key Features
1. **Interactive 12-Region SVG Map Header**: Clickable vector map of Morocco with hover states, direct regional filtering, and keyboard accessibility (`Enter`/`Space`).
2. **Cascading Address Selector Generator**: An interactive testing tool for e-commerce developers (Region -> Province -> Commune) with one-click JSON copy for checkout integration.
3. **Instant Trilingual RTL/LTR Switcher**:
   * Arabic (RTL with Cairo typography)
   * French (LTR)
   * English (LTR)
4. **Full Search Across 1,503 Communes**: Sub-50ms instant client-side lookup by French name, Arabic name, or official HCP code.
5. **Zero-Latency Data Layer**: Pre-compiled static dataset bundled for high performance with server-side rendering (SSR).

### Getting Started (Web)
```bash
cd web
npm install
npm run dev
# Open http://localhost:3000
```

To build for production:
```bash
npm run build
npm start
```

---

## 📱 Android Application (`android/`)

Built with **Kotlin**, **Jetpack Compose**, **Material 3**, and **Room Database**.

### Key Features
1. **100% Offline by Default**: Pre-seeded SQLite database (`moroccodb.db`, 368 KB) bundled in `assets/`, allowing instant first-launch search with zero network latency.
2. **Silent Background Update Sync**: Automatically queries `/api/v1/status` on launch and updates local Room tables if HCP updates are released.
3. **Trilingual Support with First-Class Arabic RTL**: Dynamic layout direction flipping (`LocalLayoutDirection provides LayoutDirection.Rtl`).
4. **Hierarchical Navigation**: Region -> Province -> Commune drilldown with one-tap HCP code copying to clipboard.
5. **Manual Update Trigger**: Settings screen with manual "Check Updates" button and dataset provenance.

### Getting Started (Android)
```bash
cd android
gradle assembleDebug
# Or open in Android Studio and run on emulator / device
```

---

## 📂 Project Structure

```
morocco-db/
├── morocco-directory.md       # Master project plan and task status
├── README.md                  # Comprehensive documentation
├── scripts/
│   ├── extract-dataset.mjs    # Fetches live MoroccoAPI into structured JSON
│   └── generate_sqlite_db.py  # Compiles SQLite database asset for Android Room
├── shared/
│   ├── data/
│   │   ├── morocco-dataset.json (Official RGPH 2024 dataset)
│   │   └── moroccodb.db        (Pre-seeded SQLite database, 368 KB)
│   ├── map/
│   │   └── morocco-regions-map.ts (12-Region vector paths)
│   └── types.ts               # Shared TypeScript schemas
├── web/                       # Next.js 15 Web Application
│   ├── src/
│   │   ├── app/               # App Router pages and layout
│   │   ├── components/        # Map, AddressCascade, DirectoryView, Header
│   │   ├── data/              # Bundled datasets
│   │   └── lib/               # i18n and data query services
└── android/                   # Native Android Jetpack Compose Project
    └── app/src/main/
        ├── assets/moroccodb.db # Bundled offline Room asset
        ├── java/com/moroccoapi/atlas/
        │   ├── data/local/    # Room Entities, DAO, AppDatabase
        │   ├── data/remote/   # Retrofit API Service & DTOs
        │   ├── data/repository/ # Sync and offline repository
        │   └── ui/            # Compose Screens, Theme, ViewModel
        └── res/               # Trilingual string resources (values, values-ar, values-fr)
```

---

## 📜 Attribution & License

* **API**: [MoroccoAPI](https://moroccodb.ysnirix.xyz) by ysnirix
* **Data Producer**: Haut-Commissariat au Plan (HCP), Kingdom of Morocco
* **License**: Creative Commons Attribution 4.0 International (CC-BY-4.0)
