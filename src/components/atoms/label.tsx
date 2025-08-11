import React from 'react';

type LabelProps = {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
  required?: boolean;
};

export const Label: React.FC<LabelProps> = ({
  children,
  htmlFor,
  className = '',
  required = false,
}) => {
  const baseStyles = 'block text-sm font-medium text-gray-700 mb-2';
  
  return (
    <label 
      htmlFor={htmlFor} 
      className={`${baseStyles} ${className}`}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};
