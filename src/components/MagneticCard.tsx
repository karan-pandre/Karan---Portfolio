import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';

interface MagneticCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  [key: string]: any;
}

export const MagneticCard: React.FC<MagneticCardProps> = ({
  children,
  className = '',
  intensity = 7,
  ...props
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 240, damping: 18 });
  const mouseYSpring = useSpring(y, { stiffness: 240, damping: 18 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${intensity}deg`, `-${intensity}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${intensity}deg`, `${intensity}deg`]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width === 0 || height === 0) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`perspective-1000 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
