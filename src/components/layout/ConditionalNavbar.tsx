'use client';

import { usePathname } from 'next/navigation';
import { NavigationBar } from '@/components/molecules/navigationBar';

export function ConditionalNavbar() {
  const pathname = usePathname();

  if (pathname === '/login') {
    return null;
  }

  return <NavigationBar className="fixed bg-[#fafcf7] z-50" />;
}
