'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CategorySidebar } from '@/components/molecules/categorySidebar';
import { PanelRightOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

type Step = {
  id: string;
  title: string;
  content: string;
};

type MateriData = {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: 'PENGANTAR' | 'SUB_MATERI';
  steps: Step[];
  postTest?: { id: string } | null;
};

type MaterialListItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  type?: string;
};

type CategoryMaterials = {
  id: string;
  title: string;
  slug: string;
  type: string;
};

export const MateriClientPage = ({
  materi,
  materiList,
}: {
  materi: MateriData;
  materiList: MaterialListItem[];
}) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [step, setStep] = useState(0);

  const totalSteps = materi.steps.length;
  const progressValue = Math.floor(((step + 1) / totalSteps) * 100);

  // Filter and sort materials by current category
  const categoryMaterials: CategoryMaterials[] = materiList
    .filter((item) => item.category === materi.category)
    .map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      type: item.type || 'SUB_MATERI',
    }))
    .sort((a, b) => {
      // Always put PENGANTAR type first
      if (a.type === 'PENGANTAR' && b.type !== 'PENGANTAR') {
        return -1;
      }
      if (a.type !== 'PENGANTAR' && b.type === 'PENGANTAR') {
        return 1;
      }
      // Maintain original order for same types
      return 0;
    });

  const handlePreTest = () => {
    router.push(`/modul/${materi.slug}/test?type=PRE`);
  };

  const handlePostTest = () => {
    router.push(`/modul/${materi.slug}/test?type=POST`);
  };

  return (
    <section className="relative min-h-screen font-lexend pt-[72px]">
      <div className="lg:hidden px-4 py-2 border-b flex justify-between items-center">
        <button onClick={() => setSidebarOpen(true)} className="flex items-center gap-2">
          <PanelRightOpen />
          Buka Modul
        </button>
      </div>

      <div className="flex lg:flex-row">
        <CategorySidebar
          categoryName={materi.category}
          materials={categoryMaterials}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 px-6 py-10">
          <h1 className="text-2xl font-bold text-primary mb-2">{materi.title}</h1>

          <Progress value={progressValue} className="w-full" />

          <article className="w-full prose max-w-none mt-4">
            {materi.type === 'PENGANTAR' && step === 0 && (
              <div className="mb-4">
                <Button onClick={handlePreTest}>Kerjakan Pre Test</Button>
              </div>
            )}
            <h2>{materi.steps[step]?.title}</h2>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {materi.steps[step]?.content || ''}
            </ReactMarkdown>
          </article>

          <div className="w-full flex justify-between mt-8">
            {step > 0 ? (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                Kembali
              </Button>
            ) : (
              <div />
            )}

            {step < totalSteps - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)}>Next</Button>
            ) : materi.postTest ? (
              <Button onClick={handlePostTest}>Kerjakan Post Test</Button>
            ) : (
              <Button
                onClick={() => toast.success('Selamat! Anda telah menyelesaikan materi ini! 🎓')}
              >
                Selesai
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
