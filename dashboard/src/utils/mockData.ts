import { KPIData, CommentQualityData, SentimentData, SpamData, ConversionData, VideoData, DashboardData } from '../types/dashboard';

export const timelineOptions = [
  { id: 'last30', label: 'Last 30 Days', description: 'Recent engagement data' },
  { id: 'quarterly', label: 'This Quarter', description: 'Q1 2024 performance' },
  { id: 'yearly', label: 'This Year', description: '2024 annual overview' }
];

export const mockVideos: VideoData[] = [
  {
    id: 'all',
    title: 'All Videos',
    publishDate: ''
  },
  {
    id: 'video-001',
    title: 'Summer Skincare Routine 2024',
    publishDate: '2024-01-15'
  },
  {
    id: 'video-002',
    title: 'Everyday Makeup Tutorial',
    publishDate: '2024-01-10'
  },
  {
    id: 'video-003',
    title: 'Fragrance Collection Review',
    publishDate: '2024-01-05'
  },
  {
    id: 'video-004',
    title: 'Hair Care Tips for Winter',
    publishDate: '2024-01-01'
  }
];

const baseKPIData: KPIData = {
  shareOfEngagement: {
    likes: 45,
    shares: 20,
    saves: 15,
    comments: 20
  },
  qualityCommentsRatio: 78,
  engagementGrowth: {
    weekOnWeek: 12.5,
    monthOnMonth: 28.3
  }
};

const baseCommentQualityData: CommentQualityData = {
  relevantPercentage: 82,
  qualityDistribution: {
    high: 35,
    medium: 47,
    low: 18
  },
  topComments: [
    {
      text: "This foundation matches my skin tone perfectly! Finally found my holy grail product.",
      score: 92,
      engagement: 156
    },
    {
      text: "The tutorial was incredibly detailed. Love how you explained each step!",
      score: 88,
      engagement: 124
    },
    {
      text: "Been using this skincare routine for 3 weeks and seeing amazing results already.",
      score: 85,
      engagement: 98
    }
  ]
};

const baseSentimentData: SentimentData = {
  breakdown: {
    positive: 68,
    neutral: 22,
    negative: 10
  },
  categories: [
    {
      name: "Skincare",
      percentage: 35,
      sentiment: { positive: 72, neutral: 18, negative: 10 }
    },
    {
      name: "Makeup",
      percentage: 28,
      sentiment: { positive: 65, neutral: 25, negative: 10 }
    },
    {
      name: "Fragrance",
      percentage: 20,
      sentiment: { positive: 70, neutral: 20, negative: 10 }
    },
    {
      name: "Hair Care",
      percentage: 17,
      sentiment: { positive: 60, neutral: 30, negative: 10 }
    }
  ],
  keywords: [
    { word: "amazing", frequency: 89, category: "skincare" },
    { word: "perfect", frequency: 76, category: "makeup" },
    { word: "love", frequency: 72, category: "general" },
    { word: "holy grail", frequency: 68, category: "skincare" },
    { word: "gorgeous", frequency: 54, category: "makeup" },
    { word: "recommend", frequency: 45, category: "general" },
    { word: "tutorial", frequency: 43, category: "general" },
    { word: "results", frequency: 41, category: "skincare" }
  ]
};

const baseSpamData: SpamData = {
  spamPercentage: 8.5,
  detectionAccuracy: 94.2,
  trend: [
    { date: "Week 1", spam: 12, genuine: 88 },
    { date: "Week 2", spam: 10, genuine: 90 },
    { date: "Week 3", spam: 9, genuine: 91 },
    { date: "Week 4", spam: 8.5, genuine: 91.5 }
  ]
};

const baseConversionData: ConversionData = {
  leadsFromComments: 247,
  sentimentToSalesCorrelation: 0.78,
  roiEstimate: {
    timeSaved: 15.2,
    revenueUplift: 23.8,
    totalValue: 45680
  },
  conversionTrend: [
    { date: "Jan", conversions: 156, sentiment: 0.65 },
    { date: "Feb", conversions: 189, sentiment: 0.68 },
    { date: "Mar", conversions: 223, sentiment: 0.72 },
    { date: "Apr", conversions: 247, sentiment: 0.78 }
  ]
};

