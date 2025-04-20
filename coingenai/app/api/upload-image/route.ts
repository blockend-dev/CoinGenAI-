import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json(); // You send base64 image
    const PINATA_API_KEY = process.env.PINATA_KEY!;
    const PINATA_SECRET = process.env.PINATA_SECRET!;

    if (!imageBase64 || !PINATA_API_KEY || !PINATA_SECRET) {
      return NextResponse.json({ error: 'Missing image or API keys' }, { status: 400 });
    }

    const buffer = Buffer.from(imageBase64.split(',')[1], 'base64');
    const blob = new Blob([buffer], { type: 'image/png' });

    const formData = new FormData();
    formData.append('file', blob, 'coin-image.png');

    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET
        }
      }
    );

    const ipfsHash = res.data.IpfsHash;
    const imageUrl = `ipfs://${ipfsHash}`;
    return NextResponse.json({ imageUrl });
  } catch (err: any) {
    console.error('[IMAGE UPLOAD ERROR]', err.message || err);
    return NextResponse.json({ error: 'Upload failed', message: err.message }, { status: 500 });
  }
}
