'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

type ResultModalProps = {
  score: number;
  show: boolean;
  onClose: () => void;
  materiSlug?: string;
};

export const ResultModal = ({ score, show, onClose, materiSlug }: ResultModalProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white w-full max-w-md rounded-xl p-6 text-center shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4">🎉 Selamat!</h2>
            <p className="text-gray-700 mb-2">Kamu telah menyelesaikan modul ini dengan skor:</p>
            <div className="text-6xl font-extrabold text-green-600 my-4">{score}</div>
            <p className="text-sm text-gray-500 mb-6">Terus semangat belajar, ya!</p>

            <div className="flex justify-center gap-4">
              <Link href={materiSlug ? `/modul/${materiSlug}` : '/modul'}>
                <Button className="hover:bg-green-600 transition-colors bg">
                  Kembali ke Materi
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => toast.info('Fitur ini akan segera hadir! 🚀')}
              >
                Lihat Sumber
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
