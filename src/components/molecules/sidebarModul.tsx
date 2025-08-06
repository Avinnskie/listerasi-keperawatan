'use client';

import { materiList } from '@/lib/data/materiList';
import Link from 'next/link';

type SidebarModulProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export const SidebarModul = ({ sidebarOpen, setSidebarOpen }: SidebarModulProps) => {
  return (
    <>
      <aside className="hidden lg:block w-64 border-r bg-[#fafcf7] px-4 py-6 h-full overflow-y-auto">
        <SidebarContent />
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
        <SidebarContent />
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

const SidebarContent = () => (
  <nav className="space-y-4">
    {materiList.map((category) => (
      <div key={category.category}>
        <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
          {category.category}
        </h3>
        <ul className="space-y-1 text-sm w-full">
          {category.items.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/modul/${item.slug}`}
                className="block px-2 py-1 rounded hover:bg-[#38e078]/20 hover:text-gray-600 transition text-gray-400"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </nav>
);

