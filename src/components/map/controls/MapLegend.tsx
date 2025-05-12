
import React from 'react';
import BaseControl from './BaseControl';
import { cn } from '@/lib/utils';

interface LegendItem {
  color?: string;
  label: string;
  hasAnimation?: boolean;
  icon?: string;
}

interface MapLegendProps {
  title?: string;
  items?: LegendItem[];
  className?: string;
}

const defaultItems: LegendItem[] = [
  { color: 'bg-green-400', label: 'Delivered' },
  { color: 'bg-blue-400', label: 'Destination' },
  { icon: 'warehouse', label: 'Warehouse (Nairobi)' },
  { icon: 'plane', label: 'Air Shipment' },
  { icon: 'ship', label: 'Sea Shipment' }
];

const MapLegend: React.FC<MapLegendProps> = ({ 
  title = 'Map Legend',
  items = defaultItems,
  className 
}) => {
  // Render an icon based on the icon type
  const renderIcon = (item: LegendItem) => {
    if (item.color) {
      // Render a colored dot
      return (
        <span 
          className={`w-3 h-3 rounded-full ${item.color} ${item.hasAnimation ? 'error-flicker' : ''}`}
        ></span>
      );
    } else if (item.icon) {
      // Render an icon SVG
      let svgPath = '';
      let extraPath = null;
      
      switch (item.icon) {
        case 'warehouse':
          svgPath = 'M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35a2 2 0 0 1 .56-1.39l8-8a2 2 0 0 1 2.83 0l8 8A2 2 0 0 1 22 8.35Z';
          extraPath = <path d="M12 22V9" />;
          break;
        case 'plane':
          svgPath = 'M22 12L18 8H7.8c-.5 0-.9.3-1.2.6L2 12l4.6 3.4c.3.2.7.6 1.2.6H18l4-4z';
          break;
        case 'ship':
          svgPath = 'M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 1.3 0 1.9-.5 2.5-1 .6-.5 1.2-1 2.5-1 1.3 0 1.9.5 2.5 1';
          extraPath = <path d="M20 15v-3a8 8 0 0 0-16 0v3" />;
          break;
        default:
          svgPath = '';
      }
      
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d={svgPath}></path>
          {extraPath}
        </svg>
      );
    }
    
    // Default empty element if no icon or color
    return <span className="w-3 h-3"></span>;
  };
  
  return (
    <BaseControl position="bottom-left" className={cn("p-3 text-xs", className)}>
      <div className="text-white mb-2 font-semibold">{title}</div>
      <div className="space-y-1.5">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            {renderIcon(item)}
            <span className="text-gray-200">{item.label}</span>
          </div>
        ))}
      </div>
    </BaseControl>
  );
};

// Memoize the component to prevent unnecessary rerenders
export default React.memo(MapLegend);
