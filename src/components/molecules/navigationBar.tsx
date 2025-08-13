'use client';

import Link from 'next/link';
import { Heading } from '../atoms/heading';
import { AuthButton } from './auth-button';
import { SearchButton } from './search-button';

type NavbarProps = {
  className?: string;
};

export const NavigationBar = ({ className }: NavbarProps) => {
  return (
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

      {/* Mobile Navigation */}
      <div className="flex md:hidden items-center gap-3">
        <SearchButton variant="mobile" />
        <AuthButton variant="mobile" />
      </div>
    </nav>
  );
};
