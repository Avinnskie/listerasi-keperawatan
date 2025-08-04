import { Button } from '../atoms/button';
import { Heading } from '../atoms/heading';
import { Paragraph } from '../atoms/paragraph';
import { ModuleCard } from '../molecules/moduleCard';

export const LandingHero = () => {
  return (
    <section className="min-h-full max-h-screen bg-gradient-to-br from-green-50 to-white py-16 font-lexend">
      <div className="text-center px-4">
        <Heading>Selamat Datang di Literasi Keperawatan</Heading>
        <Paragraph>
          Platform ini dirancang untuk kader dan masyarakat yang ingin belajar lebih dalam mengenai
          topik-topik kesehatan penting.
        </Paragraph>

        <Button variant="primary" className="mt-6">
          Mulai Belajar
        </Button>

        <div className="relative flex flex-wrap justify-center gap-28 mt-12">
          <ModuleCard imageUrl="/img/kardiovaskular.png" />
          <ModuleCard classname="absolute z-10" imageUrl="/img/covid-19.png" />
          <ModuleCard imageUrl="/img/perawatan.png" />
        </div>
      </div>
    </section>
  );
};
