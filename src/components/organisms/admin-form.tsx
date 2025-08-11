'use client';

import React from 'react';
import { Card } from '../molecules/card';
import { FormField } from '../molecules/form-field';

type AdminFormProps = {
  title: string;
  fields: Array<{
    label: string;
    type?: 'input' | 'select';
    inputType?: 'text' | 'email' | 'password' | 'number';
    placeholder?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    options?: Array<{ value: string; label: string }>;
    required?: boolean;
    min?: number;
    max?: number;
  }>;
  onSubmit: (e: React.FormEvent) => void;
  submitText: string;
  submitColor?: string;
  children?: React.ReactNode;
};

export const AdminForm: React.FC<AdminFormProps> = ({
  title,
  fields,
  onSubmit,
  submitText,
  submitColor = 'bg-blue-600',
  children,
}) => {
  return (
    <Card title={title} className="max-w-4xl">
      <form onSubmit={onSubmit} className="space-y-4">
        {fields.map((field, index) => (
          <FormField
            key={index}
            label={field.label}
            type={field.type}
            inputType={field.inputType}
            placeholder={field.placeholder}
            value={field.value}
            onChange={field.onChange}
            options={field.options}
            required={field.required}
            min={field.min}
            max={field.max}
          />
        ))}

        {children}

        <div className="pt-2">
          <button
            type="submit"
            className={`${submitColor} text-white px-6 py-2 rounded-md font-semibold hover:opacity-90 transition-opacity`}
          >
            {submitText}
          </button>
        </div>
      </form>
    </Card>
  );
};
