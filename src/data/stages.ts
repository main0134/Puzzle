import { Stage } from '../types/puzzle';
import elfImg from '../assets/images/character_elf_forest_1794377612837.jpg';
import cyberCatImg from '../assets/images/character_cyber_cat_1794377613267.jpg';
import mermaidImg from '../assets/images/character_mermaid_deep_1794377613681.jpg';
import foxSamuraiImg from '../assets/images/character_fox_samurai_1794377614692.jpg';

// SVG Artwork helper for stages 5 through 10 to guarantee gorgeous, resilient character + background illustrations
function createSvgDataUrl(svgContent: string): string {
  const encoded = encodeURIComponent(svgContent.trim().replace(/\s+/g, ' '));
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

// Stage 5: 천공 비행선의 탐험가 판다
const stage5Svg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="40%" stop-color="#3b82f6"/>
      <stop offset="70%" stop-color="#fdba74"/>
      <stop offset="100%" stop-color="#f97316"/>
    </linearGradient>
    <linearGradient id="islandGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#15803d"/>
      <stop offset="35%" stop-color="#3f6212"/>
      <stop offset="100%" stop-color="#451a03"/>
    </linearGradient>
    <linearGradient id="goldBrass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#854d0e"/>
    </linearGradient>
  </defs>
  <!-- Background: Sky & Clouds -->
  <rect width="800" height="800" fill="url(#skyGrad)"/>
  <circle cx="700" cy="220" r="140" fill="#fef08a" opacity="0.3"/>
  <circle cx="700" cy="220" r="80" fill="#ffffff" opacity="0.8"/>
  <!-- Floating clouds -->
  <path d="M-50,550 Q100,480 250,530 T550,520 T850,560 L850,800 L-50,800 Z" fill="#ffffff" opacity="0.35"/>
  <path d="M50,620 Q200,560 380,600 T720,590 T850,640 L850,800 L50,800 Z" fill="#ffffff" opacity="0.5"/>
  <!-- Floating Islands in distance -->
  <path d="M120,380 Q180,330 260,370 Q240,430 180,480 Q140,420 120,380 Z" fill="url(#islandGrad)"/>
  <path d="M540,280 Q620,240 700,270 Q670,340 600,380 Q560,320 540,280 Z" fill="url(#islandGrad)"/>
  <!-- Distant Steampunk Airships -->
  <ellipse cx="620" cy="180" rx="65" ry="24" fill="#78350f"/>
  <polygon points="685,175 710,165 710,195" fill="#ca8a04"/>
  <ellipse cx="160" cy="220" rx="45" ry="16" fill="#78350f" opacity="0.7"/>
  <!-- Main Airship Deck Foreground -->
  <path d="M-20,680 L820,650 L820,800 L-20,800 Z" fill="#292524"/>
  <rect x="0" y="660" width="800" height="18" fill="url(#goldBrass)"/>
  <!-- Brass Steampunk Compass & Wheel -->
  <circle cx="160" cy="670" r="60" fill="none" stroke="url(#goldBrass)" stroke-width="8"/>
  <line x1="160" y1="610" x2="160" y2="730" stroke="url(#goldBrass)" stroke-width="6"/>
  <line x1="100" y1="670" x2="220" y2="670" stroke="url(#goldBrass)" stroke-width="6"/>
  <!-- Panda Explorer Character -->
  <!-- Body/Aviator Jacket -->
  <ellipse cx="400" cy="560" rx="140" ry="120" fill="#78350f"/>
  <path d="M340,480 L400,640 L460,480 Z" fill="#fef3c7"/>
  <!-- Leather collar & brass buckles -->
  <path d="M330,480 Q400,530 470,480" stroke="url(#goldBrass)" stroke-width="12" fill="none"/>
  <!-- Panda Head -->
  <circle cx="400" cy="400" r="105" fill="#f8fafc"/>
  <!-- Panda Ears -->
  <circle cx="310" cy="330" r="38" fill="#1e293b"/>
  <circle cx="490" cy="330" r="38" fill="#1e293b"/>
  <!-- Steampunk Goggles -->
  <rect x="315" y="360" width="170" height="42" rx="16" fill="#854d0e"/>
  <circle cx="355" cy="380" r="28" fill="url(#goldBrass)"/>
  <circle cx="355" cy="380" r="20" fill="#38bdf8"/>
  <circle cx="445" cy="380" r="28" fill="url(#goldBrass)"/>
  <circle cx="445" cy="380" r="20" fill="#38bdf8"/>
  <!-- Eye Patches & Eyes -->
  <ellipse cx="360" cy="405" rx="20" ry="16" fill="#1e293b" opacity="0.25"/>
  <ellipse cx="440" cy="405" rx="20" ry="16" fill="#1e293b" opacity="0.25"/>
  <!-- Cute Snout & Smile -->
  <ellipse cx="400" cy="430" rx="24" ry="18" fill="#f1f5f9"/>
  <path d="M392,425 Q400,420 408,425 Q400,435 392,425" fill="#0f172a"/>
  <path d="M394,435 Q400,442 406,435" stroke="#0f172a" stroke-width="3" fill="none"/>
  <!-- Aviator Pilot Scarf blowing in wind -->
  <path d="M420,490 Q540,480 620,430 Q580,510 440,515 Z" fill="#ef4444"/>
  <!-- Brass Spyglass in Hand -->
  <rect x="500" y="520" width="140" height="28" rx="8" transform="rotate(-25 500 520)" fill="url(#goldBrass)"/>
  <circle cx="620" cy="460" r="18" fill="#38bdf8" stroke="url(#goldBrass)" stroke-width="4"/>
</svg>
`);

// Stage 6: 은하계 우주비행사 토끼
const stage6Svg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <radialGradient id="spaceGlow" cx="0.5" cy="0.5" r="0.8">
      <stop offset="0%" stop-color="#4c1d95"/>
      <stop offset="50%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#090514"/>
    </radialGradient>
    <radialGradient id="earthGlow" cx="0.4" cy="0.4" r="0.6">
      <stop offset="0%" stop-color="#67e8f9"/>
      <stop offset="60%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </radialGradient>
    <radialGradient id="helmetVisor" cx="0.35" cy="0.3" r="0.7">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="50%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#78350f"/>
    </radialGradient>
  </defs>
  <!-- Background: Deep Space & Stars -->
  <rect width="800" height="800" fill="url(#spaceGlow)"/>
  <!-- Nebula Clouds -->
  <circle cx="200" cy="180" r="160" fill="#ec4899" opacity="0.25" filter="blur(20px)"/>
  <circle cx="650" cy="550" r="180" fill="#8b5cf6" opacity="0.3" filter="blur(25px)"/>
  <!-- Giant Earth in Background -->
  <circle cx="650" cy="220" r="150" fill="url(#earthGlow)"/>
  <path d="M570,180 Q620,150 670,190 T730,240 T650,290 T560,240 Z" fill="#10b981" opacity="0.7"/>
  <path d="M640,280 Q690,260 740,310 T690,360 Z" fill="#10b981" opacity="0.6"/>
  <!-- Space Station Solar Array -->
  <rect x="40" y="480" width="220" height="70" fill="#1e3a8a" stroke="#60a5fa" stroke-width="3" rx="6"/>
  <line x1="95" y1="480" x2="95" y2="550" stroke="#60a5fa" stroke-width="2"/>
  <line x1="150" y1="480" x2="150" y2="550" stroke="#60a5fa" stroke-width="2"/>
  <line x1="205" y1="480" x2="205" y2="550" stroke="#60a5fa" stroke-width="2"/>
  <!-- Floating Star Twinkles -->
  <circle cx="120" cy="100" r="3" fill="#ffffff"/>
  <circle cx="340" cy="80" r="4" fill="#fef08a"/>
  <circle cx="480" cy="160" r="3" fill="#ffffff"/>
  <circle cx="180" cy="320" r="2.5" fill="#fef08a"/>
  <circle cx="720" cy="420" r="3" fill="#ffffff"/>
  <circle cx="280" cy="620" r="4" fill="#ffffff"/>
  <!-- Rabbit Astronaut -->
  <!-- Space Suit Torso -->
  <path d="M290,560 Q400,520 510,560 L540,800 L260,800 Z" fill="#f8fafc"/>
  <!-- Chest Controller & Badges -->
  <rect x="360" y="600" width="80" height="60" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>
  <circle cx="380" cy="620" r="6" fill="#ef4444"/>
  <circle cx="400" cy="620" r="6" fill="#10b981"/>
  <circle cx="420" cy="620" r="6" fill="#3b82f6"/>
  <!-- Long Astronaut Rabbit Ears poking into bubble helmets -->
  <path d="M330,300 Q300,120 340,90 Q370,120 365,300 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="4"/>
  <path d="M340,260 Q325,140 342,120 Q358,140 355,260 Z" fill="#f43f5e" opacity="0.5"/>
  <path d="M470,300 Q435,120 460,90 Q500,120 475,300 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="4"/>
  <path d="M460,260 Q445,140 458,120 Q485,140 465,260 Z" fill="#f43f5e" opacity="0.5"/>
  <!-- Bubble Helmet -->
  <circle cx="400" cy="400" r="130" fill="url(#helmetVisor)" stroke="#94a3b8" stroke-width="8"/>
  <!-- Helmet Golden Visor Reflection -->
  <ellipse cx="400" cy="400" rx="110" ry="90" fill="url(#helmetVisor)"/>
  <ellipse cx="360" cy="360" rx="45" ry="25" fill="#ffffff" opacity="0.45" transform="rotate(-20 360 360)"/>
  <!-- Floating Carrot in zero gravity -->
  <polygon points="560,420 630,390 600,450" fill="#f97316"/>
  <path d="M620,400 Q650,380 670,370 M625,410 Q660,410 680,415" stroke="#22c55e" stroke-width="4"/>
</svg>
`);

