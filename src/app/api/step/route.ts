import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { title, content, order, materiId } = await request.json();

    if (!title || !content || !order || !materiId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const step = await prisma.step.create({
      data: { title, content, order: Number(order), materiId },
    });

    return NextResponse.json(step, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create step' }, { status: 500 });
  }
}
