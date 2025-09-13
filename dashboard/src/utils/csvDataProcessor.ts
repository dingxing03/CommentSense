import { KPIData, CommentQualityData, SentimentData, SpamData, ConversionData, VideoData, DashboardData } from '../types/dashboard';

export interface CSVComment {
  kind: string;
  commentId: string;
  channelId: string;
  videoId: string;
  authorId: string;
  textOriginal: string;
  parentCommentId?: string;
  likeCount: number;
  publishedAt: string;
  updatedAt: string;
  translated: string;
  spam: string;
  cleaned: string;
  emotion: string;
  sentiment_scores: string;
  final_sentiment: string;
  category: string;
  relevance_score: number;
  sentiment_score: number;
  like_score: number;
  quality_score: number;
  is_quality: boolean;
}

class CSVDataProcessor {
  private comments: CSVComment[] = [];
  private isLoaded: boolean = false;
  private spamMap: Map<string, string> = new Map(); // commentId -> spam
  private allComments: CSVComment[] = []; // <-- Add this line

  async loadCSVData(): Promise<void> {
    try {
      // Load cleaned_comments.csv as before
      const response = await fetch('Dataset/cleaned_comments.csv');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const csvText = await response.text();
      this.comments = this.parseCSV(csvText);

      // Load comments.csv for spam column and all comments
      const spamResponse = await fetch('Dataset/comments.csv');
      if (spamResponse.ok) {
        const spamCsvText = await spamResponse.text();
        this.spamMap = this.extractSpamMap(spamCsvText);
        this.allComments = this.parseCSV(spamCsvText); // <-- Parse all comments
      } else {
        this.spamMap = new Map();
        this.allComments = [];
      }

      this.isLoaded = true;
      console.log(`Loaded ${this.comments.length} comments from CSV`);
    } catch (error) {
      console.error('Error loading CSV data:', error);
      console.log('Using fallback sample data');
      this.comments = this.getSampleData();
      this.spamMap = new Map();
      this.allComments = [];
      this.isLoaded = true;
    }
  }

  private extractSpamMap(csvText: string): Map<string, string> {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return new Map();
    const headers = this.parseCSVLine(lines[0]);
    const commentIdIdx = headers.findIndex(h => h.trim() === 'commentId');
    const spamIdx = headers.findIndex(h => h.trim() === 'spam');
    const map = new Map<string, string>();
    lines.slice(1).forEach(line => {
      const values = this.parseCSVLine(line);
      const commentId = values[commentIdIdx]?.trim();
      const spam = values[spamIdx]?.trim();
      if (commentId) map.set(commentId, spam);
    });
    return map;
  }

  private parseCSV(csvText: string): CSVComment[] {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = this.parseCSVLine(lines[0]);
    
    return lines.slice(1).map(line => {
      const values = this.parseCSVLine(line);
      const comment: any = {};
      
      headers.forEach((header, index) => {
        const cleanHeader = header.trim();
        let value = values[index]?.trim() || '';
        
        // Parse specific fields
        switch (cleanHeader) {
          case 'likeCount':
          case 'relevance_score':
          case 'sentiment_score':
          case 'like_score':
          case 'quality_score':
            comment[cleanHeader] = parseFloat(value) || 0;
            break;
          case 'is_quality':
            comment[cleanHeader] = value.toLowerCase() === 'true';
            break;
          default:
            comment[cleanHeader] = value;
        }
      });
      
      return comment as CSVComment;
    }).filter(comment => comment.commentId && comment.commentId !== ''); // Filter out empty rows
  }

