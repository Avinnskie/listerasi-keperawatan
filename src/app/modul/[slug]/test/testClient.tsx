'use client';

import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ResultModal } from '@/components/molecules/resultModal';
import { toast } from 'sonner';

type Question = {
  id: string;
  question: string;
  options: string[];
  answer: number;
};

export default function TestClientPage({
  materiTitle,
  type,
  questions,
}: {
  materiTitle: string;
  type: 'PRE' | 'POST';
  questions: Question[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIndex];
  const progress = Math.floor(((currentIndex + 1) / questions.length) * 100);

  const handleSelect = (choiceIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = choiceIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[currentIndex] === undefined) {
      toast.warning('Silakan pilih jawaban terlebih dahulu!');
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const correct = questions.filter((q, i) => {
        return answers[i] !== undefined && answers[i] === q.answer;
      }).length;
      const finalScore = Math.floor((correct / questions.length) * 100);
      setScore(finalScore);
      toast.success('Test berhasil diselesaikan! 🎉');
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-start p-6 font-lexend">
      <ResultModal score={score} show={showResult} onClose={() => setShowResult(false)} />
      <h1 className="text-2xl font-bold mb-1">{materiTitle}</h1>
      <p className="text-green-600 mb-4">{type === 'PRE' ? 'Pre Test' : 'Post Test'}</p>

      <p className="font-medium mb-1">
        Pertanyaan {currentIndex + 1} dari {questions.length}
      </p>
      <Progress value={progress} className="mb-6" />

      <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
      <div className="w-full space-y-3">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            className={`w-full text-left px-4 py-3 border rounded-lg ${
              answers[currentIndex] === index
                ? 'border-green-600 bg-green-50'
                : 'border-gray-300 hover:bg-gray-100'
            }`}
            onClick={() => handleSelect(index)}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <Button onClick={handlePrevious} variant="outline" disabled={currentIndex === 0}>
          Sebelumnya
        </Button>
        <Button onClick={handleNext}>
          {currentIndex === questions.length - 1 ? 'Selesai' : 'Selanjutnya'}
        </Button>
      </div>
    </div>
  );
}
