import React from 'react';
import { TrendingUp, MessageSquare, Heart, Share2, Bookmark } from 'lucide-react';
import { KPIData } from '../types/dashboard';
import { PieChart } from './charts/PieChart';

interface KPISectionProps {
  data: KPIData;
}

export const KPISection: React.FC<KPISectionProps> = ({ data }) => {
  const engagementData = [
    { label: 'Likes', value: data.shareOfEngagement.likes, color: '#EF4444' },
    { label: 'Shares', value: data.shareOfEngagement.shares, color: '#3B82F6' },
    { label: 'Saves', value: data.shareOfEngagement.saves, color: '#10B981' },
    { label: 'Comments', value: data.shareOfEngagement.comments, color: '#8B5CF6' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <TrendingUp className="text-blue-600" size={28} />
        High-Level KPIs
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="text-purple-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Quality Comments Ratio</h3>
            </div>
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {data.qualityCommentsRatio}%
            </div>
            <p className="text-gray-600">High-quality vs total comments</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Engagement Growth</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  +{data.engagementGrowth.weekOnWeek}%
                </div>
                <div className="text-sm text-gray-600">Week-on-Week</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">
                  +{data.engagementGrowth.monthOnMonth}%
                </div>
                <div className="text-sm text-gray-600">Month-on-Month</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Share of Engagement</h3>
          <PieChart data={engagementData} size={280} />
        </div>
      </div>
    </div>
  );
};