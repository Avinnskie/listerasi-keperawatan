import React from 'react';
import { EmptyState } from '../molecules/empty-state';

export const UnauthorizedAccess: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-lexend">
      <div className="max-w-lg w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <EmptyState
            icon="🚫"
            title="Akses Ditolak"
            description="Maaf, Anda tidak memiliki izin untuk mengakses halaman admin. Halaman ini hanya tersedia untuk administrator sistem."
            actionLabel="Kembali ke Beranda"
            actionHref="/"
          />
        </div>
      </div>
    </div>
  );
};
