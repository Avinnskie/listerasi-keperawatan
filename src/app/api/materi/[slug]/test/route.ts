import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type')?.toUpperCase();

    if (!type || (type !== 'PRE' && type !== 'POST')) {
      return NextResponse.json(
        { error: 'Query parameter "type" harus PRE atau POST' },
        { status: 400 }
      );
    }

    const { slug } = await params;
    const materi = await prisma.materi.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        tests: {
          where: { type },
          include: {
            questions: true,
          },
        },
      },
    });

    if (!materi) {
      return NextResponse.json({ error: 'Materi tidak ditemukan' }, { status: 404 });
    }

    const test = materi.tests[0];
    if (!test) {
      return NextResponse.json(
        { error: `Test dengan type ${type} tidak ditemukan` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      materi: {
        id: materi.id,
        slug: materi.slug,
        title: materi.title,
      },
      test,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
