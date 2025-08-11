// app/modul/[slug]/page.tsx
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { MateriClientPage } from './client';

export default async function MateriPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const materi = await prisma.materi.findUnique({
    where: { slug },
    include: {
      steps: { orderBy: { order: 'asc' } },
      tests: {
        where: { type: 'POST' },
        include: { questions: true },
      },
    },
  });

  if (!materi) return notFound();

  // Ambil postTest dari array tests
  const postTest = materi.tests.length > 0 ? materi.tests[0] : null;

  // Ambil semua materi untuk sidebar
  const materiList = await prisma.materi.findMany({
    orderBy: { title: 'asc' },
  });

  return (
    <MateriClientPage
      materi={{
        id: materi.id,
        title: materi.title,
        slug: materi.slug,
        type: materi.type,
        steps: materi.steps,
        postTest,
      }}
      materiList={materiList}
    />
  );
}
