export interface VideoData {
  id: string;
  title: string;
  thumbnail?: string;
  publishDate: string;
}

export interface KPIData {
  shareOfEngagement: {
    likes: number;
    shares: number;
    saves: number;
    comments: number;
  };
  qualityCommentsRatio: number;
  engagementGrowth: {
    weekOnWeek: number;
    monthOnMonth: number;
  };
}

export interface DashboardData {
  videoId: string;
  videoTitle: string;
  kpis: KPIData;
  commentQuality: CommentQualityData;
  sentiment: SentimentData;
  spam: SpamData;
  conversion: ConversionData;
}

export interface CommentQualityData {
  relevantPercentage: number;
  qualityDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  topComments: Array<{
    text: string;
    score: number;
    engagement: number;
  }>;
}

export interface SentimentData {
  breakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  categories: Array<{
    name: string;
    percentage: number;
    sentiment: {
      positive: number;
      neutral: number;
      negative: number;
    };
  }>;
  keywords: Array<{
    word: string;
    frequency: number;
    category: string;
  }>;
}

export interface SpamData {
  spamPercentage: number;
  trend: Array<{
    date: string;
    spam: number;
    genuine: number;
  }>;
  detectionAccuracy: number;
}

export interface ConversionData {
  leadsFromComments: number;
  sentimentToSalesCorrelation: number;
  roiEstimate: {
    timeSaved: number;
    revenueUplift: number;
    totalValue: number;
  };
  conversionTrend: Array<{
    date: string;
    conversions: number;
    sentiment: number;
  }>;
}

export interface FilterOptions {
  type: 'all' | 'timeline' | 'video';
  value: string;
}

export interface TimelineOption {
  id: string;
  label: string;
  description: string;
}