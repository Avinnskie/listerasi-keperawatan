export type MateriItem = {
  title: string;
  slug: string;
  category: string;
};

export type MateriGroup = {
  category: string;
  items: MateriItem[];
};

export const materiList: MateriGroup[] = [
  {
    category: 'Penyakit Tidak Menular',
    items: [
      {
        title: 'Kardiovaskular',
        slug: 'kardiovaskular',
        category: 'Penyakit Tidak Menular',
      },
    ],
  },
  {
    category: 'Penyakit Menular',
    items: [
      {
        title: 'COVID-19',
        slug: 'covid-19',
        category: 'Penyakit Menular',
      },
    ],
  },
];
