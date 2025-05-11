
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
        <Icon className="h-5 w-5 text-[#00FFD1]" />
        <h3 className="text-[#00FFD1] font-bold text-lg">{title}</h3>
      </div>
      <div className="flex flex-col flex-grow justify-between">
        <p className="text-gray-300 text-sm mb-4">{shortDescription}</p>
        <div className="mt-auto pt-4 border-t border-[#00FFD1]/10">
          <div className="text-center bg-black/20 p-3 rounded">
            {formula}
          </div>
        </div>
      </div>
    </>
  );

  const backContent = (
    <div className="overflow-auto h-full pb-6">{detailedContent}</div>
  );

  return (
    <FlippableCard 
      frontContent={frontContent}
      backContent={backContent}
    />
  );
};

export default MathConceptCard;
