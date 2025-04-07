import { Configuration, NeynarAPIClient } from "@neynar/nodejs-sdk";
import { FeedType, FilterType } from "@neynar/nodejs-sdk/build/api";
import * as tf from '@tensorflow/tfjs';  // Import TensorFlow.js for Node.js
import path from 'path';
import fs from 'fs'

// export const runtime = "node";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  // 1. Initialize client with proper Configuration
  const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
  if (!NEYNAR_API_KEY) {
    return new Response(JSON.stringify({ error: "NEYNAR_API_KEY not found" }), { status: 500 });
  }

  const config = new Configuration({//
    apiKey: NEYNAR_API_KEY,
  });
  const client = new NeynarAPIClient(config);

  // 2. Fetch trending feed
  const { casts } = await client.fetchFeed({
    feedType: FeedType.Filter,
    filterType: FilterType.GlobalTrending,
    limit: 50, // Get top 50 trending casts
  });

  // 3. Extract text from casts
  const trendTexts = casts.map(cast => cast.text).join(' ');

  // 4. Load the TensorFlow model 
  const modelPath = path.resolve('./public/models/trends/model.json');
  const modelData = JSON.parse(fs.readFileSync(modelPath, 'utf-8')); // Read the JSON file
  const model = await tf.loadLayersModel({
      load: async () => modelData,
  });

  const numericalData = trendTexts.map(text => [text.length]);  // Array of [length]
  const inputTensor = tf.tensor2d(numericalData, [trendTexts.length, 1]); // Shape: [batch_size, 1]


  // 5. Run prediction
  const predictions = model.predict(inputTensor) as tf.Tensor;
  const predictedValues = await predictions.data();
  const predictedArray = Array.from(predictedValues);

  // 6. Combine results
  const results = trendTexts.map((text, index) => ({
      text,
      score: predictedArray[index] * 100, // Convert to percentage
  }));

  // 7. Sort results by score (descending)
  results.sort((a, b) => b.score - a.score);

  // 8. Construct response
  const ticker = `$${prompt.slice(0, 4).toUpperCase()}`;
  const topTrendingCasts = results.slice(0, 3).map(item => ({
      text: item.text,
      score: item.score, // Include the score
      author: casts.find(cast => cast.text === item.text)?.author.username || 'Unknown', // Get author
  }));

  return new Response(JSON.stringify({
      ticker,
      topTrendingCasts
  }), { status: 200 });
} catch (error: any) {
  console.error("Error:", error);
  return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
  });
}
