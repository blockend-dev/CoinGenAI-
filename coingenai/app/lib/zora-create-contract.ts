import { create1155 } from "@zoralabs/protocol-sdk";
import { chain, publicClient } from './zora-config';
import { getWalletClient } from './zora-config';

export async function createCoinContract() {
  const walletClient = await getWalletClient();
  const [address] = await walletClient.getAddresses();

  const { parameters, contractAddress } = await create1155({
    contract: {
      name: "CoinGenAI",
      uri: "ipfs://bafybe.../contract.json"
    },
    token: {
      tokenMetadataURI: "ipfs://DUMMY/token.json"
    },
    account: address,
    publicClient,
  });

  const txHash = await walletClient.writeContract({
    ...parameters,  
    account: address,
    chain: chain, 
  });

  console.log('Transaction Hash:', txHash);
  return { txHash, contractAddress };
}
