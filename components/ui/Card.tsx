import React from 'react';

// --- Card Component ---
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={`
        bg-white/10 dark:bg-black/10 backdrop-blur-lg border border-white/20 dark:border-black/20 
        rounded-2xl shadow-lg overflow-hidden transition-all duration-300
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
