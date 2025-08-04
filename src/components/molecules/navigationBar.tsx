'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heading } from '../atoms/heading';
import { Search } from 'lucide-react';

type NavbarProps = {
  className?: string;
};

export const NavigationBar = ({ className }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav
        className={`${className} w-full z-50 px-4 md:px-12 py-4 flex justify-between items-center font-lexend`}
      >
        <div className="flex items-center space-x-6">
          <Link href={'/'}>
            <Heading>Literasi Keperawatan</Heading>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link className="hover:text-[#38E078]" href="#">
              Kardiovaskular
            </Link>
            <Link className="hover:text-[#38E078]" href="#">
              COVID-19
            </Link>
            <Link className="hover:text-[#38E078]" href="#">
              Keperawatan
            </Link>
          </div>
        </div>

        <div className="hidden md:flex space-x-5">
          <Link
            href="/login"
            className="flex gap-2 px-5 py-2 bg-[#E8F2ED] rounded-md text-[#38E078] font-semibold"
          >
            <Search /> Search
          </Link>
          <Link
            href="/login"
            className="px-5 py-2 bg-[#38E078] rounded-md text-white font-semibold"
          >
            Masuk
          </Link>
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
          <Link className="hover:text-[#38E078]" href="#">
            Kardiovaskular
          </Link>
          <Link className="hover:text-[#38E078]" href="#">
            COVID-19
          </Link>
          <Link className="hover:text-[#38E078]" href="#">
            Keperawatan
          </Link>
          <Link href="/login" className="text-[#38E078] font-semibold">
            Masuk
          </Link>
        </div>
      </div>
    </>
  );
};