// Stage 7: 마법 도서관의 현자 부엉이
const stage7Svg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <radialGradient id="libraryLight" cx="0.5" cy="0.4" r="0.7">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="40%" stop-color="#ca8a04"/>
      <stop offset="70%" stop-color="#451a03"/>
      <stop offset="100%" stop-color="#1c1917"/>
    </radialGradient>
  </defs>
  <!-- Background: Ancient Grand Archive -->
  <rect width="800" height="800" fill="url(#libraryLight)"/>
  <!-- Arched Gothic Windows & Stained Glass -->
  <path d="M300,50 Q400,0 500,50 L500,280 L300,280 Z" fill="#1e1b4b" stroke="#78350f" stroke-width="8"/>
  <line x1="400" y1="20" x2="400" y2="280" stroke="#ca8a04" stroke-width="4"/>
  <line x1="300" y1="140" x2="500" y2="140" stroke="#ca8a04" stroke-width="4"/>
  <!-- Endless Bookshelves left & right -->
  <rect x="0" y="80" width="220" height="720" fill="#292524"/>
  <rect x="580" y="80" width="220" height="720" fill="#292524"/>
  <!-- Colorful Book Spines -->
  <g fill="#b91c1c">
    <rect x="20" y="160" width="180" height="24"/>
    <rect x="20" y="300" width="180" height="24"/>
    <rect x="600" y="240" width="180" height="24"/>
  </g>
  <g fill="#1d4ed8">
    <rect x="20" y="230" width="180" height="24"/>
    <rect x="600" y="160" width="180" height="24"/>
    <rect x="600" y="380" width="180" height="24"/>
  </g>
  <g fill="#047857">
    <rect x="20" y="370" width="180" height="24"/>
    <rect x="600" y="310" width="180" height="24"/>
  </g>
  <!-- Floating Glowing Magic Spellbooks -->
  <g transform="translate(160, 260) rotate(-15)">
    <polygon points="0,0 50,-20 100,0 50,20" fill="#3b82f6"/>
    <polygon points="0,0 50,-20 50,15 0,35" fill="#fef08a"/>
    <polygon points="50,-20 100,0 100,35 50,15" fill="#fef08a"/>
    <circle cx="50" cy="0" r="30" fill="#60a5fa" opacity="0.3" filter="blur(8px)"/>
  </g>
  <g transform="translate(560, 240) rotate(18)">
    <polygon points="0,0 50,-20 100,0 50,20" fill="#ec4899"/>
    <polygon points="0,0 50,-20 50,15 0,35" fill="#fef08a"/>
    <circle cx="50" cy="0" r="30" fill="#f472b6" opacity="0.3" filter="blur(8px)"/>
  </g>
  <!-- Golden Glowing Lantern Hanging -->
  <line x1="400" y1="0" x2="400" y2="180" stroke="#ca8a04" stroke-width="4"/>
  <circle cx="400" cy="200" r="35" fill="#fef08a" opacity="0.8"/>
  <circle cx="400" cy="200" r="80" fill="#facc15" opacity="0.25" filter="blur(15px)"/>
  <!-- Center Desk & Giant Ancient Tome -->
  <path d="M180,620 L620,620 L700,800 L100,800 Z" fill="#451a03"/>
  <rect x="250" y="660" width="300" height="120" rx="8" fill="#78350f"/>
  <rect x="260" y="670" width="130" height="100" fill="#fef9c3"/>
  <rect x="410" y="670" width="130" height="100" fill="#fef9c3"/>
  <!-- Scholar Owl Character -->
  <!-- Body/Feathers/Robe -->
  <ellipse cx="400" cy="500" rx="130" ry="140" fill="#57361a"/>
  <!-- Blue Scholar Robe -->
  <path d="M300,500 Q400,460 500,500 L520,640 L280,640 Z" fill="#1e3a8a"/>
  <!-- Feathered Head & Horn Tuffs -->
  <circle cx="400" cy="400" r="95" fill="#78350f"/>
  <polygon points="310,360 340,310 360,360" fill="#57361a"/>
  <polygon points="490,360 460,310 440,360" fill="#57361a"/>
  <!-- Owl Face Mask -->
  <circle cx="355" cy="400" r="42" fill="#fed7aa"/>
  <circle cx="445" cy="400" r="42" fill="#fed7aa"/>
  <!-- Golden Spectacles/Glasses -->
  <circle cx="355" cy="400" r="32" fill="none" stroke="#facc15" stroke-width="6"/>
  <circle cx="445" cy="400" r="32" fill="none" stroke="#facc15" stroke-width="6"/>
  <line x1="387" y1="400" x2="413" y2="400" stroke="#facc15" stroke-width="6"/>
  <!-- Glowing Amber Owl Eyes -->
  <circle cx="355" cy="400" r="22" fill="#ea580c"/>
  <circle cx="355" cy="400" r="12" fill="#0f172a"/>
  <circle cx="350" cy="395" r="5" fill="#ffffff"/>
  <circle cx="445" cy="400" r="22" fill="#ea580c"/>
  <circle cx="445" cy="400" r="12" fill="#0f172a"/>
  <circle cx="440" cy="395" r="5" fill="#ffffff"/>
  <!-- Beak -->
  <polygon points="392,425 408,425 400,450" fill="#d97706"/>
  <!-- Mortarboard Academic Hat -->
  <polygon points="400,270 480,310 400,340 320,310" fill="#0f172a"/>
  <rect x="360" y="325" width="80" height="25" fill="#0f172a"/>
  <circle cx="400" cy="305" r="6" fill="#facc15"/>
  <line x1="400" y1="305" x2="460" y2="340" stroke="#facc15" stroke-width="4"/>
  <!-- Quill Pen in Wing -->
  <path d="M510,480 Q560,430 580,380" stroke="#ffffff" stroke-width="6" fill="none"/>
