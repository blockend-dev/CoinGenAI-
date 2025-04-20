import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
    const PINATA_API_KEY = process.env.PINATA_KEY;
    const PINATA_SECRET = process.env.PINATA_SECRET;

    if (!prompt || !HF_API_KEY || !PINATA_API_KEY || !PINATA_SECRET) {
      return NextResponse.json({ error: 'Missing input or API keys' }, { status: 400 });
    }

    // 1. Generate image from Hugging Face
    const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HuggingFace Error: ${errorText}`);
    }

    const buffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(buffer);

    // 2. Upload to IPFS via Pinata
    const formData = new FormData();
    formData.append('file', imageBuffer, 'coin-art.png');

    const ipfsRes = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          ...formData.getHeaders(),
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET
        }
      }
    );

    console.log('hi',ipfsRes)

    const ipfsHash = ipfsRes.data.IpfsHash;
    const ipfsUrl = `ipfs://${ipfsHash}`;

    return NextResponse.json({ imageUrl: ipfsUrl });

  } catch (err: any) {
    console.error('[GENERATE ARTWORK ERROR]', err?.message || err);
    return NextResponse.json({ error: 'Server Error', message: err?.message }, { status: 500 });
  }
}
