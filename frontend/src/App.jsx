import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

// 컨트랙트 ABI (필요한 함수만)
const NFT_ABI = [
  "function mint(address to) external returns (uint256)",
  "function totalSupply() external view returns (uint256)",
  "function revealed() external view returns (bool)",
  "function tokenURI(uint256 tokenId) external view returns (string)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
];

// 환경변수에서 설정 로드
const NFT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;
const RPC_URL = import.meta.env.VITE_RPC_URL;

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [totalSupply, setTotalSupply] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [allNFTs, setAllNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingNFTs, setLoadingNFTs] = useState(false);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all"); // "all" or "my"

  // 읽기 전용 provider로 초기 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      if (!RPC_URL || !NFT_ADDRESS) return;

      try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const nftContract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, provider);
        await loadContractData(nftContract, null);
      } catch (error) {
        console.error("초기 데이터 로드 실패:", error);
      }
    };

    loadInitialData();
  }, []);

  // 지갑 연결
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setMessage("MetaMask를 설치해주세요!");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const nftContract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, signer);

      setAccount(accounts[0]);
      setContract(nftContract);
      setMessage("지갑 연결 완료!");

      await loadContractData(nftContract, accounts[0]);
    } catch (error) {
      console.error(error);
      setMessage("지갑 연결 실패: " + error.message);
    }
  };

  // 컨트랙트 데이터 로드
  const loadContractData = async (nftContract, userAccount) => {
    try {
      setLoadingNFTs(true);

      const supply = await nftContract.totalSupply();
      setTotalSupply(Number(supply));

      const isRevealed = await nftContract.revealed();
      setRevealed(isRevealed);

      const nfts = [];
      for (let i = 1; i <= Number(supply); i++) {
        try {
          const owner = await nftContract.ownerOf(i);
          const tokenURI = await nftContract.tokenURI(i);
          console.log(`Token #${i} URI:`, tokenURI);

          let metadata = null;
          let imageUrl = null;

          try {
            const response = await fetch(tokenURI);
            metadata = await response.json();
            imageUrl = metadata.image;
            console.log(`Token #${i} 메타데이터:`, metadata);
          } catch (e) {
            console.error(`메타데이터 로드 실패 (Token #${i}):`, e);
          }

          nfts.push({
            tokenId: i,
            owner,
            isOwner: userAccount ? owner.toLowerCase() === userAccount.toLowerCase() : false,
            metadata,
            imageUrl,
          });
        } catch (e) {
          console.error(`Token #${i} 로드 실패:`, e);
        }
      }
      setAllNFTs(nfts);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoadingNFTs(false);
    }
  };

  // 민팅
  const mint = async () => {
    if (!contract || !account) {
      setMessage("지갑을 먼저 연결해주세요!");
      return;
    }

    setLoading(true);
    setMessage("민팅 중...");

    try {
      const tx = await contract.mint(account);
      setMessage("트랜잭션 전송됨, 확인 대기 중...");
      await tx.wait();
      setMessage("민팅 완료!");
      await loadContractData(contract, account);
    } catch (error) {
      console.error(error);
      setMessage("민팅 실패: " + (error.reason || error.message));
    }

    setLoading(false);
  };

  // 계정 변경 감지
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          if (contract) loadContractData(contract, accounts[0]);
        } else {
          setAccount(null);
          setContract(null);
        }
      });
    }
  }, [contract]);

  // 필터링된 NFT 목록
  const filteredNFTs = filter === "my" ? allNFTs.filter((nft) => nft.isOwner) : allNFTs;
  const myNFTCount = allNFTs.filter((nft) => nft.isOwner).length;

  return (
    <div className="app">
      <header>
        <h1>RevealNFT</h1>
        <p className="subtitle">Randomly Generated NFT Collection</p>
      </header>

      <main>
        <section className="wallet-section">
          {account ? (
            <div className="connected">
              <span className="dot"></span>
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          ) : (
            <button onClick={connectWallet} className="connect-btn">
              지갑 연결
            </button>
          )}
        </section>

        <section className="info-section">
          <div className="info-card">
            <span className="label">Total Minted</span>
            <span className="value">{totalSupply}</span>
          </div>
          <div className="info-card">
            <span className="label">Status</span>
            <span className="value">{revealed ? "Revealed" : "Hidden"}</span>
          </div>
          {account && (
            <div className="info-card">
              <span className="label">My NFTs</span>
              <span className="value">{myNFTCount}</span>
            </div>
          )}
        </section>

        {!revealed && (
          <section className="mint-section">
            <button
              onClick={mint}
              disabled={!account || loading}
              className="mint-btn"
            >
              {loading ? "민팅 중..." : "MINT NFT"}
            </button>
            {message && <p className="message">{message}</p>}
          </section>
        )}

        <section className="nft-section">
          <div className="section-header">
            <h2>NFT Gallery</h2>
            <div className="filter-tabs">
              <button
                className={`filter-tab ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                전체 ({allNFTs.length})
              </button>
              <button
                className={`filter-tab ${filter === "my" ? "active" : ""}`}
                onClick={() => setFilter("my")}
                disabled={!account}
              >
                내 NFT ({myNFTCount})
              </button>
            </div>
          </div>

          {loadingNFTs ? (
            <p className="loading-text">NFT 로딩 중...</p>
          ) : filteredNFTs.length > 0 ? (
            <div className="nft-grid">
              {filteredNFTs.map((nft) => (
                <div key={nft.tokenId} className={`nft-card ${nft.isOwner ? "owned" : ""}`}>
                  <div className="nft-image">
                    {nft.imageUrl ? (
                      <img src={nft.imageUrl} alt={nft.metadata?.name || `NFT #${nft.tokenId}`} />
                    ) : (
                      <span>{revealed ? `#${nft.tokenId}` : "?"}</span>
                    )}
                  </div>
                  <p>{nft.metadata?.name || `Token #${nft.tokenId}`}</p>
                  {nft.isOwner && <span className="owner-badge">OWNED</span>}
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-text">
              {filter === "my" ? "보유한 NFT가 없습니다" : "민팅된 NFT가 없습니다"}
            </p>
          )}
        </section>
      </main>

      <footer>
        <p>Built with React + ethers.js</p>
      </footer>
    </div>
  );
}

export default App;
