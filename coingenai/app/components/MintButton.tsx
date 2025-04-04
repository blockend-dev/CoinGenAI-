'use client';
import { useState } from 'react';

interface MintButtonProps {
    ticker: string;
    artwork: string;
    disabled?: boolean; 
  }

export function MintButton({ ticker, artwork }: { ticker: string, artwork: string }) {
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const handleMint = async () => {
    setIsMinting(true);
    setError(null);
    
    try {
      const res = await fetch('/api/mint', {
        method: 'POST',
        body: JSON.stringify({ ticker, artwork })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      window.open(data.explorerLink, '_blank');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleMint}
        disabled={isMinting}
        className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {isMinting ? 'Minting...' : `Mint $${ticker}`}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}