
import React from 'react';
import { LucideIcon } from 'lucide-react';
import FlippableCard from './FlippableCard';

interface MathConceptCardProps {
  title: string;
  icon: LucideIcon;
  shortDescription: string;
  formula: React.ReactNode;
  detailedContent: React.ReactNode;
}

const MathConceptCard: React.FC<MathConceptCardProps> = ({
  title,
  icon: Icon,
  shortDescription,
  formula,
  detailedContent,
}) => {
  const frontContent = (
    <>
      <div className="flex items-center space-x-2 mb-4">
        <Icon className="h-6 w-6 text-[#00FFD1]" />
        <h3 className="text-[#00FFD1] font-bold text-xl">{title}</h3>
      </div>
      <div className="flex flex-col flex-grow justify-between">
        <p className="text-gray-300 text-base mb-4 line-clamp-3">{shortDescription}</p>
        <div className="mt-auto pt-4 border-t border-[#00FFD1]/10">
          <div className="text-center bg-black/20 p-3 rounded">
            <div className="text-red-400 text-lg font-mono">{formula}</div>
          </div>
        </div>
      </div>
    </>
  );

  const backContent = (
    <div className="grid grid-cols-1 gap-4 h-full">
      <div className="overflow-hidden text-base text-gray-200">
        {detailedContent}
      </div>
    </div>
  );

  return (
    <FlippableCard 
      frontContent={frontContent}
      backContent={backContent}
    />
  );
};

export default MathConceptCard;
