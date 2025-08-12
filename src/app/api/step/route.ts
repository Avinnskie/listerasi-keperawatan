import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const materiId = searchParams.get('materiId');

    let whereClause = {};
    if (materiId) {
      whereClause = { materiId };
    }

    const steps = await prisma.step.findMany({
      where: whereClause,
      include: {
        materi: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(steps);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch steps' }, { status: 500 });
  }
}

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

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { title, content, order, materiId } = await request.json();

    if (!title || !content || !order || !materiId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const step = await prisma.step.update({
      where: { id },
      data: { 
        title, 
        content, 
        order: Number(order), 
        materiId 
      },
    });

    return NextResponse.json(step);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update step' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const step = await prisma.step.findUnique({
      where: { id },
    });

    if (!step) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 });
    }

    await prisma.step.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Step deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete step' }, { status: 500 });
  }
}
