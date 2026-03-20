const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SIZE = 512;
const layersDir = path.join(__dirname, "..", "layers");

// 배경 색상
const backgrounds = {
  blue: "#87CEEB",
  red: "#FFB6C1",
  green: "#98FB98",
  purple: "#DDA0DD",
  gold: "#FFD700",
};

// 피부색
const skinColors = {
  happy: "#FFDAB9",
  sad: "#FFDAB9",
  angry: "#FFB6A0",
  surprised: "#FFDAB9",
  cool: "#D2B48C",
};

// 옷 색상
const clothesColors = {
  tshirt: "#FF6B6B",
  hoodie: "#4ECDC4",
  suit: "#2C3E50",
  armor: "#95A5A6",
};

// 도구 색상
const toolColors = {
  none: "transparent",
  sword: "#7F8C8D",
  wand: "#9B59B6",
  shield: "#E67E22",
  legendary: "#F1C40F",
};

// 배경 생성
async function createBackground(color, outputPath) {
  await sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 4,
      background: color,
    },
  })
    .png()
    .toFile(outputPath);
}

// 얼굴 생성 (표정별)
async function createFace(name, skinColor, outputPath) {
  let eyeLeft, eyeRight, mouth;

  const baseX = SIZE / 2;
  const baseY = SIZE / 3;

  switch (name) {
    case "happy":
      eyeLeft = `<ellipse cx="${baseX - 40}" cy="${baseY - 10}" rx="12" ry="16" fill="#333"/>`;
      eyeRight = `<ellipse cx="${baseX + 40}" cy="${baseY - 10}" rx="12" ry="16" fill="#333"/>`;
      mouth = `<path d="M ${baseX - 50} ${baseY + 40} Q ${baseX} ${baseY + 80} ${baseX + 50} ${baseY + 40}" stroke="#333" stroke-width="6" fill="none"/>`;
      break;
    case "sad":
      eyeLeft = `<ellipse cx="${baseX - 40}" cy="${baseY - 10}" rx="12" ry="16" fill="#333"/>`;
      eyeRight = `<ellipse cx="${baseX + 40}" cy="${baseY - 10}" rx="12" ry="16" fill="#333"/>`;
      mouth = `<path d="M ${baseX - 40} ${baseY + 60} Q ${baseX} ${baseY + 30} ${baseX + 40} ${baseY + 60}" stroke="#333" stroke-width="6" fill="none"/>`;
      // 눈물
      eyeLeft += `<ellipse cx="${baseX - 35}" cy="${baseY + 15}" rx="6" ry="10" fill="#87CEEB"/>`;
      break;
    case "angry":
      eyeLeft = `<ellipse cx="${baseX - 40}" cy="${baseY - 10}" rx="12" ry="14" fill="#333"/>`;
      eyeRight = `<ellipse cx="${baseX + 40}" cy="${baseY - 10}" rx="12" ry="14" fill="#333"/>`;
      // 찌푸린 눈썹
      eyeLeft += `<line x1="${baseX - 60}" y1="${baseY - 35}" x2="${baseX - 20}" y2="${baseY - 25}" stroke="#333" stroke-width="6"/>`;
      eyeRight += `<line x1="${baseX + 20}" y1="${baseY - 25}" x2="${baseX + 60}" y2="${baseY - 35}" stroke="#333" stroke-width="6"/>`;
      mouth = `<line x1="${baseX - 35}" y1="${baseY + 50}" x2="${baseX + 35}" y2="${baseY + 50}" stroke="#333" stroke-width="6"/>`;
      break;
    case "surprised":
      eyeLeft = `<circle cx="${baseX - 40}" cy="${baseY - 10}" r="18" fill="#333"/>`;
      eyeRight = `<circle cx="${baseX + 40}" cy="${baseY - 10}" r="18" fill="#333"/>`;
      mouth = `<ellipse cx="${baseX}" cy="${baseY + 50}" rx="25" ry="30" fill="#333"/>`;
      break;
    case "cool":
      // 선글라스
      eyeLeft = `<rect x="${baseX - 65}" y="${baseY - 30}" width="50" height="35" rx="5" fill="#111"/>`;
      eyeRight = `<rect x="${baseX + 15}" y="${baseY - 30}" width="50" height="35" rx="5" fill="#111"/>`;
      eyeLeft += `<line x1="${baseX - 15}" y1="${baseY - 12}" x2="${baseX + 15}" y2="${baseY - 12}" stroke="#111" stroke-width="4"/>`;
      mouth = `<path d="M ${baseX - 30} ${baseY + 45} Q ${baseX} ${baseY + 60} ${baseX + 30} ${baseY + 45}" stroke="#333" stroke-width="5" fill="none"/>`;
      break;
  }

  const svg = `
    <svg width="${SIZE}" height="${SIZE}">
      <!-- 얼굴 -->
      <ellipse cx="${baseX}" cy="${baseY}" rx="100" ry="110" fill="${skinColor}"/>
      <!-- 귀 -->
      <ellipse cx="${baseX - 100}" cy="${baseY}" rx="20" ry="30" fill="${skinColor}"/>
      <ellipse cx="${baseX + 100}" cy="${baseY}" rx="20" ry="30" fill="${skinColor}"/>
      <!-- 볼터치 -->
      <ellipse cx="${baseX - 65}" cy="${baseY + 25}" rx="20" ry="12" fill="#FFB6C1" opacity="0.5"/>
      <ellipse cx="${baseX + 65}" cy="${baseY + 25}" rx="20" ry="12" fill="#FFB6C1" opacity="0.5"/>
      <!-- 표정 -->
      ${eyeLeft}
      ${eyeRight}
      ${mouth}
    </svg>
  `;

  await sharp(Buffer.from(svg)).png().toFile(outputPath);
}

