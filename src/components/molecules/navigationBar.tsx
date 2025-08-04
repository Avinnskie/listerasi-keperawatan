import Link from 'next/link';
import { Heading } from '../atoms/heading';

export const NavigationBar = () => (
  <nav className="px-12 py-4 flex justify-between font-lexend">
    <div className="flex items-center space-x-6">
      <Heading>Literasi Keperawatan</Heading>
      <Link href={'#'}>Kardiovaskular</Link>
      <Link href={'#'}>Covid-19</Link>
      <Link href={'#'}>Keperawatan</Link>
    </div>
  </nav>
);
