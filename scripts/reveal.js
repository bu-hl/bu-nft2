const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
  const BASE_URI = process.env.NFT_BASE_URI;

  if (!CONTRACT_ADDRESS) {
    console.error("Error: .env에 NFT_CONTRACT_ADDRESS를 설정해주세요");
    process.exit(1);
  }

  if (!BASE_URI) {
    console.error("Error: .env에 NFT_BASE_URI를 설정해주세요");
    process.exit(1);
  }

  console.log("=== RevealNFT 리빌 ===");
  console.log("컨트랙트:", CONTRACT_ADDRESS);
  console.log("리빌 URI:", BASE_URI);

  const [signer] = await hre.ethers.getSigners();
  console.log("실행 계정:", signer.address);

  const RevealNFT = await hre.ethers.getContractFactory("RevealNFT");
  const nft = RevealNFT.attach(CONTRACT_ADDRESS);

  const isRevealed = await nft.revealed();
  if (isRevealed) {
    console.log("\n이미 리빌되었습니다!");
    process.exit(0);
  }

  console.log("\n리빌 실행 중...");
  const tx = await nft.reveal(BASE_URI);
  await tx.wait();

  console.log("리빌 완료!");
  console.log("트랜잭션:", tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
