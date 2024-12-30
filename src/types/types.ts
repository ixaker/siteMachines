export interface Characteristic {
  viewInCard: boolean;
  name: string;
  value: string;
}

export enum MediaType {
  Video = "video",
  Image = "image",
}

export interface GalleryItem {
  type: MediaType;
  src: string;
}

export interface DataItem {
  id: string;
  data: {
    name: string;
    description: string;
    mainImage: string;
    gallery: GalleryItem[];
    characteristics: Characteristic[];
    fullDescription: string;
    article: string;
    type: string;
    price: number;
  };
}
