// One-off generator for the public/parts placeholder SVGs. Run: node scripts/gen-placeholders.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "parts");
mkdirSync(OUT, { recursive: true });

const EMBLEMS = {
  // Abstract mechanical emblems, drawn around (0,0).
  gear: `
    <circle cx="0" cy="0" r="92"/>
    <circle cx="0" cy="0" r="38"/>
    ${Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI) / 4;
      const x1 = Math.cos(a) * 92, y1 = Math.sin(a) * 92;
      const x2 = Math.cos(a) * 136, y2 = Math.sin(a) * 136;
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke-width="34"/>`;
    }).join("")}`,
  disc: `
    <circle cx="0" cy="0" r="130"/>
    <circle cx="0" cy="0" r="46"/>
    ${Array.from({ length: 6 }, (_, i) => {
      const a = (i * Math.PI) / 3 + 0.26;
      return `<circle cx="${(Math.cos(a) * 90).toFixed(1)}" cy="${(Math.sin(a) * 90).toFixed(1)}" r="13" stroke-width="10"/>`;
    }).join("")}`,
  battery: `
    <rect x="-120" y="-80" width="240" height="160" rx="18"/>
    <line x1="-70" y1="-80" x2="-70" y2="-120" stroke-width="22"/>
    <line x1="70" y1="-80" x2="70" y2="-120" stroke-width="22"/>
    <line x1="-40" y1="0" x2="40" y2="0" stroke-width="16"/>
    <line x1="0" y1="-40" x2="0" y2="40" stroke-width="16"/>`,
  spring: `
    <path d="M-110 -90 H110"/>
    ${Array.from({ length: 5 }, (_, i) => {
      const y = -50 + i * 32;
      const l = i % 2 === 0 ? -110 : 110;
      const r = i % 2 === 0 ? 110 : -110;
      return `<path d="M${l} ${y} L${r} ${y + 26}"/>`;
    }).join("")}
    <path d="M-110 90 H110"/>`,
  filter: `
    <rect x="-76" y="-120" width="152" height="240" rx="20"/>
    <line x1="-76" y1="-56" x2="76" y2="-56"/>
    <line x1="-76" y1="-8" x2="76" y2="-8"/>
    <line x1="-76" y1="40" x2="76" y2="40"/>
    <circle cx="0" cy="86" r="20"/>`,
  bolt: `
    <path d="M0 -118 L102 -59 L102 59 L0 118 L-102 59 L-102 -59 Z"/>
    <circle cx="0" cy="0" r="46"/>`,
  wave: `
    <circle cx="0" cy="0" r="128"/>
    <path d="M-88 0 Q-44 -60 0 0 T88 0"/>
    <path d="M-88 40 Q-44 -20 0 40 T88 40"/>`,
  pump: `
    <circle cx="-20" cy="10" r="86"/>
    <circle cx="-20" cy="10" r="30"/>
    <path d="M66 -66 H126 V-16 H66"/>
    <path d="M-20 -76 V-126 H60"/>`,
  car: `
    <path d="M-150 30 L-116 -30 Q-108 -52 -80 -52 H60 Q86 -52 100 -32 L140 30"/>
    <line x1="-150" y1="30" x2="150" y2="30"/>
    <circle cx="-84" cy="62" r="30"/>
    <circle cx="86" cy="62" r="30"/>`,
  shield: `
    <path d="M0 -120 L104 -80 V10 Q104 84 0 124 Q-104 84 -104 10 V-80 Z"/>
    <path d="M-46 4 L-12 40 L52 -32"/>`,
  wrench: `
    <path d="M56 -118 A62 62 0 1 0 6 -34 L-96 66 A26 26 0 1 1 -132 30 L-32 -70"/>
    <circle cx="76" cy="-128" r="0.5"/>`,
  spark: `
    <path d="M-14 -130 H30 V-52 L58 -22 V52 Q58 108 8 116 Q-46 112 -46 52 V-22 L-14 -52 Z"/>
    <line x1="8" y1="116" x2="8" y2="150"/>`,
  droplet: `
    <path d="M0 -130 Q86 -30 86 30 Q86 110 0 110 Q-86 110 -86 30 Q-86 -30 0 -130 Z"/>
    <path d="M-34 34 Q-34 70 6 74"/>`,
  grid: `
    <rect x="-116" y="-116" width="100" height="100" rx="16"/>
    <rect x="16" y="-116" width="100" height="100" rx="16"/>
    <rect x="-116" y="16" width="100" height="100" rx="16"/>
    <rect x="16" y="16" width="100" height="100" rx="16"/>`,
  seat: `
    <path d="M-70 -120 Q-98 -118 -96 -84 L-78 20 Q-76 40 -54 40 H84 Q104 40 104 18 V-6 Q104 -26 84 -26 H-24 L-8 -118 Q-10 -120 -70 -120 Z"/>
    <line x1="-96" y1="76" x2="110" y2="76"/>`,
};

function frame({ w, h, emblem, label, sub, tone = "#8a93a3", accent = "#0071e3" }) {
  const scale = Math.min(w, h) / 420;
  const gridStep = 48;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f8f9fb"/>
      <stop offset="1" stop-color="#e7eaef"/>
    </linearGradient>
    <pattern id="grid" width="${gridStep}" height="${gridStep}" patternUnits="userSpaceOnUse">
      <path d="M${gridStep} 0H0V${gridStep}" fill="none" stroke="#d7dbe2" stroke-width="1"/>
    </pattern>
    <radialGradient id="glow" cx="0.5" cy="0.42" r="0.6">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#grid)" opacity="0.5"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <g stroke="${tone}" fill="none" stroke-linecap="round" stroke-linejoin="round"
     transform="translate(${w / 2} ${h / 2 - h * 0.06}) scale(${scale.toFixed(3)})">
    ${emblem}
  </g>
  <g text-anchor="middle" font-family="ui-monospace, 'SF Mono', Menlo, monospace">
    <text x="${w / 2}" y="${h * 0.84}" font-size="${Math.round(Math.min(w, h) * 0.045)}"
          letter-spacing="${Math.round(Math.min(w, h) * 0.02)}" fill="#6e7686">${label}</text>
    ${sub ? `<text x="${w / 2}" y="${h * 0.84 + Math.min(w, h) * 0.07}" font-size="${Math.round(Math.min(w, h) * 0.03)}" fill="#9aa2b0">${sub}</text>` : ""}
  </g>
  <g stroke="#b9c0cb" stroke-width="4" fill="none">
    <path d="M32 32h64M32 32v64"/>
    <path d="M${w - 32} 32h-64M${w - 32} 32v64"/>
    <path d="M32 ${h - 32}h64M32 ${h - 32}v-64"/>
    <path d="M${w - 32} ${h - 32}h-64M${w - 32} ${h - 32}v-64"/>
  </g>
  <circle cx="${w / 2}" cy="${h * 0.5 - h * 0.06}" r="6" fill="${accent}" opacity="0.35"/>
</svg>`;
}

