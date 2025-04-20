// /app/api/farcaster-trends/route.ts

import { Configuration, NeynarAPIClient } from "@neynar/nodejs-sdk";
import { FeedType, FilterType } from "@neynar/nodejs-sdk/build/api";
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
        const HUGGING_FACE_API_KEY = process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY;

        if (!NEYNAR_API_KEY || !HUGGING_FACE_API_KEY) {
            return new Response(JSON.stringify({ error: 'Missing API keys' }), { status: 500 });
        }

        // 1. Initialize Neynar Client
        const client = new NeynarAPIClient(new Configuration({ apiKey: NEYNAR_API_KEY }));
        const { casts } = await client.fetchFeed({
            feedType: FeedType.Filter,
            filterType: FilterType.GlobalTrending,
            limit: 50,
        });

        const textData = casts.map(cast => `- ${cast.text}`).join('\n');

        // 2. Prepare Hugging Face prompt
        const prompt = `
            You are an AI trend analyst. Based on the following trending social media posts, extract:
            1. The top 5 keywords (just a JSON array)
            2. A one-line summary of the dominant trend
            3. The general sentiment (positive, negative, neutral)
            4. Generate 3 fun and creative meme coin names based on the trend

            Trending Posts:
            ${textData}

            Respond in JSON format like:
            {
                "keywords": ["example1", "example2"],
                "summary": "summary here",
                "sentiment": "positive",
                "coinIdeas": ["coin1", "coin2", "coin3"]
            }
        `;

        // 3. Call Hugging Face API
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/gpt2', // Example: Using GPT-2 model
            { inputs: prompt },
            {
                headers: {
                    Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
                },
            }
        );

        const gptResponse = response.data[0]?.generated_text || "";

        // 4. Parse and return the response
        let parsed;
        try {
            parsed = JSON.parse(gptResponse);
        } catch (err) {
            return new Response(JSON.stringify({ error: "Failed to parse Hugging Face output", raw: gptResponse }), { status: 500 });
        }

        return new Response(JSON.stringify(parsed), { status: 200 });
    } catch (err: any) {
        console.error("[FARCASTER HUGGINGFACE ERROR]", err?.message || err);
        return new Response(JSON.stringify({ error: "Server error", message: err?.message }), { status: 500 });
    }
}
