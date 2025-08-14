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

    if (!title || !content || !materiId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Determine next expected order
    const existing = await prisma.step.findMany({
      where: { materiId },
      select: { order: true },
      orderBy: { order: 'asc' },
    });
    const maxOrder = existing.length ? Math.max(...existing.map((s) => s.order)) : 0;
    const nextOrder = maxOrder + 1;

    let desiredOrder: number = Number(order);
    if (!order && order !== 0) {
      desiredOrder = nextOrder;
    }

    if (desiredOrder < 1) {
      return NextResponse.json({ error: 'Order minimal 1' }, { status: 400 });
    }

    // Prevent skipping order when creating
    if (desiredOrder > nextOrder) {
      return NextResponse.json({
        error: `Urutan tidak valid. Step berikutnya harus ${nextOrder}.`,
      }, { status: 400 });
    }

    // Prevent duplicate order
    const duplicate = existing.find((s) => s.order === desiredOrder);
    if (duplicate) {
      return NextResponse.json({
        error: `Step urutan ${desiredOrder} sudah ada. Silakan gunakan angka lain.`,
      }, { status: 409 });
    }

    const step = await prisma.step.create({
      data: { title, content, order: desiredOrder, materiId },
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

    if (!title || !content || !materiId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const current = await prisma.step.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 });
    }

    const existing = await prisma.step.findMany({
      where: { materiId },
      select: { id: true, order: true },
    });

    const desiredOrder = Number(order);
    if (!desiredOrder || desiredOrder < 1) {
      return NextResponse.json({ error: 'Order minimal 1' }, { status: 400 });
    }

    // Ensure no duplicates within same materi
    const duplicate = existing.find((s) => s.order === desiredOrder && s.id !== id);
    if (duplicate) {
      return NextResponse.json({
        error: `Step urutan ${desiredOrder} sudah ada untuk materi ini.`,
      }, { status: 409 });
    }

    const step = await prisma.step.update({
      where: { id },
      data: {
        title,
        content,
        order: desiredOrder,
        materiId,
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
