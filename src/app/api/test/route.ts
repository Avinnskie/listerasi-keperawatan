import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, TestType } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { type, materiId } = await request.json();

    if (!type || !materiId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (!Object.values(TestType).includes(type)) {
      return NextResponse.json({ error: 'Invalid test type' }, { status: 400 });
    }

    const test = await prisma.test.create({
      data: { type, materiId },
    });

    return NextResponse.json(test, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create test' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const materiId = searchParams.get('materiId');

    if (!materiId) {
      return NextResponse.json({ error: 'materiId parameter is required' }, { status: 400 });
    }

    const tests = await prisma.test.findMany({
      where: { materiId },
      include: {
        questions: true,
      },
    });

    return NextResponse.json(tests);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch tests' }, { status: 500 });
  }
}
