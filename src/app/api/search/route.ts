import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();

    console.log('Search API called with query:', query);

    if (!query || query.length < 2) {
      console.log('Query too short, returning empty results');
      return NextResponse.json({ materials: [] });
    }

    // Search in materials with title, category, and steps content
    const materials = await prisma.materi.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            category: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            steps: {
              some: {
                OR: [
                  {
                    title: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                  {
                    content: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      include: {
        steps: {
          select: {
            id: true,
            title: true,
          },
          take: 3,
        },
        _count: {
          select: {
            steps: true,
          },
        },
      },
      orderBy: [
        {
          title: 'asc',
        },
      ],
      take: 10, // Limit results
    });

    console.log('Raw materials from DB:', materials.length);
    if (materials.length > 0) {
      console.log('First material:', materials[0]);
    }

    // Transform data to match SearchDialog expectations
    const transformedMaterials = materials.map((material) => ({
      id: material.id,
      title: material.title,
      slug: material.slug,
      category: material.category,
      type: material.type,
      createdAt: new Date().toISOString(), // Use current date as fallback since createdAt doesn't exist
      steps: material.steps,
      _count: material._count,
    }));

    console.log('Transformed materials:', transformedMaterials.length);
    return NextResponse.json({ materials: transformedMaterials });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
