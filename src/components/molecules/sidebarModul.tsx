'use client';

import Link from 'next/link';

type SidebarModulProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  materiList?: { id: string; title: string; slug: string; category: string; type?: string }[];
  loading?: boolean;
  currentSlug?: string;
};

export const SidebarModul = ({
  sidebarOpen,
  setSidebarOpen,
  materiList,
  currentSlug,
}: SidebarModulProps) => {
  return (
    <>
      <aside className="hidden lg:block w-64 border-r bg-[#fafcf7] px-4 py-6 h-full overflow-y-auto">
        <SidebarContent materiList={materiList} currentSlug={currentSlug} />
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
        <SidebarContent materiList={materiList} currentSlug={currentSlug} />
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

const SidebarContent = ({
  materiList,
  currentSlug,
}: {
  materiList: SidebarModulProps['materiList'];
  currentSlug?: string;
}) => {
  const hasValidData = materiList && Array.isArray(materiList) && materiList.length > 0;

  const grouped = hasValidData
    ? materiList.reduce((acc: Record<string, typeof materiList>, materi) => {
        if (!acc[materi.category]) acc[materi.category] = [];
        acc[materi.category].push(materi);
        return acc;
      }, {})
    : {};

  const currentMaterial =
    hasValidData && currentSlug ? materiList.find((m) => m.slug === currentSlug) : null;
  const currentCategory = currentMaterial?.category;

  if (!hasValidData) {
    return (
      <nav className="space-y-4">
        <div className="text-sm text-gray-500 text-center py-4">Tidak ada materi tersedia</div>
      </nav>
    );
  }

  const kesehatanOrder = ['pendahuluan-covid-19', 'covid-19', 'sars-cov-2', 'imunisasi-covid-19'];

  Object.keys(grouped).forEach((category) => {
    grouped[category].sort((a, b) => {
      if (a.type === 'PENGANTAR' && b.type !== 'PENGANTAR') return -1;
      if (a.type !== 'PENGANTAR' && b.type === 'PENGANTAR') return 1;

      if (
        category.toLowerCase() === 'kesehatan' &&
        a.type !== 'PENGANTAR' &&
        b.type !== 'PENGANTAR'
      ) {
        const aIndex = kesehatanOrder.indexOf(a.slug);
        const bIndex = kesehatanOrder.indexOf(b.slug);
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
      }

      return a.title.localeCompare(b.title);
    });
  });

  return (
    <nav className="mt-7 md:mt-0 space-y-4">
      <h5 className="text-[16px] text-gray-400">Materi tersedia</h5>
      {Object.keys(grouped).map((category) => (
        <div key={category}>
          <div className="flex items-center justify-between mb-2">
            <Link
              href={`/modul/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}`}
              className="flex-1 text-sm font-semibold text-gray-700 uppercase hover:text-primary transition-colors"
            >
              {category}
            </Link>
          </div>
        </div>
      ))}
    </nav>
  );
};
