import React from 'react';
import { DollarSign, Target, BarChart3, Zap } from 'lucide-react';
import { ConversionData } from '../types/dashboard';
import { LineChart } from './charts/LineChart';

interface ConversionMetricsProps {
  data: ConversionData;
}

export const ConversionMetrics: React.FC<ConversionMetricsProps> = ({ data }) => {
  const conversionTrendData = data.conversionTrend.map(item => ({
    label: item.date,
    value: item.conversions
  }));

  const sentimentTrendData = data.conversionTrend.map(item => ({
    label: item.date,
    value: item.sentiment * 100
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <DollarSign className="text-green-600" size={28} />
        Conversion & Business Impact
      </h2>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Comment Leads</h3>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {data.leadsFromComments}
            </div>
            <p className="text-gray-600">Leads generated from comments</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="text-purple-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Sentiment-Sales Correlation</h3>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {(data.sentimentToSalesCorrelation * 100).toFixed(0)}%
            </div>
            <p className="text-gray-600">Positive sentiment correlation</p>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="text-green-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Total ROI Value</h3>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${data.roiEstimate.totalValue.toLocaleString()}
            </div>
            <p className="text-gray-600">Estimated total value</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Conversion Trend</h3>
            <LineChart 
              data={conversionTrendData} 
              color="#3B82F6"
              showGrid={true}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sentiment Impact on Conversions</h3>
            <LineChart 
              data={sentimentTrendData} 
              color="#8B5CF6"
              showGrid={true}
            />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">ROI Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {data.roiEstimate.timeSaved}hrs
              </div>
              <div className="text-sm text-gray-600">Time Saved in Moderation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                +{data.roiEstimate.revenueUplift}%
              </div>
              <div className="text-sm text-gray-600">Revenue Uplift</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                ${data.roiEstimate.totalValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Estimated Business Value</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};