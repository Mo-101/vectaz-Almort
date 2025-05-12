
import React from 'react';
import BaseControl from './BaseControl';
import { cn } from '@/lib/utils';

interface LegendItem {
  color: string;
  label: string;
  hasAnimation?: boolean;
}

interface MapLegendProps {
  title?: string;
  items?: LegendItem[];
  className?: string;
}

const defaultItems: LegendItem[] = [
  { color: 'bg-green-400', label: 'On Time' },
  { color: 'bg-amber-400', label: 'In Transit' },
  { color: 'bg-red-400', label: 'Delayed', hasAnimation: true },
  { color: 'bg-blue-400', label: 'Destination' }
];

const MapLegend: React.FC<MapLegendProps> = ({ 
  title = 'Status Legend',
  items = defaultItems,
  className 
}) => {
  return (
    <BaseControl position="bottom-left" className={cn("p-3 text-xs", className)}>
      <div className="text-white mb-2 font-semibold">{title}</div>
      <div className="space-y-1">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span 
              className={`w-3 h-3 rounded-full ${item.color} ${item.hasAnimation ? 'error-flicker' : ''}`}
            ></span>
            <span className="text-gray-200">{item.label}</span>
          </div>
        ))}
      </div>
    </BaseControl>
  );
};

// Memoize the component to prevent unnecessary rerenders
export default React.memo(MapLegend);
