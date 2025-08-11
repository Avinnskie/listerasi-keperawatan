import { materiList } from '@/lib/data/materiList';

export function getNextMateriInCategory(currentSlug: string) {
  for (const category of materiList) {
    const index = category.items.findIndex((item) => item.slug === currentSlug);

    if (index !== -1) {
      const nextItem = category.items[index + 1];
      return {
        next: nextItem || null,
        category: category.category,
        isLast: index === category.items.length - 1,
      };
    }
  }

  return { next: null, category: null, isLast: false };
}
