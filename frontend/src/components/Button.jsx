import React from 'react';

export default function Button({ children, type = 'button', disabled, ...props }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="w-full py-2.5 bg-black text-white font-semibold rounded-md text-sm hover:bg-zinc-800 transition-colors mt-2 disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed"
      {...props}
    >
      {children}
    </button>
  );
}