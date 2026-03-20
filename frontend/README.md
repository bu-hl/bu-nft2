# RevealNFT Frontend

RevealNFT 컨트랙트와 연동되는 React 프론트엔드입니다.

## 기능
qofpqks
- 전체 NFT 갤러리 조회
- 내 NFT 필터링
- NFT 민팅 (리빌 전까지만)
- 메타데이터에서 이미지 로드

## 개발 환경 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env
```

`.env` 설정:

```bash
VITE_RPC_URL=https://rpc.hoodi.ethpandaops.io
VITE_NFT_CONTRACT_ADDRESS=0x...
```

### 3. 개발 서버 실행

```bash
npm run dev
```

접속: http://localhost:5173

## Docker 배포

### 빌드

```bash
docker build \
  --build-arg VITE_RPC_URL=https://rpc.hoodi.ethpandaops.io \
  --build-arg VITE_NFT_CONTRACT_ADDRESS=0x... \
  -t reveal-nft-frontend .
```

### 실행

```bash
docker run -p 3000:80 reveal-nft-frontend
```

접속: http://localhost:3000

### 환경변수

| 변수 | 설명 |
|------|------|
| `VITE_RPC_URL` | RPC 엔드포인트 URL |
| `VITE_NFT_CONTRACT_ADDRESS` | 배포된 컨트랙트 주소 |

> Vite는 빌드 시점에 환경변수를 임베딩합니다. Docker 빌드 시 `--build-arg`로 전달해야 합니다.

## 기술 스택

- React 18
- Vite
- ethers.js v6
- Nginx (Docker)
