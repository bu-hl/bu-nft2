require("dotenv").config();
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// 레이어 설정 (확률 합계가 100이 되도록)
const layerConfig = {
  background: [
    { name: "blue", weight: 30 },
    { name: "red", weight: 25 },
    { name: "green", weight: 20 },
    { name: "purple", weight: 15 },
    { name: "gold", weight: 10 }, // 레어
  ],
  face: [
    { name: "happy", weight: 35 },
    { name: "sad", weight: 25 },
    { name: "angry", weight: 20 },
    { name: "surprised", weight: 15 },
    { name: "cool", weight: 5 }, // 레어
  ],
  clothes: [
    { name: "tshirt", weight: 40 },
    { name: "hoodie", weight: 30 },
    { name: "suit", weight: 20 },
    { name: "armor", weight: 10 }, // 레어
  ],
  tools: [
    { name: "none", weight: 40 },
    { name: "sword", weight: 25 },
    { name: "wand", weight: 20 },
    { name: "shield", weight: 10 },
    { name: "legendary", weight: 5 }, // 레어
  ],
};

// 레이어 순서 (아래에서 위로)
const layerOrder = ["background", "face", "clothes", "tools"];

// 확률 기반 랜덤 선택
function selectByWeight(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of items) {
    random -= item.weight;
    if (random <= 0) {
      return item.name;
    }
  }
  return items[items.length - 1].name;
}

// 단일 NFT 속성 생성
function generateAttributes() {
  const attributes = {};
  for (const layer of layerOrder) {
    attributes[layer] = selectByWeight(layerConfig[layer]);
  }
  return attributes;
}

// 이미지 합성
async function compositeImage(attributes, tokenId, outputDir) {
  const layersDir = path.join(__dirname, "..", "layers");
  const composites = [];

  for (const layer of layerOrder) {
    const imagePath = path.join(layersDir, layer, `${attributes[layer]}.png`);

    if (fs.existsSync(imagePath)) {
      composites.push({
        input: imagePath,
        gravity: "center",
      });
    } else {
      console.warn(`이미지 없음: ${imagePath}`);
    }
  }

  if (composites.length === 0) {
    console.error("합성할 이미지가 없습니다.");
    return null;
  }

  const outputPath = path.join(outputDir, `${tokenId}.png`);

  // 첫 번째 이미지를 베이스로 사용
  const baseImage = composites.shift();
  await sharp(baseImage.input).composite(composites).toFile(outputPath);

  return outputPath;
}

// 메타데이터 생성
function generateMetadata(tokenId, attributes, imageUri) {
  return {
    name: `NFT #${tokenId}`,
    description: "Randomly generated NFT with unique traits",
    image: imageUri,
    attributes: Object.entries(attributes).map(([trait_type, value]) => ({
      trait_type: trait_type.charAt(0).toUpperCase() + trait_type.slice(1),
      value: value.charAt(0).toUpperCase() + value.slice(1),
    })),
  };
}

// 메인 실행
async function main() {
  const args = process.argv.slice(2);
  const count = parseInt(args[0]) || 1;
  const baseUri =
    args[1] || process.env.NFT_IMAGE_BASE_URI || "https://YOUR_CID/";

  // baseUri 끝에 슬래시 보장
  const normalizedBaseUri = baseUri.endsWith("/") ? baseUri : baseUri + "/";

  const outputDir = path.join(__dirname, "..", "output", "images");
  const metadataDir = path.join(__dirname, "..", "output", "metadata");

  // 출력 디렉토리 생성
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(metadataDir, { recursive: true });

  console.log(`=== ${count}개 NFT 생성 시작 ===\n`);

  const allMetadata = [];

  for (let i = 1; i <= count; i++) {
    const attributes = generateAttributes();
    console.log(`#${i} 속성:`, attributes);

    // 이미지 합성
    const imagePath = await compositeImage(attributes, i, outputDir);

    if (imagePath) {
      console.log(`#${i} 이미지 저장: ${imagePath}`);
    }

    // 메타데이터 생성
    const metadata = generateMetadata(
      i,
      attributes,
      `${normalizedBaseUri}${i}.png`,
    );
    allMetadata.push(metadata);

    // 개별 메타데이터 파일 저장
    const metadataPath = path.join(metadataDir, `${i}.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`#${i} 메타데이터 저장: ${metadataPath}\n`);
  }

  // 전체 메타데이터 저장
  const allMetadataPath = path.join(metadataDir, "_all.json");
  fs.writeFileSync(allMetadataPath, JSON.stringify(allMetadata, null, 2));

  console.log("=== 생성 완료 ===");
  console.log(`이미지: ${outputDir}`);
  console.log(`메타데이터: ${metadataDir}`);

  // 희귀도 통계 출력
  console.log("\n=== 희귀도 통계 ===");
  for (const layer of layerOrder) {
    const counts = {};
    for (const meta of allMetadata) {
      const attr = meta.attributes.find(
        (a) => a.trait_type.toLowerCase() === layer,
      );
      if (attr) {
        counts[attr.value] = (counts[attr.value] || 0) + 1;
      }
    }
    console.log(`${layer}:`, counts);
  }
}

main().catch(console.error);
