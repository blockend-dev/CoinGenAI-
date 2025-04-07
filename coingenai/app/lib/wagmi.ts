import { createConfig, http } from 'wagmi'
import { base, baseSepolia } from 'viem/chains'
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'

// Type-safe configuration object
export const config = createConfig({
  chains: [base, baseSepolia] as const, // Important: `as const` for tuple type
  transports: {
    [base.id]: http(), // Uses default RPC
    [baseSepolia.id]: http()
  },
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'CoinGenAI',
      appLogoUrl: 'https://yourapp.com/logo.png'
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
      metadata: {
        name: 'CoinGenAI',
        description: 'AI-powered Zora coin generator',
        url: 'https://yourapp.com',
        icons: ['https://yourapp.com/icon.png']
      }
    })
  ]
})