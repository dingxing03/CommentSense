import React from 'react';
import { MessageCircle, Award, Users } from 'lucide-react';
import { CommentQualityData } from '../types/dashboard';
import { PieChart } from './charts/PieChart';

interface CommentQualityProps {
  data: CommentQualityData;
}

export const CommentQuality: React.FC<CommentQualityProps> = ({ data }) => {
  const qualityData = [
    { label: 'High Quality', value: data.qualityDistribution.high, color: '#10B981' },
    { label: 'Medium Quality', value: data.qualityDistribution.medium, color: '#F59E0B' },
    { label: 'Low Quality', value: data.qualityDistribution.low, color: '#EF4444' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <MessageCircle className="text-green-600" size={28} />
        Comment Quality & Relevance
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-green-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Relevant Comments</h3>
            </div>
            <div className="text-4xl font-bold text-green-600 mb-2">
              {data.relevantPercentage}%
            </div>
            <p className="text-gray-600">Comments classified as relevant</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quality Score Distribution</h3>
            <PieChart data={qualityData} size={240} />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-4">
            <Award className="text-yellow-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">Top Quality Comments</h3>
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {data.topComments.map((comment, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-yellow-400">
                <p className="text-gray-700 mb-3 italic">"{comment.text}"</p>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-4">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                      Quality Score: {comment.score}
                    </span>
                    <span className="text-gray-600">
                      {comment.engagement} engagements
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};