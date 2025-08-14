'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

type AuthButtonProps = {
  variant?: 'desktop' | 'mobile';
};

export const AuthButton: React.FC<AuthButtonProps> = ({ variant = 'desktop' }) => {
  const { data: session, status } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const getAvatarInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({
        callbackUrl: '/',
        redirect: true,
      });
      toast.success('Berhasil logout! Sampai jumpa lagi 👋');
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
      const initials = getAvatarInitials(userName);

      return (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-semibold text-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="User menu"
          >
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-500">{session.user?.email}</p>
                {session.user?.role === 'ADMIN' && (
                  <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                    Admin
                  </span>
                )}
              </div>

              <div className="py-1">
                {session.user?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setIsDropdownOpen(false);
                    }}
                  >
                    <svg
                      className="w-4 h-4 mr-3 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  disabled={isLoggingOut}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-4 h-4 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  {isLoggingOut ? 'Logout...' : 'Keluar'}
                </button>
              </div>
            </div>
          )}
        </div>
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
        className="text-white bg-[#38E078] px-3 py-2 rounded-md font-semibold hover:text-green-600"
      >
        Masuk
      </Link>
    );
  }
};
