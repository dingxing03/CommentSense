import React from 'react';
import { Video, ChevronDown, Calendar, Play } from 'lucide-react';
import { VideoData, FilterOptions } from '../types/dashboard';
import { timelineOptions } from '../utils/mockData';

interface VideoSelectorProps {
  videos: VideoData[];
  selectedFilter: FilterOptions;
  onFilterChange: (filter: FilterOptions) => void;
}

export const VideoSelector: React.FC<VideoSelectorProps> = ({
  videos,
  selectedFilter,
  onFilterChange
}) => {
  const handleFilterTypeChange = (type: 'all' | 'timeline' | 'video') => {
    let defaultValue = '';
    if (type === 'timeline') defaultValue = 'last30';
    if (type === 'video') defaultValue = videos[1]?.id || 'all';
    
    onFilterChange({ type, value: defaultValue });
  };

  const handleFilterValueChange = (value: string) => {
    onFilterChange({ ...selectedFilter, value });
  };

  const getFilterDescription = () => {
    switch (selectedFilter.type) {
      case 'all':
        return 'Showing aggregated data across all videos';
      case 'timeline':
        const timelineOption = timelineOptions.find(t => t.id === selectedFilter.value);
        return timelineOption?.description || 'Timeline-based filtering';
      case 'video':
        const video = videos.find(v => v.id === selectedFilter.value);
        return video?.publishDate ? `Published: ${new Date(video.publishDate).toLocaleDateString()}` : '';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Type Selection */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <Video className="text-blue-600" size={20} />
          <span className="text-sm font-medium text-gray-700">Filter Type:</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => handleFilterTypeChange('all')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedFilter.type === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Videos
          </button>
          <button
            onClick={() => handleFilterTypeChange('timeline')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              selectedFilter.type === 'timeline'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar size={16} />
            Timeline
          </button>
          <button
            onClick={() => handleFilterTypeChange('video')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              selectedFilter.type === 'video'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Play size={16} />
            Video ID
          </button>
        </div>
      </div>

      {/* Filter Value Selection */}
      {selectedFilter.type === 'timeline' && (
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-purple-600" size={18} />
            <span className="text-sm font-medium text-gray-700">Time Period:</span>
          </div>
          <div className="relative">
            <select
              value={selectedFilter.value}
              onChange={(e) => handleFilterValueChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors min-w-48"
            >
              {timelineOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
              size={16} 
            />
          </div>
        </div>
      )}

      {selectedFilter.type === 'video' && (
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Play className="text-green-600" size={18} />
            <span className="text-sm font-medium text-gray-700">Select Video:</span>
          </div>
          <div className="relative">
            <select
              value={selectedFilter.value}
              onChange={(e) => handleFilterValueChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors min-w-64"
            >
              {videos.slice(1).map((video) => (
                <option key={video.id} value={video.id}>
                  {video.title}
                </option>
              ))}
            </select>
            <ChevronDown 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
              size={16} 
            />
          </div>
        </div>
      )}

      {/* Filter Description */}
      {getFilterDescription() && (
        <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
          {getFilterDescription()}
        </div>
      )}
    </div>
  );
};