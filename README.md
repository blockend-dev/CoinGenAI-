
# CoinGenAI 🚀

**CoinGenAI** is a powerful platform that allows users to generate and deploy meme coins powered by Farcaster trends, Hugging Face models, and blockchain technology using the Zora Coin SDK. The platform enables users to:
- Fetch trending Farcaster posts
- Generate meme coin ideas based on those trends
- Create custom artwork and metadata for the coin
- Deploy the generated coins to the Zora blockchain

## Features 🌟

- **Coin Generation**: Automatically generates meme coin names based on trending topics.
- **Artwork Generation**: Utilizes Hugging Face models to generate coin artwork.
- **Metadata Creation**: Generates metadata and uploads it to IPFS via Pinata.
- **Seamless Wallet Integration**: Uses **RainbowKit** for easy wallet connection.
- **Deployment**: Deploy coins to the **Zora blockchain** with a simple click.

## Tech Stack 🔧

- **Frontend**: Next.js, React, Tailwind CSS
- **Blockchain**: Zora Coin SDK, Wagmi, Viem
- **AI**: Hugging Face (Stable Diffusion, Mixtral-8x7B), Neynar API
- **IPFS**: Pinata
- **Wallet**: RainbowKit, Wagmi
- **Backend**: API routes in Next.js

## Demo 🎥

Check the live site [here](https://coin-gen-ai-rvym.vercel.app/).

## Installation 💻

Clone the repository and install dependencies:

```bash
git clone https://github.com/blockend-dev/CoinGenAI-
cd coingenai
npm install
```

### Environment Variables ⚡

Make sure to create a `.env.local` file with the following environment variables:

```env
NEXT_PUBLIC_NEYNAR_API_KEY=your-neynar-api-key
NEXT_PUBLIC_HUGGINGFACE_API_KEY=your-huggingface-api-key
NEXT_PUBLIC_PINATA_KEY=your-pinata-api-key
NEXT_PUBLIC_PINATA_SECRET=your-pinata-api-secret
```

- **NEYNAR_API_KEY**: Required for accessing Farcaster trends via the Neynar API.
- **HUGGINGFACE_API_KEY**: Needed to interact with Hugging Face models for generating coin artwork.
- **PINATA_KEY and PINATA_SECRET**: Used for uploading metadata to IPFS using Pinata.

### Running the Development Server 🚀

To run the project locally in development mode:

```bash
npm run dev
```

This will start the app at `http://localhost:3000`.

## Usage 🚀

1. **Connect your Wallet**: Use the "Connect Wallet" button (powered by RainbowKit) to link your wallet.
2. **Generate Coin**: Click on the "Generate Coin" button to analyze Farcaster trends and generate a coin idea.
3. **Preview Coin**: Once the coin idea is generated, you'll see the coin's name, symbol, description, and artwork.
4. **Deploy Coin**: Once you're happy with the generated coin, you can deploy it to the Zora blockchain with a single click.

## Features Walkthrough 📑

### Step-by-Step UI (Progress Wizard)
CoinGenAI offers a seamless, guided process for first-time users with clear steps and progress indicators.

### Onboarding Modal
For first-time users, CoinGenAI offers an onboarding modal with tips and a preview to help guide you through the process.

### Responsive UI
CoinGenAI is fully responsive and works on mobile, tablet, and desktop devices.


## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements 🙏

- **Zora** for their amazing Coin SDK.
- **RainbowKit** for wallet integration.
- **Hugging Face** for powerful AI models.
- **Pinata** for seamless IPFS integration.
- **Farcaster** for creating a platform that drives the trends.

---

Feel free to reach out with any questions or ideas, and let's create some epic meme coins! 🎉
```
