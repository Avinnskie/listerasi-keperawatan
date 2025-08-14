'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { BookOpen, ChevronRight } from 'lucide-react';

type MaterialItem = {
  id: string;
  title: string;
  slug: string;
  type: string;
};

type CategorySidebarProps = {
  categoryName: string;
  materials: MaterialItem[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export const CategorySidebar = ({
  categoryName,
  materials,
  sidebarOpen,
  setSidebarOpen,
}: CategorySidebarProps) => {
  return (
    <>
      <aside className="hidden lg:block w-64 border-r bg-[#fafcf7] px-4 py-6 h-full overflow-y-auto">
        <CategorySidebarContent categoryName={categoryName} materials={materials} />
      </aside>

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-[#fafcf7] border-r px-4 py-6 overflow-y-auto transition-transform duration-300 transform
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}
      >
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            ✕ Tutup
          </button>
        </div>
        <CategorySidebarContent categoryName={categoryName} materials={materials} />
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

const CategorySidebarContent = ({
  categoryName,
  materials,
}: {
  categoryName: string;
  materials: MaterialItem[];
}) => {
  const pathname = usePathname();
  const params = useParams();

  const sortedMaterials = [...materials].sort((a, b) => {
    if (a.type === 'PENGANTAR' && b.type !== 'PENGANTAR') {
      return -1;
    }
    if (a.type !== 'PENGANTAR' && b.type === 'PENGANTAR') {
      return 1;
    }
    return 0;
  });

  return (
    <nav className="space-y-6">
      <div className="mt-7 md:mt-0 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">{categoryName}</h2>
        </div>
        <p className="text-sm text-gray-600">{materials.length} Materi Pembelajaran</p>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-gray-500 mt-2 mb-1 px-3 font-medium uppercase tracking-wide">
          Materi Pembelajaran
        </p>

        {sortedMaterials.map((material, index) => {
          const isActive = pathname === `/modul/${material.slug}`;

          return (
            <Link
              key={material.id}
              href={`/modul/${material.slug}`}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group
                ${
                  isActive ? 'bg-[#38e078] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span
                  className={`text-xs font-mono px-2 py-1 rounded-md flex-shrink-0
                  ${isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="min-w-0 flex-1">
                  <div
                    className={`font-medium truncate
                    ${isActive ? 'text-white' : 'text-gray-900'}
                  `}
                  >
                    {material.title}
                  </div>
                  <div
                    className={`text-xs mt-0.5
                    ${isActive ? 'text-white/80' : 'text-gray-500'}
                  `}
                  >
                    {material.type === 'PENGANTAR' ? 'Pengantar' : 'Sub-Materi'}
                  </div>
                </div>
              </div>

              <ChevronRight
                className={`w-4 h-4 transition-transform group-hover:translate-x-0.5
                ${isActive ? 'text-white' : 'text-gray-400'}
              `}
              />
            </Link>
          );
        })}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <Link
          href="/modul"
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Semua Kategori
        </Link>
      </div>
    </nav>
  );
};
