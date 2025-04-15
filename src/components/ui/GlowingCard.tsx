import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GlowingCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: number;
}

export const GlowingCard: React.FC<GlowingCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(74, 144, 226, 0.3)',
  intensity = 0.3
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      card.style.setProperty('--x', `${x}%`);
      card.style.setProperty('--y', `${y}%`);
      card.style.setProperty('--glow-color', glowColor);
      card.style.setProperty('--glow-intensity', intensity.toString());
    };

    const handleMouseLeave = () => {
      card.style.setProperty('--x', '50%');
      card.style.setProperty('--y', '50%');
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [glowColor, intensity]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{
        background: `radial-gradient(circle at var(--x, 50%) var(--y, 50%), 
                    var(--glow-color) 0%,
                    transparent calc(50% * var(--glow-intensity, 0.3)))`,
      }}
    >
      {children}
    </motion.div>
  );
};