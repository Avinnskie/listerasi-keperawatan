import Image from 'next/image';
import { Button } from '../atoms/button';
import { Heading } from '../atoms/heading';
import { Paragraph } from '../atoms/paragraph';
import { ModuleCard } from '../molecules/moduleCard';

export const LandingHero = () => {
  return (
    <section className="relative min-h-screen md:h-max flex flex-col justify-center items-center px-4 pt-12 font-lexend overflow-hidden">
      {/* Background Ellipse */}
      <Image
        className="absolute bottom-0 left-0 w-full h-full object-cover -z-10"
        src="/asset/Ellipse 1.png"
        alt="background"
        width={1920}
        height={1080}
      />

      {/* Decorative Left Images */}
      <div className="hidden md:flex flex-col md:gap-8 lg:gap-16 absolute left-0 top-1/3 md:translate-x-10 md:translate-y-36 lg:translate-x-40 lg:translate-y-20 -z-10">
        <Image src="/asset/Bandage-right.png" alt="bandage" width={100} height={100} />
        <Image src="/asset/bacteri-2-right.png" alt="bacteri" width={80} height={80} />
        <Image src="/asset/heart-right.png" alt="heart" width={60} height={60} />
      </div>

      {/* Decorative Right Images */}
      <div className="hidden md:flex flex-col md:gap-8 lg:gap-16 absolute right-0 top-1/3 -translate-x-10 md:translate-y-36 md:-translate-x-6 lg:-translate-x-40 lg:translate-y-20 -z-10">
        <Image src="/asset/virus-left.png" alt="virus" width={85} height={85} />
        <Image src="/asset/engyme-left.png" alt="enzyme" width={100} height={100} />
        <Image src="/asset/mask-left.png" alt="mask" width={70} height={70} />
      </div>

      {/* Content */}
      <div className="text-center max-w-2xl">
        <Heading className="text-3xl md:text-5xl leading-tight">
          Selamat Datang di Literasi Keperawatan
        </Heading>
        <Paragraph className="text-sm md:text-lg mt-4">
          Platform ini dirancang untuk kader dan masyarakat yang ingin belajar lebih dalam mengenai
          topik-topik kesehatan penting. Temukan berbagai modul yang mencakup topik-topik penting
          seperti kesehatan kardiovaskular, informasi terkini tentang COVID-19, dan dasar-dasar
          keperawatan.
        </Paragraph>

        <Button variant="primary" className="mt-6">
          Mulai Belajar
        </Button>
      </div>

      {/* Module Cards */}
      <div className="hidden md:flex flex-wrap justify-center items-center md:pt-8 lg:pt-0 md:gap-24 lg:gap-44 mt-20 relative z-10">
        <ModuleCard
          classname="md:w-52 md:h-52 lg:w-72 lg:h-72"
          imageUrl="/img/kardiovaskular.png"
        />
        <ModuleCard
          classname="md:w-52 md:h-52 lg:w-72 lg:h-72 absolute -translate-y-16 z-10"
          imageUrl="/img/covid-19.png"
        />
        <ModuleCard classname="md:w-52 md:h-52 lg:w-72 lg:h-72" imageUrl="/img/perawatan.png" />
      </div>
    </section>
  );
};
