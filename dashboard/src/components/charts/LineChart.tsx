import React from 'react';

interface LineChartProps {
  data: Array<{ label: string; value: number }>;
  color?: string;
  height?: number;
  showGrid?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  color = '#3B82F6', 
  height = 200,
  showGrid = true 
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  const padding = 40;
  const width = 400;

  const points = data.map((point, index) => {
    const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
    const y = height - padding - ((point.value - minValue) / range) * (height - 2 * padding);
    return { x, y, ...point };
  });

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <div className="relative">
      <svg width={width} height={height} className="overflow-visible">
        {showGrid && (
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
        )}
        
        {showGrid && <rect width={width} height={height} fill="url(#grid)" />}
        
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={color}
            className="hover:r-6 transition-all cursor-pointer"
          />
        ))}
      </svg>
      
      <div className="flex justify-between mt-2 px-10 text-sm text-gray-600">
        {data.map((point, index) => (
          <span key={index}>{point.label}</span>
        ))}
      </div>
    </div>
  );
};