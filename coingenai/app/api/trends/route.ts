// app/api/trends/route.ts
import { Configuration, NeynarAPIClient } from "@neynar/nodejs-sdk";
import { FeedType, FilterType } from "@neynar/nodejs-sdk/build/api";
import * as tf from '@tensorflow/tfjs-node';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  // 1. Initialize client with proper Configuration
  const NEYNAR_API_KEY  = process.env.NEXT_PUBLIC_NEYNAR_API_KEY
  const config = new Configuration({
    apiKey: NEYNAR_API_KEY!,
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

  // 4. AI Prediction
  const model = await tf.loadLayersModel('file://./public/models/trends/model.json');
  const input = tf.tensor([trendTexts]);
  const prediction = model.predict(input) as tf.Tensor;

  return Response.json({
    ticker: `$${prompt.slice(0,4).toUpperCase()}`,
    score: prediction.dataSync()[0] * 100,
    trendingCasts: casts.slice(0, 3).map(cast => ({
      text: cast.text,
      author: cast.author.username
    }))
  });
}