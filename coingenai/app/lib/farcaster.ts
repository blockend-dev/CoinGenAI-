import axios from 'axios';

const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;

export async function fetchTrendingCasts() {
  const url = 'https://api.neynar.com/v2/farcaster/feed/GlobalTrending';

  try {
    const res = await axios.get(url, {
      headers: {
        'api_key': NEYNAR_API_KEY!,
      },
    });

    // Extract and return trending topics/text
    const casts = res.data?.casts || [];
    return casts.map((cast: any) => cast.text).slice(0, 10);
  } catch (error: any) {
    console.error('[FARCASTER ERROR]', error?.response?.data || error.message);
    return [];
  }
}
