import { mint } from "@zoralabs/protocol-sdk";
import { chain, publicClient } from './zora-config';
import { getWalletClient } from './zora-config';
import { formatEther } from 'viem'; 

export async function estimateMintingGas({
  contractAddress,
  tokenId,
  artworkURI,
  quantity = 1000000
}: {
  contractAddress: `0x${string}`,
  tokenId: number,
  artworkURI: string,
  quantity?: number
}) {
  // Get wallet client
  const walletClient = await getWalletClient();
  const [address] = await walletClient.getAddresses();

  // Create parameters for minting (without actually minting)
  const { parameters } = await mint({
    tokenContract: contractAddress,
    mintType: "1155",
    tokenId: BigInt(tokenId),
    quantityToMint: BigInt(quantity),
    mintComment: "Minted via CoinGenAI",
    tokenMetadataURI: artworkURI,
    minterAccount: address,
    publicClient,
    chainId: chain.id
  });

  // Estimate gas for minting
  const gasEstimate = await publicClient.estimateGas({
    ...parameters,
    from: address,
  });

  console.log('Estimated Gas:', gasEstimate);

  // Get the current gas price in Wei (from the publicClient)
  const gasPrice = await publicClient.getGasPrice(); // Gas price in Wei

  console.log('Current Gas Price (in Wei):', gasPrice.toString());

  // Calculate the estimated gas cost in Wei
  const gasCostInWei = gasEstimate * gasPrice;

  // Convert gas cost from Wei to Ether
  const gasCostInEther = formatEther(gasCostInWei);

  console.log('Estimated Gas Cost in Ether:', gasCostInEther);

  return gasCostInEther;
}
