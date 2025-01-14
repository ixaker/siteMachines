import { DataItem } from '@/types/types';

export const EMPTY_DATA_ITEM: DataItem = {
  data: {
    name: '',
    article: '',
    availability: '',
    characteristics: [],
    chengedDate: Date.now().toString(),
    description: '',
    fullDescription: '',
    gallery: [],
    galleryMin: [],
    mainImage: '',
    model: '',
    price: '',
    type: '',
  },
  id: '',
};