</svg>
`);

// Stage 8: 크리스탈 계곡의 드래곤 라이더
const stage8Svg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="crystalSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#312e81"/>
      <stop offset="100%" stop-color="#065f46"/>
    </linearGradient>
    <linearGradient id="crystalGlow1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#a7f3d0"/>
      <stop offset="50%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
    <linearGradient id="crystalGlow2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#c4b5fd"/>
      <stop offset="50%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#5b21b6"/>
    </linearGradient>
  </defs>
  <!-- Background: Deep Cavern & Starry Mist -->
  <rect width="800" height="800" fill="url(#crystalSky)"/>
  <!-- Mountain Peaks & Stalactites -->
  <polygon points="0,0 120,240 240,0" fill="#1e1b4b"/>
  <polygon points="560,0 680,260 800,0" fill="#1e1b4b"/>
  <polygon points="280,0 360,180 440,0" fill="#0f172a"/>
  <!-- Glowing Giant Crystal Clusters -->
  <polygon points="60,780 100,480 140,780" fill="url(#crystalGlow1)"/>
  <polygon points="120,780 160,540 200,780" fill="url(#crystalGlow2)"/>
  <polygon points="620,780 660,460 700,780" fill="url(#crystalGlow1)"/>
  <polygon points="680,780 730,520 780,780" fill="url(#crystalGlow2)"/>
  <circle cx="100" cy="500" r="40" fill="#34d399" opacity="0.4" filter="blur(15px)"/>
  <circle cx="660" cy="480" r="40" fill="#a78bfa" opacity="0.4" filter="blur(15px)"/>
  <!-- Dragon Companion (Friendly Guardian Dragon) -->
  <path d="M180,600 Q260,340 460,420 Q600,480 650,620 Z" fill="#065f46"/>
  <!-- Dragon Wings Spread in Background -->
  <path d="M260,440 Q140,300 80,180 Q240,240 320,380 Z" fill="#047857" opacity="0.8"/>
  <path d="M520,440 Q660,300 740,180 Q600,240 480,380 Z" fill="#047857" opacity="0.8"/>
  <!-- Dragon Head with Horns -->
  <polygon points="280,380 230,280 320,330" fill="#fbbf24"/>
  <polygon points="320,380 300,270 350,330" fill="#f59e0b"/>
  <ellipse cx="270" cy="400" rx="60" ry="40" fill="#10b981"/>
  <circle cx="260" cy="390" r="10" fill="#fbbf24"/>
  <circle cx="260" cy="390" r="5" fill="#0f172a"/>
  <!-- Dragon Scale Glows -->
  <circle cx="340" cy="480" r="16" fill="#34d399" opacity="0.6"/>
  <circle cx="420" cy="500" r="20" fill="#34d399" opacity="0.6"/>
  <!-- Hero Dragon Rider Knight Character -->
  <!-- Cape blowing -->
  <path d="M380,420 Q480,360 560,410 Q500,560 410,540 Z" fill="#8b5cf6"/>
  <!-- Armor Torso -->
  <ellipse cx="440" cy="440" rx="45" ry="55" fill="#cbd5e1" stroke="#475569" stroke-width="4"/>
  <!-- Knight Helmet with Plume -->
  <circle cx="440" cy="340" r="40" fill="#e2e8f0" stroke="#475569" stroke-width="4"/>
  <path d="M420,345 L460,345" stroke="#0f172a" stroke-width="6"/>
  <!-- Radiant Violet Plume -->
  <path d="M440,300 Q480,240 540,260 Q490,320 440,310 Z" fill="#c084fc"/>
  <!-- Legendary Glowing Crystal Lance -->
  <line x1="380" y1="560" x2="520" y2="200" stroke="#f8fafc" stroke-width="6"/>
  <polygon points="520,200 550,150 510,180" fill="#a7f3d0"/>
  <circle cx="530" cy="180" r="25" fill="#6ee7b7" opacity="0.7" filter="blur(8px)"/>
</svg>
`);

