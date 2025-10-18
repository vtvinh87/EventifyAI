import React from 'react';

// --- Input Component ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, className, ...props }) => {
    return (
        <div>
            {label && <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>}
            <input
                id={id}
                className={`w-full bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all duration-200 ${className}`}
                {...props}
            />
        </div>
    );
}
