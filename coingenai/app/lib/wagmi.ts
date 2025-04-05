import { createConfig, http } from 'wagmi'
import { base, baseSepolia } from 'viem/chains'
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base, baseSepolia], 
  transports: {
    [base.id]: http('https://mainnet.base.org'), 
    [baseSepolia.id]: http('https://sepolia.base.org')
  },
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'CoinGenAI' }),
    walletConnect({ projectId: 'f6791418d6c9f8ab51a9ff3fbed9dd0d' })
  ]
})