const part = (name, emblem, label, sub) =>
  [name, frame({ w: 1200, h: 900, emblem: EMBLEMS[emblem], label, sub })];

const files = [
  part("placeholder", "gear", "PIECE", "ATELIER RICHARD MECHANO"),
  part("timing-kit", "gear", "KIT DISTRIBUTION", "TIMING KIT"),
  part("brake-pads", "disc", "PLAQUETTES DE FREIN", "BRAKE PADS"),
  part("brake-disc", "disc", "DISQUE DE FREIN", "BRAKE DISC"),
  part("battery", "battery", "BATTERIE", "BATTERY"),
  part("shock-absorber", "spring", "AMORTISSEUR", "SHOCK ABSORBER"),
  part("oil-filter", "filter", "FILTRE A HUILE", "OIL FILTER"),
  part("alternator", "wrench", "ALTERNATEUR", "ALTERNATOR"),
  part("clutch-kit", "gear", "KIT EMBRAYAGE", "CLUTCH KIT"),
  part("water-pump", "pump", "POMPE A EAU", "WATER PUMP"),
  part("gasket-set", "bolt", "KIT DE JOINTS", "GASKET SET"),
  part("fuel-pump", "droplet", "POMPE A CARBURANT", "FUEL PUMP"),
  part("toolkit", "wrench", "OUTILLAGE", "WORKSHOP TOOLS"),
  part("fitment-guide", "grid", "GUIDE DE COMPATIBILITE", "FITMENT GUIDE"),
];

