import React, { useState } from 'react';

interface MintButtonProps {
  ticker: string;
  artwork: string;
  disabled?: boolean; // Add optional disabled prop
}

export default function MintButton({ ticker, artwork, disabled = false }: MintButtonProps) {
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        disabled={disabled || isMinting}
        className={`w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors ${
          (disabled || isMinting) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isMinting ? 'Minting...' : `Mint $${ticker}`}
      </button>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
}