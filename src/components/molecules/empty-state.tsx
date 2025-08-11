import React from 'react';
import Link from 'next/link';
import { Heading } from '../atoms/heading';
import { Text } from '../atoms/text';
import { Button } from '@/components/ui/button';

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📝',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className}`}
    >
      <div className="text-6xl mb-4 opacity-50">{icon}</div>

      <Heading className="text-2xl font-bold text-gray-900 mb-3">{title}</Heading>

      {description && (
        <Text variant="body" color="secondary" className="max-w-md mb-6">
          {description}
        </Text>
      )}

      {actionLabel && (actionHref || onAction) && (
        <div className="mt-4">
          {actionHref ? (
            <Link href={actionHref}>
              <Button variant="default">{actionLabel}</Button>
            </Link>
          ) : (
            <Button onClick={onAction} variant="default">
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
