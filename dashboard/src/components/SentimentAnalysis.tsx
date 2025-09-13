import React from 'react';
import { Brain, Tag, Hash } from 'lucide-react';
import { SentimentData } from '../types/dashboard';
import { PieChart } from './charts/PieChart';
import { StackedBarChart } from './charts/StackedBarChart';
import { WordCloud } from './charts/WordCloud';

interface SentimentAnalysisProps {
  data: SentimentData;
}

export const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ data }) => {
  const sentimentData = [
    { label: 'Positive', value: data.breakdown.positive, color: '#10B981' },
    { label: 'Neutral', value: data.breakdown.neutral, color: '#6B7280' },
    { label: 'Negative', value: data.breakdown.negative, color: '#EF4444' }
  ];

  const categoryData = data.categories.map(category => ({
    category: category.name,
    values: [
      { label: 'Positive', value: category.sentiment.positive, color: '#10B981' },
      { label: 'Neutral', value: category.sentiment.neutral, color: '#6B7280' },
      { label: 'Negative', value: category.sentiment.negative, color: '#EF4444' }
    ]
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <Brain className="text-purple-600" size={28} />
        Sentiment & Category Analysis
      </h2>

      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Tag className="text-purple-600" size={20} />
              Overall Sentiment Breakdown
            </h3>
            <PieChart data={sentimentData} size={280} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sentiment by Category</h3>
            <StackedBarChart data={categoryData} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Hash className="text-blue-600" size={20} />
            Keyword Cloud
          </h3>
          <WordCloud words={data.keywords} />
        </div>
      </div>
    </div>
  );
};