// 옷 생성
async function createClothes(name, color, outputPath) {
  const baseX = SIZE / 2;
  const baseY = SIZE / 2 + 80;

  let clothesSvg;

  switch (name) {
    case "tshirt":
      clothesSvg = `
        <!-- 목 -->
        <rect x="${baseX - 30}" y="${baseY - 60}" width="60" height="40" fill="#FFDAB9"/>
        <!-- 티셔츠 몸통 -->
        <path d="M ${baseX - 80} ${baseY - 20} L ${baseX - 80} ${baseY + 120} L ${baseX + 80} ${baseY + 120} L ${baseX + 80} ${baseY - 20} Q ${baseX} ${baseY - 40} ${baseX - 80} ${baseY - 20}" fill="${color}"/>
        <!-- 소매 -->
        <ellipse cx="${baseX - 95}" cy="${baseY + 10}" rx="30" ry="40" fill="${color}"/>
        <ellipse cx="${baseX + 95}" cy="${baseY + 10}" rx="30" ry="40" fill="${color}"/>
        <!-- 목 라인 -->
        <path d="M ${baseX - 30} ${baseY - 20} Q ${baseX} ${baseY} ${baseX + 30} ${baseY - 20}" stroke="#333" stroke-width="2" fill="none"/>
      `;
      break;
    case "hoodie":
      clothesSvg = `
        <!-- 목 -->
        <rect x="${baseX - 30}" y="${baseY - 60}" width="60" height="40" fill="#FFDAB9"/>
        <!-- 후드티 몸통 -->
        <path d="M ${baseX - 85} ${baseY - 25} L ${baseX - 85} ${baseY + 120} L ${baseX + 85} ${baseY + 120} L ${baseX + 85} ${baseY - 25} Q ${baseX} ${baseY - 50} ${baseX - 85} ${baseY - 25}" fill="${color}"/>
        <!-- 후드 -->
        <path d="M ${baseX - 70} ${baseY - 30} Q ${baseX - 90} ${baseY - 80} ${baseX} ${baseY - 90} Q ${baseX + 90} ${baseY - 80} ${baseX + 70} ${baseY - 30}" fill="${color}" stroke="${color}"/>
        <!-- 소매 -->
        <rect x="${baseX - 120}" y="${baseY - 10}" width="50" height="80" rx="10" fill="${color}"/>
        <rect x="${baseX + 70}" y="${baseY - 10}" width="50" height="80" rx="10" fill="${color}"/>
        <!-- 주머니 -->
        <rect x="${baseX - 50}" y="${baseY + 50}" width="100" height="40" rx="5" fill="${color}" stroke="#333" stroke-width="1" opacity="0.8"/>
      `;
      break;
    case "suit":
      clothesSvg = `
        <!-- 목 -->
        <rect x="${baseX - 30}" y="${baseY - 60}" width="60" height="40" fill="#FFDAB9"/>
        <!-- 셔츠 -->
        <rect x="${baseX - 40}" y="${baseY - 25}" width="80" height="145" fill="white"/>
        <!-- 넥타이 -->
        <polygon points="${baseX},${baseY - 20} ${baseX - 15},${baseY + 10} ${baseX},${baseY + 80} ${baseX + 15},${baseY + 10}" fill="#C0392B"/>
        <!-- 수트 재킷 -->
        <path d="M ${baseX - 90} ${baseY - 30} L ${baseX - 90} ${baseY + 120} L ${baseX - 35} ${baseY + 120} L ${baseX - 35} ${baseY - 10} Z" fill="${color}"/>
        <path d="M ${baseX + 90} ${baseY - 30} L ${baseX + 90} ${baseY + 120} L ${baseX + 35} ${baseY + 120} L ${baseX + 35} ${baseY - 10} Z" fill="${color}"/>
        <!-- 라펠 -->
        <polygon points="${baseX - 35},${baseY - 25} ${baseX - 60},${baseY + 30} ${baseX - 35},${baseY + 30}" fill="#1A252F"/>
        <polygon points="${baseX + 35},${baseY - 25} ${baseX + 60},${baseY + 30} ${baseX + 35},${baseY + 30}" fill="#1A252F"/>
      `;
      break;
    case "armor":
      clothesSvg = `
        <!-- 목 -->
        <rect x="${baseX - 30}" y="${baseY - 60}" width="60" height="40" fill="#FFDAB9"/>
        <!-- 갑옷 몸통 -->
        <path d="M ${baseX - 85} ${baseY - 30} L ${baseX - 85} ${baseY + 120} L ${baseX + 85} ${baseY + 120} L ${baseX + 85} ${baseY - 30} Q ${baseX} ${baseY - 55} ${baseX - 85} ${baseY - 30}" fill="${color}"/>
        <!-- 어깨 보호대 -->
        <ellipse cx="${baseX - 100}" cy="${baseY - 10}" rx="40" ry="30" fill="#7F8C8D"/>
        <ellipse cx="${baseX + 100}" cy="${baseY - 10}" rx="40" ry="30" fill="#7F8C8D"/>
        <!-- 가슴 장식 -->
        <ellipse cx="${baseX}" cy="${baseY + 30}" rx="40" ry="50" fill="#7F8C8D" stroke="#5D6D7E" stroke-width="3"/>
        <!-- 벨트 -->
        <rect x="${baseX - 85}" y="${baseY + 90}" width="170" height="15" fill="#8B4513"/>
        <rect x="${baseX - 15}" y="${baseY + 85}" width="30" height="25" fill="#F1C40F"/>
      `;
      break;
  }

  const svg = `<svg width="${SIZE}" height="${SIZE}">${clothesSvg}</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(outputPath);
}

// 도구 생성
async function createTool(name, color, outputPath) {
  const baseX = SIZE / 2 + 120;
  const baseY = SIZE / 2 + 50;

  let toolSvg = "";

  switch (name) {
    case "none":
      break;
    case "sword":
      toolSvg = `
        <!-- 검 -->
        <rect x="${baseX - 8}" y="${baseY - 120}" width="16" height="100" fill="${color}"/>
        <polygon points="${baseX},${baseY - 130} ${baseX - 10},${baseY - 120} ${baseX + 10},${baseY - 120}" fill="${color}"/>
        <!-- 손잡이 -->
        <rect x="${baseX - 20}" y="${baseY - 25}" width="40" height="12" fill="#8B4513"/>
        <rect x="${baseX - 6}" y="${baseY - 20}" width="12" height="40" fill="#654321"/>
      `;
      break;
    case "wand":
      toolSvg = `
        <!-- 지팡이 -->
        <rect x="${baseX - 5}" y="${baseY - 100}" width="10" height="120" fill="#8B4513" rx="3"/>
        <!-- 마법 구슬 -->
        <circle cx="${baseX}" cy="${baseY - 110}" r="20" fill="${color}"/>
        <circle cx="${baseX - 5}" cy="${baseY - 115}" r="6" fill="white" opacity="0.6"/>
        <!-- 빛나는 효과 -->
        <circle cx="${baseX}" cy="${baseY - 110}" r="28" fill="none" stroke="${color}" stroke-width="2" opacity="0.5"/>
      `;
      break;
    case "shield":
      toolSvg = `
        <!-- 방패 -->
        <ellipse cx="${baseX - 20}" cy="${baseY - 40}" rx="50" ry="70" fill="${color}"/>
        <ellipse cx="${baseX - 20}" cy="${baseY - 40}" rx="35" ry="50" fill="#D35400"/>
        <ellipse cx="${baseX - 20}" cy="${baseY - 40}" rx="15" ry="25" fill="#F39C12"/>
      `;
      break;
    case "legendary":
      toolSvg = `
        <!-- 전설의 검 -->
        <rect x="${baseX - 10}" y="${baseY - 140}" width="20" height="120" fill="${color}"/>
        <polygon points="${baseX},${baseY - 155} ${baseX - 15},${baseY - 140} ${baseX + 15},${baseY - 140}" fill="${color}"/>
        <!-- 화려한 손잡이 -->
        <rect x="${baseX - 30}" y="${baseY - 25}" width="60" height="15" fill="#9B59B6"/>
        <rect x="${baseX - 8}" y="${baseY - 15}" width="16" height="45" fill="#8E44AD"/>
        <!-- 보석 -->
        <circle cx="${baseX}" cy="${baseY - 18}" r="8" fill="#E74C3C"/>
        <!-- 빛나는 효과 -->
        <line x1="${baseX - 25}" y1="${baseY - 160}" x2="${baseX - 35}" y2="${baseY - 175}" stroke="${color}" stroke-width="3"/>
        <line x1="${baseX + 25}" y1="${baseY - 160}" x2="${baseX + 35}" y2="${baseY - 175}" stroke="${color}" stroke-width="3"/>
        <line x1="${baseX}" y1="${baseY - 155}" x2="${baseX}" y2="${baseY - 175}" stroke="${color}" stroke-width="3"/>
      `;
      break;
  }

  const svg = `<svg width="${SIZE}" height="${SIZE}">${toolSvg}</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(outputPath);
}

