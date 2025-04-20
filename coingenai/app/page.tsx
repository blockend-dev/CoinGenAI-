"use client";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract } from "wagmi";
import { createCoinCall } from "@zoralabs/coins-sdk";
import { Address } from "viem";
import { base } from "viem/chains";
import { toast } from "react-toastify";

export default function CoinGenAI() {
  const { address,isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [generating, setGenerating] = useState(false);
  const [coin, setCoin] = useState<any>(null);
  const [status, setStatus] = useState("idle");
  const { writeContract } = useWriteContract();

  const generateCoin = async () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
  
    setGenerating(true);
    toast.info("Analyzing Farcaster trends...");
  
    try {
      const res = await fetch("/api/generate-coin-idea");
      const idea = await res.json();
  
      const coinName = idea.coinIdeas[0];
      const description = idea.summary;
      const imageURI = idea.image
      
      console.log(JSON.stringify({
        name: coinName,
        description,
        image: imageURI,
        creator: address,
      }))
      toast.info("Generating coin artwork & metadata...");
  
      const metaRes = await fetch("/api/generate-metadata", {
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
        symbol: coinName.replace(/\s+/g, "").slice(0, 6).toUpperCase(),
        description,
        image: meta.image,
        uri: meta.metadataUrl,
      });
  
      toast.success("Coin ready to deploy!");
    } catch (err) {
      console.error("Error:", err);
      toast.error("Error generating coin. Try again.");
    } finally {
      setGenerating(false);
    }
  };
  

  const deployCoin = async () => {
    if (!address || !coin) return;
    setStatus("deploying");

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
        setStatus("done");
        toast.success("🎉 Coin deployed successfully!");
      },
      onError: (err) => {
        console.error(err);
        setStatus("error");
        toast.error("Failed to deploy coin.");
      },
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 py-10 px-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">🚀 CoinGenAI</h1>
          <ConnectButton />
        </div>

        <button
          onClick={generateCoin}
          disabled={generating || status === "deploying"}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 mb-6 transition"
        >
          {generating ? "Generating Coin..." : "✨ Generate Coin from Farcaster"}
        </button>

        {coin && (
          <div className="bg-gray-50 p-4 rounded shadow mb-6">
            <h2 className="text-xl font-semibold mb-2">{coin.name} (${coin.symbol})</h2>
            <img src={coin.image} alt="coin preview" className="w-full rounded mb-2" />
            <p className="text-gray-700">{coin.description}</p>
            <p className="text-sm text-green-600 mt-2">Metadata: {coin.uri}</p>
          </div>
        )}

        {coin && (
          <button
            onClick={deployCoin}
            disabled={status === "deploying"}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            {status === "deploying" ? "Deploying..." : "🚀 Deploy Coin to Zora"}
          </button>
        )}
      </div>
    </main>
  );
}
