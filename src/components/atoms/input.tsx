import React from 'react';

type InputProps = {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
};

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  className = '',
  min,
  max,
}) => {
  const baseStyles = 'border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent';
  const disabledStyles = disabled ? 'bg-gray-100 cursor-not-allowed' : '';
  
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      min={min}
      max={max}
      className={`${baseStyles} ${disabledStyles} ${className}`}
    />
  );
};
