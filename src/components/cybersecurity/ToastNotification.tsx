import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, AlertTriangle, XCircle, Info, X, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  autoDismissDuration?: number;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ 
  toasts, 
  onDismiss,
  autoDismissDuration = 5000 
}) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2.5 max-w-sm w-full font-mono pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <SingleToastItem 
            key={t.id} 
            toast={t} 
            onDismiss={onDismiss} 
            duration={autoDismissDuration} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface SingleToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
  duration: number;
}

const SingleToastItem: React.FC<SingleToastItemProps> = ({ toast, onDismiss, duration }) => {
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || duration <= 0) return;
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, isPaused, onDismiss]);

  const getBorderAndBg = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-[#0d1424]/95 border-emerald-500/50 text-emerald-300 shadow-emerald-950/40';
      case 'warning':
        return 'bg-[#0d1424]/95 border-amber-500/50 text-amber-300 shadow-amber-950/40';
      case 'error':
        return 'bg-[#0d1424]/95 border-rose-500/60 text-rose-300 shadow-rose-950/50 ring-1 ring-rose-500/30';
      case 'info':
      default:
        return 'bg-[#0d1424]/95 border-cyan-500/50 text-cyan-300 shadow-cyan-950/40';
    }
  };

  const getProgressBarColor = () => {
    switch (toast.type) {
      case 'success': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'error': return 'bg-rose-500';
      case 'info':
      default: return 'bg-cyan-500';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.92, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x: 80, scale: 0.9, filter: 'blur(4px)' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`p-3.5 rounded-2xl border shadow-2xl flex flex-col gap-2 pointer-events-auto backdrop-blur-md relative overflow-hidden group ${getBorderAndBg()}`}
    >
      <div className="flex items-start gap-3">
        <div className="pt-0.5 shrink-0">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />}
          {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-400 animate-bounce" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-cyan-400" />}
        </div>

        <div className="flex-1 space-y-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-xs text-white truncate">{toast.title}</span>
            <span className="text-[10px] text-slate-400 shrink-0">{toast.timestamp}</span>
          </div>
          <p className="text-[11px] text-slate-300 font-sans leading-snug break-words">
            {toast.message}
          </p>
        </div>

        <button
          onClick={() => onDismiss(toast.id)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer shrink-0"
          title="Dismiss Toast"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Subtle Auto-Dismiss Progress Bar */}
      {duration > 0 && !isPaused && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={`h-0.5 absolute bottom-0 left-0 ${getProgressBarColor()} opacity-60`}
        />
      )}
    </motion.div>
  );
};