  private parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if ((char === '"' || char === "'") && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar && inQuotes) {
        inQuotes = false;
        quoteChar = '';
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  private parseSentimentScores(scoresStr: string): { positive: number; negative: number; neutral: number } {
    try {
      // Parse the sentiment scores string that looks like: "{'positive': 0.995, 'negative': 0.933, 'neutral': 0.983}"
      const cleaned = scoresStr.replace(/'/g, '"');
      const scores = JSON.parse(cleaned);
      return {
        positive: scores.positive || 0,
        negative: scores.negative || 0,
        neutral: scores.neutral || 0
      };
    } catch {
      return { positive: 0, negative: 0, neutral: 0 };
    }
  }

  getVideoList(): VideoData[] {
    if (!this.isLoaded || this.comments.length === 0) {
      return [
        {
          id: 'all',
          title: 'All Videos',
          publishDate: ''
        }
      ];
    }

    // Get unique video IDs and filter out any invalid ones
    const videoIds = [...new Set(this.comments.map(c => c.videoId))]
      .filter(id => id && id !== '' && !isNaN(Number(id)))
      .sort((a, b) => Number(a) - Number(b));
    
    const videos: VideoData[] = [
      {
        id: 'all',
        title: 'All Videos',
        publishDate: ''
      }
    ];

    videoIds.forEach((videoId) => {
      const videoComments = this.comments.filter(c => c.videoId === videoId);
      const sampleComment = videoComments[0];
      
      videos.push({
        id: videoId,
        title: `Video ${videoId}`,
        publishDate: sampleComment?.publishedAt?.split(' ')[0] || ''
      });
    });

    return videos;
  }

  generateDashboardData(videoId: string = 'all'): DashboardData {
    if (!this.isLoaded || this.comments.length === 0) {
      return this.getDefaultDashboardData(videoId);
    }

    const filteredComments = videoId === 'all' 
      ? this.comments 
      : this.comments.filter(c => c.videoId === videoId);

    if (filteredComments.length === 0) {
      return this.getDefaultDashboardData(videoId);
    }

    return {
      videoId,
      videoTitle: videoId === 'all' ? 'All Videos' : `Video ${videoId}`,
      kpis: this.generateKPIData(filteredComments),
      commentQuality: this.generateCommentQualityData(filteredComments),
      sentiment: this.generateSentimentData(filteredComments),
      spam: this.generateSpamData(filteredComments),
      conversion: this.generateConversionData(filteredComments)
    };
  }

  private generateKPIData(comments: CSVComment[]): KPIData {
    const totalLikes = comments.reduce((sum, c) => sum + c.likeCount, 0);
    const qualityComments = comments.filter(c => c.is_quality).length;
    const qualityRatio = Math.round((qualityComments / comments.length) * 100);

    // Simulate engagement distribution
    return {
      shareOfEngagement: {
        likes: Math.round(totalLikes * 0.45 / comments.length),
        shares: Math.round(totalLikes * 0.20 / comments.length),
        saves: Math.round(totalLikes * 0.15 / comments.length),
        comments: Math.round(totalLikes * 0.20 / comments.length)
      },
      qualityCommentsRatio: qualityRatio,
      engagementGrowth: {
        weekOnWeek: Math.round((Math.random() * 20 - 5) * 10) / 10, // -5% to +15%
        monthOnMonth: Math.round((Math.random() * 40 - 10) * 10) / 10 // -10% to +30%
      }
    };
  }

  private generateCommentQualityData(comments: CSVComment[]): CommentQualityData {
    const qualityComments = comments.filter(c => c.is_quality);
    const relevantComments = comments.filter(c => c.relevance_score > 0);
    
    // Calculate quality distribution
    const highQuality = comments.filter(c => c.quality_score >= 0.1).length;
    const mediumQuality = comments.filter(c => c.quality_score >= 0.05 && c.quality_score < 0.1).length;
    const lowQuality = comments.length - highQuality - mediumQuality;

    const total = comments.length;
    
    // Get top comments by quality score
    const topComments = comments
      .filter(c => c.is_quality && c.textOriginal.length > 20)
      .sort((a, b) => (b.quality_score * 100) - (a.quality_score * 100))
      .slice(0, 3)
      .map(c => ({
        text: c.textOriginal.length > 100 ? c.textOriginal.substring(0, 100) + '...' : c.textOriginal,
        score: Math.round(c.quality_score * 100),
        engagement: c.likeCount
      }));

    return {
      relevantPercentage: Math.round((relevantComments.length / total) * 100),
      qualityDistribution: {
        high: Math.round((highQuality / total) * 100),
        medium: Math.round((mediumQuality / total) * 100),
        low: Math.round((lowQuality / total) * 100)
      },
      topComments
    };
  }

  private generateSentimentData(comments: CSVComment[]): SentimentData {
    // Calculate sentiment breakdown
    const sentimentCounts = {
      positive: comments.filter(c => c.final_sentiment === 'positive').length,
      neutral: comments.filter(c => c.final_sentiment === 'neutral').length,
      negative: comments.filter(c => c.final_sentiment === 'negative').length
    };

    const total = comments.length;

    // Calculate category breakdown - only include the 4 expected categories
    const categoryMap = new Map<string, { count: number; sentiments: { positive: number; neutral: number; negative: number } }>();
    
    comments.forEach(comment => {
      // Normalize category to only include the 4 expected categories
      let category = comment.category || 'other';
      
      // Map any unexpected categories to 'other'
      if (!['skincare', 'makeup', 'hair', 'other'].includes(category.toLowerCase())) {
        category = 'other';
      }
      
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { count: 0, sentiments: { positive: 0, neutral: 0, negative: 0 } });
      }
      
      const categoryData = categoryMap.get(category)!;
      categoryData.count++;
      categoryData.sentiments[comment.final_sentiment as keyof typeof categoryData.sentiments]++;
    });

    // Only include the 4 expected categories, sorted by count
    const categories = Array.from(categoryMap.entries())
      .filter(([name]) => ['skincare', 'makeup', 'hair', 'other'].includes(name.toLowerCase()))
      .map(([name, data]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        percentage: Math.round((data.count / total) * 100),
        sentiment: {
          positive: Math.round((data.sentiments.positive / data.count) * 100),
          neutral: Math.round((data.sentiments.neutral / data.count) * 100),
          negative: Math.round((data.sentiments.negative / data.count) * 100)
        }
      }))
      .sort((a, b) => b.percentage - a.percentage);

