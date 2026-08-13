import React from 'react';
import { 
  CheckCircle2, AlertTriangle, XCircle, Info, X 
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
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm w-full font-mono pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className={`p-3.5 rounded-xl border shadow-2xl flex items-start gap-3 pointer-events-auto backdrop-blur-md ${
              t.type === 'success' ? 'bg-slate-900/95 border-emerald-500/50 text-emerald-300' :
              t.type === 'warning' ? 'bg-slate-900/95 border-amber-500/50 text-amber-300' :
              t.type === 'error' ? 'bg-slate-900/95 border-rose-500/50 text-rose-300' :
              'bg-slate-900/95 border-cyan-500/50 text-cyan-300'
            }`}
          >
            <div className="pt-0.5 shrink-0">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {t.type === 'error' && <XCircle className="w-5 h-5 text-rose-400" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-cyan-400" />}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">{t.title}</span>
                <span className="text-[10px] text-slate-400">{t.timestamp}</span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-snug">{t.message}</p>
            </div>

            <button
              onClick={() => onDismiss(t.id)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
