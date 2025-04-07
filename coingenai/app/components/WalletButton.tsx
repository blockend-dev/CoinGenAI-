'use client'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'

export function WalletButton() {
  const { connect } = useConnect()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  return (
    <div className="flex gap-2">
      {!isConnected ? (
        <>
          <button
            onClick={() => connect({ connector: injected() })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            MetaMask
          </button>
          <button
            onClick={() => connect({ connector: coinbaseWallet() })}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
          >
            Coinbase Wallet
          </button>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}