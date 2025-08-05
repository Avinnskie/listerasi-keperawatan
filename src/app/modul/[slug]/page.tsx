import { notFound } from 'next/navigation';
import { materiList, MateriItem } from '@/lib/data/materiList';
import { MateriClientPage } from './client';

interface PageProps {
  params: { slug: string };
}

export default function MateriPage({ params }: PageProps) {
  const { slug } = params;

  const category = materiList.find((cat) =>
    cat.items.some((item: MateriItem) => item.slug === slug)
  );

  if (!category) return notFound();

  const currentMateri = category.items.find((item: MateriItem) => item.slug === slug);
  if (!currentMateri) return notFound();

  return (
    <MateriClientPage
    // currentMateri={{
    //   ...currentMateri,
    //   category: category.category,
    // }}
    />
  );
}