// Stage 9: 황혼 오아시스의 유목민 전사
const stage9Svg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="twilightDesert" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#311042"/>
      <stop offset="40%" stop-color="#9333ea"/>
      <stop offset="70%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#fef08a"/>
    </linearGradient>
    <linearGradient id="duneGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ea580c"/>
      <stop offset="60%" stop-color="#9a3412"/>
      <stop offset="100%" stop-color="#451a03"/>
    </linearGradient>
  </defs>
  <!-- Background: Twilight Desert Sunset -->
  <rect width="800" height="800" fill="url(#twilightDesert)"/>
  <!-- Crescent Moon & Evening Star -->
  <path d="M680,140 A45,45 0 1 0 710,195 A35,35 0 1 1 680,140 Z" fill="#fef08a"/>
  <circle cx="610" cy="120" r="4" fill="#ffffff"/>
  <circle cx="540" cy="80" r="3" fill="#ffffff"/>
  <!-- Ancient Distant Pyramids -->
  <polygon points="120,440 240,320 360,440" fill="#78350f" opacity="0.7"/>
  <polygon points="280,440 370,350 460,440" fill="#57361a" opacity="0.6"/>
  <!-- Rolling Desert Sand Dunes -->
  <path d="M-50,560 Q200,460 450,540 T850,500 L850,800 L-50,800 Z" fill="url(#duneGrad)"/>
  <!-- Palm Oasis & Mirrored Water Basin -->
  <ellipse cx="600" cy="680" rx="160" ry="60" fill="#0284c7"/>
  <ellipse cx="600" cy="680" rx="140" ry="45" fill="#38bdf8" opacity="0.7"/>
  <!-- Palm Trees -->
  <path d="M680,680 Q720,540 700,440" stroke="#78350f" stroke-width="12" fill="none"/>
  <!-- Palm Fronds -->
  <path d="M700,440 Q620,400 580,430 M700,440 Q760,390 820,410 M700,440 Q700,360 720,330" stroke="#15803d" stroke-width="8" fill="none"/>
  <!-- Desert Nomad Warrior Character (Cheetah / Sand Nomad) -->
  <!-- Camel silhouette in distance -->
  <circle cx="160" cy="510" r="16" fill="#451a03"/>
  <ellipse cx="190" cy="525" rx="30" ry="18" fill="#451a03"/>
  <!-- Nomad Body with Flowing Silk Desert Cloak -->
  <path d="M300,540 Q400,490 500,540 L530,780 L270,780 Z" fill="#b45309"/>
  <!-- Azure & Gold Sash -->
  <path d="M320,620 L480,620 L460,650 L340,650 Z" fill="#0284c7"/>
  <!-- Nomad Headwrap / Shemagh -->
  <circle cx="400" cy="420" r="85" fill="#d97706"/>
  <!-- Mysterious Mask & Sharp Focused Eyes -->
  <rect x="330" y="390" width="140" height="35" rx="10" fill="#451a03"/>
  <circle cx="365" cy="405" r="8" fill="#facc15"/>
  <circle cx="435" cy="405" r="8" fill="#facc15"/>
  <!-- Desert Scimitar Sword on Back with Jeweled Pommel -->
  <path d="M480,400 Q560,460 590,560" stroke="#e2e8f0" stroke-width="10" fill="none"/>
  <circle cx="480" cy="400" r="14" fill="#f59e0b"/>
  <!-- Flowing Turban Tails blowing across twilight wind -->
  <path d="M330,420 Q240,410 180,450 Q230,480 320,460 Z" fill="#d97706"/>
