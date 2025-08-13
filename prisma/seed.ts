import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'admin',
      email: 'admin@example.com',
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', admin);

  const categoryOverviews = [
    {
      category: 'Kesehatan Dasar',
      overviewMarkdown: `# Kesehatan Dasar

Selamat datang di kategori Kesehatan Dasar! Ini adalah fondasi penting untuk memahami prinsip-prinsip kesehatan.

## Yang Akan Anda Pelajari:
- Konsep dasar kesehatan dan kesehatan masyarakat
- Pentingnya pola hidup sehat dalam kehidupan sehari-hari
- Prinsip-prinsip pencegahan penyakit

Materi ini dirancang untuk memberikan pemahaman yang kuat tentang dasar-dasar kesehatan sebelum mempelajari topik yang lebih spesifik.`,
    },
    {
      category: 'Penyakit Umum',
      overviewMarkdown: `# Penyakit Umum

Pelajari tentang penyakit-penyakit yang sering ditemui dalam kehidupan sehari-hari.

## Fokus Pembelajaran:
- Identifikasi gejala penyakit umum
- Cara pencegahan yang efektif
- Penanganan awal yang tepat
- Kapan harus mencari bantuan medis

Dengan memahami penyakit-penyakit umum, Anda dapat memberikan respons yang tepat dan cepat ketika menghadapi situasi kesehatan tertentu.`,
    },
    {
      category: 'Pertolongan Pertama',
      overviewMarkdown: `# Pertolongan Pertama

Keterampilan pertolongan pertama adalah kemampuan penting yang dapat menyelamatkan nyawa.

## Kompetensi yang Akan Dikuasai:
- Prinsip dasar P3K (Pertolongan Pertama Pada Kecelakaan)
- Penanganan luka dan pendarahan
- Teknik-teknik pertolongan darurat
- Penggunaan peralatan P3K

**Ingat:** Pertolongan pertama yang tepat dapat membuat perbedaan besar dalam situasi darurat. Mari pelajari bersama!`,
    },
  ];

  for (const overview of categoryOverviews) {
    await prisma.categoryOverview.upsert({
      where: { category: overview.category },
      update: { overviewMarkdown: overview.overviewMarkdown },
      create: overview,
    });
  }

  console.log('Category overviews seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
