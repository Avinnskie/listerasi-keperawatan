export type MateriItem = {
  slug: string;
  title: string;
};

export type MateriCategory = {
  category: string;
  items: MateriItem[];
};

export const materiList: MateriCategory[] = [
  {
    category: 'Kesehatan Dasar',
    items: [
      {
        slug: 'pengantar-kesehatan',
        title: 'Pengantar Kesehatan',
      },
      {
        slug: 'pola-hidup-sehat',
        title: 'Pola Hidup Sehat',
      },
    ],
  },
  {
    category: 'Penyakit Umum',
    items: [
      {
        slug: 'flu',
        title: 'Mengenal Penyakit Flu',
      },
      {
        slug: 'diare',
        title: 'Penanganan Diare',
      },
    ],
  },
  {
    category: 'Pertolongan Pertama',
    items: [
      {
        slug: 'luka-dan-pendarahan',
        title: 'Luka dan Pendarahan',
      },
      {
        slug: 'p3k',
        title: 'Prinsip Dasar P3K',
      },
    ],
  },
];