</svg>
`);

// Stage 10: 눈꽃 궁전의 얼음 정령 여왕
const stage10Svg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="auroraSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#022c22"/>
      <stop offset="40%" stop-color="#064e3b"/>
      <stop offset="70%" stop-color="#0e7490"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="iceCrown" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e0f2fe"/>
      <stop offset="50%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
  <!-- Background: Arctic Aurora Borealis -->
  <rect width="800" height="800" fill="url(#auroraSky)"/>
  <!-- Aurora Waves -->
  <path d="M-50,220 Q200,80 400,200 T850,150 L850,340 L-50,340 Z" fill="#34d399" opacity="0.35" filter="blur(20px)"/>
  <path d="M-50,280 Q250,160 550,260 T850,220 L850,400 L-50,400 Z" fill="#38bdf8" opacity="0.35" filter="blur(25px)"/>
  <!-- Grand Ice Palace Spires in Background -->
  <polygon points="360,420 400,160 440,420" fill="#bae6fd" opacity="0.8"/>
  <polygon points="260,460 290,240 320,460" fill="#7dd3fc" opacity="0.7"/>
  <polygon points="480,460 510,240 540,460" fill="#7dd3fc" opacity="0.7"/>
  <polygon points="180,500 200,320 220,500" fill="#38bdf8" opacity="0.6"/>
  <polygon points="580,500 600,320 620,500" fill="#38bdf8" opacity="0.6"/>
  <!-- Crystalline Ice Floor & Glaciers -->
  <path d="M-20,620 L820,600 L820,800 L-20,800 Z" fill="#0f172a"/>
  <polygon points="40,620 180,560 300,620" fill="#e0f2fe" opacity="0.8"/>
  <polygon points="500,620 640,550 760,620" fill="#e0f2fe" opacity="0.8"/>
  <!-- Floating Snowflakes -->
  <circle cx="140" cy="160" r="5" fill="#ffffff" opacity="0.9"/>
  <circle cx="280" cy="110" r="6" fill="#e0f2fe" opacity="0.8"/>
  <circle cx="680" cy="200" r="5" fill="#ffffff" opacity="0.9"/>
  <circle cx="720" cy="100" r="7" fill="#e0f2fe" opacity="0.8"/>
  <!-- Frost Spirit Queen Character -->
  <!-- Translucent Ice Wings -->
  <path d="M380,440 Q180,300 120,180 Q280,260 380,380 Z" fill="#bae6fd" opacity="0.5"/>
  <path d="M420,440 Q620,300 680,180 Q520,260 420,380 Z" fill="#bae6fd" opacity="0.5"/>
  <!-- Flowing Winter Gown -->
  <path d="M320,520 Q400,480 480,520 L540,800 L260,800 Z" fill="#e0f2fe"/>
  <path d="M360,540 L440,540 L420,800 L380,800 Z" fill="#38bdf8" opacity="0.4"/>
  <!-- Queen's Head & Face -->
  <circle cx="400" cy="380" r="80" fill="#f8fafc"/>
  <!-- Long Flowing Platinum/Ice Blue Hair -->
  <path d="M330,340 Q300,480 260,600" stroke="#bae6fd" stroke-width="24" fill="none"/>
  <path d="M470,340 Q500,480 540,600" stroke="#bae6fd" stroke-width="24" fill="none"/>
  <!-- Ice Crystal Crown -->
  <polygon points="340,330 360,260 380,320 400,230 420,320 440,260 460,330" fill="url(#iceCrown)"/>
  <!-- Beautiful Sapphire Eyes -->
  <ellipse cx="370" cy="385" rx="14" ry="10" fill="#0284c7"/>
  <circle cx="370" cy="385" r="5" fill="#ffffff"/>
  <ellipse cx="430" cy="385" rx="14" ry="10" fill="#0284c7"/>
  <circle cx="430" cy="385" r="5" fill="#ffffff"/>
  <!-- Soft Smile -->
  <path d="M392,415 Q400,422 408,415" stroke="#38bdf8" stroke-width="3" fill="none"/>
  <!-- Magic Ice Scepter with Giant Floating Snowflake -->
  <line x1="520" y1="620" x2="520" y2="340" stroke="#bae6fd" stroke-width="8"/>
  <circle cx="520" cy="320" r="30" fill="#38bdf8" opacity="0.8"/>
  <circle cx="520" cy="320" r="60" fill="#7dd3fc" opacity="0.3" filter="blur(10px)"/>
</svg>
`);

