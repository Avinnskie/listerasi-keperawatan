// app/modul/[slug]/test/page.tsx
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import TestClientPage from './testClient';
import { TestNotAvailable } from '@/components/organisms';
import { TestEmptyQuestions } from '@/components/organisms/test-empty-questions';

export default async function TestPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const type = resolvedSearchParams.type === 'PRE' ? 'PRE' : 'POST';

  // Cari materi
  const materi = await prisma.materi.findUnique({
    where: { slug },
    select: { id: true, title: true },
  });

  if (!materi) return notFound();

  // Cari test sesuai type
  const test = await prisma.test.findFirst({
    where: {
      materiId: materi.id,
      type,
    },
    include: { questions: true },
  });

  // Check if test doesn't exist
  if (!test) {
    return <TestNotAvailable testType={type} materiTitle={materi.title} materiSlug={slug} />;
  }

  // Check if test exists but has no questions
  if (!test.questions || test.questions.length === 0) {
    return <TestEmptyQuestions testType={type} materiTitle={materi.title} materiSlug={slug} />;
  }

  return <TestClientPage materiTitle={materi.title} type={type} questions={test.questions} />;
}
