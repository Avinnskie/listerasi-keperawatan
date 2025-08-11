'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heading } from '../atoms/heading';
import { AuthButton } from './auth-button';
import { SearchButton } from './search-button';

type NavbarProps = {
  className?: string;
};

export const NavigationBar = ({ className }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav
        className={`${className} w-full z-50 px-2 md:px-4 py-4 flex justify-between items-center font-lexend`}
      >
        <div className="flex items-center space-x-6">
          <Link href={'/'}>
            <Heading>Literasi Keperawatan</Heading>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-3">
          <SearchButton variant="desktop" />
          <AuthButton variant="desktop" />
        </div>

        <button onClick={() => setIsOpen(true)} className="md:hidden focus:outline-none">
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 z-40" onClick={() => setIsOpen(false)} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-3/5 bg-[#fafcf7] z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setIsOpen(false)}>
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col px-6 space-y-6 mt-8 text-lg font-medium">
          <SearchButton variant="mobile" onMobileClose={() => setIsOpen(false)} />
          <AuthButton variant="mobile" onMobileClose={() => setIsOpen(false)} />
        </div>
      </div>
    </>
  );
};
