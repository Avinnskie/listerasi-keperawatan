import { NavigationBar } from '@/components/molecules/navigationBar';
import { LandingHero } from '@/components/organisms/landingPage';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <NavigationBar></NavigationBar>
      <LandingHero />
    </>
  );
}