    // Extract keywords from cleaned text
    const keywords = this.extractKeywords(comments);

    return {
      breakdown: {
        positive: Math.round((sentimentCounts.positive / total) * 100),
        neutral: Math.round((sentimentCounts.neutral / total) * 100),
        negative: Math.round((sentimentCounts.negative / total) * 100)
      },
      categories,
      keywords
    };
  }

  private extractKeywords(comments: CSVComment[]): Array<{ word: string; frequency: number; category: string }> {
    const wordCounts = new Map<string, { count: number; categories: Set<string> }>();
    
    comments.forEach(comment => {
      const words = comment.cleaned
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3 && !this.isStopWord(word));
        
      words.forEach(word => {
        if (!wordCounts.has(word)) {
          wordCounts.set(word, { count: 0, categories: new Set() });
        }
        const wordData = wordCounts.get(word)!;
        wordData.count++;
        wordData.categories.add(comment.category || 'general');
      });
    });

    return Array.from(wordCounts.entries())
      .map(([word, data]) => ({
        word,
        frequency: data.count,
        category: Array.from(data.categories)[0] // Take the first category
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 15); // Top 15 keywords
  }

  private isStopWord(word: string): boolean {
    const stopWords = ['the', 'and', 'but', 'for', 'are', 'with', 'this', 'that', 'have', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'well', 'were'];
    return stopWords.includes(word);
  }

  private generateSpamData(comments: CSVComment[]): SpamData {
    // If a video filter is applied, filter allComments by videoId
    let spamSource: CSVComment[];
    if (this.allComments.length > 0 && comments.length > 0) {
      const videoId = comments[0].videoId;
      if (videoId && videoId !== 'all') {
        spamSource = this.allComments.filter(c => c.videoId === videoId);
      } else {
        spamSource = this.allComments;
      }
    } else {
      spamSource = comments;
    }

    const spamComments = spamSource.filter(c => c.spam === 'noise').length;
    const spamPercentage = spamSource.length > 0 ? (spamComments / spamSource.length) * 100 : 0;

    // Generate trend data (simulated weekly data)
    const trend = [
      { date: "Week 1", spam: Math.round(spamPercentage * 1.2), genuine: Math.round(100 - spamPercentage * 1.2) },
      { date: "Week 2", spam: Math.round(spamPercentage * 1.1), genuine: Math.round(100 - spamPercentage * 1.1) },
      { date: "Week 3", spam: Math.round(spamPercentage * 1.05), genuine: Math.round(100 - spamPercentage * 1.05) },
      { date: "Week 4", spam: Math.round(spamPercentage), genuine: Math.round(100 - spamPercentage) }
    ];

    return {
      spamPercentage: Math.round(spamPercentage * 10) / 10,
      detectionAccuracy: Math.round((85 + Math.random() * 10) * 10) / 10, // 85-95% accuracy
      trend
    };
  }
  

  private generateConversionData(comments: CSVComment[]): ConversionData {
    const qualityComments = comments.filter(c => c.is_quality).length;
    const positiveComments = comments.filter(c => c.final_sentiment === 'positive').length;
    
    // Estimate leads from quality comments
    const leadsFromComments = Math.round(qualityComments * 0.15); // 15% of quality comments become leads
    
    // Calculate sentiment to sales correlation
    const sentimentScore = positiveComments / comments.length;
    const sentimentToSalesCorrelation = Math.round(sentimentScore * 100) / 100;

    // Generate trend data
    const months = ['Jan', 'Feb', 'Mar', 'Apr'];
    const conversionTrend = months.map((month, index) => ({
      date: month,
      conversions: Math.round(leadsFromComments * (0.7 + index * 0.1)), // Growing trend
      sentiment: Math.round((sentimentScore * (0.8 + index * 0.05)) * 100) / 100
    }));

    return {
      leadsFromComments,
      sentimentToSalesCorrelation,
      roiEstimate: {
        timeSaved: Math.round((qualityComments / 100) * 10) / 10, // Hours saved
        revenueUplift: Math.round((sentimentScore * 30) * 10) / 10, // % revenue increase
        totalValue: Math.round(leadsFromComments * 180) // Estimated value per lead: $180
      },
      conversionTrend
    };
  }

  private getDefaultDashboardData(videoId: string): DashboardData {
    return {
      videoId,
      videoTitle: videoId === 'all' ? 'All Videos' : `Video ${videoId}`,
      kpis: {
        shareOfEngagement: { likes: 0, shares: 0, saves: 0, comments: 0 },
        qualityCommentsRatio: 0,
        engagementGrowth: { weekOnWeek: 0, monthOnMonth: 0 }
      },
      commentQuality: {
        relevantPercentage: 0,
        qualityDistribution: { high: 0, medium: 0, low: 0 },
        topComments: []
      },
      sentiment: {
        breakdown: { positive: 0, neutral: 0, negative: 0 },
        categories: [],
        keywords: []
      },
      spam: {
        spamPercentage: 0,
        detectionAccuracy: 0,
        trend: []
      },
      conversion: {
        leadsFromComments: 0,
        sentimentToSalesCorrelation: 0,
        roiEstimate: { timeSaved: 0, revenueUplift: 0, totalValue: 0 },
        conversionTrend: []
      }
    };
  }

  private getSampleData(): CSVComment[] {
    return [
      {
        kind: 'youtube#comment',
        commentId: '1',
        channelId: '15366',
        videoId: '0',
        authorId: '2425288',
        textOriginal: 'This skincare routine is amazing! I\'ve been using it for weeks and my skin looks so much better.',
        likeCount: 15,
        publishedAt: '2022-09-23 19:12:24+00:00',
        updatedAt: '2022-09-23 19:12:24+00:00',
        translated: 'This skincare routine is amazing! I\'ve been using it for weeks and my skin looks so much better.',
        spam: 'clean',
        cleaned: 'skincare routine amazing using weeks skin look much better',
        emotion: '[["joy", 0.995], ["admiration", 0.911]]',
        sentiment_scores: '{"positive": 1.906, "negative": 0.0, "neutral": 0.0}',
        final_sentiment: 'positive',
        category: 'skincare',
        relevance_score: 0.8,
        sentiment_score: 1.906,
        like_score: 0.5,
        quality_score: 0.9,
        is_quality: true
      },
      {
        kind: 'youtube#comment',
        commentId: '2',
        channelId: '15366',
        videoId: '0',
        authorId: '2425289',
        textOriginal: 'Love this makeup tutorial! The foundation looks perfect on you.',
        likeCount: 8,
        publishedAt: '2022-09-23 19:15:24+00:00',
        updatedAt: '2022-09-23 19:15:24+00:00',
        translated: 'Love this makeup tutorial! The foundation looks perfect on you.',
        spam: 'clean',
        cleaned: 'love makeup tutorial foundation look perfect',
        emotion: '[["love", 0.995], ["admiration", 0.986]]',
        sentiment_scores: '{"positive": 1.981, "negative": 0.0, "neutral": 0.0}',
        final_sentiment: 'positive',
        category: 'makeup',
        relevance_score: 0.7,
        sentiment_score: 1.981,
        like_score: 0.3,
        quality_score: 0.85,
        is_quality: true
      },
      {
        kind: 'youtube#comment',
        commentId: '3',
        channelId: '15366',
        videoId: '1',
        authorId: '2425290',
        textOriginal: 'My hair has never looked better! These tips are incredible.',
        likeCount: 12,
        publishedAt: '2022-09-23 19:18:24+00:00',
        updatedAt: '2022-09-23 19:18:24+00:00',
        translated: 'My hair has never looked better! These tips are incredible.',
        spam: 'clean',
        cleaned: 'hair never look better tip incredible',
        emotion: '[["joy", 0.932], ["admiration", 0.9]]',
        sentiment_scores: '{"positive": 1.832, "negative": 0.0, "neutral": 0.0}',
        final_sentiment: 'positive',
        category: 'hair',
        relevance_score: 0.6,
        sentiment_score: 1.832,
        like_score: 0.4,
        quality_score: 0.8,
        is_quality: true
      },
      {
        kind: 'youtube#comment',
        commentId: '4',
        channelId: '15366',
        videoId: '1',
        authorId: '2425291',
        textOriginal: 'This product is okay but nothing special.',
        likeCount: 2,
        publishedAt: '2022-09-23 19:20:24+00:00',
        updatedAt: '2022-09-23 19:20:24+00:00',
        translated: 'This product is okay but nothing special.',
        spam: 'clean',
        cleaned: 'product okay nothing special',
        emotion: '[["neutral", 0.978], ["disappointment", 0.84]]',
        sentiment_scores: '{"positive": 0.0, "negative": 0.84, "neutral": 0.978}',
        final_sentiment: 'neutral',
        category: 'other',
        relevance_score: 0.3,
        sentiment_score: 0.5,
        like_score: 0.1,
        quality_score: 0.4,
        is_quality: false
      },
      {
        kind: 'youtube#comment',
        commentId: '5',
        channelId: '15366',
        videoId: '2',
        authorId: '2425292',
        textOriginal: 'Amazing results! I can\'t believe how well this works.',
        likeCount: 18,
        publishedAt: '2022-09-23 19:22:24+00:00',
        updatedAt: '2022-09-23 19:22:24+00:00',
        translated: 'Amazing results! I can\'t believe how well this works.',
        spam: 'clean',
        cleaned: 'amazing result believe well work',
        emotion: '[["joy", 0.984], ["admiration", 0.963]]',
        sentiment_scores: '{"positive": 1.948, "negative": 0.0, "neutral": 0.0}',
        final_sentiment: 'positive',
        category: 'skincare',
        relevance_score: 0.8,
        sentiment_score: 1.948,
        like_score: 0.6,
        quality_score: 0.9,
        is_quality: true
      }
    ];
  }

  getIsLoaded(): boolean {
    return this.isLoaded;
  }

  getCommentCount(): number {
    return this.comments.length;
  }
}

export const csvDataProcessor = new CSVDataProcessor();
