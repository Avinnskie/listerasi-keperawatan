import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
