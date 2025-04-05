'use client'
import { useSwitchChain, useChainId } from 'wagmi'
import { base, baseSepolia } from 'viem/chains'

export default function NetworkSwitcher() {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  return (
    <div className="flex gap-2">
      <button
        onClick={() => switchChain({ chainId: base.id })}
        disabled={chainId === base.id}
        className={`px-3 py-1 rounded text-sm ${
          chainId === base.id ? 'bg-gray-300' : 'bg-blue-500 text-white'
        }`}
      >
        Base Mainnet
      </button>
      <button
        onClick={() => switchChain({ chainId: baseSepolia.id })}
        disabled={chainId === baseSepolia.id}
        className={`px-3 py-1 rounded text-sm ${
          chainId === baseSepolia.id ? 'bg-gray-300' : 'bg-purple-500 text-white'
        }`}
      >
        Base Sepolia
      </button>
    </div>
  )
}