export const STAGES: Stage[] = [
  {
    id: 1,
    title: '달빛 숲의 엘프 마법사',
    character: '엘프 마도사 실피아 (Sylphia)',
    location: '세계수의 은밀한 성소',
    description: '반짝이는 요정 버섯과 신비로운 고대 숲속에서 달빛 마법의 구체를 소환하는 은발의 엘프 마법사입니다.',
    imageUrl: elfImg,
    tags: ['판타지', '엘프', '신비의 숲', '마법'],
    themeColor: '#10b981',
  },
  {
    id: 2,
    title: '네온 시티의 사이버 캣 해커',
    character: '천재 넷러너 사이버캣 (Byte)',
    location: '네오 교토 고층 루프탑',
    description: '화려한 홀로그램 간판과 날아다니는 미래 비행선이 가득한 빗속 사이버펑크 도시에서 데이터를 해킹하는 고양이 요원입니다.',
    imageUrl: cyberCatImg,
    tags: ['사이버펑크', '고양이', '네온', 'SF'],
    themeColor: '#a855f7',
  },
  {
    id: 3,
    title: '심해 산호초의 인어 수호자',
    character: '산호의 인어 공주 코랄리아 (Coralia)',
    location: '침몰한 아틀란티스 대리석 신전',
    description: '영롱한 산호와 빛나는 해파리, 열대어 무리 사이를 유영하며 가라앉은 고대 왕국의 평화를 지키는 인어 수호자입니다.',
    imageUrl: mermaidImg,
    tags: ['심해', '인어', '수중 궁전', '산호초'],
    themeColor: '#06b6d4',
  },
  {
    id: 4,
    title: '벚꽃 신사의 여우 무사',
    character: '검객 붉은여우 렌 (Ren)',
    location: '황혼의 천년 신사 토리이',
    description: '만개한 벚꽃 잎이 황혼 노을빛에 흩날리는 신사 입구에서 칼을 정비하며 마음을 다스리는 의리의 무사 여우입니다.',
    imageUrl: foxSamuraiImg,
    tags: ['동양풍', '여우 검객', '벚꽃', '황혼'],
    themeColor: '#f43f5e',
  },
  {
    id: 5,
    title: '천공 비행선의 판다 탐험가',
    character: '선장 보보 (Captain Bobo)',
    location: '떠다니는 부유섬 군락',
    description: '황동 나침반과 고글을 착용하고 거대한 증기 비행선을 조종하여 미지의 천공 세계를 탐험하는 용감한 판다입니다.',
    imageUrl: stage5Svg,
    tags: ['스팀펑크', '판다', '천공 비행선', '탐험'],
    themeColor: '#f59e0b',
  },
  {
    id: 6,
    title: '은하계의 우주비행사 토끼',
    character: '천문학자 버니 (Astro Bunny)',
    location: '궤도 우주 정거장 외벽',
    description: '신비로운 성운과 반짝이는 별들, 푸른 지구가 내려다보이는 무중력 우주 공간에서 호기심 가득한 우주복 토끼입니다.',
    imageUrl: stage6Svg,
    tags: ['우주', '토끼', '지구', '성운'],
    themeColor: '#8b5cf6',
  },
  {
    id: 7,
    title: '마법 도서관의 현자 부엉이',
    character: '대도서관장 아르키메데스 (Archimedes)',
    location: '고대 마법 아카이브 대강당',
    description: '공중에 떠다니는 신비한 마법서들과 수만 권의 고서가 가득한 서재에서 진리를 탐구하는 근엄한 학자 부엉이입니다.',
    imageUrl: stage7Svg,
    tags: ['마법 학당', '부엉이', '도서관', '고서'],
    themeColor: '#eab308',
  },
  {
    id: 8,
    title: '크리스탈 계곡의 드래곤 라이더',
    character: '용기사 아스타 (Knight Asta)',
    location: '발광 수정 동굴 협곡',
    description: '에메랄드와 자수정 수정체가 눈부시게 빛나는 계곡에서 충직한 수호룡과 함께 계곡의 평화를 지키는 용맹한 기사입니다.',
    imageUrl: stage8Svg,
    tags: ['드래곤', '기사', '수정 동굴', '모험'],
    themeColor: '#10b981',
  },
  {
    id: 9,
    title: '황혼 오아시스의 유목민 전사',
    character: '모래바람의 칼날 타리크 (Tariq)',
    location: '저녁노을의 사막 오아시스',
    description: '달과 저녁별이 떠오르는 황혼빛 사막의 오아시스 샘터에서 모래바람을 가르며 사막을 수호하는 유목민 전사입니다.',
    imageUrl: stage9Svg,
    tags: ['사막', '오아시스', '황혼', '전사'],
    themeColor: '#f97316',
  },
  {
    id: 10,
    title: '눈꽃 궁전의 얼음 정령 여왕',
    character: '설원의 군주 루미나 (Queen Lumina)',
    location: '오로라 눈꽃 빙하 궁전',
    description: '북극의 오로라가 밤하늘을 수놓고 투명한 얼음 첨탑이 솟아있는 궁전에서 눈꽃 지팡이로 겨울을 다스리는 얼음 정령 여왕입니다.',
    imageUrl: stage10Svg,
    tags: ['겨울', '눈꽃 여왕', '오로라', '빙하 궁전'],
    themeColor: '#38bdf8',
  },
];
