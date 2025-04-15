import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
  disabled?: boolean;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  strength = 0.15,
  radius = 200,
  disabled = false,
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useSpring(0, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(0, { stiffness: 150, damping: 15 });

  const translateX = useTransform(mouseX, (x) => x * strength);
  const translateY = useTransform(mouseY, (y) => y * strength);

  useEffect(() => {
    if (disabled) return;
    
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );

      if (distance < radius && isHovered) {
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
      } else {
        mouseX.set(0);
        mouseY.set(0);
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      mouseX.set(0);
      mouseY.set(0);
    };

    const handleMouseEnter = () => setIsHovered(true);

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY, radius, isHovered, disabled]);

  return (
    <motion.div
      ref={buttonRef}
      style={{
        x: translateX,
        y: translateY,
        scale: useTransform(
          useSpring(isHovered && !disabled ? 1 : 0, { stiffness: 150, damping: 15 }),
          [0, 1],
          [1, 1.05]
        ),
      }}
      className={`inline-block ${disabled ? '' : 'cursor-pointer'} ${className}`}
    >
      {children}
    </motion.div>
  );
};