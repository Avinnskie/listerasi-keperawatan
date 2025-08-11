import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { TestType } from '@prisma/client';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const materi = await prisma.materi.findUnique({
      where: { slug },
      include: {
        steps: {
          orderBy: { order: 'asc' },
        },
        tests: {
          where: { type: TestType.POST },
          include: {
            questions: true,
          },
        },
      },
    });

    if (!materi) {
      return NextResponse.json({ error: 'Materi tidak ditemukan' }, { status: 404 });
    }

    const postTest = materi.tests.length > 0 ? materi.tests[0] : null;

    return NextResponse.json({
      id: materi.id,
      title: materi.title,
      slug: materi.slug,
      category: materi.category,
      type: materi.type,
      steps: materi.steps.map((s) => ({
        id: s.id,
        title: s.title,
        content: s.content,
      })),
      postTest: postTest
        ? {
            id: postTest.id,
            questions: postTest.questions.map((q) => ({
              id: q.id,
              question: q.question,
              options: q.options,
              answer: q.answer,
            })),
          }
        : null,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
