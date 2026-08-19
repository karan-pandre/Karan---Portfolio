import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

interface MouseSpotlightProps {
  darkMode: boolean;
}

export const MouseSpotlight: React.FC<MouseSpotlightProps> = ({ darkMode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const rawX = useMotionValue(-500);
  const rawY = useMotionValue(-500);

  // Ultra-smooth spring physics for fluid cursor lag effect (21st.dev style)
  const springX = useSpring(rawX, { stiffness: 150, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 150, damping: 20 });

  useEffect(() => {
    // Only activate on devices with a fine pointer (mouse/trackpad)
    const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible, rawX, rawY]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden" aria-hidden="true">
      {/* Primary Dynamic Mouse Spotlight */}
      <motion.div
        className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-500"
        style={{
          left: springX,
          top: springY,
          background: darkMode
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(147, 51, 234, 0.06) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(147, 51, 234, 0.03) 50%, transparent 70%)'
        }}
      />

      {/* Secondary Micro-Highlight Spot */}
      <motion.div
        className="absolute w-[240px] h-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl opacity-60"
        style={{
          left: springX,
          top: springY,
          background: darkMode
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.03) 50%, transparent 70%)'
        }}
      />
    </div>
  );
};

