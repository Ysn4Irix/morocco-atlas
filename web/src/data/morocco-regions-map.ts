export interface RegionMapPath {
  code: string;
  nameEn: string;
  nameFr: string;
  nameAr: string;
  color: string;
  hoverColor: string;
  center: { x: number; y: number };
  path: string;
}

// 12 Administrative Regions of Morocco (Normalized coordinate space: 0 0 600 700)
export const MOROCCO_REGIONS_MAP: RegionMapPath[] = [
  {
    code: "tanger-tetouan-al-hoceima",
    nameEn: "Tanger-Tetouan-Al Hoceima",
    nameFr: "Tanger-Tétouan-Al Hoceima",
    nameAr: "طنجة-تطوان-الحسيمة",
    color: "#0f766e",
    hoverColor: "#14b8a6",
    center: { x: 375, y: 75 },
    path: "M 345,60 L 370,45 L 400,65 L 420,80 L 405,100 L 360,95 L 340,80 Z"
  },
  {
    code: "oriental",
    nameEn: "Oriental",
    nameFr: "Oriental",
    nameAr: "الشرق",
    color: "#0369a1",
    hoverColor: "#38bdf8",
    center: { x: 450, y: 150 },
    path: "M 420,80 L 470,85 L 500,120 L 490,190 L 450,230 L 430,170 L 405,100 Z"
  },
  {
    code: "fes-meknes",
    nameEn: "Fes-Meknes",
    nameFr: "Fès-Meknès",
    nameAr: "فاس-مكناس",
    color: "#1d4ed8",
    hoverColor: "#60a5fa",
    center: { x: 385, y: 135 },
    path: "M 360,95 L 405,100 L 425,140 L 405,170 L 365,155 L 350,125 Z"
  },
  {
    code: "rabat-sale-kenitra",
    nameEn: "Rabat-Sale-Kenitra",
    nameFr: "Rabat-Salé-Kénitra",
    nameAr: "الرباط-سلا-القنيطرة",
    color: "#4338ca",
    hoverColor: "#818cf8",
    center: { x: 335, y: 120 },
    path: "M 330,85 L 360,95 L 350,125 L 330,145 L 315,120 Z"
  },
  {
    code: "casablanca-settat",
    nameEn: "Casablanca-Settat",
    nameFr: "Casablanca-Settat",
    nameAr: "الدار البيضاء-سطات",
    color: "#6d28d9",
    hoverColor: "#a78bfa",
    center: { x: 295, y: 165 },
    path: "M 315,120 L 330,145 L 320,185 L 285,195 L 275,160 L 295,140 Z"
  },
  {
    code: "beni-mellal-khenifra",
    nameEn: "Beni Mellal-Khenifra",
    nameFr: "Béni Mellal-Khénifra",
    nameAr: "بني ملال-خنيفرة",
    color: "#7e22ce",
    hoverColor: "#c084fc",
    center: { x: 360, y: 190 },
    path: "M 330,145 L 365,155 L 405,170 L 390,225 L 340,215 L 320,185 Z"
  },
  {
    code: "marrakech-safi",
    nameEn: "Marrakech-Safi",
    nameFr: "Marrakech-Safi",
    nameAr: "مراكش-آسفي",
    color: "#b91c1c",
    hoverColor: "#f87171",
    center: { x: 275, y: 235 },
    path: "M 275,160 L 285,195 L 320,185 L 340,215 L 325,270 L 255,270 L 245,215 Z"
  },
  {
    code: "draa-tafilalet",
    nameEn: "Draa-Tafilalet",
    nameFr: "Drâa-Tafilalet",
    nameAr: "درعة-تافيلالت",
    color: "#c2410c",
    hoverColor: "#fb923c",
    center: { x: 395, y: 265 },
    path: "M 405,170 L 430,170 L 450,230 L 435,320 L 360,310 L 340,215 L 390,225 Z"
  },
  {
    code: "souss-massa",
    nameEn: "Souss-Massa",
    nameFr: "Souss-Massa",
    nameAr: "سوس-ماسة",
    color: "#d97706",
    hoverColor: "#fcd34d",
    center: { x: 260, y: 320 },
    path: "M 255,270 L 325,270 L 360,310 L 315,370 L 235,355 L 225,305 Z"
  },
  {
    code: "guelmim-oued-noun",
    nameEn: "Guelmim-Oued Noun",
    nameFr: "Guelmim-Oued Noun",
    nameAr: "كلميم-واد نون",
    color: "#047857",
    hoverColor: "#34d399",
    center: { x: 220, y: 405 },
    path: "M 235,355 L 315,370 L 295,435 L 200,435 L 195,385 Z"
  },
  {
    code: "laayoune-sakia-el-hamra",
    nameEn: "Laayoune-Sakia El Hamra",
    nameFr: "Laâyoune-Sakia El Hamra",
    nameAr: "العيون-الساقية الحمراء",
    color: "#0f766e",
    hoverColor: "#2dd4bf",
    center: { x: 170, y: 495 },
    path: "M 195,385 L 295,435 L 280,530 L 145,530 L 140,455 Z"
  },
  {
    code: "dakhla-oued-ed-dahab",
    nameEn: "Dakhla-Oued Ed-Dahab",
    nameFr: "Dakhla-Oued Ed-Dahab",
    nameAr: "الداخلة-وادي الذهب",
    color: "#0369a1",
    hoverColor: "#0284c7",
    center: { x: 115, y: 605 },
    path: "M 145,530 L 280,530 L 240,670 L 80,670 L 95,570 Z"
  }
];
