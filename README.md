# RevealNFT

리빌 기능이 포함된 ERC-721 NFT 컨트랙트입니다. 민팅 시 히든 이미지가 보이고, 리빌 후 실제 NFT 이미지가 공개됩니다.

## 주요 파일

- `contracts/RevealNFT.sol`: 리빌 기능이 있는 ERC-721 컨트랙트
- `scripts/generate.js`: NFT 이미지/메타데이터 생성
- `scripts/createHiddenImage.js`: 히든 이미지 생성
- `scripts/deploy.js`: 컨트랙트 배포
- `scripts/mint.js`: NFT 민팅
- `scripts/reveal.js`: 리빌 실행
- `scripts/uploadToS3.js`: S3 업로드

## 실행 순서

### 1. 의존성 설치

```bash
npm install
npm run dapp:install
```

### 2. 환경변수 설정

```bash
cp .env.example .env
```

`.env` 필수 값:

```bash
PRIVATE_KEY=your_wallet_private_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=ap-northeast-2
S3_BUCKET_NAME=your-bucket-name
```

### 3. 히든 이미지 생성 및 업로드

`.env`에 추가:

```bash
UNREVEALED_IMAGE_URI=https://your-bucket.s3.ap-northeast-2.amazonaws.com/hidden/hidden.png
```

실행:

```bash
npm run generate:hidden
npm run upload:hidden
```

### 4. 환경변수 업데이트

`.env`에 추가:

```bash
UNREVEALED_URI=https://your-bucket.s3.ap-northeast-2.amazonaws.com/hidden/hidden.json
```

### 5. 컨트랙트 배포

```bash
npm run compile
npm run deploy:hoodi
```

출력된 주소를 `.env`에 설정:

```bash
NFT_CONTRACT_ADDRESS=0x...
```

### 6. NFT 민팅

```bash
npm run mint:hoodi
```

이 시점에서 NFT는 히든 이미지로 보입니다.

### 7. 실제 이미지/메타데이터 생성 및 업로드

`.env`에 추가:

```bash
NFT_IMAGE_BASE_URI=https://your-bucket.s3.ap-northeast-2.amazonaws.com/images/
```

실행:

```bash
npm run generate 10
npm run upload:metadata
```

### 8. 환경변수 업데이트

`.env`에 추가:

```bash
NFT_BASE_URI=https://your-bucket.s3.ap-northeast-2.amazonaws.com/metadata/
```

### 9. 리빌

```bash
npm run reveal:hoodi
```

리빌 후 NFT가 실제 이미지로 공개됩니다.

### 10. 프론트엔드 실행

```bash
cd frontend
cp .env.example .env
```

`frontend/.env` 설정:

```bash
VITE_RPC_URL=https://rpc.hoodi.ethpandaops.io
VITE_CONTRACT_ADDRESS=0x...
```

실행:

```bash
npm run dapp:dev
```

접속: http://localhost:5173

## 스크립트 목록

| 명령어 | 설명 |
|--------|------|
| `npm run compile` | 컨트랙트 컴파일 |
| `npm run deploy:hoodi` | Hoodi 테스트넷 배포 |
| `npm run mint:hoodi` | NFT 민팅 |
| `npm run reveal:hoodi` | 리빌 실행 |
| `npm run set-uri:hoodi` | Base URI 변경 (리빌 후) |
| `npm run generate [개수]` | NFT 이미지/메타데이터 생성 |
| `npm run generate:samples` | 샘플 레이어 생성 |
| `npm run generate:hidden` | 히든 이미지 생성 |
| `npm run upload` | output 폴더 전체 업로드 |
| `npm run upload:metadata` | 메타데이터/이미지 업로드 (hidden 제외) |
| `npm run upload:hidden` | 히든 이미지만 업로드 |
| `npm run wallet` | 새 지갑 생성 |
| `npm run address` | 프라이빗 키로 주소 확인 |
| `npm run balance` | ETH 잔액 확인 |
| `npm run dapp:dev` | 프론트엔드 개발 서버 |
| `npm run dapp:build` | 프론트엔드 빌드 |

## 로컬 테스트

```bash
# 터미널 1: 로컬 노드 실행
npm run node

# 터미널 2: 배포 및 테스트
npm run deploy
npm run mint
npm run reveal
```

## S3 공개 설정

S3 버킷 정책 예시:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket/*"
    }
  ]
}
```

## 환경변수 전체 목록

```bash
# 지갑
PRIVATE_KEY=your_wallet_private_key

# AWS
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=ap-northeast-2
S3_BUCKET_NAME=your-bucket-name

# 컨트랙트
NFT_CONTRACT_ADDRESS=0x...

# URI
UNREVEALED_URI=https://your-bucket.s3.ap-northeast-2.amazonaws.com/hidden/hidden.json
UNREVEALED_IMAGE_URI=https://your-bucket.s3.ap-northeast-2.amazonaws.com/hidden/hidden.png
NFT_BASE_URI=https://your-bucket.s3.ap-northeast-2.amazonaws.com/metadata/
NFT_IMAGE_BASE_URI=https://your-bucket.s3.ap-northeast-2.amazonaws.com/images/
```
