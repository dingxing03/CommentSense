import React from 'react';
import { Shield, TrendingDown, CheckCircle } from 'lucide-react';
import { SpamData } from '../types/dashboard';
import { LineChart } from './charts/LineChart';

interface SpamFilteringProps {
  data: SpamData;
}

export const SpamFiltering: React.FC<SpamFilteringProps> = ({ data }) => {
  const trendData = data.trend.map(item => ({
    label: item.date,
    value: item.genuine
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <Shield className="text-red-600" size={28} />
        Spam & Noise Filtering
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-red-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingDown className="text-red-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Spam Detection</h3>
            </div>
            <div className="text-4xl font-bold text-red-600 mb-2">
              {data.spamPercentage}%
            </div>
            <p className="text-gray-600">Comments identified as spam</p>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="text-green-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Detection Accuracy</h3>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-2">
              {data.detectionAccuracy}%
            </div>
            <p className="text-gray-600">AI model accuracy rate</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Genuine Engagement Trend</h3>
          <LineChart 
            data={trendData} 
            color="#10B981"
            showGrid={true}
          />
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Trend Analysis:</strong> Spam filtering effectiveness has improved over the past 4 weeks, 
              with genuine engagement increasing from 88% to 91.5%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};