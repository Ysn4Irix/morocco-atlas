# Morocco Administrative Directory - Web Application

A modern, high-performance web application representing the administrative divisions of the Kingdom of Morocco, built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS**.

Powered by official census open data from the Haut-Commissariat au Plan (**HCP RGPH 2024**) via [MoroccoAPI](https://moroccodb.ysnirix.xyz).

---

## Features

- **Interactive 12-Region Vector Map**: High-accuracy SVG map with geographic boundaries, hover states, selection synchronization, and keyboard accessibility.
- **Top Navigation Universal Search**: Real-time autocomplete searching across all 12 regions, 75 provinces/prefectures, and 1,503 communes with instant drilldown navigation.
- **Companion Region Inspector**:
  - Detailed administrative statistics (regions, provinces, communes, arrondissements).
  - Expandable province accordion cards with integrated commune listings.
  - In-province commune search and filter.
  - One-click HCP code copying to clipboard with visual confirmation.
- **Trilingual RTL / LTR Support**:
  - Arabic (Cairo font, native RTL layout)
  - French (LTR)
  - English (LTR)
- **Production-Ready Containerization**: Standalone Next.js output mode, minimal image footprint, and dedicated `/api/health` probe.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Language**: TypeScript 5

---

## Getting Started

### Prerequisites

- Node.js 20+ (recommended: Node.js 22 LTS)
- npm 10+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Build standalone production bundle
npm run build

# Start production server
npm start
```

### Health Check

The application includes a production liveness/readiness probe:
```bash
curl http://localhost:3000/api/health
```

---

## License

This project is open-source software licensed under the [MIT License](../LICENSE).
