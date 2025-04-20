'use client';

import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract } from 'wagmi';
import { createCoinCall } from '@zoralabs/coins-sdk';
import { Address } from 'viem';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const steps = ['Connect Wallet', 'Generate Coin', 'Deploy Coin'];

export default function CoinGenAI() {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [generating, setGenerating] = useState(false);
  const [coin, setCoin] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'deploying' | 'done' | 'error'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const { writeContract } = useWriteContract();
  const [showOnboarding, setShowOnboarding] = useState(true);

  const generateCoin = async () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    setGenerating(true);
    toast.info('Analyzing Farcaster trends...');

    try {
      const res = await fetch('/api/generate-coin-idea');
      const idea = await res.json();

      const coinName = idea.coinIdeas[0];
      const description = idea.summary;
      const imageURI = idea.image;

      toast.info('Generating coin artwork & metadata...');

      const metaRes = await fetch('/api/generate-metadata', {
        method: 'POST',
        body: JSON.stringify({
          name: coinName,
          description,
          image: imageURI,
          creator: address,
        }),
      });

      const meta = await metaRes.json();

      setCoin({
        name: coinName,
        symbol: coinName.replace(/\s+/g, '').slice(0, 6).toUpperCase(),
        description,
        image: imageURI,
        uri: meta.metadataUrl,
      });

      setCurrentStep(2);
      toast.success('Coin ready to deploy!');
    } catch (err) {
      console.error('Error:', err);
      toast.error('Error generating coin. Try again.');
    } finally {
      setGenerating(false);
    }
  };

  const deployCoin = async () => {
    if (!address || !coin) return;
    setStatus('deploying');

    const coinParams = {
      name: coin.name,
      symbol: coin.symbol,
      uri: coin.uri,
      payoutRecipient: address as Address,
      platformReferrer: address as Address,
    };

    const callParams = await createCoinCall(coinParams);

    writeContract(callParams, {
      onSuccess: () => {
        setStatus('done');
        toast.success('🎉 Coin deployed successfully!');
      },
      onError: (err) => {
        console.error(err);
        setStatus('error');
        toast.error('Failed to deploy coin.');
      },
    });
  };

  const formatIpfsUrl = (uri: string) =>
    uri?.startsWith('ipfs://') ? uri.replace('ipfs://', 'https://ipfs.io/ipfs/') : uri;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 py-10 px-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg relative overflow-hidden">
        <AnimatePresence>
          {showOnboarding && (
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="absolute inset-0 z-50 bg-white bg-opacity-90 flex flex-col items-center justify-center p-6 text-center"
            >
              <h2 className="text-2xl font-bold mb-4">👋 Welcome to CoinGenAI!</h2>
              <p className="text-gray-600 mb-4">
                CoinGenAI generates viral meme coins based on Farcaster trends. Connect your wallet,
                let the AI cook a coin, and deploy to Zora—all in one click.
              </p>
              <ul className="text-sm text-left mb-6 list-disc list-inside text-gray-700">
                <li>Analyze trending Farcaster posts</li>
                <li>Generate a creative coin + artwork</li>
                <li>Deploy your coin to Base via Zora</li>
              </ul>
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
                onClick={() => setShowOnboarding(false)}
              >
                Let’s Go 🚀
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">🚀 CoinGenAI</h1>
          <ConnectButton />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step} className="flex-1 text-center relative">
                <div
                  className={`rounded-full w-8 h-8 mx-auto flex items-center justify-center ${
                    currentStep >= index ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="mt-2 text-xs">{step}</div>
                {index < steps.length - 1 && (
                  <div className="absolute top-4 left-full w-full h-1 bg-gray-300">
                    <div
                      className={`h-full bg-purple-600 transition-all duration-500 ease-in-out ${
                        currentStep > index ? 'w-full' : 'w-0'
                      }`}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            if (currentStep === 0 && !isConnected) openConnectModal?.();
            else if (currentStep === 0) setCurrentStep(1);
            else generateCoin();
          }}
          disabled={generating || status === 'deploying'}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 mb-6 transition"
        >
          {currentStep === 0
            ? '🔌 Connect Wallet to Start'
            : currentStep === 1
            ? generating
              ? 'Generating Coin...'
              : '✨ Generate Coin from Farcaster'
            : '✅ Coin Ready!'}
        </button>

        {coin && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 p-4 rounded shadow mb-6"
          >
            <h2 className="text-xl font-semibold mb-2">
              {coin.name} (${coin.symbol})
            </h2>
            <img
              src={formatIpfsUrl(coin.image)}
              alt="coin preview"
              className="w-full max-h-64 object-contain rounded mb-2"
            />
            <p className="text-gray-700">{coin.description}</p>
            <p className="text-sm text-green-600 mt-2">Metadata: {coin.uri}</p>
          </motion.div>
        )}

        {coin && (
          <motion.button
            onClick={deployCoin}
            disabled={status === 'deploying'}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            {status === 'deploying' ? 'Deploying...' : '🚀 Deploy Coin to Zora'}
          </motion.button>
        )}
      </div>
    </main>
  );
}
