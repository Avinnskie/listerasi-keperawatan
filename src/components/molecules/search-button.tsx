'use client';

import { useState, useEffect } from 'react';
import { SearchIcon } from 'lucide-react';
import { SearchDialog } from '../organisms/search-dialog-new';

type SearchButtonProps = {
  variant?: 'desktop' | 'mobile';
  onMobileClose?: () => void;
};

export const SearchButton: React.FC<SearchButtonProps> = ({
  variant = 'desktop',
  onMobileClose,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (variant !== 'desktop') return;

    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [variant]);

  const handleOpen = () => {
    setOpen(true);
    if (variant === 'mobile') {
      onMobileClose?.();
    }
  };

  if (variant === 'desktop') {
    return (
      <>
        <button
          onClick={handleOpen}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          <SearchIcon className="h-4 w-4 text-gray-600" />
          <span className="text-gray-600">Cari materi...</span>
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-200 px-1.5 font-mono text-[10px] font-medium text-gray-500 ml-auto">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
        <SearchDialog open={open} onOpenChange={setOpen} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center space-x-2 text-gray-700 hover:text-green-600 font-medium"
      >
        <SearchIcon className="h-5 w-5" />
      </button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
};
