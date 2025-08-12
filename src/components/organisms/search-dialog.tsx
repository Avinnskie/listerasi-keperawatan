'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

type MateriData = {
  id: string;
  title: string;
  slug: string;
};

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MateriData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        const data: MateriData[] = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (slug: string) => {
    router.push(`/modul/${slug}`);
    setTimeout(() => {
      setQuery('');
      setResults([]);
      onOpenChange(false);
    }, 50);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setQuery('');
          setResults([]);
        }
        onOpenChange(isOpen);
      }}
    >
      <CommandInput
        placeholder="Cari materi..."
        value={query}
        onValueChange={(val) => setQuery(val)}
      />
      <CommandList>
        {loading && <div className="p-2 text-sm text-gray-400">Mencari...</div>}
        <CommandEmpty>Tidak ada hasil.</CommandEmpty>
        <CommandGroup>
          {results.map((material) => (
            <CommandItem
              key={material.id}
              onSelect={() => {
                handleSelect(material.slug);
              }}
            >
              {material.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
