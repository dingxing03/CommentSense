import React from 'react';

interface StackedBarChartProps {
  data: Array<{
    category: string;
    values: Array<{ label: string; value: number; color: string }>;
  }>;
  height?: number;
}

export const StackedBarChart: React.FC<StackedBarChartProps> = ({ data, height = 300 }) => {
  const maxTotal = Math.max(...data.map(item => 
    item.values.reduce((sum, val) => sum + val.value, 0)
  ));

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const total = item.values.reduce((sum, val) => sum + val.value, 0);
        return (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{item.category}</span>
              <span className="text-sm text-gray-500">{total}%</span>
            </div>
            <div className="flex h-8 bg-gray-100 rounded-lg overflow-hidden">
              {item.values.map((value, valueIndex) => {
                const width = (value.value / total) * 100;
                return (
                  <div
                    key={valueIndex}
                    className="flex items-center justify-center text-xs text-white font-medium hover:opacity-80 transition-opacity cursor-pointer"
                    style={{
                      width: `${width}%`,
                      backgroundColor: value.color
                    }}
                    title={`${value.label}: ${value.value}%`}
                  >
                    {width > 15 && `${value.value}%`}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};