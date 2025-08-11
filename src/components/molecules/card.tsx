import React from 'react';

type CardProps = {
  children: React.ReactNode;
  title?: string;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: boolean;
  border?: boolean;
};

export const Card: React.FC<CardProps> = ({
  children,
  title,
  className = '',
  padding = 'md',
  shadow = true,
  border = true,
}) => {
  const paddingStyles = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const baseStyles = 'rounded-lg bg-white';
  const shadowStyles = shadow ? 'shadow-md' : '';
  const borderStyles = border ? 'border border-gray-200' : '';

  return (
    <div className={`${baseStyles} ${paddingStyles[padding]} ${shadowStyles} ${borderStyles} ${className}`}>
      {title && (
        <h3 className="text-xl font-semibold mb-4 text-gray-900">{title}</h3>
      )}
      {children}
    </div>
  );
};
