import { Configuration, NeynarAPIClient } from "@neynar/nodejs-sdk";
import { FeedType, FilterType } from "@neynar/nodejs-sdk/build/api";
import { HfInference } from "@huggingface/inference";

export const dynamic = "force-dynamic";


export async function GET() {
  try {
    const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
    const HF_API_KEY = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;

    if (!NEYNAR_API_KEY || !HF_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing API keys" }), { status: 500 });
    }

    // 1. Fetch trending Farcaster posts
    const client = new NeynarAPIClient(new Configuration({ apiKey: NEYNAR_API_KEY }));
    const { casts } = await client.fetchFeed({
      feedType: FeedType.Filter,
      filterType: FilterType.GlobalTrending,
      limit: 50,
    });

    const textData = casts.map((cast) => `- ${cast.text}`).join('\n');

    // 2. Generate prompt
    const prompt = `
You are an AI trend analyst. Based on the following trending social media posts, extract:
1. The top 5-10 keywords (just a JSON array)
2. A one-line summary of the dominant trend
3. The general sentiment (positive, negative, neutral)
4. Generate 3 fun and creative meme coin names based on the trend

Trending Posts:
${textData}

Respond in this format:
Keywords: ["AI", "example"]
Summary: Your summary here
Sentiment: Positive
CoinIdeas: ["$EXAMPLE1", "$EXAMPLE2", "$EXAMPLE3"]
`;

    // 3. Call Hugging Face
    const hf = new HfInference(HF_API_KEY);
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 300,
        return_full_text: false,
        temperature: 0.7,
      },
    });

    const raw = response.generated_text.trim();
    console.log("🧠 Hugging Face Output:\n", raw);

    const parsed = parseHuggingFaceOutput(raw);
    return new Response(JSON.stringify(parsed), { status: 200 });
  } catch (err: any) {
    console.error("[GEN COIN IDEA ERROR]", err?.message || err);
    return new Response(JSON.stringify({ error: "Failed to parse Hugging Face output", raw: err.message || "" }), { status: 500 });
  }
}
