'use client';

import { materiList } from '@/lib/data/materiList';
import Link from 'next/link';

type SidebarModulProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export const SidebarModul = ({ sidebarOpen, setSidebarOpen }: SidebarModulProps) => {
  return (
    <aside
      className={`absolute top-0 z-30 w-64 h-full bg-[#fafcf7] border-r border-gray-300 px-4 py-6 overflow-y-auto transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0 lg:w-1/6 lg:block
        `}
    >
      <div className="lg:hidden flex justify-end mb-4">
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ✕ Tutup
        </button>
      </div>

      <nav className="space-y-4 pt-8 lg:pt-0">
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
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/20 bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </aside>
  );
};
