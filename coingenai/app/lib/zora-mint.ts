import { mint } from "@zoralabs/protocol-sdk";
import { chain, publicClient } from './zora-config';
import { getWalletClient } from './zora-config';

export async function mintCoin({
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
  const walletClient = await getWalletClient();
  const [address] = await walletClient.getAddresses();

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

  return walletClient.writeContract(parameters);
}