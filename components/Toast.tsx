'use client';

import { useEffect } from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';

export interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className="bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-[90vw]">
        <FiAlertCircle className="text-2xl flex-shrink-0" />
        <p className="flex-1 font-medium text-base">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
          aria-label="Close"
        >
          <FiX className="text-xl" />
        </button>
      </div>
    </div>
  );
}
