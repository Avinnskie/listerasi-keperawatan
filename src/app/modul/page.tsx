'use client';

import { useState, useEffect } from 'react';
import { Heading } from '@/components/atoms/heading';
import { PanelRightOpen } from 'lucide-react';
import { SidebarModul } from '@/components/molecules/sidebarModul';

type MateriData = {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: string;
};

export default function Modul() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [materiList, setMateriList] = useState<MateriData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch('/api/materi');
        if (response.ok) {
          const data = await response.json();
          setMateriList(data);
        } else {
          console.error('Failed to fetch materials');
        }
      } catch (error) {
        console.error('Error fetching materials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row pt-[72px] font-lexend overflow-hidden">
      <div className="lg:hidden px-4 py-2 border-b flex justify-between items-center">
        <button onClick={() => setSidebarOpen(true)} className="focus:outline-none flex gap-2">
          <PanelRightOpen />
          Buka
        </button>
      </div>

      <SidebarModul
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        materiList={materiList}
      />

      <main className="w-full lg:w-full px-6 md:px-10 py-10 flex flex-col items-center justify-center text-center z-10 relative">
        <img src="/asset/guide.svg" alt="Panduan Awal" className="w-40 md:w-56 h-auto mb-6" />
        <Heading>Selamat datang di Halaman Modul</Heading>

        {loading ? (
          <div className="mt-4 text-gray-600">
            <p>Memuat materi pembelajaran...</p>
          </div>
        ) : (
          <>
            <p className="mt-4 text-gray-700 text-base md:text-lg max-w-xl">
              Untuk mulai belajar, silakan pilih salah satu materi yang tersedia di sisi kiri layar.
            </p>
            <p className="mt-2 text-gray-600 text-sm md:text-base max-w-xl">
              Kami menyediakan materi yang mudah dipahami dan disusun khusus untuk Anda.
            </p>
            {materiList.length > 0 && (
              <p className="mt-2 text-green-600 text-sm">{materiList.length} materi tersedia</p>
            )}
          </>
        )}
      </main>
    </section>
  );
}
