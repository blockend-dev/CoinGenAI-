'use client';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import {MintButton} from './components/MintButton';

type CoinHistory = {
  ticker: string;
  artwork: string;
  timestamp: number;
};

export default function Home() {
  const { address, isConnected } = useAccount();
  const [prompt, setPrompt] = useState('');
  const [generatedTicker, setGeneratedTicker] = useState('');
  const [artwork, setArtwork] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<CoinHistory[]>([]);
  const [mintCost, setMintCost] = useState<string | null>(null);
  const [isCalculatingCost, setIsCalculatingCost] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('coinGenHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('coinGenHistory', JSON.stringify(history));
    }
  }, [history]);

  const generateCoin = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Step 1: Get AI-generated ticker
      const trendsRes = await fetch('/api/trends', {
        method: 'POST',
        body: JSON.stringify({ prompt })
      });
      
      if (!trendsRes.ok) throw new Error('Failed to generate ticker');
      const { ticker } = await trendsRes.json();
      setGeneratedTicker(ticker);

      // Step 2: Generate artwork
      const artRes = await fetch('/api/generate-art', {
        method: 'POST',
        body: JSON.stringify({ prompt })
      });
      
      if (!artRes.ok) throw new Error('Failed to generate artwork');
      const artBlob = await artRes.blob();
      const artUrl = URL.createObjectURL(artBlob);
      setArtwork(artUrl);

      // Add to history
      setHistory(prev => [
        {
          ticker,
          artwork: artUrl,
          timestamp: Date.now()
        },
        ...prev.slice(0, 9) // Keep last 10 items
      ]);

      // Estimate mint cost
      estimateMintCost();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const estimateMintCost = async () => {
    if (!generatedTicker) return;
    
    setIsCalculatingCost(true);
    try {
      const res = await fetch('/api/estimate-cost', {
        method: 'POST',
        body: JSON.stringify({ ticker: generatedTicker })
      });
      const { cost } = await res.json();
      setMintCost(cost);
    } catch (err) {
      console.error('Cost estimation failed:', err);
    } finally {
      setIsCalculatingCost(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">CoinGenAI</h1>
          <p className="text-lg text-gray-600">
            {isConnected 
              ? `Connected as ${address?.slice(0, 6)}...${address?.slice(-4)}`
              : 'Connect your wallet to mint coins'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Generation Panel */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Create Your Coin</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                    Describe your coin concept
                  </label>
                  <input
                    type="text"
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Cyberpunk doge, based frog, abstract crypto art"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={isGenerating}
                  />
                </div>
                
                <button
                  onClick={generateCoin}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </span>
                  ) : 'Generate Coin'}
                </button>

                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Generated Coin Preview */}
            {generatedTicker && artwork && (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Your Coin</h2>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                      <img 
                        src={artwork} 
                        alt="Generated coin artwork" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">${generatedTicker}</h3>
                      <p className="text-gray-600">AI-generated crypto coin</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Network</span>
                        <span className="font-medium">Base</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Royalties</span>
                        <span className="font-medium">5%</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Mint Cost</span>
                        <span className="font-medium">
                          {isCalculatingCost ? (
                            <span className="inline-block h-4 w-16 bg-gray-200 rounded animate-pulse"></span>
                          ) : mintCost ? (
                            mintCost
                          ) : (
                            '--'
                          )}
                        </span>
                      </div>
                    </div>

                    <MintButton 
                      ticker={generatedTicker} 
                      artwork={artwork} 
                      disabled={!isConnected || isCalculatingCost}
                    />
                    
                    {!isConnected && (
                      <p className="text-sm text-red-500 mt-2">
                        Connect your wallet to mint this coin
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - History */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Recent Coins</h2>
            {history.length === 0 ? (
              <p className="text-gray-500 text-sm">Your generated coins will appear here</p>
            ) : (
              <div className="space-y-4">
                {history.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => {
                      setGeneratedTicker(item.ticker);
                      setArtwork(item.artwork);
                      estimateMintCost();
                    }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded overflow-hidden">
                      <img 
                        src={item.artwork} 
                        alt={item.ticker}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">${item.ticker}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}