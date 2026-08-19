import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface AnimatedBackgroundProps {
  darkMode: boolean;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ darkMode }) => {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Static fallback if user prefers reduced motion for accessibility
  if (prefersReducedMotion) {
    return (
      <div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden" 
        aria-hidden="true"
      >
        <div 
          className={`absolute inset-0 ${
            darkMode ? 'bg-grid-pattern opacity-40' : 'bg-grid-pattern-light opacity-30'
          }`} 
        />
        <div 
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: darkMode 
              ? 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)'
          }}
        />
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden" 
      aria-hidden="true"
    >
      {/* Dynamic Geometric Grid with Subtle Moving Gradient Layer */}
      <div 
        className={`absolute inset-0 ${
          darkMode ? 'bg-grid-pattern opacity-50' : 'bg-grid-pattern-light opacity-40'
        }`} 
      />

      {/* Floating Ambient Orb 1 - Primary Cyber Blue / Indigo (Top Left to Center) */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] will-change-transform"
        style={{
          background: darkMode
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(99, 102, 241, 0.04) 50%, transparent 70%)',
          top: '-10%',
          left: '-5%'
        }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, 50, 20, 0],
          scale: [1, 1.08, 0.95, 1],
          opacity: [0.7, 0.9, 0.6, 0.7]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Floating Ambient Orb 2 - Purple / Pink Accent (Top Right to Mid) */}
      <motion.div
        className="absolute w-[460px] h-[460px] rounded-full blur-[110px] will-change-transform"
        style={{
          background: darkMode
            ? 'radial-gradient(circle, rgba(168, 85, 247, 0.14) 0%, rgba(236, 72, 153, 0.06) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(168, 85, 247, 0.09) 0%, rgba(236, 72, 153, 0.03) 50%, transparent 70%)',
          top: '15%',
          right: '-8%'
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, -40, 50, 0],
          scale: [1, 0.94, 1.06, 1],
          opacity: [0.6, 0.85, 0.55, 0.6]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2
        }}
      />

      {/* Floating Ambient Orb 3 - Emerald / Cyan SOC Security Glow (Bottom Left) */}
      <motion.div
        className="absolute w-[480px] h-[480px] rounded-full blur-[120px] will-change-transform"
        style={{
          background: darkMode
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(16, 185, 129, 0.07) 0%, rgba(6, 182, 212, 0.02) 50%, transparent 70%)',
          bottom: '10%',
          left: '10%'
        }}
        animate={{
          x: [0, 45, -40, 0],
          y: [0, -60, -20, 0],
          scale: [1, 1.1, 0.92, 1],
          opacity: [0.5, 0.75, 0.5, 0.5]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4
        }}
      />

      {/* Floating Ambient Orb 4 - Amber / Warm Glow (Bottom Right) */}
      <motion.div
        className="absolute w-[420px] h-[420px] rounded-full blur-[105px] will-change-transform"
        style={{
          background: darkMode
            ? 'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, rgba(249, 115, 22, 0.03) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(245, 158, 11, 0.05) 0%, rgba(249, 115, 22, 0.02) 50%, transparent 70%)',
          bottom: '-5%',
          right: '5%'
        }}
        animate={{
          x: [0, -35, 25, 0],
          y: [0, 40, -30, 0],
          scale: [0.95, 1.05, 0.98, 0.95],
          opacity: [0.4, 0.65, 0.4, 0.4]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1
        }}
      />
    </div>
  );
};
