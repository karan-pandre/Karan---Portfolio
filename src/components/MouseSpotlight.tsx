import React, { useEffect, useState } from 'react';

interface MouseSpotlightProps {
  darkMode: boolean;
}

export const MouseSpotlight: React.FC<MouseSpotlightProps> = ({ darkMode }) => {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only activate on devices with a fine pointer (mouse)
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, ${
          darkMode ? 'rgba(59, 130, 246, 0.08), rgba(147, 51, 234, 0.03)' : 'rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.02)'
        }, transparent 80%)`
      }}
    />
  );
};
