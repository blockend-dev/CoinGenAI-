declare global {
  interface Window {
    ethereum?: any; 
  }
}

import { base } from "viem/chains";
import { Chain, createPublicClient, createWalletClient, custom,http } from "viem";

export const chain = base; // Using Base chain
export const publicClient = createPublicClient({
  chain : chain as Chain,
  transport: http() //  RPC URL
});

// For browser interactions
export const getWalletClient = async () => {
  if (typeof window === 'undefined') throw new Error('Browser only');
  return createWalletClient({
    chain,
    transport: custom(window.ethereum!)
  });
};