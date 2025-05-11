
import React from 'react';
import { motion } from 'framer-motion';

interface MathCardGridProps {
  children: React.ReactNode;
}

const MathCardGrid: React.FC<MathCardGridProps> = ({ children }) => {
  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={cardVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MathCardGrid;
