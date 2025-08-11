import React from 'react';
import { EmptyState } from '../molecules/empty-state';

type TestNotAvailableProps = {
  testType: 'PRE' | 'POST';
  materiTitle: string;
  materiSlug: string;
};

export const TestNotAvailable: React.FC<TestNotAvailableProps> = ({
  testType,
  materiTitle,
  materiSlug,
}) => {
  const getTestIcon = () => {
    return testType === 'PRE' ? '📋' : '📊';
  };

  const getTestTitle = () => {
    return testType === 'PRE' ? `Pre Test Belum Tersedia` : `Post Test Belum Tersedia`;
  };

  const getTestDescription = () => {
    const testName = testType === 'PRE' ? 'pre test' : 'post test';
    const suggestion =
      testType === 'PRE'
        ? 'Anda dapat langsung mempelajari materi dan mengerjakan post test setelahnya.'
        : 'Pastikan Anda telah menyelesaikan seluruh materi sebelum mengerjakan post test.';

    return `Maaf, ${testName} untuk materi "${materiTitle}" belum tersedia. Admin sedang menyiapkan soal-soal untuk test ini. ${suggestion}`;
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
