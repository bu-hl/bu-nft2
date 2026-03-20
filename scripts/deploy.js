const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("Deploying RevealNFT contract...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("배포자:", deployer.address);

  const unrevealedURI = process.env.UNREVEALED_URI;
  if (!unrevealedURI) {
    throw new Error("UNREVEALED_URI 환경변수를 설정해주세요");
  }

  console.log("Unrevealed URI:", unrevealedURI);

  const RevealNFT = await hre.ethers.getContractFactory("RevealNFT");
  const nft = await RevealNFT.deploy(unrevealedURI);
  await nft.waitForDeployment();

  const address = await nft.getAddress();
  console.log("RevealNFT 컨트랙트 주소:", address);
  console.log("\n.env 파일에 추가하세요:");
  console.log(`NFT_CONTRACT_ADDRESS=${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
