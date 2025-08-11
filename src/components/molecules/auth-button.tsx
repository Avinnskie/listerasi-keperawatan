'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

type AuthButtonProps = {
  variant?: 'desktop' | 'mobile';
  onMobileClose?: () => void;
};

export const AuthButton: React.FC<AuthButtonProps> = ({ variant = 'desktop', onMobileClose }) => {
  const { data: session, status } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({
        callbackUrl: '/',
        redirect: true,
      });
      toast.success('Berhasil logout! Sampai jumpa lagi 👋');
      onMobileClose?.();
    } catch (error) {
      toast.error('Gagal logout. Silakan coba lagi.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (status === 'loading') {
    return variant === 'desktop' ? (
      <div className="px-5 py-2 bg-gray-300 rounded-md text-gray-600 font-semibold animate-pulse">
        Loading...
      </div>
    ) : (
      <span className="text-gray-500 font-semibold animate-pulse">Loading...</span>
    );
  }

  if (session) {
    const userName = session.user?.name || session.user?.email?.split('@')[0] || 'User';
    const displayName = userName.length > 15 ? `${userName.substring(0, 15)}...` : userName;

    if (variant === 'desktop') {
      return (
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Halo, {displayName}</span>

          {session.user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Admin
            </Link>
          )}

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? 'Logout...' : 'Keluar'}
          </button>
        </div>
      );
    } else {
      return (
        <>
          <div className="text-sm text-gray-600 px-2">Halo, {displayName}</div>

          {session.user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="text-blue-600 font-semibold hover:text-blue-800"
              onClick={onMobileClose}
            >
              Admin Dashboard
            </Link>
          )}

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-red-600 font-semibold hover:text-red-800 text-left disabled:opacity-50"
          >
            {isLoggingOut ? 'Logout...' : 'Keluar'}
          </button>
        </>
      );
    }
  }

  if (variant === 'desktop') {
    return (
      <Link
        href="/login"
        className="px-5 py-2 bg-[#38E078] rounded-md text-white font-semibold hover:bg-green-600 transition-colors"
      >
        Masuk
      </Link>
    );
  } else {
    return (
      <Link
        href="/login"
        className="text-[#38E078] font-semibold hover:text-green-600"
        onClick={onMobileClose}
      >
        Masuk
      </Link>
    );
  }
};
