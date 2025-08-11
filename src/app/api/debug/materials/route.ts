import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const materials = await prisma.materi.findMany({
      include: {
        steps: {
          select: {
            id: true,
            title: true,
          },
          take: 2,
        },
        _count: {
          select: {
            steps: true,
          },
        },
      },
      take: 5,
    });

    console.log('All materials in DB:', materials.length);
    materials.forEach((material) => {
      console.log(
        'Material:',
        material.title,
        'Category:',
        material.category,
        'Type:',
        material.type
      );
    });

    return NextResponse.json({
      count: materials.length,
      materials: materials.map((m) => ({
        id: m.id,
        title: m.title,
        slug: m.slug,
        category: m.category,
        type: m.type,
        stepCount: m._count.steps,
      })),
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
