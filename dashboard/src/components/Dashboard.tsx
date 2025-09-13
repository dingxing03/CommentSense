import React, { useState } from 'react';
import { Play, RefreshCw } from 'lucide-react';
import { VideoSelector } from './VideoSelector';
import { KPISection } from './KPISection';
import { CommentQuality } from './CommentQuality';
import { SentimentAnalysis } from './SentimentAnalysis';
import { SpamFiltering } from './SpamFiltering';
import { ConversionMetrics } from './ConversionMetrics';
import { FilterOptions } from '../types/dashboard';
import {
  mockVideos,
  getDashboardData,
  timelineOptions
} from '../utils/mockData';

export const Dashboard: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterOptions>({ 
    type: 'all', 
    value: '' 
  });
  
  // Get dashboard data based on current filter
  const getDashboardDataForFilter = () => {
    switch (selectedFilter.type) {
      case 'all':
        return getDashboardData('all');
      case 'timeline':
        // For demo purposes, return slightly modified data based on timeline
        const baseData = getDashboardData('all');
        const timelineMultiplier = selectedFilter.value === 'yearly' ? 1.2 : 
                                 selectedFilter.value === 'quarterly' ? 1.1 : 1.0;
        return {
          ...baseData,
          kpis: {
            ...baseData.kpis,
            qualityCommentsRatio: Math.round(baseData.kpis.qualityCommentsRatio * timelineMultiplier)
          }
        };
      case 'video':
        return getDashboardData(selectedFilter.value);
      default:
        return getDashboardData('all');
    }
  };

  const dashboardData = getDashboardDataForFilter();

  const getFilterDisplayText = () => {
    switch (selectedFilter.type) {
      case 'all':
        return 'All Videos';
      case 'timeline':
        const timelineOption = timelineOptions.find(t => t.id === selectedFilter.value);
        return timelineOption?.label || 'Timeline Filter';
      case 'video':
        const video = mockVideos.find(v => v.id === selectedFilter.value);
        return video?.title || 'Video Filter';
      default:
        return 'All Videos';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Play className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Video Engagement Analytics</h1>
                <p className="text-gray-600">AI-Enhanced Insights Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Current Filter:</div>
                <div className="text-sm text-gray-600">{getFilterDisplayText()}</div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <RefreshCw size={16} />
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <VideoSelector
            videos={mockVideos}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </div>
      </div>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* High-Level KPIs */}
          <KPISection data={dashboardData.kpis} />

          {/* Comment Quality & Relevance */}
          <CommentQuality data={dashboardData.commentQuality} />

          {/* Sentiment & Category Analysis */}
          <SentimentAnalysis data={dashboardData.sentiment} />

          {/* Spam & Noise Filtering */}
          <SpamFiltering data={dashboardData.spam} />

          {/* Conversion & Business Impact */}
          <ConversionMetrics data={dashboardData.conversion} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="text-center text-gray-600 text-sm">
            <p>Powered by AI-Enhanced Analytics • Last updated: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
