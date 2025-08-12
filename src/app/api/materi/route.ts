import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { MateriType } from '@/lib/enum';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const materiList = await prisma.materi.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        type: true,
      },
      orderBy: {
        title: 'asc',
      },
    });
    return NextResponse.json(materiList);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, slug, category, type } = await request.json();

    if (!title || !slug || !category || !type) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (!Object.values(MateriType).includes(type)) {
      return NextResponse.json({ error: 'Invalid materi type' }, { status: 400 });
    }

    const materi = await prisma.materi.create({
      data: {
        title,
        slug,
        category,
        type,
      },
    });

    return NextResponse.json(materi, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { title, slug, category, type } = await request.json();

    if (!title || !slug || !category || !type) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (!Object.values(MateriType).includes(type)) {
      return NextResponse.json({ error: 'Invalid materi type' }, { status: 400 });
    }

    const materi = await prisma.materi.update({
      where: { id },
      data: {
        title,
        slug,
        category,
        type,
      },
    });

    return NextResponse.json(materi);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Check if materi exists and has related data
    const materi = await prisma.materi.findUnique({
      where: { id },
      include: {
        steps: true,
        tests: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!materi) {
      return NextResponse.json({ error: 'Materi not found' }, { status: 404 });
    }

    // Delete in order: questions -> tests -> steps -> materi
    for (const test of materi.tests) {
      if (test.questions.length > 0) {
        await prisma.question.deleteMany({
          where: { testId: test.id },
        });
      }
    }

    await prisma.test.deleteMany({
      where: { materiId: id },
    });

    await prisma.step.deleteMany({
      where: { materiId: id },
    });

    await prisma.materi.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Materi deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
