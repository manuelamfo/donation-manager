import React from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirmar" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative border border-zinc-200 animate-in fade-in zoom-in-95 duration-150">
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-zinc-400 hover:text-black transition-colors cursor-pointer p-1 rounded-md hover:bg-zinc-50"
        >
          <FiX className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3 mb-3 text-red-600">
          <FiAlertCircle className="w-6 h-6" />
          <h2 className="text-lg font-bold text-black">{title}</h2>
        </div>
        
        <p className="text-zinc-600 text-sm mb-6 leading-relaxed">
          {message}
        </p>
        
        <div className="flex justify-end gap-3 border-t border-zinc-100 pt-4">
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-zinc-600 hover:text-black transition-colors cursor-pointer rounded-md hover:bg-zinc-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-semibold shadow-sm transition-colors duration-150 cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}