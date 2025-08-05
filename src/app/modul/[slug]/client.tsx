'use client';

import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import { materiList } from '@/lib/data/materiList';

export const MateriClientPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const [step, setStep] = useState(0); // 0: pengenalan, 1: pembahasan, 2: post-test

  const allMateri = materiList.flatMap((kategori) => kategori.items);
  const currentMateri = allMateri.find((item) => item.slug === slug);

  if (!currentMateri) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-red-500">Materi tidak ditemukan</h1>
      </div>
    );
  }

  const progressValue = Math.floor((step / 2) * 100);

  return (
    <section className="flex flex-col items-center p-6 gap-4">
      <h1 className="text-2xl font-bold text-primary mb-2">{currentMateri.title}</h1>

      <Progress value={progressValue} className="w-full max-w-3xl" />

      <article className="w-full prose max-w-3xl text-gray-800 mt-4">
        {step === 0 && (
          <>
            <h2>Pengenalan</h2>
            <p>
              <strong>{currentMateri.title}</strong> merupakan bagian penting dalam kategori ini.
              Materi ini akan memperkenalkan Anda pada konsep dasar dan tujuan dari topik ini.
            </p>
          </>
        )}

        {step === 1 && (
          <>
            <h2>Pembahasan Lengkap</h2>
            <p>
              Di bagian ini, kita akan membahas lebih dalam mengenai{' '}
              <strong>{currentMateri.title}</strong>, disertai contoh kasus, ilustrasi, dan tips
              praktis.
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Post Test</h2>
            <div className="space-y-6">
              <div>
                <p>
                  <strong>1.</strong> Apa tujuan utama dari mempelajari {currentMateri.title}?
                </p>
                <ul className="list-disc pl-6">
                  <li>Untuk mengetahui jenis penyakit</li>
                  <li>Untuk memahami gejala umum</li>
                  <li>Untuk mengetahui pengobatan</li>
                  <li>Semua benar</li>
                </ul>
              </div>

              <div>
                <p>
                  <strong>2.</strong> Apa langkah awal saat menghadapi kasus {currentMateri.title}?
                </p>
                <ul className="list-disc pl-6">
                  <li>Mencari bantuan medis</li>
                  <li>Mengabaikannya</li>
                  <li>Mencoba pengobatan sembarangan</li>
                  <li>Menghindari informasi medis</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </article>

      <div className="w-full max-w-3xl flex justify-between mt-8">
        {step > 0 ? (
          <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
            Kembali
          </Button>
        ) : (
          <div />
        )}

        {step < 2 ? (
          <Button onClick={() => setStep((s) => s + 1)}>Next</Button>
        ) : (
          <Button onClick={() => alert('Jawaban post test disimpan. Terima kasih!')}>
            Selesai Post Test
          </Button>
        )}
      </div>
    </section>
  );
};
