import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { name, description, image, creator } = await req.json();
    const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_KEY;
    const PINATA_SECRET = process.env.NEXT_PUBLIC_PINATA_SECRET;

    if (!name || !description || !image || !creator || !PINATA_API_KEY || !PINATA_SECRET) {
      return NextResponse.json({ error: 'Missing fields or API keys' }, { status: 400 });
    }

    const metadata = {
      name,
      description,
      image,
      properties: {
        creator
      }
    };

    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      metadata,
      {
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET
        }
      }
    );

    const ipfsHash = res.data.IpfsHash;
    const metadataUrl = `ipfs://${ipfsHash}`;

    console.log(metadataUrl,'mr')
    return NextResponse.json({ metadataUrl });
  } catch (err: any) {
    console.error('[METADATA UPLOAD ERROR]', err?.message || err);
    return NextResponse.json({ error: 'Server Error', message: err?.message }, { status: 500 });
  }
}
