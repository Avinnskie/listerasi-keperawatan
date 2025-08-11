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
