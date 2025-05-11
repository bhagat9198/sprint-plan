import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  flipDuration?: number;
  className?: string;
}

export const FlipCard: React.FC<FlipCardProps> = ({
  front,
  back,
  flipDuration = 0.6,
  className = ''
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`relative w-full h-full perspective-1000 ${className}`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onFocus={() => setIsFlipped(true)}
      onBlur={() => setIsFlipped(false)}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: flipDuration
        }}
        className="w-full h-full preserve-3d"
      >
        {/* Front */}
        <motion.div
          className="absolute w-full h-full backface-hidden"
          initial={false}
          animate={{ opacity: isFlipped ? 0 : 1 }}
          transition={{ duration: flipDuration / 2 }}
        >
          {front}
        </motion.div>

        {/* Back */}
        <motion.div
          className="absolute w-full h-full backface-hidden rotate-y-180"
          initial={false}
          animate={{ opacity: isFlipped ? 1 : 0 }}
          transition={{ duration: flipDuration / 2 }}
        >
          {back}
        </motion.div>
      </motion.div>
    </div>
  );
};