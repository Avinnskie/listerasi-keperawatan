import React from 'react';
import { Heading } from '../atoms/heading';

type AdminPageTemplateProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export const AdminPageTemplate: React.FC<AdminPageTemplateProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 py-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Heading className="text-3xl font-bold text-gray-900 text-left">
            {title}
          </Heading>
        </div>
        
        <div className="space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
};
