import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import './globals.css';
import { NavigationBar } from '@/components/molecules/navigationBar';

const lexend = Lexend({
  variable: '--font-lexend',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Literasi Keperawatan',
  description:
    'Platform ini dirancang untuk kader dan masyarakat yang ingin belajar lebih dalam mengenai topik-topik kesehatan penting. Temukan berbagai modul yang mencakup topik-topik penting seperti kesehatan kardiovaskular, informasi terkini tentang COVID-19, dan dasar-dasar keperawatan. ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lexend.variable} relative antialiased`}>
        <NavigationBar className="fixed bg-[#fafcf7] z-50"></NavigationBar>
        {children}
      </body>
    </html>
  );
}
