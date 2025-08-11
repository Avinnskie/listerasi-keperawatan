import React from 'react';

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  options: Option[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = '-- Pilih --',
  required = false,
  disabled = false,
  className = '',
}) => {
  const baseStyles =
    'border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent';
  const disabledStyles = disabled ? 'bg-gray-100 cursor-not-allowed' : '';

  return (
    <select
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`${baseStyles} ${disabledStyles} ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
