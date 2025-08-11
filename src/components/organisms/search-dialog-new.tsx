'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { BookOpenIcon, ClockIcon, FolderIcon, SearchIcon } from 'lucide-react';
import { toast } from 'sonner';

type Material = {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: 'PENGANTAR' | 'SUB_MATERI';
  createdAt: string;
  steps: Array<{
    id: string;
    title: string;
  }>;
  _count: {
    steps: number;
  };
};

type SearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const SearchDialog: React.FC<SearchDialogProps> = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const searchMaterials = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);

      if (response.ok) {
        const data = await response.json();
        setResults(data.materials || []);
      } else {
        console.error('Search failed with status:', response.status);
        toast.error('Gagal melakukan pencarian');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Terjadi kesalahan saat mencari');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchMaterials(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchMaterials]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  const handleSelect = (slug: string) => {
    onOpenChange(false);
    router.push(`/modul/${slug}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTypeIcon = (type: string) => {
    return type === 'PENGANTAR' ? BookOpenIcon : FolderIcon;
  };

  const getTypeLabel = (type: string) => {
    return type === 'PENGANTAR' ? 'Pengantar' : 'Sub Materi';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 max-h-[80vh]">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <SearchIcon className="h-5 w-5" />
            Cari Materi Pembelajaran
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <Input
            placeholder="Ketik untuk mencari materi..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-4"
            autoFocus
          />

          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent"></div>
                <span className="ml-3 text-gray-600">Mencari...</span>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Materi Ditemukan ({results.length})
                </h3>
                {results.map((material) => {
                  const TypeIcon = getTypeIcon(material.type);

                  return (
                    <button
                      key={material.id}
                      onClick={() => handleSelect(material.slug)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <TypeIcon className="h-4 w-4 text-green-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                              {material.title}
                            </h4>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              {getTypeLabel(material.type)}
                            </span>
                          </div>

                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <FolderIcon className="h-3 w-3 mr-1" />
                              {material.category}
                            </span>
                            <span className="flex items-center">
                              <BookOpenIcon className="h-3 w-3 mr-1" />
                              {material._count.steps} langkah
                            </span>
                            <span className="flex items-center">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {formatDate(material.createdAt)}
                            </span>
                          </div>

                          {material.steps.length > 0 && (
                            <div className="mt-1">
                              <p className="text-xs text-gray-400 truncate">
                                Langkah:{' '}
                                {material.steps
                                  .slice(0, 2)
                                  .map((step) => step.title)
                                  .join(', ')}
                                {material.steps.length > 2 && '...'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : query.length >= 2 ? (
              <div className="py-8 text-center">
                <SearchIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium">Tidak ada materi yang ditemukan</p>
                <p className="text-sm text-gray-500 mt-1">Coba gunakan kata kunci yang berbeda</p>
              </div>
            ) : (
              <div className="py-8 text-center">
                <SearchIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-600 font-medium">Mulai mencari materi</p>
                <p className="text-sm text-gray-500 mt-1">
                  Ketik minimal 2 karakter untuk mencari materi pembelajaran
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
