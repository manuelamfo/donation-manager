import React, { useState } from 'react';
import logoImg from '../assets/logo.png'; 

import { FiUser, FiLogOut } from 'react-icons/fi';

export default function Navbar({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-white border-b border-zinc-200 flex justify-between items-center px-6 z-50">
      <div className="flex items-center gap-2">
        <img 
          src={logoImg} 
          alt="Logo" 
          className="h-12 w-auto object-contain my-3" 
        />
      </div>
      
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 border border-zinc-200 hover:bg-zinc-200 transition-colors focus:outline-none"
          title="Menu"
        >
          <FiUser className="w-5 h-5" />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-2 text-xs font-semibold text-zinc-400 border-b border-zinc-100 select-none">
                Administrador
              </div>
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center gap-2 font-medium"
              >
                <FiLogOut className="w-4 h-4 text-zinc-500" />
                Sair
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}