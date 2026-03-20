require("dotenv").config();
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SIZE = 500;

async function main() {
  const outputDir = path.join(__dirname, "..", "output", "hidden");
  fs.mkdirSync(outputDir, { recursive: true });

  // 미스터리 박스 이미지 생성
  const svg = `
    <svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
      <!-- 배경 그라데이션 -->
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e"/>
          <stop offset="100%" style="stop-color:#16213e"/>
        </linearGradient>
        <linearGradient id="box" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#e94560"/>
          <stop offset="100%" style="stop-color:#533483"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- 배경 -->
      <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>

      <!-- 별들 -->
      <circle cx="50" cy="80" r="2" fill="white" opacity="0.8"/>
      <circle cx="150" cy="40" r="1.5" fill="white" opacity="0.6"/>
      <circle cx="420" cy="100" r="2" fill="white" opacity="0.7"/>
      <circle cx="380" cy="50" r="1" fill="white" opacity="0.5"/>
      <circle cx="80" cy="450" r="1.5" fill="white" opacity="0.6"/>
      <circle cx="450" cy="400" r="2" fill="white" opacity="0.8"/>
      <circle cx="100" cy="200" r="1" fill="white" opacity="0.4"/>
      <circle cx="400" cy="300" r="1.5" fill="white" opacity="0.5"/>

      <!-- 박스 -->
      <rect x="130" y="180" width="252" height="200" rx="20" fill="url(#box)" filter="url(#glow)"/>

      <!-- 박스 윗면 (3D 효과) -->
      <polygon points="130,180 256,130 382,180 256,230" fill="#f39c12" opacity="0.3"/>

      <!-- 리본 세로 -->
      <rect x="241" y="180" width="30" height="200" fill="#f1c40f"/>

      <!-- 리본 가로 -->
      <rect x="130" y="265" width="252" height="30" fill="#f1c40f"/>

      <!-- 리본 매듭 -->
      <circle cx="256" cy="280" r="25" fill="#f39c12"/>

      <!-- 물음표 -->
      <text x="256" y="450" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="white" text-anchor="middle" filter="url(#glow)">?</text>

      <!-- 텍스트 -->
      <text x="256" y="490" font-family="Arial, sans-serif" font-size="16" fill="#aaa" text-anchor="middle">COMING SOON</text>
    </svg>
  `;

  // 이미지 저장
  const imagePath = path.join(outputDir, "hidden.png");
  await sharp(Buffer.from(svg)).png().toFile(imagePath);
  console.log("이미지 생성:", imagePath);

  // 메타데이터 생성
  const imageUri =
    process.env.UNREVEALED_IMAGE_URI || "https://YOUR_HIDDEN_CID/hidden.png";
  const metadata = {
    name: "Mystery Box",
    description: "This NFT has not been revealed yet. Stay tuned!",
    image: imageUri,
    attributes: [
      {
        trait_type: "Status",
        value: "Unrevealed",
      },
    ],
  };

  const metadataPath = path.join(outputDir, "hidden.json");
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log("메타데이터 생성:", metadataPath);

  console.log("\n=== 완료 ===");
  console.log("위치:", outputDir);
  console.log("\n다음 단계:");
  console.log("1. hidden.png와 hidden.json을 S3에 업로드");
  console.log("2. .env의 UNREVEALED_URI를 업데이트");
}

main().catch(console.error);
