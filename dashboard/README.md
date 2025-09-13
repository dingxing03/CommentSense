# Video Engagement Analytics Dashboard

This is a React-based dashboard that displays analytics for video comments, including sentiment analysis, spam detection, and quality metrics.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy the CSV data files to the public directory:
```bash
# Copy the cleaned_comments.csv file from Dataset/ to public/
cp Dataset/cleaned_comments.csv public/
cp Dataset/comments.csv public/
```

3. Start the development server:
```bash
npm run dev
```

## Data Structure

The dashboard expects CSV files with the following columns:
- `videoId`: Video identifier
- `textOriginal`: Original comment text
- `likeCount`: Number of likes
- `spam`: Spam classification (clean, mild gibberish, word salad, noise)
- `cleaned`: Preprocessed text
- `final_sentiment`: Sentiment classification (positive, negative, neutral)
- `category`: Comment category (skincare, makeup, hair, other)
- `quality_score`: Quality score (0-1)
- `is_quality`: Boolean indicating if comment is high quality
- `relevance_score`: Relevance score (0-1)

## Features

- **KPI Dashboard**: Shows engagement metrics and quality ratios
- **Comment Quality Analysis**: Displays quality distribution and top comments
- **Sentiment Analysis**: Shows sentiment breakdown by category
- **Spam Filtering**: Displays spam detection metrics
- **Conversion Metrics**: Shows business impact and ROI estimates
- **Video Filtering**: Filter data by specific video or timeline

## Categories

The system supports four main categories:
- **Skincare**: Comments related to skincare products and routines
- **Makeup**: Comments about makeup tutorials and products
- **Hair**: Comments about hair care and styling
- **Other**: General comments not fitting the above categories
