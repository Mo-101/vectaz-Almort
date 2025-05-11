
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FlippableCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
  cardHeight?: string;
  cardWidth?: string;
}

const FlippableCard: React.FC<FlippableCardProps> = ({
  frontContent,
  backContent,
  className,
  cardHeight = 'min-h-[300px]', // Increased height
  cardWidth = 'w-full',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsFlipped(!isFlipped);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleFlip();
    }
  };

  return (
    <div 
      className={cn(
        "perspective-1000 cursor-pointer group", 
        cardWidth,
        className
      )}
      onClick={handleFlip}
      onKeyDown={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-pressed={isFlipped}
      aria-label="Flip card to see more information"
    >
      <motion.div
        className={cn(
          "relative preserve-3d duration-500 w-full", 
          cardHeight
        )}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, onComplete: () => setIsAnimating(false) }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <motion.div 
          className={cn(
            "absolute backface-hidden w-full h-full rounded-lg",
            "border border-[#00FFD1]/20 bg-[#0A1A2F]/80 backdrop-blur-md shadow-lg",
            "p-5 flex flex-col"
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          {frontContent}
          <div className="absolute bottom-2 right-2 text-[#00FFD1]/50 text-xs">
            Click to flip
          </div>
        </motion.div>

        {/* Back */}
        <motion.div 
          className={cn(
            "absolute backface-hidden w-full h-full rounded-lg hide-scrollbar",
            "border border-[#00FFD1]/20 bg-[#0A1A2F]/90 backdrop-blur-md shadow-lg",
            "p-5 flex flex-col"
          )}
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {backContent}
          <div className="absolute bottom-2 right-2 text-[#00FFD1]/50 text-xs">
            Click to flip back
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FlippableCard;
