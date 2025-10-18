import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({ label, id, options, className, ...props }) => {
  const customArrow = {
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5em 1.5em',
    paddingRight: '2.5rem',
  };

  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>}
      <div className="relative">
        <select
          id={id}
          style={customArrow}
          className={`w-full bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all duration-200 appearance-none ${className}`}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value} className="bg-gray-800 text-white">
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