async function main() {
  console.log("=== 캐릭터 샘플 레이어 생성 ===\n");

  // Background
  const bgDir = path.join(layersDir, "background");
  fs.mkdirSync(bgDir, { recursive: true });
  for (const [name, color] of Object.entries(backgrounds)) {
    await createBackground(color, path.join(bgDir, `${name}.png`));
    console.log(`배경: ${name}.png`);
  }

  // Face
  const faceDir = path.join(layersDir, "face");
  fs.mkdirSync(faceDir, { recursive: true });
  for (const [name, color] of Object.entries(skinColors)) {
    await createFace(name, color, path.join(faceDir, `${name}.png`));
    console.log(`얼굴: ${name}.png`);
  }

  // Clothes
  const clothesDir = path.join(layersDir, "clothes");
  fs.mkdirSync(clothesDir, { recursive: true });
  for (const [name, color] of Object.entries(clothesColors)) {
    await createClothes(name, color, path.join(clothesDir, `${name}.png`));
    console.log(`옷: ${name}.png`);
  }

  // Tools
  const toolsDir = path.join(layersDir, "tools");
  fs.mkdirSync(toolsDir, { recursive: true });
  for (const [name, color] of Object.entries(toolColors)) {
    await createTool(name, color, path.join(toolsDir, `${name}.png`));
    console.log(`도구: ${name}.png`);
  }

  console.log("\n=== 완료 ===");
  console.log(`위치: ${layersDir}`);
}

main().catch(console.error);
