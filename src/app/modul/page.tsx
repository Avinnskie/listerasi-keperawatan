'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heading } from '@/components/atoms/heading';
import { Card } from '@/components/molecules/card';
import { PanelRightOpen, BookOpen, Users, ChevronRight } from 'lucide-react';
import { SidebarModul } from '@/components/molecules/sidebarModul';
import Image from 'next/image';

type MateriData = {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: string;
};

type CategoryGroup = {
  category: string;
  materials: MateriData[];
  totalCount: number;
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

  const groupedMaterials = materiList.reduce((acc: Record<string, CategoryGroup>, material) => {
    if (!acc[material.category]) {
      acc[material.category] = {
        category: material.category,
        materials: [],
        totalCount: 0,
      };
    }
    acc[material.category].materials.push(material);
    acc[material.category].totalCount += 1;
    return acc;
  }, {});

  const categories = Object.values(groupedMaterials);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'kesehatan':
      case 'kesehatan dasar':
        return '🏥';
      case 'penyakit umum':
        return '🩺';
      case 'pertolongan pertama':
        return '🚑';
      default:
        return '📚';
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category.toLowerCase()) {
      case 'kesehatan':
      case 'kesehatan dasar':
        return 'Pelajari dasar-dasar kesehatan dan prinsip-prinsip fundamental dalam bidang kesehatan';
      case 'penyakit umum':
        return 'Memahami berbagai penyakit umum, gejala, dan cara penanganannya';
      case 'pertolongan pertama':
        return 'Keterampilan pertolongan pertama yang penting untuk situasi darurat';
      default:
        return 'Materi pembelajaran komprehensif untuk meningkatkan pengetahuan Anda';
    }
  };

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
        currentSlug={undefined}
      />

      <main className="flex-1 px-6 md:px-10 py-10 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            {/* <div className="flex justify-center items-center w-40 md:w-56 h-auto mb-6 mx-auto">
              <Image src="/asset/guide.svg" width={150} height={150} alt="Panduan Awal" />
            </div> */}
            <Heading className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Modul Pembelajaran
            </Heading>
            <p className="text-gray-700 text-base md:text-lg max-w-2xl mx-auto mb-2">
              Pilih kategori pembelajaran yang ingin Anda pelajari
            </p>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
              Kami menyediakan materi yang mudah dipahami dan disusun sistematis untuk kemudahan
              belajar Anda
            </p>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat kategori pembelajaran...</p>
              </div>
            </div>
          )}

          {!loading && categories.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {categories.map((categoryGroup) => (
                <Link
                  key={categoryGroup.category}
                  href={`/modul/${encodeURIComponent(
                    categoryGroup.category.toLowerCase().replace(/\s+/g, '-')
                  )}`}
                  className="group"
                >
                  <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105 cursor-pointer border-2 hover:border-primary/20">
                    <div className="text-center">
                      <div className="text-4xl mb-4">{getCategoryIcon(categoryGroup.category)}</div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                        {categoryGroup.category}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {getCategoryDescription(categoryGroup.category)}
                      </p>

                      <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{categoryGroup.totalCount} Materi</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>Akses gratis</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center text-primary font-medium group-hover:gap-2 transition-all">
                        <span>Mulai Belajar</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {!loading && categories.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Belum Ada Kategori Tersedia
              </h3>
              <p className="text-gray-500">Materi pembelajaran sedang dalam tahap persiapan</p>
            </div>
          )}
        </div>
      </main>
    </section>
  );
}
