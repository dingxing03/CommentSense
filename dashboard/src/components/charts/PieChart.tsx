import React from 'react';

interface PieChartProps {
  data: Array<{ label: string; value: number; color: string }>;
  size?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, size = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const radius = size / 2 - 10;
  const centerX = size / 2;
  const centerY = size / 2;

  const slices = data.map((item) => {
    const percentage = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + percentage;
    currentAngle = endAngle;

    const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

    const largeArcFlag = percentage > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    return { ...item, pathData, percentage: (item.value / total) * 100 };
  });

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} className="drop-shadow-sm">
        {slices.map((slice, index) => (
          <path
            key={index}
            d={slice.pathData}
            fill={slice.color}
            className="hover:opacity-80 transition-opacity cursor-pointer"
          />
        ))}
      </svg>
      <div className="space-y-2">
        {slices.map((slice, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-gray-700">{slice.label}</span>
            <span className="font-medium">{slice.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};