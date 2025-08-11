import React from 'react';
import { EmptyState } from '../molecules/empty-state';

type TestEmptyQuestionsProps = {
  testType: 'PRE' | 'POST';
  materiTitle: string;
  materiSlug: string;
};

export const TestEmptyQuestions: React.FC<TestEmptyQuestionsProps> = ({
  testType,
  materiTitle,
  materiSlug,
}) => {
  const getTestIcon = () => {
    return '❓';
  };

  const getTestTitle = () => {
    return testType === 'PRE' ? `Pre Test Belum Memiliki Soal` : `Post Test Belum Memiliki Soal`;
  };

  const getTestDescription = () => {
    const testName = testType === 'PRE' ? 'Pre test' : 'Post test';
    return `${testName} untuk materi "${materiTitle}" sudah dibuat tetapi belum memiliki soal-soal. Admin sedang menyiapkan pertanyaan untuk test ini. Silakan coba lagi nanti.`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-lexend">
      <div className="max-w-lg w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <EmptyState
            icon={getTestIcon()}
            title={getTestTitle()}
            description={getTestDescription()}
            actionLabel="Kembali ke Materi"
            actionHref={`/modul/${materiSlug}`}
          />
        </div>
      </div>
    </div>
  );
};
