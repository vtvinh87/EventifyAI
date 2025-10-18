import React, { memo } from 'react';

// --- Button Component ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const ButtonComponent: React.FC<ButtonProps> = ({ children, className, variant = 'primary', size = 'md', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  const variantClasses = {
    primary: 'bg-brand-600 text-white hover:bg-brand-500 focus:ring-brand-500',
    secondary: 'bg-white/20 dark:bg-black/20 text-white hover:bg-white/30 dark:hover:bg-black/30 focus:ring-white/50',
    ghost: 'text-gray-200 hover:bg-white/10 dark:hover:bg-black/10 focus:ring-white/50',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Button = memo(ButtonComponent);