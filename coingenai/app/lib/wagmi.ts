import { createConfig, http } from 'wagmi'
import { base, baseSepolia } from 'viem/chains'
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'

// Type-safe configuration object
export const config = createConfig({
  chains: [base, baseSepolia] as const, 
  transports: {
    [base.id]: http(), 
    [baseSepolia.id]: http()
  },
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'CoinGenAI',
      appLogoUrl: 'https://coingenai.com/logo.png'
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
      metadata: {
        name: 'CoinGenAI',
        description: 'AI-powered Zora coin generator',
        url: 'https://google.com',
        icons: ['https://google.com/icon.png']
      }
    })
  ]
})