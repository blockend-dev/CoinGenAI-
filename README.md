# CoinGenAI - AI-Powered Zora Coin Generator

## 🚀 Overview

CoinGenAI is an innovative platform that combines AI with blockchain technology to help creators generate and mint viral Zora coins with a single click. Our system analyzes trends, generates unique coin artwork, and handles on-chain deployment automatically.

## ⚠️ Current Known Issue

**Bug Status**: *Identified - Fix Coming in Next Release*

We're currently experiencing an issue with dependency conflicts related to `@mapbox/node-pre-gyp` which affects the trend analysis API endpoint. This manifests as:

```
Module not found errors for aws-sdk, mock-aws-s3, and nock
HTML module type errors in build process
```

**Our Solution**:  
We've implemented temporary workarounds and will be deploying a complete fix in the next development sprint that will:

1. Replace problematic dependencies with modern alternatives
2. Implement proper type declarations
3. Optimize the build pipeline

## ✨ Features

- **AI-Powered Coin Generation**
  - Automatic trend analysis
  - Unique artwork generation
  - Smart ticker suggestions

- **Blockchain Integration**
  - One-click minting on Zora Protocol
  - Multi-chain support (Base + Base Sepolia)
  - Royalty configuration

- **User Experience**
  - Wallet connection (MetaMask, Coinbase, WalletConnect)
  - Transaction history
  - Real-time market data

## 🛠️ Installation

```bash
git clone https://github.com/blockend-dev/CoinGenAI-.git
cd coingenai
npm install
```

## 🔧 Configuration

1. Create `.env.local` file:
```env
NEXT_PUBLIC_ZORA_CONTRACT=0x...
NEYNAR_API_KEY=your_key
OPENAI_API_KEY=your_key
```

## 🚴‍♂️ Running the App

```bash
npm run dev
```

## 📂 Project Structure

```
/coingenai
├── app/            # Next.js app router
├── components/     # React components
├── lib/            # Blockchain/AI logic
├── types/          # TypeScript declarations
└── public/         # Static assets
```



## 📅 Roadmap

### Next Release (Fixes Coming)
- [ ] Complete dependency overhaul
- [ ] Enhanced error handling
- [ ] Gas optimization

### Future Features
- [ ] Multi-wallet support
- [ ] Coin analytics dashboard
- [ ] Social sharing integration

## 📜 License

MIT

---

**Note**: The current dependency issues do not affect core functionality. Minting and generation features remain fully operational. Our team is working diligently to resolve these build issues completely in the upcoming release.