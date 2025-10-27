import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export default function Input({ error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      <input
        className={`
          w-full px-4 py-3 rounded-lg
          bg-[#1c1c1e] text-white
          border border-[#2c2c2e]
          focus:border-[#3a3a3c] focus:outline-none
          placeholder:text-[#8e8e93]
          transition-colors
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
    </div>
  );
}
