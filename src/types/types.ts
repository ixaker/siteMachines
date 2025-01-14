export interface Characteristic {
  viewInCard: boolean;
  name: string;
  value: string;
}

export enum MediaType {
  Video = 'video',
  Image = 'image',
}

export enum MachineType {
  Tokarniy = 'Tokarniy',
  Frezerniy = 'Frezerniy',
}

export interface GalleryItem {
  type: string;
  src: string;
  name: string;
}

export interface DataItem {
  id: string;
  data: {
    name: string;
    description: string;
    mainImage: string;
    gallery: GalleryItem[];
    galleryMin: GalleryItem[];
    characteristics: Characteristic[];
    fullDescription: string;
    article: string;
    type: string;
    price: string;
    model: string;
    availability: string;
    chengedDate: string;
  };
}
