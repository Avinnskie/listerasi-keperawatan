import { PrismaClient } from '@prisma/client';

/**
 * Lightweight service for fetching grouped and ordered materials from Prisma
 *
 * This service provides functionality to:
 * - Group materials by category
 * - Apply custom ordering rules (PENGANTAR first, custom Kesehatan order, then alphabetical)
 * - Return data in a format ready for collapsible display
 */

const prisma = new PrismaClient();

export type MaterialItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: string;
};

export type CategoryGroup = {
  category: string;
  overview: string;
  materials: MaterialItem[];
};

export async function getGroupedMaterials(): Promise<CategoryGroup[]> {
  try {
    const [materiList, categoryOverviews] = await Promise.all([
      prisma.materi.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          type: true,
        },
      }),
      prisma.categoryOverview.findMany({
        select: {
          category: true,
          overviewMarkdown: true,
        },
      }),
    ]);

    const grouped = materiList.reduce((acc: Record<string, MaterialItem[]>, materi) => {
      if (!acc[materi.category]) acc[materi.category] = [];
      acc[materi.category].push(materi);
      return acc;
    }, {});

    const kesehatanOrder = ['pendahuluan-covid-19', 'covid-19', 'sars-cov-2', 'imunisasi-covid-19'];

    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => {
        if (a.type === 'PENGANTAR' && b.type !== 'PENGANTAR') return -1;
        if (a.type !== 'PENGANTAR' && b.type === 'PENGANTAR') return 1;

        if (
          category.toLowerCase() === 'kesehatan' &&
          a.type !== 'PENGANTAR' &&
          b.type !== 'PENGANTAR'
        ) {
          const aIndex = kesehatanOrder.indexOf(a.slug);
          const bIndex = kesehatanOrder.indexOf(b.slug);
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }
        }

        return a.title.localeCompare(b.title);
      });
    });

    const overviewMap = categoryOverviews.reduce(
      (acc, item) => {
        acc[item.category] = item.overviewMarkdown || '';
        return acc;
      },
      {} as Record<string, string>
    );

    const result: CategoryGroup[] = Object.keys(grouped).map((category) => ({
      category,
      overview: overviewMap[category] || '',
      materials: grouped[category],
    }));

    return result;
  } catch (error) {
    console.error('Error fetching grouped materials:', error);
    throw error;
  }
}
