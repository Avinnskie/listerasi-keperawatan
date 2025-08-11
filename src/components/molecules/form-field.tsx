import React from 'react';
import { Input } from '../atoms/input';
import { Select } from '../atoms/select';
import { Label } from '../atoms/label';

type Option = {
  value: string;
  label: string;
};

type FormFieldProps = {
  label?: string;
  type?: 'input' | 'select';
  inputType?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: Option[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
  error?: string;
};

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'input',
  inputType = 'text',
  placeholder,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
  className = '',
  min,
  max,
  error,
}) => {
  const fieldId = `field-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
      )}

      {type === 'input' ? (
        <Input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
        />
      ) : (
        <Select
          options={options}
          value={value as string}
          onChange={onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
