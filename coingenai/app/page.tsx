'use client';
import { useState } from 'react';
import {MintButton} from './components/MintButton';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [generatedTicker, setGeneratedTicker] = useState('');
  const [artwork, setArtwork] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setArtwork(URL.createObjectURL(artBlob));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          CoinGenAI
        </h1>
        <p className="text-lg text-center text-gray-600 mb-12">
          Turn your ideas into viral Zora coins with AI
        </p>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          {/* Input Section */}
          <div className="mb-8">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Describe your coin concept
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Cyberpunk doge, based frog, abstract crypto art"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isGenerating}
              />
              <button
                onClick={generateCoin}
                disabled={isGenerating}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          {/* Results Section */}
          {generatedTicker && artwork && (
            <div className="border border-gray-200 rounded-lg p-6 transition-all duration-300">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Your AI-Generated Coin: <span className="text-purple-600">{generatedTicker}</span>
              </h2>
              
              <div className="flex flex-col md:flex-row gap-8">
                {/* Artwork Preview */}
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                    <img 
                      src={artwork} 
                      alt="Generated coin artwork" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Minting Panel */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Mint</h3>
                    <p className="text-gray-600 mb-4">
                      This coin will be minted on Base with Zora Protocol.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ticker:</span>
                        <span className="font-mono">{generatedTicker}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Network:</span>
                        <span>Base</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Royalties:</span>
                        <span>5%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <MintButton ticker={generatedTicker} artwork={artwork} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* How it Works Section */}
        <div className="mt-16 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-lg mb-2">1. Describe</h3>
              <p className="text-gray-600">Tell us your coin concept in a few words</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-lg mb-2">2. Generate</h3>
              <p className="text-gray-600">AI creates the artwork and trending ticker</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-lg mb-2">3. Mint</h3>
              <p className="text-gray-600">One-click minting on Zora Protocol</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}