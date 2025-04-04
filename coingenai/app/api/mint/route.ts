import { mintCoin } from '../../lib/zora-mint';
import { NextResponse } from 'next/server';

//  deployed contract address
const COIN_CONTRACT = "0x123..."; 

export async function POST(req: Request) {
  const { ticker, artwork } = await req.json();

  try {
    // Generate unique token ID
    const tokenId = Math.floor(Date.now() / 1000);
    
    const txHash = await mintCoin({
      contractAddress: COIN_CONTRACT,
      tokenId,
      artworkURI: artwork
    });

    return NextResponse.json({
      txHash,
      explorerLink: `https://basescan.org/tx/${txHash}`,
      tokenId,
      ticker
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.shortMessage || "Mint failed" },
      { status: 500 }
    );
  }
}