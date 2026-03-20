const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;

  if (!CONTRACT_ADDRESS) {
    console.error("Error: .env에 NFT_CONTRACT_ADDRESS를 설정해주세요");
    process.exit(1);
  }

  const [signer] = await hre.ethers.getSigners();
  console.log("민팅 계정:", signer.address);

  const RevealNFT = await hre.ethers.getContractFactory("RevealNFT");
  const nft = RevealNFT.attach(CONTRACT_ADDRESS);

  const mintTo = process.env.MINT_TO || signer.address;

  console.log("컨트랙트 주소:", CONTRACT_ADDRESS);
  console.log("민팅 대상:", mintTo);

  const supplyBefore = await nft.totalSupply();
  console.log("현재 총 발행량:", supplyBefore.toString());

  console.log("\n민팅 중...");
  const tx = await nft.mint(mintTo);
  const receipt = await tx.wait();

  console.log("트랜잭션 해시:", receipt.hash);

  const supplyAfter = await nft.totalSupply();
  console.log("민팅 완료! 새 토큰 ID:", supplyAfter.toString());
  console.log("총 발행량:", supplyAfter.toString());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
