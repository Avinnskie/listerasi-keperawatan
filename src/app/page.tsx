import { NavigationBar } from '@/components/molecules/navigationBar';
import { LandingHero } from '@/components/organisms/landingPage';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-y-hidden">
      <NavigationBar className="fixed bg-[#fafcf7] z-50"></NavigationBar>
      <LandingHero />
    </div>
  );
}
