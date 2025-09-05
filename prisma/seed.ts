import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const oldEmail = 'admin@example.com'; // email lama untuk dicari
  const newEmail = 'superadmin@gmail.com'; // email baru
  const newPassword = 'literasiadmin1.'; // password baru
  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: oldEmail },
    update: {
      email: newEmail,
      password: newPasswordHash,
    },
    create: {
      name: 'admin',
      email: newEmail,
      password: newPasswordHash,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created/updated:', admin);

  // seed category overview (biar tetap jalan)
  const categoryOverviews = [
    {
      category: 'Kesehatan Dasar',
      overviewMarkdown: `# Kesehatan Dasar

Selamat datang di kategori Kesehatan Dasar!...`,
    },
    {
      category: 'Penyakit Umum',
      overviewMarkdown: `# Penyakit Umum

Pelajari tentang penyakit-penyakit...`,
    },
    {
      category: 'Pertolongan Pertama',
      overviewMarkdown: `# Pertolongan Pertama

Keterampilan pertolongan pertama...`,
    },
  ];

  for (const overview of categoryOverviews) {
    await prisma.categoryOverview.upsert({
      where: { category: overview.category },
      update: { overviewMarkdown: overview.overviewMarkdown },
      create: overview,
    });
  }

  console.log('✅ Category overviews seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