const CATEGORY_LABEL_FR = {
  engine: "MOTEUR",
  transmission: "TRANSMISSION",
  electrical: "ELECTRICITE",
  brakes: "FREINAGE",
  body: "CARROSSERIE",
  suspension: "SUSPENSION",
  fuel: "ALIMENTATION",
  cooling: "REFROIDISSEMENT",
  interior: "HABITACLE",
  tools: "OUTILLAGE",
  gaskets: "JOINTS",
  filters: "FILTRES",
};
const CATEGORY_EMBLEM = {
  engine: "gear",
  transmission: "gear",
  electrical: "spark",
  brakes: "disc",
  body: "shield",
  suspension: "spring",
  fuel: "droplet",
  cooling: "droplet",
  interior: "seat",
  tools: "wrench",
  gaskets: "bolt",
  filters: "filter",
};
for (const [slug, label] of Object.entries(CATEGORY_LABEL_FR)) {
  files.push(
    part(`category-${slug}`, CATEGORY_EMBLEM[slug], label, "CATEGORIE"),
  );
}

for (const make of ["peugeot", "citroen", "renault", "volkswagen", "bmw", "ford"]) {
  files.push(part(`make-${make}`, "car", make.toUpperCase(), "MARQUE VEHICULE"));
}
for (const brand of ["brembo", "bosch", "sachs", "luk"]) {
  files.push(part(`brand-${brand}`, "shield", brand.toUpperCase(), "MARQUE PIECE"));
}

// Wide hero artwork — abstract workshop bench with a gear wall.
files.push([
  "hero",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1280" role="img" aria-label="Atelier">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f7f9fc"/>
      <stop offset="1" stop-color="#dfe4ec"/>
    </linearGradient>
    <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M56 0H0V56" fill="none" stroke="#d3d8e1" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1600" height="1280" fill="url(#bg)"/>
  <rect width="1600" height="1280" fill="url(#grid)" opacity="0.5"/>
  <g stroke="#7d8798" fill="none" stroke-width="10" stroke-linecap="round">
    <g transform="translate(430 430) scale(1.6)">
      <circle cx="0" cy="0" r="92"/><circle cx="0" cy="0" r="38"/>
      ${Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return `<line x1="${(Math.cos(a) * 92).toFixed(1)}" y1="${(Math.sin(a) * 92).toFixed(1)}" x2="${(Math.cos(a) * 136).toFixed(1)}" y2="${(Math.sin(a) * 136).toFixed(1)}" stroke-width="30"/>`;
      }).join("")}
    </g>
    <g transform="translate(1020 380) scale(1.05)">
      <circle cx="0" cy="0" r="130"/><circle cx="0" cy="0" r="46"/>
      ${Array.from({ length: 6 }, (_, i) => {
        const a = (i * Math.PI) / 3 + 0.26;
        return `<circle cx="${(Math.cos(a) * 90).toFixed(1)}" cy="${(Math.sin(a) * 90).toFixed(1)}" r="13" stroke-width="9"/>`;
      }).join("")}
    </g>
    <g transform="translate(1310 660) scale(0.8)" stroke="#98a1b1">
      <rect x="-120" y="-80" width="240" height="160" rx="18"/>
      <line x1="-70" y1="-80" x2="-70" y2="-120" stroke-width="20"/>
      <line x1="70" y1="-80" x2="70" y2="-120" stroke-width="20"/>
      <line x1="-40" y1="0" x2="40" y2="0" stroke-width="14"/>
    </g>
    <g transform="translate(300 800) scale(0.85)" stroke="#98a1b1">
      <rect x="-76" y="-120" width="152" height="240" rx="20"/>
      <line x1="-76" y1="-56" x2="76" y2="-56"/>
      <line x1="-76" y1="-8" x2="76" y2="-8"/>
      <line x1="-76" y1="40" x2="76" y2="40"/>
    </g>
    <line x1="120" y1="980" x2="1480" y2="980" stroke="#6e7686" stroke-width="12"/>
    <line x1="220" y1="980" x2="220" y2="1160" stroke="#6e7686" stroke-width="12"/>
    <line x1="1380" y1="980" x2="1380" y2="1160" stroke="#6e7686" stroke-width="12"/>
    <g transform="translate(800 920) scale(0.55)" stroke="#0071e3">
      <path d="M56 -118 A62 62 0 1 0 6 -34 L-96 66 A26 26 0 1 1 -132 30 L-32 -70"/>
    </g>
  </g>
  <g text-anchor="middle" font-family="ui-monospace, 'SF Mono', Menlo, monospace">
    <text x="800" y="1220" font-size="44" letter-spacing="14" fill="#6e7686">ATELIER RICHARD MECHANO</text>
  </g>
