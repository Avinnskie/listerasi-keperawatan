import React from 'react';

type LoadingProps = {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
};

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const containerClass = fullScreen
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center p-4';

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        <div
          className={`${sizeStyles[size]} animate-spin rounded-full border-2 border-gray-300 border-t-green-600`}
        />
        {text && <p className={`${textSizes[size]} text-gray-600 font-medium`}>{text}</p>}
      </div>
    </div>
  );
};
