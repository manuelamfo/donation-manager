import React, { useEffect } from 'react';
import { FiAlertOctagon, FiCheckCircle } from 'react-icons/fi';

export default function Toast({ message, isVisible, type = 'error', onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const isError = type === 'error';
  const bgColor = isError ? 'bg-red-600' : 'bg-emerald-600';
  const Icon = isError ? FiAlertOctagon : FiCheckCircle;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[70] animate-in slide-in-from-top-5 fade-in duration-200">
      <div className={`flex items-center gap-3 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg font-medium text-sm`}>
        <Icon className="w-5 h-5" />
        {message}
      </div>
    </div>
  );
}