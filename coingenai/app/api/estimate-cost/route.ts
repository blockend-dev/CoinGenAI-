import { NextResponse } from 'next/server';
import { estimateMintingGas } from '../../lib/gas-estimate'; // Import the estimateMintingGas function

export async function POST(req: Request) {
  const { contractAddress, tokenId, artworkURI, quantity } = await req.json();
  
  try {
    const estimatedGasCost = await estimateMintingGas({
      contractAddress,
      tokenId,
      artworkURI,
      quantity,
    });
    return NextResponse.json({ estimatedGasCost: `${estimatedGasCost} ETH` });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to estimate gas' },
      { status: 500 }
    );
  }
}
