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

    let whereClause = {};
    if (materiId) {
      whereClause = { materiId };
    }

    const tests = await prisma.test.findMany({
      where: whereClause,
      include: {
        questions: true,
        materi: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
    });

    return NextResponse.json(tests);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch tests' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { type, materiId } = await request.json();

    if (!type || !materiId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (!Object.values(TestType).includes(type)) {
      return NextResponse.json({ error: 'Invalid test type' }, { status: 400 });
    }

    const test = await prisma.test.update({
      where: { id },
      data: {
        type,
        materiId,
      },
    });

    return NextResponse.json(test);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update test' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const test = await prisma.test.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Delete related questions first
    await prisma.question.deleteMany({
      where: { testId: id },
    });

    // Then delete the test
    await prisma.test.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Test and related questions deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete test' }, { status: 500 });
  }
}
