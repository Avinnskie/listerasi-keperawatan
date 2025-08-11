import React from 'react';
import { Heading } from '../atoms/heading';
import { Text } from '../atoms/text';

type TestQuestionProps = {
  question: string;
  options: string[];
  selectedAnswer?: number;
  onSelectAnswer: (index: number) => void;
  questionNumber: number;
  totalQuestions: number;
};

export const TestQuestion: React.FC<TestQuestionProps> = ({
  question,
  options,
  selectedAnswer,
  onSelectAnswer,
  questionNumber,
  totalQuestions,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Text variant="small" color="secondary" className="font-medium">
          Pertanyaan {questionNumber} dari {totalQuestions}
        </Text>
        <Heading className="text-xl font-semibold text-left text-gray-900">
          {question}
        </Heading>
      </div>
      
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectAnswer(index)}
            className={`w-full text-left px-4 py-3 border rounded-lg transition-colors ${
              selectedAnswer === index
                ? 'border-green-600 bg-green-50 text-green-800'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Text className="font-medium">{option}</Text>
          </button>
        ))}
      </div>
    </div>
  );
};
