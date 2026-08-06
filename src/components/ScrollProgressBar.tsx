import React, { useEffect, useState } from 'react';

interface ScrollProgressBarProps {
  darkMode?: boolean;
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({ darkMode = true }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      } else {
        setScrollProgress(0);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    // Calculate initial on mount
    updateScrollProgress();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-hidden={scrollProgress <= 0}
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] pointer-events-none bg-transparent"
    >
      {/* Background track track accent */}
      <div
        className={`w-full h-full absolute inset-0 opacity-10 ${
          darkMode ? 'bg-slate-400' : 'bg-slate-900'
        }`}
      />

      {/* Animated scroll bar */}
      <div
        className="h-full relative transition-all duration-75 ease-out rounded-r-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400"
        style={{ width: `${scrollProgress}%` }}
      >
        {/* Glow point at the leading right edge */}
        <div
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full blur-xs opacity-90 transition-opacity ${
            scrollProgress > 1 ? 'opacity-100' : 'opacity-0'
          } ${
            darkMode ? 'bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]'
          }`}
        />
      </div>
    </div>
  );
};
