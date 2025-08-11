import React from 'react';

type TextVariant = 'body' | 'small' | 'caption' | 'subtitle';
type TextColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning';

type TextProps = {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  className?: string;
  as?: 'p' | 'span' | 'div';
};

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  color = 'primary',
  className = '',
  as: Component = 'p',
}) => {
  const variantStyles = {
    body: 'text-base',
    small: 'text-sm',
    caption: 'text-xs',
    subtitle: 'text-lg font-medium',
  };

  const colorStyles = {
    primary: 'text-gray-900',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
  };

  const combinedStyles = `${variantStyles[variant]} ${colorStyles[color]} ${className}`;

  return <Component className={combinedStyles}>{children}</Component>;
};