// Generate mock data for individual videos with variations
const generateVideoData = (videoId: string, videoTitle: string): DashboardData => {
  const variation = Math.random() * 0.3 - 0.15; // ±15% variation
  
  return {
    videoId,
    videoTitle,
    kpis: {
      shareOfEngagement: {
        likes: Math.max(20, Math.round(baseKPIData.shareOfEngagement.likes * (1 + variation))),
        shares: Math.max(10, Math.round(baseKPIData.shareOfEngagement.shares * (1 + variation))),
        saves: Math.max(5, Math.round(baseKPIData.shareOfEngagement.saves * (1 + variation))),
        comments: Math.max(15, Math.round(baseKPIData.shareOfEngagement.comments * (1 + variation)))
      },
      qualityCommentsRatio: Math.max(60, Math.round(baseKPIData.qualityCommentsRatio * (1 + variation * 0.5))),
      engagementGrowth: {
        weekOnWeek: Math.round(baseKPIData.engagementGrowth.weekOnWeek * (1 + variation) * 10) / 10,
        monthOnMonth: Math.round(baseKPIData.engagementGrowth.monthOnMonth * (1 + variation) * 10) / 10
      }
    },
    commentQuality: {
      relevantPercentage: Math.max(70, Math.round(baseCommentQualityData.relevantPercentage * (1 + variation * 0.3))),
      qualityDistribution: {
        high: Math.max(25, Math.round(baseCommentQualityData.qualityDistribution.high * (1 + variation))),
        medium: Math.max(35, Math.round(baseCommentQualityData.qualityDistribution.medium * (1 + variation * 0.5))),
        low: Math.max(10, Math.round(baseCommentQualityData.qualityDistribution.low * (1 - variation)))
      },
      topComments: baseCommentQualityData.topComments.map(comment => ({
        ...comment,
        score: Math.max(70, Math.round(comment.score * (1 + variation * 0.2))),
        engagement: Math.max(50, Math.round(comment.engagement * (1 + variation)))
      }))
    },
    sentiment: {
      breakdown: {
        positive: Math.max(50, Math.round(baseSentimentData.breakdown.positive * (1 + variation * 0.3))),
        neutral: Math.max(15, Math.round(baseSentimentData.breakdown.neutral * (1 + variation * 0.2))),
        negative: Math.max(5, Math.round(baseSentimentData.breakdown.negative * (1 - variation * 0.5)))
      },
      categories: baseSentimentData.categories,
      keywords: baseSentimentData.keywords
    },
    spam: {
      spamPercentage: Math.max(3, Math.round(baseSpamData.spamPercentage * (1 + variation * 0.5) * 10) / 10),
      detectionAccuracy: Math.max(90, Math.round(baseSpamData.detectionAccuracy * (1 + variation * 0.1) * 10) / 10),
      trend: baseSpamData.trend
    },
    conversion: {
      leadsFromComments: Math.max(100, Math.round(baseConversionData.leadsFromComments * (1 + variation))),
      sentimentToSalesCorrelation: Math.max(0.6, Math.round(baseConversionData.sentimentToSalesCorrelation * (1 + variation * 0.2) * 100) / 100),
      roiEstimate: {
        timeSaved: Math.max(10, Math.round(baseConversionData.roiEstimate.timeSaved * (1 + variation) * 10) / 10),
        revenueUplift: Math.max(15, Math.round(baseConversionData.roiEstimate.revenueUplift * (1 + variation) * 10) / 10),
        totalValue: Math.max(30000, Math.round(baseConversionData.roiEstimate.totalValue * (1 + variation)))
      },
      conversionTrend: baseConversionData.conversionTrend
    }
  };
};

// Generate data for all videos
export const mockDashboardData: DashboardData[] = [
  {
    videoId: 'all',
    videoTitle: 'All Videos',
    kpis: baseKPIData,
    commentQuality: baseCommentQualityData,
    sentiment: baseSentimentData,
    spam: baseSpamData,
    conversion: baseConversionData
  },
  ...mockVideos.slice(1).map(video => generateVideoData(video.id, video.title))
];

export const getDashboardData = (videoId: string): DashboardData => {
  return mockDashboardData.find(data => data.videoId === videoId) || mockDashboardData[0];
};

// Legacy exports for backward compatibility
export const mockKPIData = baseKPIData;
export const mockCommentQualityData = baseCommentQualityData;
export const mockSentimentData = baseSentimentData;
export const mockSpamData = baseSpamData;
export const mockConversionData = baseConversionData;