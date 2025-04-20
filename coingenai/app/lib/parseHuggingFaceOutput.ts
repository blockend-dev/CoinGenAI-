export function parseHuggingFaceOutput(raw: string) {
  const extractArray = (label: string) => {
    const match = raw.match(new RegExp(`${label}:\\s*\\[(.*?)\\]`, 's'));
    if (!match) return [];
    return match[1]
      .split(',')
      .map(s => s.trim().replace(/^"|"$/g, '').replace(/^\$/, ''))
      .filter(Boolean);
  };

  const extractString = (label: string) => {
    const match = raw.match(new RegExp(`${label}:\\s*(.+)`));
    return match ? match[1].trim() : '';
  };

  return {
    keywords: extractArray('Keywords'),
    summary: extractString('Summary'),
    sentiment: extractString('Sentiment'),
    coinIdeas: extractArray('CoinIdeas'),
  };
}
