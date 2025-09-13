import React from 'react';

interface WordCloudProps {
  words: Array<{ word: string; frequency: number; category: string }>;
}

export const WordCloud: React.FC<WordCloudProps> = ({ words }) => {
  const maxFrequency = Math.max(...words.map(w => w.frequency));
  
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      skincare: '#10B981',
      makeup: '#8B5CF6',
      fragrance: '#F59E0B',
      general: '#3B82F6'
    };
    return colors[category] || '#6B7280';
  };

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg">
      {words.map((word, index) => {
        const fontSize = Math.max(12, (word.frequency / maxFrequency) * 24 + 12);
        return (
          <span
            key={index}
            className="hover:scale-110 transition-transform cursor-pointer font-medium"
            style={{ 
              fontSize: `${fontSize}px`,
              color: getCategoryColor(word.category)
            }}
            title={`${word.word}: ${word.frequency} mentions`}
          >
            {word.word}
          </span>
        );
      })}
    </div>
  );
};