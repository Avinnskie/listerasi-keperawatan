import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('testId');

    let whereClause = {};
    if (testId) {
      whereClause = { testId };
    }

    const questions = await prisma.question.findMany({
      where: whereClause,
      include: {
        test: {
          include: {
            materi: {
              select: {
                id: true,
                title: true,
                type: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { testId, question, options, answer } = await request.json();

    if (!testId || !question || !options || !Array.isArray(options) || answer === undefined) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    const createdQuestion = await prisma.question.create({
      data: {
        testId,
        question,
        options,
        answer: Number(answer),
      },
    });

    return NextResponse.json(createdQuestion, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { testId, question, options, answer } = await request.json();

    if (!testId || !question || !options || !Array.isArray(options) || answer === undefined) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: {
        testId,
        question,
        options,
        answer: Number(answer),
      },
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const question = await prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    await prisma.question.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
  }
}