</svg>`,
]);

files.push([
  "atelier",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-label="Atelier">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f6f8fb"/>
      <stop offset="1" stop-color="#e2e6ee"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#d5dae2" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="900" fill="url(#bg)"/>
  <rect width="1200" height="900" fill="url(#grid)" opacity="0.5"/>
  <g stroke="#7d8798" fill="none" stroke-width="10" stroke-linecap="round">
    <path d="M120 640 H1080" stroke="#6e7686" stroke-width="12"/>
    <path d="M200 640 V800 M1000 640 V800" stroke="#6e7686" stroke-width="12"/>
    <g transform="translate(600 380) scale(1.35)">
      <circle cx="0" cy="0" r="92"/><circle cx="0" cy="0" r="38"/>
      ${Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return `<line x1="${(Math.cos(a) * 92).toFixed(1)}" y1="${(Math.sin(a) * 92).toFixed(1)}" x2="${(Math.cos(a) * 136).toFixed(1)}" y2="${(Math.sin(a) * 136).toFixed(1)}" stroke-width="30"/>`;
      }).join("")}
    </g>
    <g transform="translate(320 590) scale(0.42)" stroke="#98a1b1">
      <path d="M56 -118 A62 62 0 1 0 6 -34 L-96 66 A26 26 0 1 1 -132 30 L-32 -70"/>
    </g>
    <g transform="translate(890 590) scale(0.42)" stroke="#98a1b1">
      <path d="M0 -118 L102 -59 L102 59 L0 118 L-102 59 L-102 -59 Z"/>
      <circle cx="0" cy="0" r="46"/>
    </g>
  </g>
  <g text-anchor="middle" font-family="ui-monospace, 'SF Mono', Menlo, monospace">
    <text x="600" y="850" font-size="34" letter-spacing="10" fill="#6e7686">L'ATELIER</text>
  </g>
</svg>`,
]);

files.push([
  "map",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="Carte">
  <rect width="1600" height="900" fill="#eef1f6"/>
  <g stroke="#d8dde6" stroke-width="14" fill="none">
    <path d="M0 210 H1600 M0 480 H1600 M0 720 H1600"/>
    <path d="M280 0 V900 M640 0 V900 M980 0 V900 M1320 0 V900"/>
  </g>
  <g stroke="#c6cdd9" stroke-width="6" fill="none">
    <path d="M0 340 H1600 M0 600 H1600"/>
    <path d="M460 0 V900 M800 0 V900 M1160 0 V900"/>
  </g>
  <g fill="#e3e8f0">
    <rect x="60" y="60" width="180" height="120" rx="10"/>
    <rect x="330" y="250" width="260" height="180" rx="10"/>
    <rect x="1040" y="80" width="220" height="100" rx="10"/>
    <rect x="1050" y="540" width="200" height="140" rx="10"/>
    <rect x="420" y="660" width="300" height="120" rx="10"/>
    <rect x="1380" y="280" width="160" height="160" rx="10"/>
  </g>
  <g transform="translate(800 450)">
    <circle cx="0" cy="0" r="120" fill="#0071e3" opacity="0.12"/>
    <path d="M0 -96 C46 -96 84 -58 84 -12 C84 44 0 112 0 112 C0 112 -84 44 -84 -12 C-84 -58 -46 -96 0 -96 Z"
          fill="#0071e3"/>
    <circle cx="0" cy="-14" r="30" fill="#ffffff"/>
  </g>
  <g text-anchor="middle" font-family="ui-monospace, 'SF Mono', Menlo, monospace">
    <text x="800" y="640" font-size="30" letter-spacing="8" fill="#6e7686">24 RUE DE L'INDUSTRIE — LYON</text>
  </g>
</svg>`,
]);

for (const [name, svg] of files) {
  writeFileSync(join(OUT, `${name}.svg`), svg.trim() + "\n", "utf8");
}
console.log(`wrote ${files.length} svgs to public/parts`);
