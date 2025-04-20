import { Configuration, NeynarAPIClient } from "@neynar/nodejs-sdk";
import { FeedType, FilterType } from "@neynar/nodejs-sdk/build/api";
import { InferenceClient } from "@huggingface/inference";
import { parseHuggingFaceOutput } from "@/app/lib/parseHuggingFaceOutput";
import axios from "axios";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
    const HF_API_KEY = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
    const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_KEY;
    const PINATA_SECRET = process.env.NEXT_PUBLIC_PINATA_SECRET;

    if (!NEYNAR_API_KEY || !HF_API_KEY || !PINATA_API_KEY || !PINATA_SECRET) {
      return new Response(JSON.stringify({ error: "Missing API keys" }), { status: 500 });
    }

    // 1. Fetch Farcaster trending posts
    const client = new NeynarAPIClient(new Configuration({ apiKey: NEYNAR_API_KEY }));
    const { casts } = await client.fetchFeed({
      feedType: FeedType.Filter,
      filterType: FilterType.GlobalTrending,
      limit: 50,
    });

    const textData = casts.map((cast) => `- ${cast.text}`).join("\n");

    // 2. Trend Analysis Prompt
    const prompt = `
You are an AI trend analyst. Based on the following trending social media posts, extract:
1. Top 5-10 keywords (just a JSON array)
2. One-line summary of the trend
3. General sentiment (positive, negative, neutral)
4. Generate 3 fun and creative meme coin names

Trending Posts:
${textData}

Respond in this format:
Keywords: ["AI", "example"]
Summary: Your summary here
Sentiment: Positive
CoinIdeas: ["$EXAMPLE1", "$EXAMPLE2", "$EXAMPLE3"]
    `;

    const hf = new InferenceClient(HF_API_KEY);
    const result = await hf.textGeneration({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      inputs: prompt,
      parameters: { max_new_tokens: 300, return_full_text: false },
    });

    const parsed = parseHuggingFaceOutput(result.generated_text.trim());

    const selectedCoinName = parsed.coinIdeas?.[0] || "AI Coin";

    // 3. Generate image blob
    const imageBlob = await hf.textToImage({
      provider: "nebius",
      model: "black-forest-labs/FLUX.1-dev",
      inputs: `Logo for a fun crypto coin called ${selectedCoinName}`,
      parameters: { num_inference_steps: 5 },
    });

    // 4. Upload image blob to IPFS via Pinata
    const buffer = Buffer.from(await imageBlob.arrayBuffer());
    const formData = new FormData();
    formData.append("file", new Blob([buffer], { type: "image/png" }), "coin-image.png");

    const pinataUpload = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET,
        },
      }
    );

    const ipfsHash = pinataUpload.data.IpfsHash;
    const ipfsImage = `ipfs://${ipfsHash}`;

    return new Response(JSON.stringify({ ...parsed, image: ipfsImage }), { status: 200 });
  } catch (err: any) {
    console.error("[COINGEN ERROR]", err);
    return new Response(JSON.stringify({ error: "Server Error", message: err?.message }), { status: 500 });
  }
}
