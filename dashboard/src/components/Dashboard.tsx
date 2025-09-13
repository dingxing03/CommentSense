import React, { useState, useEffect } from 'react';
import { Play, RefreshCw } from 'lucide-react';
import { VideoSelector } from './VideoSelector';
import { KPISection } from './KPISection';
import { CommentQuality } from './CommentQuality';
import { SentimentAnalysis } from './SentimentAnalysis';
import { SpamFiltering } from './SpamFiltering';
import { ConversionMetrics } from './ConversionMetrics';
import { FilterOptions, VideoData, DashboardData } from '../types/dashboard';
import { csvDataProcessor } from '../utils/csvDataProcessor';
import { timelineOptions } from '../utils/mockData';

export const Dashboard: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterOptions>({ 
    type: 'all', 
    value: '' 
  });
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load CSV data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await csvDataProcessor.loadCSVData();
        const videoList = csvDataProcessor.getVideoList();
        setVideos(videoList);
        
        // Generate initial dashboard data
        const data = csvDataProcessor.generateDashboardData('all');
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading data:', error);
        // Set empty data
        setVideos([{ id: 'all', title: 'All Videos', publishDate: '' }]);
        setDashboardData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Get dashboard data based on current filter
  const getDashboardDataForFilter = () => {
    if (!csvDataProcessor.getIsLoaded()) {
      return null;
    }

    switch (selectedFilter.type) {
      case 'all':
        return csvDataProcessor.generateDashboardData('all');
      case 'timeline':
        // For demo purposes, return slightly modified data based on timeline
        const baseData = csvDataProcessor.generateDashboardData('all');
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
        return csvDataProcessor.generateDashboardData(selectedFilter.value);
      default:
        return csvDataProcessor.generateDashboardData('all');
    }
  };

  const currentDashboardData = getDashboardDataForFilter();

  const getFilterDisplayText = () => {
    switch (selectedFilter.type) {
      case 'all':
        return 'All Videos';
      case 'timeline':
        const timelineOption = timelineOptions.find(t => t.id === selectedFilter.value);
        return timelineOption?.label || 'Timeline Filter';
      case 'video':
        const video = videos.find(v => v.id === selectedFilter.value);
        return video?.title || 'Video Filter';
      default:
        return 'All Videos';
    }
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      await csvDataProcessor.loadCSVData();
      const videoList = csvDataProcessor.getVideoList();
      setVideos(videoList);
      
      const data = getDashboardDataForFilter();
      setDashboardData(data);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (!csvDataProcessor.getIsLoaded() || !currentDashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">No data available. Please ensure the CSV file is accessible.</p>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
              <button 
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                {isLoading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <VideoSelector
            videos={videos}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </div>
      </div>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* High-Level KPIs */}
          <KPISection data={currentDashboardData.kpis} />

          {/* Comment Quality & Relevance */}
          <CommentQuality data={currentDashboardData.commentQuality} />

          {/* Sentiment & Category Analysis */}
          <SentimentAnalysis data={currentDashboardData.sentiment} />

          {/* Spam & Noise Filtering */}
          <SpamFiltering data={currentDashboardData.spam} />

          {/* Conversion & Business Impact */}
          <ConversionMetrics data={currentDashboardData.conversion} />
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
