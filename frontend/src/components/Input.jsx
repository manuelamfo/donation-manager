import React from 'react';

export default function Input({ label, type = 'text', ...props }) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-sm font-medium text-zinc-900 text-left">
                    {label}
                </label>
            )}
            <input
                type={type}
                className="px-3 py-2 border border-zinc-300 rounded-md bg-white text-black text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black w-full transition-shadow"
                {...props}
            />
        </div>
    );
}