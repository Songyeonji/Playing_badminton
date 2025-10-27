'use client';

import { useEffect } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';
import type { ToastType } from '@/types';

export interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: 'bg-emerald-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  };

  const icons = {
    success: <FiCheckCircle className="text-xl sm:text-2xl flex-shrink-0" />,
    error: <FiAlertCircle className="text-xl sm:text-2xl flex-shrink-0" />,
    info: <FiInfo className="text-xl sm:text-2xl flex-shrink-0" />,
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className={`${styles[type]} text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg flex items-center gap-2 sm:gap-3 min-w-[250px] sm:min-w-[300px] max-w-[90vw]`}>
        {icons[type]}
        <p className="flex-1 font-medium text-sm sm:text-base">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
          aria-label="Close"
        >
          <FiX className="text-lg sm:text-xl" />
        </button>
      </div>
    </div>
  );
}
